# NextStep Backend - Build & Setup Instructions

## Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL**: v14.0 or higher (or use Docker)
- **Git**: For version control

---

## Step 1: Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/oren24/next-step-frontend.git
cd next-step-frontend

# Switch to server branch
git checkout server

# Navigate to server directory
cd server

# Install dependencies
npm install
```

---

## Step 2: Set Up Database

### Option A: Local PostgreSQL

1. **Install PostgreSQL**:
   - [Download](https://www.postgresql.org/download/) and install PostgreSQL
   - Remember the password you set for the `postgres` user

2. **Create Database & User**:
   ```bash
   # Connect to PostgreSQL
   psql -U postgres

   # Create database
   CREATE DATABASE nextstep_db;

   # Create user
   CREATE USER nextstep_user WITH PASSWORD 'your_secure_password';

   # Grant privileges
   GRANT ALL PRIVILEGES ON DATABASE nextstep_db TO nextstep_user;

   # Exit
   \q
   ```

3. **Run Migrations**:
   ```bash
   # This will create tables automatically
   npm run migrate
   ```

### Option B: Docker PostgreSQL (Recommended)

```bash
# Run PostgreSQL container
docker run --name nextstep-postgres \
  -e POSTGRES_USER=nextstep_user \
  -e POSTGRES_PASSWORD=secure_password \
  -e POSTGRES_DB=nextstep_db \
  -p 5432:5432 \
  -d postgres:15

# Verify container is running
docker ps
```

---

## Step 3: Environment Configuration

1. **Copy .env.example to .env**:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` with your values**:
   ```bash
   # Edit the file with your text editor or run:
   cat > .env << 'EOF'
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=nextstep_user
   DB_PASSWORD=your_secure_password
   DB_NAME=nextstep_db

   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_here_min_32_chars
   JWT_EXPIRY=7d

   # Frontend URL (CORS)
   FRONTEND_URL=http://localhost:5173
   EOF
   ```

---

## Step 4: Run Database Migrations

```bash
# Create initial schema
psql -U nextstep_user -d nextstep_db -f migrations/001_initial_schema.sql

# Verify tables were created
psql -U nextstep_user -d nextstep_db -c "\dt"
```

**Expected tables**:
- users
- job_applications
- application_statuses
- notes

---

## Step 5: Run the Development Server

```bash
# Install nodemon (if not already installed globally)
npm install -D nodemon

# Start development server with auto-reload
npm run dev

# OR start without auto-reload
npm start
```

**Expected output**:
```
Server running on http://localhost:5000
Database connected successfully
```

The server will listen on `http://localhost:5000`.

---

## Step 6: Verify API is Running

### Using curl:

```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
# {"status":"ok","timestamp":"2024-01-15T10:30:00Z"}
```

### Using Postman:

1. Open Postman
2. Create new GET request to `http://localhost:5000/health`
3. Click "Send"
4. You should get a 200 OK response

---

## Step 7: Connect Frontend

In the frontend (`src/` directory), configure the API base URL:

```javascript
// src/api/client.ts (or similar)
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
```

---

## Project Directory Structure

After setup, your project should look like:

```
server/
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── services/
│   ├── dal/
│   ├── middleware/
│   ├── schemas/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   └── server.js
├── migrations/
├── tests/
├── .env
├── .env.example
├── .gitignore
├── package.json
├── ARCHITECTURE.md
├── BUILD.md
├── API.md
└── README.md
```

---

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

---

## Linting & Code Quality

```bash
# Run ESLint and fix issues
npm run lint
```

---

## Troubleshooting

### "Cannot connect to database"

- Ensure PostgreSQL is running: `psql -U postgres`
- Check DB credentials in `.env`
- Verify database exists: `psql -U postgres -l`

### "Port 5000 already in use"

```bash
# Find process using port 5000
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows

# Kill the process or change PORT in .env
```

### "JWT_SECRET not set"

- Ensure `.env` file exists and contains `JWT_SECRET`
- Restart the server after updating `.env`

---

## Production Deployment

1. **Set NODE_ENV=production** in `.env`
2. **Use a process manager** like PM2:
   ```bash
   npm install -g pm2
   pm2 start src/server.js --name "nextstep-api"
   pm2 startup
   pm2 save
   ```

3. **Use a reverse proxy** like Nginx
4. **Enable HTTPS** with SSL certificates
5. **Set strong JWT_SECRET** (32+ chars)
6. **Use environment-specific configs** for production DB

---

For more details on API endpoints, see [API.md](./API.md).
For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md).
