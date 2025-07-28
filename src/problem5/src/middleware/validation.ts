import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateCreateResource = [
    body('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    body('description')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    body('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
];

export const validateUpdateResource = [
    param('id')
        .isUUID()
        .withMessage('Invalid resource ID format'),
    body('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    body('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    body('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    body('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
];

export const validateResourceId = [
    param('id')
        .isUUID()
        .withMessage('Invalid resource ID format'),
];

export const validateResourceFilters = [
    query('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    query('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
    query('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    query('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be 0 or greater'),
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }

    next();
};
