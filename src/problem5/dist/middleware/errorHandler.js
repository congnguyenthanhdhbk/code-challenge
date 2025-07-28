"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = exports.errorHandler = void 0;
const errorHandler = (err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    const response = {
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    };
    res.status(500).json(response);
};
exports.errorHandler = errorHandler;
const notFoundHandler = (req, res) => {
    const response = {
        success: false,
        error: `Route ${req.originalUrl} not found`
    };
    res.status(404).json(response);
};
exports.notFoundHandler = notFoundHandler;
//# sourceMappingURL=errorHandler.js.map