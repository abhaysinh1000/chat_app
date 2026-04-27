export const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";

  // Mongoose Validation Error

  // raw object

  // {
  //   name: "ValidationError",
  //   message: "User validation failed: email: Path `email` is required, age: Path `age` is required",
  //   errors: {
  //     email: {
  //       name: "ValidatorError",
  //       message: "Path `email` is required",
  //       properties: { message: "Path `email` is required", type: "required", path: "email" },
  //       kind: "required",
  //       path: "email",
  //       value: undefined
  //     },
  //     age: {
  //       name: "ValidatorError",
  //       message: "Path `age` is required",
  //       properties: { ... },
  //       kind: "required",
  //       path: "age",
  //       value: undefined
  //     }
  //   }
  // }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // raw error object
  //   {
  //   code: 11000,  
  //   keyValue: { email: "test@gmail.com" }  
  // }
  // duplication Error
  // Mongoose Duplicate Key Error

  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose Invalid ID
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // raw error object
  // {
  //   name: "JsonWebTokenError",  
  //   message: "invalid signature"
  // }

  // JWT Invalid Token
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token. Please login again";
  }

  //? raw Object of Token Expired

  // raw error object
  // {
  //   name: "JsonWebTokenError",
  //   message: "invalid signature"
  // }

  // JWT Expired
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired. Please login again";
  }

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "developement" && { stack: err.stack }),
  });
};
