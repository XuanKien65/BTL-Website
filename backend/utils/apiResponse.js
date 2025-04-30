class ApiResponse {
  static success(res, message, data = null, statusCode = 200) {
    const response = {
      success: true,
      message,
    };
    if (data) response.data = data;
    res.status(statusCode).json(response);
  }

  static created(res, message, data) {
    this.success(res, message, data, 201);
  }

  static paginated(res, message, data, pagination) {
    res.status(200).json({
      success: true,
      message,
      data,
      pagination,
    });
  }

  static error(res, message, statusCode = 400, error = null) {
    const response = {
      success: false,
      message,
    };
    if (error && process.env.NODE_ENV === "development") {
      response.error = error.message;
      response.stack = error.stack;
    }
    res.status(statusCode).json(response);
  }
}

module.exports = ApiResponse;
