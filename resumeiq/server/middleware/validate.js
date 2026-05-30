const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: result.error?.issues?.map(e => ({
        field: e.path?.[0] || 'unknown',
        message: e.message
      })) ?? []
    });
  }
  req.body = result.data; // sanitized data
  next();
};

module.exports = validate;
