const Scan = require('../models/Scan');
const Job = require('../models/Job');
const User = require('../models/User');
const { analyzeResume, extractKeywordsFromJD } = require('../utils/aiService');

/**
 * Orchestrates the AI background scan.
 * (Note: If BullMQ or a robust queue is added later, this function should be wrapped by the job processor)
 */
exports.processBackgroundScan = async (scanId, userId, resumeRawText, jobDescription, io) => {
  const userIdStr = userId.toString();
  const scan = await Scan.findById(scanId);

  const emitter = (event, data) => {
    console.log(`[Socket Emit] Event: ${event}`, data);
    if (io) io.to(userIdStr).emit(event, data);
  };

  try {
    console.log(`[Scan Background] Starting scan: ${scan._id}`);

    scan.status = 'processing';
    await scan.save();

    emitter('scan:progress', { scanId: scan._id, step: 'Extracting keywords...', pct: 20 });
    const keywords = await extractKeywordsFromJD(jobDescription);
    console.log(`[Scan Background] Keywords extracted: ${keywords.length}`);

    // Update the job with extracted keywords
    const job = await Job.findById(scan.jobId);
    if (job) {
      job.extractedKeywords = keywords;
      await job.save();
    }

    emitter('scan:progress', { scanId: scan._id, step: 'Running AI analysis...', pct: 40 });
    console.log(`[Scan Background] Calling analyzeResume...`);

    const analysis = await analyzeResume(resumeRawText, jobDescription, keywords, emitter, scan._id);

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
    await User.findByIdAndUpdate(userId, { $inc: { scansUsed: 1 } });

    emitter('scan:done', { scanId: scan._id, atsScore: scan.atsScore });
    console.log(`[Scan Background] Scan completed successfully: ${scan._id}`);
  } catch (err) {
    console.error("[Scan Background CRITICAL ERROR]", err);
    scan.status = 'failed';
    await scan.save();
    emitter('scan:failed', { scanId: scan._id, message: err.message });
  }
};
