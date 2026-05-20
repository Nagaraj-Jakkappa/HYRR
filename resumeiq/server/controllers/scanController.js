const Scan = require('../models/Scan');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const User = require('../models/User');
const Groq = require('groq-sdk');
const PDFDocument = require('pdfkit');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const { analyzeResume, extractKeywordsFromJD } = require('../utils/aiService');
const { hashString } = require('../utils/hashUtils');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const getCandidateName = (text, filename) => {
  const firstLine = text.split('\n')[0].trim();
  return firstLine.length > 2 && firstLine.length < 50 ? firstLine : filename.split('.')[0];
};

/**
 * FEATURE 1: Public Read-Only Report
 * Strips sensitive PII and returns only the analysis metrics for public viewing
 */
exports.getPublicReport = async (req, res, next) => {
  try {
    const scan = await Scan.findById(req.params.id)
      .populate('jobId', 'companyName jobTitle')
      .populate('resumeId', 'originalName');

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }

    if (scan.status !== 'done') {
      return res.status(400).json({ success: false, message: 'Report is still processing' });
    }

    // Curate a safe payload (excluding user IDs, hashes, and raw resume text)
    const publicData = {
      _id: scan._id,
      atsScore: scan.atsScore,
      matchedKeywords: scan.matchedKeywords,
      missingKeywords: scan.missingKeywords,
      suggestions: scan.suggestions,
      jobTitle: scan.jobId?.jobTitle,
      companyName: scan.jobId?.companyName,
      resumeName: scan.resumeId?.originalName || 'Candidate',
      createdAt: scan.createdAt
    };

    res.json({ success: true, data: { scan: publicData } });
  } catch (err) {
    next(err);
  }
};

exports.downloadResume = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { format } = req.body;

    const scan = await Scan.findById(id)
      .populate('resumeId')
      .populate('jobId');

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const missingKeywordsStr = scan.missingKeywords.join(', ');

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: `You are a professional resume writer. Rewrite the resume to better match the job description by naturally incorporating specific missing keywords. 
          
          STRICT RULES:
          - NEVER add, fabricate, or modify the Certifications section.
          - NEVER add "in progress" or placeholder certifications (e.g., Bubble.io, PHP).
          - Only add missing keywords to the Technical Skills section naturally.
          - Do not invent experience the candidate does not have.
          - Keep the Certifications section exactly as it appears in the original resume.
          - Only improve bullet point phrasing in the Experience and Projects sections.
          - Return ONLY the improved resume text, no explanation.`
        },
        {
          role: "user",
          content: `RESUME TEXT: ${scan.resumeId.rawText}\n\nTARGET JOB: ${scan.jobId.jobDescription}\n\nMISSING KEYWORDS TO INCLUDE: ${missingKeywordsStr}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const optimizedText = completion.choices[0]?.message?.content || scan.resumeId.rawText;
    const candidateName = getCandidateName(scan.resumeId.rawText, scan.resumeId.originalName);
    const safeFileName = `${candidateName.replace(/\s+/g, '_')}_Optimized`;

    if (format === 'pdf') {
      const doc = new PDFDocument({ margin: 50 });
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.pdf"`);
      doc.pipe(res);

      doc.fillColor('#000000').fontSize(22).font('Helvetica-Bold').text(candidateName.toUpperCase(), { align: 'center' });
      doc.moveDown(1);

      const lines = optimizedText.split('\n');
      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) {
          doc.moveDown(0.5);
        } else if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
          doc.moveDown(1);
          doc.fontSize(12).font('Helvetica-Bold').fillColor('#000000').text(trimmed);
          doc.moveTo(50, doc.y).lineTo(550, doc.y).strokeColor('#E5E7EB').stroke();
          doc.moveDown(0.5);
        } else {
          doc.fontSize(11).font('Helvetica').fillColor('#374151').text(trimmed, { align: 'justify', lineGap: 2 });
        }
      });

      doc.fontSize(9).fillColor('#9CA3AF').text(`Optimized for ${scan.jobId.jobTitle} at ${scan.jobId.companyName} by Hyrr`, 50, 750, { align: 'center' });
      doc.end();

    } else if (format === 'docx') {
      const lines = optimizedText.split('\n');
      const doc = new Document({
        sections: [{
          children: [
            new Paragraph({ text: candidateName, heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
            ...lines.map(line => {
              const trimmed = line.trim();
              const isHeader = trimmed === trimmed.toUpperCase() && trimmed.length > 3;
              return new Paragraph({
                text: trimmed,
                heading: isHeader ? HeadingLevel.HEADING_2 : undefined,
                spacing: { before: isHeader ? 300 : 120, after: 120 },
                children: [new TextRun({ text: "", break: trimmed === "" ? 1 : 0 })]
              });
            }),
            new Paragraph({
              spacing: { before: 400 },
              children: [new TextRun({ text: `Optimized by Hyrr`, color: "9CA3AF", size: 18, italics: true })]
            })
          ],
        }],
      });

      const buffer = await Packer.toBuffer(doc);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.setHeader('Content-Disposition', `attachment; filename="${safeFileName}.docx"`);
      res.send(buffer);
    }
  } catch (error) {
    console.error("Download Error:", error);
    res.status(500).json({ success: false, message: 'Resume generation failed' });
  }
};

