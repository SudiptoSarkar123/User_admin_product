const errorMiddleware = (err, req, res, next) => {
  console.log(err.stack);

  const statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!";

  if (typeof message === "object") {
    try {
      message = JSON.stringify(message, null, 2);
    } catch (_) {
      message = String(message);
    }
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: err.errors || [],
    // stack:process.env.NODE_ENV === "DEVELOPMENT" ? err.stack : undefined
    stack: err.stack,
  });
};

export default errorMiddleware;
