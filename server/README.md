# NextStep Backend

A professional Node.js + Express.js REST API for the NextStep job application tracker.

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database credentials

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Server runs on `http://localhost:5000`

---

## Documentation

- **[BUILD.md](./BUILD.md)** — Setup, installation, and database configuration
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Project structure, design patterns, and best practices
- **[API.md](./API.md)** — Complete API endpoint documentation
- **[FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md)** — React Query integration guide

---

## Features

✅ User authentication with JWT
✅ Job application CRUD operations
✅ Application status tracking with history
✅ Notes and comments on applications
✅ User profile management
✅ Secure password hashing with bcryptjs
✅ Input validation with Joi
✅ Error handling and logging
✅ PostgreSQL database with connection pooling
✅ CORS support for frontend integration
✅ Professional code organization

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Password Hashing**: bcryptjs
- **Security**: Helmet, CORS
- **Testing**: Jest + Supertest

---

## Scripts

```bash
# Development
npm run dev       # Start with auto-reload (nodemon)
npm start         # Start without auto-reload

# Code Quality
npm run lint      # ESLint with auto-fix

# Testing
npm test          # Run tests
npm test -- --coverage  # With coverage report

# Database
npm run migrate   # Run migrations
```

---

## Environment Variables

See `.env.example` for all required variables. Key ones:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=nextstep_user
DB_PASSWORD=your_password
DB_NAME=nextstep_db
PORT=5000
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

---

## Project Structure

```
src/
├── controllers/     # HTTP request handlers
├── routes/         # Route definitions
├── services/       # Business logic
├── dal/           # Data access layer
├── middleware/    # Express middleware
├── schemas/       # Joi validation schemas
├── config/        # Configuration files
├── utils/         # Utility functions
├── app.js         # Express app setup
└── server.js      # Server entry point
```

---

## API Overview

Base URL: `http://localhost:5000`

### Auth
- `POST /auth/register` — Register new user
- `POST /auth/login` — Login user

### Applications
- `GET /applications` — List all applications
- `POST /applications` — Create application
- `GET /applications/:id` — Get single application
- `PUT /applications/:id` — Update application
- `DELETE /applications/:id` — Delete application

### User
- `GET /users/profile` — Get user profile
- `PUT /users/profile` — Update profile
- `POST /users/change-password` — Change password

Full docs: [API.md](./API.md)

---

## Frontend Integration

Connect your React frontend using React Query:

```tsx
import { useApplications } from './api/hooks/useApplications';

function MyComponent() {
  const { data: apps, isLoading } = useApplications();
  
  if (isLoading) return <div>Loading...</div>;
  return <div>{apps?.map(app => <div key={app.id}>{app.company_name}</div>)}</div>;
}
```

See [FRONTEND_INTEGRATION.md](./FRONTEND_INTEGRATION.md) for complete guide.

---

## Development Workflow

1. Create a feature branch: `git checkout -b feature/my-feature`
2. Install dependencies: `npm install`
3. Start dev server: `npm run dev`
4. Make changes following the architecture patterns
5. Run tests: `npm test`
6. Lint code: `npm run lint`
7. Commit and push: `git push origin feature/my-feature`
8. Create Pull Request

---

## Testing

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Run in watch mode
npm test -- --watch

# Run specific test file
npm test -- auth.test.js
```

Tests follow the same structure as source:
- `tests/unit/` — Unit tests for services, utils
- `tests/integration/` — API endpoint tests
- `tests/fixtures/` — Mock data

---

## Deployment

See [BUILD.md](./BUILD.md) for production deployment instructions.

---

## Support

For questions or issues:
1. Check relevant documentation file
2. Review example code in comments
3. Check API responses for error messages
4. Run with `NODE_ENV=development` for verbose logging

---

**Last Updated**: January 2024
