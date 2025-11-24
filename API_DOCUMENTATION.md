# Rent Management System - API Documentation

## Table of Contents
1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Base URL](#base-url)
4. [Response Format](#response-format)
5. [Error Handling](#error-handling)
6. [Pagination](#pagination)
7. [API Endpoints](#api-endpoints)
   - [Authentication](#authentication-endpoints)
   - [Buildings](#buildings-endpoints)
   - [Flats](#flats-endpoints)
   - [Tenants](#tenants-endpoints)
   - [Payments](#payments-endpoints)
   - [Service Requests](#service-requests-endpoints)
   - [Family Members](#family-members-endpoints)

---

## Overview

The Rent Management System API provides endpoints for managing buildings, flats, tenants, payments, and service requests. All endpoints require authentication except for the login endpoint.

**Version:** 1.0.0

---

## Authentication

The API uses JWT-based authentication with HTTP-only cookies. After successful login, a session cookie is set automatically.

### Authentication Flow

1. **Login** - POST `/api/auth/login` with email and password
2. **Session Cookie** - A session cookie is automatically set upon successful login
3. **Protected Routes** - Include the session cookie in subsequent requests
4. **Logout** - POST `/api/auth/logout` to clear the session

### Roles

The system supports the following roles with hierarchical permissions:

- **ADMIN** - Full access to all resources
- **MANAGER** - Can manage buildings, tenants, and payments
- **STAFF** - Can create tenants and record payments
- **TENANT** - Can only view/modify their own data

---

## Base URL

```
http://localhost:3000/api
```

For production, replace with your production domain.

---

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE",
    "details": [ ... ]
  }
}
```

### Paginated Response

```json
{
  "success": true,
  "message": "Success",
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## Error Handling

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

### Error Codes

- `VALIDATION_ERROR` - Request validation failed
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `NOT_FOUND` - Resource not found
- `INTERNAL_ERROR` - Server error

---

## Pagination

Most GET endpoints support pagination using query parameters:

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Example:**
```
GET /api/buildings?page=2&limit=20
```

---

## API Endpoints

### Authentication Endpoints

#### Login

Authenticate a user and create a session.

**Endpoint:** `POST /api/auth/login`

**Authentication:** Not required

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Validation:**
- `email` - Valid email format (required)
- `password` - Non-empty string (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "role": "ADMIN"
  }
}
```

**Error Responses:**
- `401` - Invalid credentials
- `400` - Validation error

---

#### Register

Create a new user account.

**Endpoint:** `POST /api/auth/register`

**Authentication:** Required (ADMIN or MANAGER only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "role": "STAFF"
}
```

**Validation:**
- `name` - Minimum 2 characters (required)
- `email` - Valid email format (required)
- `password` - Minimum 8 characters, must contain:
  - At least one lowercase letter
  - At least one uppercase letter
  - At least one number
  - At least one special character
- `role` - One of: ADMIN, MANAGER, STAFF, TENANT (required)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "userId": "uuid-here"
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (insufficient permissions)
- `400` - Validation error or user already exists

---

#### Logout

Clear the current session.

**Endpoint:** `POST /api/auth/logout`

**Authentication:** Required

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully",
  "data": null
}
```

---

### Buildings Endpoints

#### Get All Buildings

Retrieve a paginated list of all buildings.

**Endpoint:** `GET /api/buildings`

**Authentication:** Required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "name": "Sunset Residency",
      "address": "123 Main Street",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z",
      "flats": [ ... ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  }
}
```

---

#### Create Building

Create a new building.

**Endpoint:** `POST /api/buildings`

**Authentication:** Required (ADMIN or MANAGER only)

**Request Body:**
```json
{
  "name": "Sunset Residency",
  "address": "123 Main Street, City"
}
```

**Validation:**
- `name` - Non-empty string (required)
- `address` - Non-empty string (required)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Building created successfully",
  "data": {
    "id": "uuid",
    "name": "Sunset Residency",
    "address": "123 Main Street, City",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### Flats Endpoints

#### Get Flats by Building

Retrieve all flats for a specific building.

**Endpoint:** `GET /api/buildings/[id]/flats`

**Authentication:** Required

**Path Parameters:**
- `id` - Building UUID (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "number": "101",
      "buildingId": "uuid",
      "rentAmount": 1500.00,
      "isOccupied": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### Create Flat

Create a new flat in a building.

**Endpoint:** `POST /api/buildings/[id]/flats`

**Authentication:** Required (ADMIN or MANAGER only)

**Path Parameters:**
- `id` - Building UUID (required)

**Request Body:**
```json
{
  "number": "101",
  "rentAmount": 1500.00,
  "isOccupied": false
}
```

**Validation:**
- `number` - Non-empty string (required)
- `rentAmount` - Positive number (required)
- `isOccupied` - Boolean (optional, default: false)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Flat created successfully",
  "data": {
    "id": "uuid",
    "number": "101",
    "buildingId": "uuid",
    "rentAmount": 1500.00,
    "isOccupied": false,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Building not found

---

### Tenants Endpoints

#### Get All Tenants

Retrieve a paginated list of all tenants.

**Endpoint:** `GET /api/tenants`

**Authentication:** Required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "userId": "uuid",
      "flatId": "uuid",
      "moveInDate": "2024-01-01T00:00:00.000Z",
      "securityDeposit": 3000.00,
      "user": {
        "id": "uuid",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "TENANT"
      },
      "flat": {
        "id": "uuid",
        "number": "101",
        "building": { ... }
      }
    }
  ],
  "pagination": { ... }
}
```

---

#### Create Tenant

Create a new tenant account and tenant record.

**Endpoint:** `POST /api/tenants`

**Authentication:** Required (ADMIN, MANAGER, or STAFF only)

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "flatId": "uuid",
  "moveInDate": "2024-01-01",
  "securityDeposit": 3000.00,
  "photo": "base64-string-or-null",
  "identityDocument": "base64-string-or-null",
  "identityType": "NID"
}
```

**Validation:**
- `name` - Minimum 2 characters (required)
- `email` - Valid email format (required)
- `password` - Strong password (see password requirements) (required)
- `flatId` - Valid UUID (optional)
- `moveInDate` - Date in YYYY-MM-DD format (required)
- `securityDeposit` - Non-negative number (optional, default: 0)
- `photo` - Base64 string or null (optional)
- `identityDocument` - Base64 string or null (optional)
- `identityType` - One of: NID, Passport, Driving License, Other (optional)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Tenant created successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "flatId": "uuid",
    "moveInDate": "2024-01-01T00:00:00.000Z",
    "securityDeposit": 3000.00
  }
}
```

**Error Responses:**
- `400` - Validation error, user already exists, flat not found, or flat already occupied
- `401` - Unauthorized
- `403` - Forbidden

---

#### Get Tenant by ID

Retrieve a specific tenant's details.

**Endpoint:** `GET /api/tenants/[id]`

**Authentication:** Required

**Path Parameters:**
- `id` - Tenant UUID (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "flatId": "uuid",
    "moveInDate": "2024-01-01T00:00:00.000Z",
    "securityDeposit": 3000.00,
    "user": { ... },
    "flat": { ... }
  }
}
```

**Error Responses:**
- `403` - Forbidden (tenants can only view their own data)
- `404` - Tenant not found

---

#### Update Tenant

Update tenant information.

**Endpoint:** `PATCH /api/tenants/[id]`

**Authentication:** Required

**Path Parameters:**
- `id` - Tenant UUID (required)

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "flatId": "new-uuid",
  "moveInDate": "2024-01-15",
  "moveOutDate": null,
  "securityDeposit": 3500.00,
  "photo": "base64-string",
  "identityDocument": "base64-string",
  "identityType": "Passport"
}
```

**Note:** All fields are optional. Only provided fields will be updated.

**Validation:**
- `name` - Minimum 2 characters (optional)
- `email` - Valid email format (optional)
- `flatId` - Valid UUID (optional, ADMIN/MANAGER only)
- `moveInDate` - Date in YYYY-MM-DD format (optional)
- `moveOutDate` - Date in YYYY-MM-DD format or null (optional)
- `securityDeposit` - Non-negative number (optional)
- `photo` - Base64 string or null (optional)
- `identityDocument` - Base64 string or null (optional)
- `identityType` - One of: NID, Passport, Driving License, Other (optional)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Tenant updated successfully",
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "flatId": "new-uuid",
    "moveInDate": "2024-01-15T00:00:00.000Z",
    "securityDeposit": 3500.00,
    "user": { ... },
    "flat": { ... }
  }
}
```

**Error Responses:**
- `400` - Flat not found or flat already occupied
- `403` - Forbidden (tenants can only update their own data, or insufficient permissions for flat assignment)
- `404` - Tenant not found

---

### Payments Endpoints

#### Get All Payments

Retrieve a paginated list of payments.

**Endpoint:** `GET /api/rent`

**Authentication:** Required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Note:** Tenants can only see their own payments.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "amount": 1500.00,
      "date": "2024-01-01T00:00:00.000Z",
      "type": "RENT",
      "method": "BKASH",
      "status": "PAID",
      "month": "2024-01",
      "tenant": {
        "id": "uuid",
        "user": { ... },
        "flat": { ... }
      }
    }
  ],
  "pagination": { ... }
}
```

---

#### Create Payment

Record a new payment.

**Endpoint:** `POST /api/rent`

**Authentication:** Required (ADMIN, MANAGER, or STAFF only)

**Request Body:**
```json
{
  "tenantId": "uuid",
  "amount": 1500.00,
  "type": "RENT",
  "method": "BKASH",
  "month": "2024-01",
  "status": "PAID"
}
```

**Validation:**
- `tenantId` - Valid UUID (required)
- `amount` - Positive number (required)
- `type` - One of: RENT, UTILITY, DEPOSIT (required)
- `method` - One of: CASH, BANK, BKASH, NAGAD (required)
- `month` - Date in YYYY-MM format (optional)
- `status` - One of: PAID, PARTIAL, PENDING (optional, default: PAID)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Payment recorded successfully",
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "amount": 1500.00,
    "date": "2024-01-01T00:00:00.000Z",
    "type": "RENT",
    "method": "BKASH",
    "status": "PAID",
    "month": "2024-01"
  }
}
```

---

### Service Requests Endpoints

#### Get All Service Requests

Retrieve a paginated list of service requests.

**Endpoint:** `GET /api/requests`

**Authentication:** Required

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)

**Note:** Tenants can only see their own requests.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "assignedToId": "uuid",
      "category": "PLUMBING",
      "description": "Leaky faucet in kitchen",
      "status": "PENDING",
      "cost": null,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "tenant": { ... },
      "assignedTo": {
        "id": "uuid",
        "name": "Staff Member",
        "email": "staff@example.com"
      }
    }
  ],
  "pagination": { ... }
}
```

---

#### Create Service Request

Create a new service request.

**Endpoint:** `POST /api/requests`

**Authentication:** Required

**Request Body:**
```json
{
  "tenantId": "uuid",
  "category": "PLUMBING",
  "description": "Leaky faucet in kitchen needs repair",
  "assignedToId": "uuid",
  "cost": 500.00,
  "status": "PENDING"
}
```

**Validation:**
- `tenantId` - Valid UUID (required)
- `category` - One of: PLUMBING, ELECTRICAL, CLEANING, OTHER (required)
- `description` - Minimum 10 characters (required)
- `assignedToId` - Valid UUID (optional)
- `cost` - Non-negative number (optional)
- `status` - One of: PENDING, IN_PROGRESS, COMPLETED (optional, default: PENDING)

**Note:** Tenants can only create requests for themselves.

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Service request created successfully",
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "category": "PLUMBING",
    "description": "Leaky faucet in kitchen needs repair",
    "status": "PENDING",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `403` - Forbidden (tenants can only create requests for themselves)

---

### Family Members Endpoints

#### Get Family Members

Retrieve all family members for a tenant.

**Endpoint:** `GET /api/tenants/[id]/family`

**Authentication:** Required

**Path Parameters:**
- `id` - Tenant UUID (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Success",
  "data": [
    {
      "id": "uuid",
      "tenantId": "uuid",
      "name": "Jane Doe",
      "relationship": "Spouse",
      "age": 30,
      "phone": "+1234567890",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Error Responses:**
- `403` - Forbidden (tenants can only view their own family members)
- `404` - Tenant not found

---

#### Create Family Member

Add a family member to a tenant.

**Endpoint:** `POST /api/tenants/[id]/family`

**Authentication:** Required

**Path Parameters:**
- `id` - Tenant UUID (required)

**Request Body:**
```json
{
  "name": "Jane Doe",
  "relationship": "Spouse",
  "age": 30,
  "phone": "+1234567890"
}
```

**Validation:**
- `name` - Minimum 2 characters (required)
- `relationship` - Non-empty string (required)
- `age` - Positive integer (optional)
- `phone` - String (optional)

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Family member created successfully",
  "data": {
    "id": "uuid",
    "tenantId": "uuid",
    "name": "Jane Doe",
    "relationship": "Spouse",
    "age": 30,
    "phone": "+1234567890",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400` - Validation error
