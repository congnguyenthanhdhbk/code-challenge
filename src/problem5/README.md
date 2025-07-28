# Express CRUD API with TypeScript

A RESTful API built with Express.js, TypeScript, and SQLite that provides complete CRUD operations for resource management.

## Features

- **Full CRUD Operations**: Create, Read, Update, Delete resources
- **TypeScript**: Type-safe development with strict TypeScript configuration
- **SQLite Database**: Lightweight, file-based database for data persistence
- **Input Validation**: Comprehensive request validation using express-validator
- **Error Handling**: Centralized error handling and logging
- **Filtering & Pagination**: List resources with filters and pagination support
- **Security**: Helmet.js for security headers and CORS support
- **Development Tools**: Hot reloading with ts-node-dev

## Project Structure

```
├── src/
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces and types
│   ├── database/
│   │   └── index.ts          # Database class and operations
│   ├── middleware/
│   │   ├── validation.ts     # Request validation middleware
│   │   └── errorHandler.ts   # Error handling middleware
│   ├── routes/
│   │   └── resources.ts      # Resource routes and controllers
│   └── index.ts              # Main application entry point
├── package.json
├── tsconfig.json
├── .env
└── README.md
```

## API Endpoints

### Base URL: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| POST | `/resources` | Create a new resource |
| GET | `/resources` | List resources with optional filters |
| GET | `/resources/:id` | Get a specific resource by ID |
| PUT | `/resources/:id` | Update a resource |
| DELETE | `/resources/:id` | Delete a resource |

## Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone or create the project directory**
   ```bash
   mkdir express-crud-api
   cd express-crud-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   DB_PATH=./database.sqlite
   ```

4. **Build the project**
   ```bash
   npm run build
   ```

## Running the Application

### Development Mode (with hot reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## API Usage Examples

### 1. Create a Resource
```bash
curl -X POST http://localhost:3000/api/resources \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sample Resource",
    "description": "This is a sample resource",
    "category": "Technology",
    "status": "active"
  }'
```

### 2. List Resources
```bash
# Get all resources
curl http://localhost:3000/api/resources

# With filters and pagination
curl "http://localhost:3000/api/resources?category=Technology&status=active&limit=5&offset=0"

# Search by name
curl "http://localhost:3000/api/resources?name=Sample"
```

### 3. Get a Specific Resource
```bash
curl http://localhost:3000/api/resources/{resource-id}
```

### 4. Update a Resource
```bash
curl -X PUT http://localhost:3000/api/resources/{resource-id} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Resource Name",
    "status": "inactive"
  }'
```

### 5. Delete a Resource
```bash
curl -X DELETE http://localhost:3000/api/resources/{resource-id}
```

## Data Model

### Resource Schema
```typescript
interface Resource {
  id: string;              // UUID
  name: string;            // 1-100 characters
  description: string;     // 1-500 characters
  category: string;        // 1-50 characters
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}
```

## API Response Format

All API responses follow this consistent format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "details": [ ... ]  // For validation errors
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

## Available NPM Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run clean` - Remove build directory

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode | `development` |
| `DB_PATH` | SQLite database file path | `./database.sqlite` |

##
