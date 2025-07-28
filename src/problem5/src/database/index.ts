import sqlite3 from 'sqlite3';
import { Resource, CreateResourceRequest, UpdateResourceRequest, ResourceFilters } from '../types';
import { v4 as uuidv4 } from 'uuid';

export class Database {
    private db: sqlite3.Database;

    constructor(dbPath: string) {
        this.db = new sqlite3.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            } else {
                console.log('Connected to SQLite database');
                this.initializeDatabase();
            }
        });
    }

    private initializeDatabase(): void {
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        status TEXT CHECK(status IN ('active', 'inactive', 'pending')) DEFAULT 'active',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `;

        this.db.run(createTableQuery, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Resources table ready');
            }
        });
    }

    async createResource(resourceData: CreateResourceRequest): Promise<Resource> {
        return new Promise((resolve, reject) => {
            const id = uuidv4();
            const now = new Date().toISOString();
            const { name, description, category, status = 'active' } = resourceData;

            const query = `
        INSERT INTO resources (id, name, description, category, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

            this.db.run(query, [id, name, description, category, status, now, now], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({
                        id,
                        name,
                        description,
                        category,
                        status,
                        createdAt: now,
                        updatedAt: now
                    });
                }
            });
        });
    }

    async getResources(filters: ResourceFilters = {}): Promise<{ items: Resource[]; total: number }> {
        return new Promise((resolve, reject) => {
            const { category, status, name, limit = 10, offset = 0 } = filters;

            let whereClause = '';
            let params: any[] = [];
            const conditions: string[] = [];

            if (category) {
                conditions.push('category = ?');
                params.push(category);
            }

            if (status) {
                conditions.push('status = ?');
                params.push(status);
            }

            if (name) {
                conditions.push('name LIKE ?');
                params.push(`%${name}%`);
            }

            if (conditions.length > 0) {
                whereClause = 'WHERE ' + conditions.join(' AND ');
            }

            // Get total count
            const countQuery = `SELECT COUNT(*) as total FROM resources ${whereClause}`;

            this.db.get(countQuery, params, (err, countResult: any) => {
                if (err) {
                    reject(err);
                    return;
                }

                const total = countResult.total;

                // Get paginated results
                const query = `
          SELECT * FROM resources ${whereClause}
          ORDER BY createdAt DESC
          LIMIT ? OFFSET ?
        `;

                this.db.all(query, [...params, limit, offset], (err, rows: any[]) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({
                            items: rows as Resource[],
                            total
                        });
                    }
                });
            });
        });
    }

    async getResourceById(id: string): Promise<Resource | null> {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM resources WHERE id = ?';

            this.db.get(query, [id], (err, row: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row ? (row as Resource) : null);
                }
            });
        });
    }

    async updateResource(id: string, updates: UpdateResourceRequest): Promise<Resource | null> {
        return new Promise((resolve, reject) => {
            const updatedAt = new Date().toISOString();
            const fields: string[] = [];
            const params: any[] = [];

            Object.entries(updates).forEach(([key, value]) => {
                if (value !== undefined) {
                    fields.push(`${key} = ?`);
                    params.push(value);
                }
            });

            if (fields.length === 0) {
                this.getResourceById(id).then(resolve).catch(reject);
                return;
            }

            fields.push('updatedAt = ?');
            params.push(updatedAt, id);

            const query = `UPDATE resources SET ${fields.join(', ')} WHERE id = ?`;

            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else if (this.changes === 0) {
                    resolve(null);
                } else {
                    // Return updated resource
                    resolve(new Database(process.env.DB_PATH || './database.sqlite').getResourceById(id));
                }
            });
        });
    }

    async deleteResource(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM resources WHERE id = ?';

            this.db.run(query, [id], function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(this.changes > 0);
                }
            });
        });
    }

    close(): void {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            } else {
                console.log('Database connection closed');
            }
        });
    }
}
