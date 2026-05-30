/**
 * Plan-Based Feature Gating Middleware
 * 
 * Restricts access to specific API endpoints based on the user's subscription plan.
 * Usage: router.post('/cover-letter', requirePlan('pro', 'career+'), generateCoverLetter);
 * 
 * Plan Hierarchy:
 *   free     → Basic features only (3 scans/mo, 1 template, basic rewrite, PDF export)
 *   pro      → All features (unlimited scans, cover letters, LinkedIn import, all templates, DOCX export)
 *   career+  → Everything in Pro + dashboard analytics, version tracking, optimized downloads, priority support
 */

const PLAN_FEATURES = {
  free: {
    label: 'Free',
    scansLimit: 3,
    tokensLimit: 50000,
    features: ['basic_rewrite', 'pdf_export', 'shareable_reports'],
  },
  pro: {
    label: 'Pro',
    scansLimit: 999,
    tokensLimit: 500000,
    features: ['basic_rewrite', 'pdf_export', 'shareable_reports', 'cover_letter', 'linkedin_import', 'docx_export', 'all_templates', 'scan_compare', 'unlimited_rewrites', 'optimized_download'],
  },
  'career+': {
    label: 'Career+',
    scansLimit: 999,
    tokensLimit: 2000000,
    features: ['basic_rewrite', 'pdf_export', 'shareable_reports', 'cover_letter', 'linkedin_import', 'docx_export', 'all_templates', 'scan_compare', 'unlimited_rewrites', 'optimized_download', 'dashboard_analytics', 'version_tracking', 'priority_support'],
  },
};

/**
 * Middleware factory — restricts route access to users with one of the specified plans.
 * @param  {...string} allowedPlans - Plan names that can access this endpoint (e.g., 'pro', 'career+')
 */
const requirePlan = (...allowedPlans) => {
  return (req, res, next) => {
    const userPlan = req.user?.plan || 'free';

    if (allowedPlans.includes(userPlan)) {
      return next();
    }

    const allowedLabels = allowedPlans
      .map(p => PLAN_FEATURES[p]?.label || p)
      .join(' or ');

    return res.status(403).json({
      success: false,
      message: `This feature requires a ${allowedLabels} plan. Upgrade to unlock it.`,
      code: 'PLAN_UPGRADE_REQUIRED',
      currentPlan: userPlan,
      requiredPlans: allowedPlans,
    });
  };
};

/**
 * Returns the scansLimit for a given plan name.
 * @param {string} plan
 * @returns {number}
 */
const getScansLimitForPlan = (plan) => {
  return PLAN_FEATURES[plan]?.scansLimit || PLAN_FEATURES.free.scansLimit;
};

/**
 * Returns the tokensLimit for a given plan name.
 * @param {string} plan
 * @returns {number}
 */
const getTokensLimitForPlan = (plan) => {
  return PLAN_FEATURES[plan]?.tokensLimit || PLAN_FEATURES.free.tokensLimit;
};

/**
 * Middleware — restricts access if user has exceeded their token budget
 */
const checkTokenBudget = (req, res, next) => {
  const user = req.user;
  if (!user) return next();

  const limit = getTokensLimitForPlan(user.plan);
  if (user.tokensUsed >= limit) {
    return res.status(403).json({
      success: false,
      message: `You have reached the AI token limit for the ${PLAN_FEATURES[user.plan]?.label || 'Free'} plan. Upgrade to continue using AI features.`,
      code: 'TOKEN_LIMIT_EXCEEDED'
    });
  }
  next();
};

module.exports = { requirePlan, getScansLimitForPlan, getTokensLimitForPlan, checkTokenBudget, PLAN_FEATURES };
