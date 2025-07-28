import { Resource, CreateResourceRequest, UpdateResourceRequest, ResourceFilters } from '../types';
export declare class Database {
    private db;
    constructor(dbPath: string);
    private initializeDatabase;
    createResource(resourceData: CreateResourceRequest): Promise<Resource>;
    getResources(filters?: ResourceFilters): Promise<{
        items: Resource[];
        total: number;
    }>;
    getResourceById(id: string): Promise<Resource | null>;
    updateResource(id: string, updates: UpdateResourceRequest): Promise<Resource | null>;
    deleteResource(id: string): Promise<boolean>;
    close(): void;
}
//# sourceMappingURL=index.d.ts.map