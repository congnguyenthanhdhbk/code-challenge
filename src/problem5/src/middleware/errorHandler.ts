import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);

    const response: ApiResponse = {
        success: false,
        error: process.env.NODE_ENV === 'production'
            ? 'Internal server error'
            : err.message
    };

    res.status(500).json(response);
};

export const notFoundHandler = (req: Request, res: Response) => {
    const response: ApiResponse = {
        success: false,
        error: `Route ${req.originalUrl} not found`
    };

    res.status(404).json(response);
};
