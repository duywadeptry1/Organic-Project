// 1. Catch requests that made it past all our routes (404 Not Found)
export const notFoundHandler = (req, res, next) => {
    const error = new Error(`Route Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// 2. The global error handler
export const globalErrorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    let message = err.message;

    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        message = 'Resource not found. Invalid ID format.';
        statusCode = 404;
    }

    res.status(statusCode).json({
        success: false,
        message: message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

export default { notFoundHandler, globalErrorHandler };
