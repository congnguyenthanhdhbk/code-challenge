import { Router, Request, Response } from 'express';
import { Database } from '../database';
import {
    CreateResourceRequest,
    UpdateResourceRequest,
    ResourceFilters,
    ApiResponse,
    PaginatedResponse,
    Resource
} from '../types';
import {
    validateCreateResource,
    validateUpdateResource,
    validateResourceId,
    validateResourceFilters,
    handleValidationErrors
} from '../middleware/validation';

const router = Router();
const db = new Database(process.env.DB_PATH || './database.sqlite');

// Create a resource
router.post('/',
    validateCreateResource,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const resourceData: CreateResourceRequest = req.body;
            const resource = await db.createResource(resourceData);

            const response: ApiResponse<Resource> = {
                success: true,
                data: resource,
                message: 'Resource created successfully'
            };

            res.status(201).json(response);
        } catch (error) {
            console.error('Error creating resource:', error);
            const response: ApiResponse = {
                success: false,
                error: 'Failed to create resource'
            };
            res.status(500).json(response);
        }
    }
);

// List resources with filters
router.get('/',
    validateResourceFilters,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const filters: ResourceFilters = {
                category: req.query.category as string,
                status: req.query.status as 'active' | 'inactive' | 'pending',
                name: req.query.name as string,
                limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
                offset: req.query.offset ? parseInt(req.query.offset as string) : 0
            };

            const result = await db.getResources(filters);

            const response: ApiResponse<PaginatedResponse<Resource>> = {
                success: true,
                data: {
                    items: result.items,
                    total: result.total,
                    limit: filters.limit || 10,
                    offset: filters.offset || 0
                }
            };

            res.json(response);
        } catch (error) {
            console.error('Error fetching resources:', error);
            const response: ApiResponse = {
                success: false,
                error: 'Failed to fetch resources'
            };
            res.status(500).json(response);
        }
    }
);

// Get resource by ID
router.get('/:id',
    validateResourceId,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const resource = await db.getResourceById(id);

            if (!resource) {
                const response: ApiResponse = {
                    success: false,
                    error: 'Resource not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse<Resource> = {
                success: true,
                data: resource
            };

            res.json(response);
        } catch (error) {
            console.error('Error fetching resource:', error);
            const response: ApiResponse = {
                success: false,
                error: 'Failed to fetch resource'
            };
            res.status(500).json(response);
        }
    }
);

// Update resource
router.put('/:id',
    validateUpdateResource,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const updates: UpdateResourceRequest = req.body;

            const resource = await db.updateResource(id, updates);

            if (!resource) {
                const response: ApiResponse = {
                    success: false,
                    error: 'Resource not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse<Resource> = {
                success: true,
                data: resource,
                message: 'Resource updated successfully'
            };

            res.json(response);
        } catch (error) {
            console.error('Error updating resource:', error);
            const response: ApiResponse = {
                success: false,
                error: 'Failed to update resource'
            };
            res.status(500).json(response);
        }
    }
);

// Delete resource
router.delete('/:id',
    validateResourceId,
    handleValidationErrors,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleted = await db.deleteResource(id);

            if (!deleted) {
                const response: ApiResponse = {
                    success: false,
                    error: 'Resource not found'
                };
                return res.status(404).json(response);
            }

            const response: ApiResponse = {
                success: true,
                message: 'Resource deleted successfully'
            };

            res.json(response);
        } catch (error) {
            console.error('Error deleting resource:', error);
            const response: ApiResponse = {
                success: false,
                error: 'Failed to delete resource'
            };
            res.status(500).json(response);
        }
    }
);

export default router;
