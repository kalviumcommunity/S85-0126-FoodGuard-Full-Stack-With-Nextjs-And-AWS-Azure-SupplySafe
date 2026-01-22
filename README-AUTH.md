# SupplySafe Authentication System

## 📋 Overview

This document explains the complete authentication system implemented in SupplySafe, including signup, login, and protected routes using JWT (JSON Web Tokens).

## 🔐 Authentication vs Authorization

### Authentication
- **Definition**: Verifies who the user is
- **Example**: Login using email + password
- **Implementation**: JWT tokens after successful login

### Authorization  
- **Definition**: Verifies what the user can access
- **Example**: Only ADMIN can access `/api/admin`
- **Implementation**: Role-based access control (future enhancement)

📌 **In this implementation, we focus on authentication**

## 🛠️ Technology Stack

- **bcrypt**: Password hashing (10 salt rounds - industry standard)
- **jsonwebtoken**: JWT token creation and validation
- **Prisma**: Database ORM with PostgreSQL
- **Next.js API Routes**: RESTful API endpoints

## 📁 Folder Structure

```
src/
 └── app/
      └── api/
           ├── auth/
           │    ├── signup/
           │    │    └── route.ts     # User registration
           │    └── login/
           │         └── route.ts     # User login with JWT
           └── users/
                └── route.ts          # Protected route
lib/
 └── prisma.ts                       # Database client
```

## 🔑 Security Features

### Password Security
- ✅ Passwords are **never stored in plain text**
- ✅ bcrypt with 10 salt rounds for hashing
- ✅ Secure password comparison during login

### JWT Security
- ✅ Tokens signed with secret key
- ✅ 1-hour expiration time
- ✅ Contains user identity (id, email, name)
- ✅ Invalidated on logout (client-side)

### API Security
- ✅ Input validation on all endpoints
- ✅ Proper HTTP status codes
- ✅ Error handling without information leakage

## 🚀 API Endpoints

### 1. Signup API
**Endpoint**: `POST /api/auth/signup`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com", 
  "password": "securePassword123"
}
```

**Success Response** (201):
```json
{
  "success": true,
  "message": "Signup successful",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com",
    "name": "John Doe"
  }
}
```

**Error Responses**:
- `400`: Missing required fields
- `409`: User already exists
- `500`: Server error

### 2. Login API
**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Login successful", 
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com", 
    "name": "John Doe"
  }
}
```

**Error Responses**:
- `401`: Invalid credentials
- `404`: User not found
- `500`: Server error

### 3. Protected Route API
**Endpoint**: `GET /api/users`

**Headers**:
```
Authorization: Bearer <jwt_token>
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Protected route accessed",
  "user": {
    "id": "user-uuid",
    "email": "john@example.com",
    "name": "John Doe", 
    "role": "USER",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses**:
- `401`: Token missing
- `403`: Invalid or expired token
- `404`: User not found

## 🔧 Environment Setup

Create a `.env` file with:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb"
JWT_SECRET=super_secure_secret_min_32_characters_long
```

**Important**: 
- JWT_SECRET must be at least 32 characters long
- Use different secrets for development/staging/production
- Never commit `.env` files to version control

## 🧪 Testing the Authentication Flow

### 1. Test Signup
```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com", 
    "password": "testPassword123"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testPassword123"
  }'
```

### 3. Test Protected Route
```bash
# Replace <token> with the JWT from login response
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer <token>"
```

## 🔄 Authentication Flow Diagram

```
1. User Signup
   Client → POST /api/auth/signup → Server
   Server: Hash password → Store user → Return success

2. User Login  
   Client → POST /api/auth/login → Server
   Server: Verify password → Generate JWT → Return token

3. Access Protected Route
   Client → GET /api/users (with JWT) → Server
   Server: Validate JWT → Return user data
```

## 🛡️ Security Best Practices Implemented

1. **Password Security**
   - Never store plain text passwords
   - Use bcrypt with appropriate salt rounds
   - Validate password strength (future enhancement)

2. **JWT Security**
   - Short expiration time (1 hour)
   - Strong secret keys
   - Proper error handling

3. **API Security**
   - Input validation
   - Rate limiting (future enhancement)
   - CORS configuration
   - HTTPS in production

4. **Database Security**
   - Parameterized queries (via Prisma)
   - Selective data exposure
   - Proper error handling

## 🚨 Important Notes

- **Database Setup**: Run `npx prisma migrate dev` after schema changes
- **Token Storage**: Store JWT in httpOnly cookies or secure storage
- **Logout**: Implement client-side token deletion
- **Refresh Tokens**: Consider implementing refresh tokens for better UX

## 🔮 Future Enhancements

1. **Authorization**: Role-based access control
2. **Security**: Rate limiting, account lockout
3. **UX**: Password reset, email verification
4. **Tokens**: Refresh tokens, token blacklisting
5. **Monitoring**: Login attempts, security logs

## 📞 Support

For authentication-related issues:
1. Check environment variables
2. Verify database connection
3. Review API request/response format
4. Check JWT token validity

---

**Last Updated**: January 2024
**Version**: 1.0.0
