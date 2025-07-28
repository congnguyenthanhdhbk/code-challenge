"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleValidationErrors = exports.validateResourceFilters = exports.validateResourceId = exports.validateUpdateResource = exports.validateCreateResource = void 0;
const express_validator_1 = require("express-validator");
exports.validateCreateResource = [
    (0, express_validator_1.body)('name')
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    (0, express_validator_1.body)('category')
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
];
exports.validateUpdateResource = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid resource ID format'),
    (0, express_validator_1.body)('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    (0, express_validator_1.body)('description')
        .optional()
        .trim()
        .isLength({ min: 1, max: 500 })
        .withMessage('Description must be between 1 and 500 characters'),
    (0, express_validator_1.body)('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    (0, express_validator_1.body)('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
];
exports.validateResourceId = [
    (0, express_validator_1.param)('id')
        .isUUID()
        .withMessage('Invalid resource ID format'),
];
exports.validateResourceFilters = [
    (0, express_validator_1.query)('category')
        .optional()
        .trim()
        .isLength({ min: 1, max: 50 })
        .withMessage('Category must be between 1 and 50 characters'),
    (0, express_validator_1.query)('status')
        .optional()
        .isIn(['active', 'inactive', 'pending'])
        .withMessage('Status must be active, inactive, or pending'),
    (0, express_validator_1.query)('name')
        .optional()
        .trim()
        .isLength({ min: 1, max: 100 })
        .withMessage('Name must be between 1 and 100 characters'),
    (0, express_validator_1.query)('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    (0, express_validator_1.query)('offset')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Offset must be 0 or greater'),
];
const handleValidationErrors = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array()
        });
    }
    next();
};
exports.handleValidationErrors = handleValidationErrors;
//# sourceMappingURL=validation.js.map