const scanRepository = require('../repositories/scanRepository');
const resumeRepository = require('../repositories/resumeRepository');
const jobRepository = require('../repositories/jobRepository');
const User = require('../models/User');
const { hashString } = require('../utils/hashUtils');
const documentService = require('../services/documentService');
const scanService = require('../services/scanService');
const { rewriteResumeWithKeywords } = require('../utils/aiService');

exports.getPublicReport = async (req, res, next) => {
  try {
    const scan = await scanRepository.findPublicScanById(req.params.id);

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

    const scan = await scanRepository.findScanByIdAndUserId(id, req.user._id);

    if (!scan) {
      return res.status(404).json({ success: false, message: 'Scan not found' });
    }

    if (scan.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access' });
    }

    const missingKeywordsStr = scan.missingKeywords.join(', ');

    const { result: optimizedText, tokensUsed } = await rewriteResumeWithKeywords(scan.resumeId.rawText, scan.jobId.jobDescription, missingKeywordsStr);

    if (tokensUsed > 0) {
      await userRepository.incrementTokensUsed(req.user._id, tokensUsed);
    }

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
    if (user.role !== 'admin' && user.plan === 'free' && user.scansUsed >= user.scansLimit) {
      return res.status(403).json({
        success: false,
        message: `You've used all ${user.scansLimit} scans on the Free plan this month. Upgrade to Pro for unlimited scans.`,
        code: 'PLAN_UPGRADE_REQUIRED',
        currentPlan: user.plan,
      });
    }

    const resume = await resumeRepository.findResumeByIdAndUserId(resumeId, user._id);
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const jobDescHash = hashString(jobDescription);
    let job = await jobRepository.findJobByHashAndUser(jobDescHash, user._id);
    if (!job) {
      job = await jobRepository.createJob({ userId: user._id, companyName, jobTitle, jobDescription, jobDescHash });
    }

    const scan = await scanRepository.createScan({
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
    const scans = await scanRepository.findScansByUserIdWithPagination(req.user._id, (page - 1) * limit, limit * 1);
    const total = await scanRepository.countScansByUserId(req.user._id);
    res.json({ success: true, data: { scans, total, page: +page, pages: Math.ceil(total / limit) } });
  } catch (err) { next(err); }
};

exports.getScan = async (req, res, next) => {
  try {
    const scan = await scanRepository.findDetailedScanByIdAndUserId(req.params.id, req.user._id);
    if (!scan) return res.status(404).json({ success: false, message: 'Scan not found' });
    res.json({ success: true, data: { scan } });
  } catch (err) { next(err); }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    
    // 1. User specific stats
    const stats = await scanRepository.aggregateUserStats(userId);

    // 2. Global Average stats
    const globalStats = await scanRepository.aggregateGlobalStats();
    const globalAvgATS = Math.round(globalStats[0]?.avgATS || 0);

    // 3. Recent Scans
    const recentScans = await scanRepository.findRecentScans(userId, 5);
      
    // 4. Recent Resumes
    const recentResumes = await resumeRepository.findRecentResumes(userId, 4);

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