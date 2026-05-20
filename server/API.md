# NextStep Backend - API Documentation

## Base URL

```
http://localhost:5000
```

---

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

---

## Endpoints

### Auth Endpoints

#### 1. Register User

```http
POST /auth/register
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error** (409 Conflict):
```json
{
  "error": "User already exists"
}
```

---

#### 2. Login User

```http
POST /auth/login
Content-Type: application/json
```

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "name": "John Doe"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error** (401 Unauthorized):
```json
{
  "error": "Invalid credentials"
}
```

---

### Job Applications Endpoints

#### 3. Get All Applications

```http
GET /applications
Authorization: Bearer <token>
```

**Query Parameters**:
- `status`: Filter by status (applied, interviewing, offer, rejected, wishlist)
- `page`: Pagination page (default: 1)
- `limit`: Results per page (default: 20)

**Example**:
```bash
GET /applications?status=interviewing&page=1&limit=10
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "company_logo": "https://example.com/logo.png",
      "company_name": "Tech Corp",
      "job_title": "Senior Developer",
      "job_url": "https://example.com/jobs/123",
      "status": "interviewing",
      "description": "Great opportunity",
      "applied_date": "2024-01-10",
      "created_at": "2024-01-10T10:00:00Z",
      "updated_at": "2024-01-12T14:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

---

#### 4. Create Application

```http
POST /applications
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "company_name": "Tech Corp",
  "company_logo": "https://example.com/logo.png",
  "job_title": "Senior Developer",
  "job_url": "https://example.com/jobs/123",
  "status": "applied",
  "description": "Great opportunity",
  "applied_date": "2024-01-10"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "company_logo": "https://example.com/logo.png",
    "company_name": "Tech Corp",
    "job_title": "Senior Developer",
    "status": "applied",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 5. Get Single Application

```http
GET /applications/:id
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "user_id": 1,
    "company_logo": "https://example.com/logo.png",
    "company_name": "Tech Corp",
    "job_title": "Senior Developer",
    "job_url": "https://example.com/jobs/123",
    "status": "interviewing",
    "description": "Great opportunity",
    "applied_date": "2024-01-10",
    "notes": [
      {
        "id": 1,
        "content": "First round scheduled for Jan 20",
        "created_at": "2024-01-12T14:30:00Z"
      }
    ],
    "status_history": [
      {
        "status": "applied",
        "timestamp": "2024-01-10T10:00:00Z"
      },
      {
        "status": "interviewing",
        "timestamp": "2024-01-12T14:30:00Z"
      }
    ],
    "created_at": "2024-01-10T10:00:00Z",
    "updated_at": "2024-01-12T14:30:00Z"
  }
}
```

---

#### 6. Update Application

```http
PUT /applications/:id
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "company_name": "Tech Corp",
  "job_title": "Senior Developer",
  "status": "interviewing",
  "description": "Updated description"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "company_name": "Tech Corp",
    "status": "interviewing",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 7. Delete Application

```http
DELETE /applications/:id
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Application deleted successfully"
}
```

---

### Notes Endpoints

#### 8. Add Note to Application

```http
POST /applications/:id/notes
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "content": "First round scheduled for Jan 20"
}
```

**Response** (201 Created):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "application_id": 1,
    "content": "First round scheduled for Jan 20",
    "created_at": "2024-01-12T14:30:00Z"
  }
}
```

---

#### 9. Get Application Notes

```http
GET /applications/:id/notes
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "application_id": 1,
      "content": "First round scheduled for Jan 20",
      "created_at": "2024-01-12T14:30:00Z"
    }
  ]
}
```

---

### User Profile Endpoints

#### 10. Get User Profile

```http
GET /users/profile
Authorization: Bearer <token>
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "profile_picture": "https://...",
    "bio": "Software developer",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### 11. Update User Profile

```http
PUT /users/profile
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "name": "John Doe",
  "bio": "Senior Software Developer",
  "profile_picture": "https://..."
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "bio": "Senior Software Developer",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

---

#### 12. Change Password

```http
POST /users/change-password
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "current_password": "OldPass123!",
  "new_password": "NewPass456!"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Password changed successfully"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Validation error",
  "details": "Email is required"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Missing or invalid token"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "Application not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Something went wrong"
}
```

---

## Status Codes

- **200 OK**: Successful GET, PUT request
- **201 Created**: Successful POST request
- **400 Bad Request**: Validation error
- **401 Unauthorized**: Missing or invalid authentication
- **403 Forbidden**: User doesn't have permission
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **500 Internal Server Error**: Server error

---

For setup instructions, see [BUILD.md](./BUILD.md).
For architecture details, see [ARCHITECTURE.md](./ARCHITECTURE.md).
