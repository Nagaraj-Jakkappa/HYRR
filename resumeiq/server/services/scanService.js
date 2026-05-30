const scanRepository = require('../repositories/scanRepository');
const jobRepository = require('../repositories/jobRepository');
const userRepository = require('../repositories/userRepository');
const { analyzeResume, extractKeywordsFromJD } = require('../utils/aiService');

/**
 * Orchestrates the AI background scan.
 * (Note: If BullMQ or a robust queue is added later, this function should be wrapped by the job processor)
 */
exports.processBackgroundScan = async (scanId, userId, resumeRawText, jobDescription, io) => {
  const userIdStr = userId.toString();
  let scan = await scanRepository.findPublicScanById(scanId);

  const emitter = (event, data) => {
    console.log(`[Socket Emit] Event: ${event}`, data);
    if (io) io.to(userIdStr).emit(event, data);
  };

  try {
    console.log(`[Scan Background] Starting scan: ${scan._id}`);

    scan = await scanRepository.updateScanStatus(scan._id, { status: 'processing' });

    emitter('scan:progress', { scanId: scan._id, step: 'Extracting keywords...', pct: 20 });
    const keywords = await extractKeywordsFromJD(jobDescription);
    console.log(`[Scan Background] Keywords extracted: ${keywords.length}`);

    // Update the job with extracted keywords
    await jobRepository.updateJobKeywords(scan.jobId, keywords);

    emitter('scan:progress', { scanId: scan._id, step: 'Running AI analysis...', pct: 40 });
    console.log(`[Scan Background] Calling analyzeResume...`);

    const analysis = await analyzeResume(resumeRawText, jobDescription, keywords, emitter, scan._id);

    if (!analysis) throw new Error("AI Analysis returned no data.");
    console.log(`[Scan Background] AI Analysis success, score: ${analysis.atsScore}`);

    scan = await scanRepository.updateScanStatus(scan._id, {
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

    await userRepository.incrementScansUsed(userId);

    emitter('scan:done', { scanId: scan._id, atsScore: scan.atsScore });
    console.log(`[Scan Background] Scan completed successfully: ${scan._id}`);
  } catch (err) {
    console.error("[Scan Background CRITICAL ERROR]", err);
    await scanRepository.updateScanStatus(scanId, { status: 'failed' });
    emitter('scan:failed', { scanId: scan._id, message: err.message });
  }
};
