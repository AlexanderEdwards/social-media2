// middleware/errorHandler.js

module.exports = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
  
    // Log detailed error information in a development environment
    if (process.env.NODE_ENV === 'development') {
      console.error(err);
    }
  
    res.status(statusCode).json({
      status: 'error',
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  };
  