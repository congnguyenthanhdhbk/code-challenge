"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../database");
const validation_1 = require("../middleware/validation");
const router = (0, express_1.Router)();
const db = new database_1.Database(process.env.DB_PATH || './database.sqlite');
router.post('/', validation_1.validateCreateResource, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const resourceData = req.body;
        const resource = await db.createResource(resourceData);
        const response = {
            success: true,
            data: resource,
            message: 'Resource created successfully'
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error('Error creating resource:', error);
        const response = {
            success: false,
            error: 'Failed to create resource'
        };
        res.status(500).json(response);
    }
});
router.get('/', validation_1.validateResourceFilters, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const filters = {
            category: req.query.category,
            status: req.query.status,
            name: req.query.name,
            limit: req.query.limit ? parseInt(req.query.limit) : 10,
            offset: req.query.offset ? parseInt(req.query.offset) : 0
        };
        const result = await db.getResources(filters);
        const response = {
            success: true,
            data: {
                items: result.items,
                total: result.total,
                limit: filters.limit || 10,
                offset: filters.offset || 0
            }
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching resources:', error);
        const response = {
            success: false,
            error: 'Failed to fetch resources'
        };
        res.status(500).json(response);
    }
});
router.get('/:id', validation_1.validateResourceId, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const resource = await db.getResourceById(id);
        if (!resource) {
            const response = {
                success: false,
                error: 'Resource not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: resource
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error fetching resource:', error);
        const response = {
            success: false,
            error: 'Failed to fetch resource'
        };
        res.status(500).json(response);
    }
});
router.put('/:id', validation_1.validateUpdateResource, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const resource = await db.updateResource(id, updates);
        if (!resource) {
            const response = {
                success: false,
                error: 'Resource not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            data: resource,
            message: 'Resource updated successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error updating resource:', error);
        const response = {
            success: false,
            error: 'Failed to update resource'
        };
        res.status(500).json(response);
    }
});
router.delete('/:id', validation_1.validateResourceId, validation_1.handleValidationErrors, async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await db.deleteResource(id);
        if (!deleted) {
            const response = {
                success: false,
                error: 'Resource not found'
            };
            return res.status(404).json(response);
        }
        const response = {
            success: true,
            message: 'Resource deleted successfully'
        };
        res.json(response);
    }
    catch (error) {
        console.error('Error deleting resource:', error);
        const response = {
            success: false,
            error: 'Failed to delete resource'
        };
        res.status(500).json(response);
    }
});
exports.default = router;
//# sourceMappingURL=resources.js.map