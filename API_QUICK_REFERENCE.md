# API Quick Reference Guide

A quick reference for common API operations.

## Base URL
```
http://localhost:3000/api
```

## Authentication

### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!"
}
```

### Logout
```http
POST /api/auth/logout
```

---

## Buildings

### List Buildings (Paginated)
```http
GET /api/buildings?page=1&limit=10
```

### Create Building
```http
POST /api/buildings
Content-Type: application/json

{
  "name": "Building Name",
  "address": "123 Main St"
}
```
**Required Role:** ADMIN, MANAGER

---

## Flats

### Get Flats by Building
```http
GET /api/buildings/{buildingId}/flats
```

### Create Flat
```http
POST /api/buildings/{buildingId}/flats
Content-Type: application/json

{
  "number": "101",
  "rentAmount": 1500.00,
  "isOccupied": false
}
```
**Required Role:** ADMIN, MANAGER

---

## Tenants

### List Tenants (Paginated)
```http
GET /api/tenants?page=1&limit=10
```

### Get Tenant
```http
GET /api/tenants/{tenantId}
```

### Create Tenant
```http
POST /api/tenants
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "flatId": "uuid",
  "moveInDate": "2024-01-01",
  "securityDeposit": 3000.00
}
```
**Required Role:** ADMIN, MANAGER, STAFF

### Update Tenant
```http
PATCH /api/tenants/{tenantId}
Content-Type: application/json

{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

---

## Payments

### List Payments (Paginated)
```http
GET /api/rent?page=1&limit=10
```
**Note:** Tenants see only their own payments

### Create Payment
```http
POST /api/rent
Content-Type: application/json

{
  "tenantId": "uuid",
  "amount": 1500.00,
  "type": "RENT",
  "method": "BKASH",
  "month": "2024-01"
}
```
**Required Role:** ADMIN, MANAGER, STAFF

---

## Service Requests

### List Requests (Paginated)
```http
GET /api/requests?page=1&limit=10
```
**Note:** Tenants see only their own requests

### Create Request
```http
POST /api/requests
Content-Type: application/json

{
  "tenantId": "uuid",
  "category": "PLUMBING",
  "description": "Leaky faucet needs repair"
}
```

---

## Family Members

### Get Family Members
```http
GET /api/tenants/{tenantId}/family
```

### Add Family Member
```http
POST /api/tenants/{tenantId}/family
Content-Type: application/json

{
  "name": "Jane Doe",
  "relationship": "Spouse",
  "age": 30,
  "phone": "+1234567890"
}
```

### Delete Family Member
```http
DELETE /api/tenants/{tenantId}/family/{memberId}
```

---

## Response Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized |
| 403 | Forbidden (insufficient permissions) |
| 404 | Not Found |
| 500 | Internal Server Error |

---

## Common Request Headers

```http
Content-Type: application/json
Cookie: session=<session-token>
```

---

## Common Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### Error
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "code": "ERROR_CODE"
  }
}
```

### Paginated
```json
{
  "success": true,
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

## Validation Rules

### Password Requirements
- Minimum 8 characters
- At least one lowercase letter
- At least one uppercase letter
- At least one number
- At least one special character

### Email
- Valid email format

### UUID
- Valid UUID v4 format

### Dates
- `moveInDate`: YYYY-MM-DD format
- `month`: YYYY-MM format

---

## Role Permissions Matrix

| Action | ADMIN | MANAGER | STAFF | TENANT |
|--------|-------|---------|-------|--------|
| Create User | ✅ | ✅ | ❌ | ❌ |
| Create Building | ✅ | ✅ | ❌ | ❌ |
| Create Flat | ✅ | ✅ | ❌ | ❌ |
| Create Tenant | ✅ | ✅ | ✅ | ❌ |
| View All Tenants | ✅ | ✅ | ✅ | ❌ |
| View Own Data | ✅ | ✅ | ✅ | ✅ |
| Record Payment | ✅ | ✅ | ✅ | ❌ |
| Create Service Request | ✅ | ✅ | ✅ | ✅ (own only) |
| View All Requests | ✅ | ✅ | ✅ | ❌ (own only) |

---

## JavaScript Examples

### Login
```javascript
const login = async (email, password) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ email, password })
  });
  return response.json();
};
```

### Get Buildings
```javascript
const getBuildings = async (page = 1, limit = 10) => {
  const response = await fetch(
    `/api/buildings?page=${page}&limit=${limit}`,
    {
      credentials: 'include'
    }
  );
  return response.json();
};
```

### Create Building
```javascript
const createBuilding = async (name, address) => {
  const response = await fetch('/api/buildings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name, address })
  });
  return response.json();
};
```

---

For detailed documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