- `403` - Forbidden (tenants can only add family members to their own record)
- `404` - Tenant not found

---

#### Delete Family Member

Remove a family member from a tenant.

**Endpoint:** `DELETE /api/tenants/[id]/family/[memberId]`

**Authentication:** Required

**Path Parameters:**
- `id` - Tenant UUID (required)
- `memberId` - Family member UUID (required)

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Family member deleted successfully",
  "data": null
}
```

**Error Responses:**
- `400` - Family member does not belong to this tenant
- `403` - Forbidden (tenants can only delete their own family members)
- `404` - Family member not found

---

## Example Requests

### Using cURL

**Login:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }' \
  -c cookies.txt
```

**Get Buildings (with session cookie):**
```bash
curl -X GET http://localhost:3000/api/buildings?page=1&limit=10 \
  -b cookies.txt
```

**Create Building:**
```bash
curl -X POST http://localhost:3000/api/buildings \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{
    "name": "Sunset Residency",
    "address": "123 Main Street"
  }'
```

### Using JavaScript (Fetch API)

**Login:**
```javascript
const response = await fetch('http://localhost:3000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  credentials: 'include', // Important for cookies
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'Admin123!'
  })
});

const data = await response.json();
```

**Get Buildings:**
```javascript
const response = await fetch('http://localhost:3000/api/buildings?page=1&limit=10', {
  method: 'GET',
  credentials: 'include', // Include session cookie
});

const data = await response.json();
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting in production to prevent abuse.

---

## Best Practices

1. **Always include credentials** - Use `credentials: 'include'` in fetch requests to send cookies
2. **Handle errors gracefully** - Check the `success` field in responses
3. **Use pagination** - For large datasets, always use pagination
4. **Validate on client** - Client-side validation improves UX, but server validation is required
5. **Store tokens securely** - Session cookies are HTTP-only for security
6. **Handle expired sessions** - Redirect to login on 401 responses

---

## Support

For issues or questions, please contact the development team.

---

**Last Updated:** 2024-01-01

