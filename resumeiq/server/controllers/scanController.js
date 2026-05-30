const Scan = require('../models/Scan');
const Resume = require('../models/Resume');
const Job = require('../models/Job');
const User = require('../models/User');
const { hashString } = require('../utils/hashUtils');
const documentService = require('../services/documentService');
const scanService = require('../services/scanService');
const { rewriteResumeWithKeywords } = require('../utils/aiService');

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

    const optimizedText = await rewriteResumeWithKeywords(scan.resumeId.rawText, scan.jobId.jobDescription, missingKeywordsStr);

    if (format === 'pdf') {
      documentService.generateOptimizedPDF(res, optimizedText, scan.resumeId.rawText, scan.resumeId.originalName, scan.jobId);
    } else if (format === 'docx') {
      await documentService.generateOptimizedDocx(res, optimizedText, scan.resumeId.rawText, scan.resumeId.originalName);
    } else {
      res.status(400).json({ success: false, message: 'Invalid format requested' });
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
      return res.status(403).json({
        success: false,
        message: `You've used all ${user.scansLimit} scans on the Free plan this month. Upgrade to Pro for unlimited scans.`,
        code: 'PLAN_UPGRADE_REQUIRED',
        currentPlan: user.plan,
      });
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

    res.status(202).json({ success: true, message: 'Scan started', data: { scanId: scan._id } });

    const io = req.app.get('io');
    
    // Delegate to the scanService background orchestration
    scanService.processBackgroundScan(scan._id, user._id, resume.rawText, jobDescription, io).catch(console.error);

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
    
    // 1. User specific stats
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

    // 2. Global Average stats
    const globalStats = await Scan.aggregate([
      { $match: { status: 'done' } },
      {
        $group: {
          _id: null,
          avgATS: { $avg: '$atsScore' }
        }
      }
    ]);
    const globalAvgATS = Math.round(globalStats[0]?.avgATS || 0);

    // 3. Recent Scans
    const recentScans = await Scan.find({ userId, status: 'done' })
      .populate('resumeId', 'originalName')
      .populate('jobId', 'companyName jobTitle')
      .sort({ createdAt: -1 }).limit(5);
      
    // 4. Recent Resumes
    const recentResumes = await Resume.find({ userId })
      .select('originalName fileType createdAt')
      .sort({ createdAt: -1 }).limit(4);

    // 5. Contextual Top Recommendation
    let topMissingKeyword = null;
    let recommendationContext = "You're hitting the primary keywords for your target roles effectively.";
    
    if (stats[0]?.allMissingKeywords) {
      const flat = stats[0].allMissingKeywords.flat();
      const freq = {};
      flat.forEach(k => { freq[k] = (freq[k] || 0) + 1; });
      
      const sortedKeys = Object.entries(freq).sort((a, b) => b[1] - a[1]);
      if (sortedKeys.length > 0) {
        topMissingKeyword = sortedKeys[0][0];
        const count = sortedKeys[0][1];
        recommendationContext = `You missed "${topMissingKeyword}" in ${count} recent scan${count > 1 ? 's' : ''}. Integrating this keyword could boost your match rate significantly.`;
      }
    }

    res.json({
      success: true,
      data: {
        avgATS: Math.round(stats[0]?.avgATS || 0),
        bestScore: stats[0]?.bestScore || 0,
        totalScans: stats[0]?.totalScans || 0,
        topMissingKeyword,
        recommendationContext,
        globalAvgATS,
        recentScans,
        recentResumes,
        scansUsed: req.user.scansUsed,
        scansLimit: req.user.scansLimit,
        plan: req.user.plan,
      }
    });
  } catch (err) { next(err); }
};