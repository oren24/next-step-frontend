# NextStep Backend - Architecture Guide

## Overview

The NextStep backend is a professional Node.js + Express.js REST API that manages job application tracking. The architecture follows a layered pattern (Controller → Logic → DAL) with separation of concerns and clean code principles.

---

## Project Structure

```
server/
├── src/
│   ├── app.js                 # Express app configuration, middleware setup
│   ├── server.js              # Server entry point (port initialization)
│   ├── config/
│   │   ├── database.js        # Database connection pool
│   │   ├── constants.js       # App-wide constants
│   │   └── logger.js          # Logging configuration
│   ├── controllers/           # HTTP request handlers
│   │   ├── authController.js
│   │   ├── applicationsController.js
│   │   ├── usersController.js
│   │   └── index.js           # Export all controllers
│   ├── routes/                # Route definitions
│   │   ├── auth.routes.js
│   │   ├── applications.routes.js
│   │   ├── users.routes.js
│   │   └── index.js           # Mount all routes
│   ├── services/              # Business logic & validations
│   │   ├── authService.js
│   │   ├── applicationService.js
│   │   ├── userService.js
│   │   └── index.js
│   ├── dal/                   # Data Access Layer (queries)
│   │   ├── connectionWrapper.js
│   │   ├── authDal.js
│   │   ├── applicationsDal.js
│   │   ├── usersDal.js
│   │   └── index.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── errorHandler.js
│   │   ├── validation.middleware.js
│   │   └── index.js
│   ├── schemas/               # Joi validation schemas
│   │   ├── auth.schema.js
│   │   ├── application.schema.js
│   │   └── user.schema.js
│   ├── utils/
│   │   ├── tokenUtils.js      # JWT utilities
│   │   ├── passwordUtils.js   # Bcrypt utilities
│   │   ├── errorHandler.js    # Custom error classes
│   │   └── validators.js      # Reusable validators
│   └── types/                 # JSDoc type definitions
│       └── index.js
├── migrations/                # Database migrations
│   └── 001_initial_schema.sql
├── .env.example
├── .gitignore
├── package.json
├── ARCHITECTURE.md
├── BUILD.md                   # Build & setup instructions
├── API.md                     # API documentation
└── README.md
```

---

## Layer Descriptions

### 1. **Controllers** (`src/controllers/`)

Handles HTTP requests and responses. Controllers are thin and delegate business logic to services.

**Example: `authController.js`**

```javascript
export const register = async (req, res, next) => {
  try {
    const { email, password, name } = req.body;
    const result = await authService.register(email, password, name);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
```

**Responsibilities:**
- Parse request data
- Call appropriate service function
- Format and send HTTP response
- Delegate validation to middleware
- Delegate errors to error handler

---

### 2. **Services/Logic** (`src/services/`)

Contains business logic, data validation, and orchestration. Services call DAL methods and enforce domain rules.

**Example: `authService.js`**

```javascript
export const register = async (email, password, name) => {
  // Validation
  if (!email || !password) throw new ValidationError('Missing required fields');
  
  // Check if user exists
  const existingUser = await authDal.getUserByEmail(email);
  if (existingUser) throw new ConflictError('User already exists');
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Save to database
  const user = await authDal.createUser(email, hashedPassword, name);
  
  // Generate token
  const token = generateToken(user.id);
  
  return { user, token };
};
```

**Responsibilities:**
- Business logic and domain rules
- Input validation
- Authorization checks
- Data transformation
- Call DAL methods
- Error handling and propagation

---

### 3. **DAL (Data Access Layer)** (`src/dal/`)

Direct database operations. DAL methods use parameterized queries to prevent SQL injection.

**Example: `authDal.js`**

