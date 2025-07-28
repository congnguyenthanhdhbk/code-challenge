"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const sqlite3_1 = __importDefault(require("sqlite3"));
const uuid_1 = require("uuid");
class Database {
    constructor(dbPath) {
        this.db = new sqlite3_1.default.Database(dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
            }
            else {
                console.log('Connected to SQLite database');
                this.initializeDatabase();
            }
        });
    }
    initializeDatabase() {
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
            }
            else {
                console.log('Resources table ready');
            }
        });
    }
    async createResource(resourceData) {
        return new Promise((resolve, reject) => {
            const id = (0, uuid_1.v4)();
            const now = new Date().toISOString();
            const { name, description, category, status = 'active' } = resourceData;
            const query = `
        INSERT INTO resources (id, name, description, category, status, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
            this.db.run(query, [id, name, description, category, status, now, now], function (err) {
                if (err) {
                    reject(err);
                }
                else {
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
    async getResources(filters = {}) {
        return new Promise((resolve, reject) => {
            const { category, status, name, limit = 10, offset = 0 } = filters;
            let whereClause = '';
            let params = [];
            const conditions = [];
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
            const countQuery = `SELECT COUNT(*) as total FROM resources ${whereClause}`;
            this.db.get(countQuery, params, (err, countResult) => {
                if (err) {
                    reject(err);
                    return;
                }
                const total = countResult.total;
                const query = `
          SELECT * FROM resources ${whereClause}
          ORDER BY createdAt DESC
          LIMIT ? OFFSET ?
        `;
                this.db.all(query, [...params, limit, offset], (err, rows) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve({
                            items: rows,
                            total
                        });
                    }
                });
            });
        });
    }
    async getResourceById(id) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM resources WHERE id = ?';
            this.db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row ? row : null);
                }
            });
        });
    }
    async updateResource(id, updates) {
        return new Promise((resolve, reject) => {
            const updatedAt = new Date().toISOString();
            const fields = [];
            const params = [];
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
            this.db.run(query, params, function (err) {
                if (err) {
                    reject(err);
                }
                else if (this.changes === 0) {
                    resolve(null);
                }
                else {
                    resolve(new Database(process.env.DB_PATH || './database.sqlite').getResourceById(id));
                }
            });
        });
    }
    async deleteResource(id) {
        return new Promise((resolve, reject) => {
            const query = 'DELETE FROM resources WHERE id = ?';
            this.db.run(query, [id], function (err) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(this.changes > 0);
                }
            });
        });
    }
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
            }
            else {
                console.log('Database connection closed');
            }
        });
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map