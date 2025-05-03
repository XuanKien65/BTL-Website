class ErrorHandler extends Error {
  constructor(statusCode, message, error = null) {
    super();
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;

    // Capture stack trace for debugging
    if (error && error.stack) {
      this.stack = error.stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static handleError(err, res) {
    const { statusCode = 500, message } = err;
    res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  }
}

module.exports = ErrorHandler;