```javascript
export const createUser = async (email, passwordHash, name) => {
  const sql = `
    INSERT INTO users (email, password_hash, name, created_at)
    VALUES ($1, $2, $3, NOW())
    RETURNING id, email, name, created_at;
  `;
  const [user] = await connection.executeWithParameters(sql, [
    email,
    passwordHash,
    name
  ]);
  return user;
};

export const getUserByEmail = async (email) => {
  const sql = 'SELECT * FROM users WHERE email = $1';
  const [user] = await connection.executeWithParameters(sql, [email]);
  return user;
};
```

**Responsibilities:**
- Database queries (SELECT, INSERT, UPDATE, DELETE)
- Parameterized queries (prevent SQL injection)
- Connection management
- Return raw database results

---

### 4. **Routes** (`src/routes/`)

Define HTTP endpoints and attach controllers. Apply route-specific middleware and validation schemas.

**Example: `auth.routes.js`**

```javascript
import express from 'express';
import { register, login } from '../controllers/authController.js';
import { validateRequest } from '../middleware/validation.middleware.js';
import { registerSchema, loginSchema } from '../schemas/auth.schema.js';

const router = express.Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);

export default router;
```

---

### 5. **Middleware** (`src/middleware/`)

Request preprocessing and cross-cutting concerns.

- **auth.middleware.js**: JWT verification
- **validation.middleware.js**: Request body/param validation
- **errorHandler.js**: Centralized error handling

**Example: `auth.middleware.js`**

```javascript
export const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  
  try {
    const decoded = verifyToken(token);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};
```

---

### 6. **Schemas** (`src/schemas/`)

Joi validation schemas for request validation. Schemas are applied via validation middleware.

**Example: `auth.schema.js`**

```javascript
import Joi from 'joi';

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  name: Joi.string().required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});
```

---

## Data Flow Example: User Registration

```
Client POST /auth/register
    ↓
Express Route Handler (routes/auth.routes.js)
    ↓
Validation Middleware (validates body against schema)
    ↓
Controller: authController.register()
    ↓
Service: authService.register()
    - Validate inputs
    - Check if user exists (DAL call)
    - Hash password
    - Create user (DAL call)
    - Generate JWT token
    ↓
DAL: authDal.createUser(), authDal.getUserByEmail()
    - Execute SQL queries
    - Return results
    ↓
Response: 201 Created with user + token
```

---

## Database

### Connection Pool

The `src/config/database.js` creates a PostgreSQL connection pool for efficient database access:

```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  max: 20, // Max connection pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export default pool;
```

### Schema

Key tables:

1. **users**: Core user data
   - id, email, password_hash, name, profile_picture, created_at, updated_at

2. **job_applications**: Job application entries
   - id, user_id, company_name, job_title, job_url, status, description, applied_date, created_at, updated_at

3. **application_statuses**: Status history
   - id, application_id, status, timestamp

4. **notes**: Application notes
   - id, application_id, content, created_at

---

## Error Handling

Custom error classes in `src/utils/errorHandler.js`:

```javascript
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}
```

Middleware catches errors and responds with appropriate HTTP status codes.

---

## Security Best Practices

1. **Authentication**: JWT tokens for stateless auth
2. **Password Hashing**: bcryptjs (10 salt rounds)
3. **SQL Injection Prevention**: Parameterized queries
4. **CORS**: Whitelist frontend domain
5. **Helmet**: Security headers
6. **Input Validation**: Joi schemas before processing
7. **Environment Variables**: Sensitive config in .env
8. **Rate Limiting**: To be implemented

---

## Testing Strategy

- **Unit Tests**: Services and DAL functions
- **Integration Tests**: Full request/response cycle
- **Fixtures**: Mock data for tests
- **Coverage Target**: 80%+

Run: `npm test`

---

## Performance Considerations

1. **Connection Pooling**: PostgreSQL pool (max 20 connections)
2. **Query Optimization**: Indexes on frequently queried columns
3. **Caching**: Redis cache (future enhancement)
4. **Pagination**: For large result sets
5. **Eager Loading**: Join queries to reduce N+1 problems

---

This architecture ensures scalability, maintainability, and professional code organization.
