export interface Resource {
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'active' | 'inactive' | 'pending';
    createdAt: string;
    updatedAt: string;
}
export interface CreateResourceRequest {
    name: string;
    description: string;
    category: string;
    status?: 'active' | 'inactive' | 'pending';
}
export interface UpdateResourceRequest {
    name?: string;
    description?: string;
    category?: string;
    status?: 'active' | 'inactive' | 'pending';
}
export interface ResourceFilters {
    category?: string;
    status?: 'active' | 'inactive' | 'pending';
    name?: string;
    limit?: number;
    offset?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    limit: number;
    offset: number;
}
//# sourceMappingURL=index.d.ts.map