exports.createScan = async (req, res, next) => {
  try {
    const { resumeId, jobDescription, companyName, jobTitle } = req.body;
    if (!resumeId || !jobDescription || !companyName || !jobTitle) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const user = req.user;
    if (user.plan === 'free' && user.scansUsed >= user.scansLimit) {
      return res.status(403).json({ success: false, message: 'Free scan limit reached. Upgrade to Pro.' });
    }

    const resume = await Resume.findOne({ _id: resumeId, userId: user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const jobDescHash = hashString(jobDescription);
    let job = await Job.findOne({ userId: user._id, jobDescHash });
    if (!job) {
      job = await Job.create({ userId: user._id, companyName, jobTitle, jobDescription, jobDescHash });
    }

    const scan = await Scan.create({
      userId: user._id,
      resumeId: resume._id,
      jobId: job._id,
      status: 'pending',
    });

    const io = req.app.get('io');
    const userIdStr = user._id.toString();

    // Improved Emitter with logging
    const emitter = (event, data) => {
      console.log(`[Socket Emit] Event: ${event}`, data);
      if (io) io.to(userIdStr).emit(event, data);
    };

    res.status(202).json({ success: true, message: 'Scan started', data: { scanId: scan._id } });

    // Background process with full logging
    (async () => {
      try {
        console.log(`[Scan Background] Starting scan: ${scan._id}`);

        scan.status = 'processing';
        await scan.save();

        emitter('scan:progress', { scanId: scan._id, step: 'Extracting keywords...', pct: 20 });
        const keywords = await extractKeywordsFromJD(jobDescription);
        console.log(`[Scan Background] Keywords extracted: ${keywords.length}`);

        job.extractedKeywords = keywords;
        await job.save();

        emitter('scan:progress', { scanId: scan._id, step: 'Running AI analysis...', pct: 40 });
        console.log(`[Scan Background] Calling analyzeResume...`);

        const analysis = await analyzeResume(resume.rawText, jobDescription, keywords, emitter);

        if (!analysis) throw new Error("AI Analysis returned no data.");
        console.log(`[Scan Background] AI Analysis success, score: ${analysis.atsScore}`);

        Object.assign(scan, {
          atsScore: analysis.atsScore || 0,
          keywordMatchPct: analysis.keywordMatchPct || 0,
          formattingScore: analysis.formattingScore || 0,
          matchedKeywords: analysis.matchedKeywords || [],
          missingKeywords: analysis.missingKeywords || [],
          suggestions: analysis.suggestions || [],
          status: 'done',
          tokensUsed: analysis.tokensUsed || 0,
          aiModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
        });

        await scan.save();
        await User.findByIdAndUpdate(user._id, { $inc: { scansUsed: 1 } });

        emitter('scan:done', { scanId: scan._id, atsScore: scan.atsScore });
        console.log(`[Scan Background] Scan completed successfully: ${scan._id}`);
      } catch (err) {
        console.error("[Scan Background CRITICAL ERROR]", err);
        scan.status = 'failed';
        await scan.save();
        emitter('scan:failed', { scanId: scan._id, message: err.message });
      }
    })();
  } catch (err) { next(err); }
};

exports.getMyScans = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const scans = await Scan.find({ userId: req.user._id })
      .populate('resumeId', 'originalName fileType')
      .populate('jobId', 'companyName jobTitle')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Scan.countDocuments({ userId: req.user._id });
    res.json({ success: true, data: { scans, total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.getScan = async (req, res, next) => {
  try {
    const scan = await Scan.findOne({ _id: req.params.id, userId: req.user._id })
      .populate('resumeId', 'originalName fileType fileUrl')
      .populate('jobId', 'companyName jobTitle jobDescription extractedKeywords');
    if (!scan) return res.status(404).json({ success: false, message: 'Scan not found' });
    res.json({ success: true, data: { scan } });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const stats = await Scan.aggregate([
      { $match: { userId, status: 'done' } },
      {
        $group: {
          _id: null,
          avgATS: { $avg: '$atsScore' },
          bestScore: { $max: '$atsScore' },
          totalScans: { $sum: 1 },
          allMissingKeywords: { $push: '$missingKeywords' },
        }
      }
    ]);

    const recentScans = await Scan.find({ userId, status: 'done' })
      .populate('resumeId', 'originalName')
      .populate('jobId', 'companyName jobTitle')
      .sort({ createdAt: -1 }).limit(5);

    let topMissingKeyword = null;
    if (stats[0]?.allMissingKeywords) {
      const flat = stats[0].allMissingKeywords.flat();
      const freq = {};
      flat.forEach(k => { freq[k] = (freq[k] || 0) + 1; });
      topMissingKeyword = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    }

    res.json({
      success: true,
      data: {
        avgATS: Math.round(stats[0]?.avgATS || 0),
        bestScore: stats[0]?.bestScore || 0,
        totalScans: stats[0]?.totalScans || 0,
        topMissingKeyword,
        recentScans,
        scansUsed: req.user.scansUsed,
        scansLimit: req.user.scansLimit,
        plan: req.user.plan,
      }
    });
  } catch (err) { next(err); }
};