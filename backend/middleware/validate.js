// middleware/validate.js – Zod request body validator
// ----------------------------------------------------------
// Usage: router.post('/', validate(registerSchema), controllerFunction);
// Returns 400 with a standardized error payload if validation fails.

const { ZodError } = require('zod');

/**
 * validate – Express middleware factory that validates req.body against a Zod schema.
 * The schema should be created with .strict() to reject unknown fields.
 * On failure, responds with { success:false, message:'Validation failed', errors:[...] }.
 */
const validate = (schema) => (req, res, next) => {
  try {
    // Parse and assign the sanitized data back to req.body
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const formatted = err.errors.map((e) => ({ path: e.path.join('.'), message: e.message }));
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: formatted,
      });
    }
    // Fallback for unexpected errors
    console.error('VALIDATION MIDDLEWARE ERROR:', err);
    return res.status(500).json({ success: false, message: 'Server validation error' });
  }
};

module.exports = validate;
