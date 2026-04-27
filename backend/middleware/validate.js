export const validate = (schema) => {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const errors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (!field || errors[field]) continue;

        if (issue.code === "invalid_type") {
          const fieldName = field
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (s) => s.toUpperCase());

          // ✅ Zod v4 — check message instead of issue.input/issue.received
          if (issue.message.includes("undefined")) {
            errors[field] = `${fieldName} is required`;
          } else {
            errors[field] = `${fieldName} must be a valid string`;
          }
        } else {
          errors[field] = issue.message;
        }
      }

      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    req.body = result.data;
    next();
  };
};