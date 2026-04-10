# Auth System - Shared Authentication Module

Auth-system is a centralized authentication and authorization service used across all projects in the portfolio to manage user accounts, sessions, and permissions.

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Integration Guide](#integration-guide)
- [Setup](#setup)
- [Configuration](#configuration)

## 🔐 Overview

Auth-system provides:

- **Centralized Authentication**: Single source of truth for user accounts
- **OAuth/JWT Support**: Bearer token authentication
- **User Management**: Create, read, update user accounts
- **Role-Based Access Control**: User roles and permissions
- **Session Management**: Session handling and validation
- **Message Service**: User messaging and notifications

## 🏗️ Architecture

### Integration Pattern

```
Client App 1
    ↓
Auth API Requests
    ↓
Auth-System Service
    ↓
Shared Database
    ↓
Auth API Responses
    ↓
Client App 2
```

### Exported Modules

```
auth-system/
├── app/
│   ├── Http/
│   │   └── Controllers/
│   │       ├── AuthController.php
│   │       ├── UserController.php
│   │       └── MessageController.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Role.php
│   │   └── Message.php
│   └── Services/
│       ├── AuthService.php
│       ├── UserService.php
│       └── TokenService.php
├── routes/
│   └── api.php
└── config/
    └── auth.php
```

## 📡 API Reference

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secure_password",
  "password_confirmation": "secure_password"
}
```

**Response (201)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": "user_123",
    "name": "John Doe",
    "email": "john@example.com",
    "roles": ["user"]
  }
}
```

#### Logout

```http
POST /api/auth/logout
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

#### Refresh Token

```http
POST /api/auth/refresh
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

### User Management

#### Get Current User

```http
GET /api/user
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "id": "user_123",
  "name": "John Doe",
  "email": "john@example.com",
  "roles": ["user"],
  "permissions": ["read", "write"]
}
```

#### Update User

```http
PATCH /api/user
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "name": "Jane Doe",
  "email": "jane@example.com"
}
```

**Response (200)**:
```json
{
  "success": true,
  "user": {
    "id": "user_123",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}
```

### Messages API

#### Get Messages

```http
GET /api/messages
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
[
  {
    "id": "msg_1",
    "user_id": "user_123",
    "subject": "Welcome",
    "body": "Welcome to the platform",
    "read": false,
    "created_at": "2026-04-09T10:00:00Z"
  }
]
```

#### Mark Message as Read

```http
PATCH /api/messages/{id}/read
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true
}
```

#### Mark All as Read

```http
PATCH /api/messages/read-all
Authorization: Bearer YOUR_TOKEN
```

**Response (200)**:
```json
{
  "success": true,
  "count": 5
}
```

## 🔗 Integration Guide

### Installation

```bash
# In your project directory
composer require vendor/auth-system

# Publish configuration
php artisan vendor:publish --provider="AuthSystem\ServiceProvider"
```

### Configuration

Edit `.env` in your project:

```env
# Auth System Service URL
AUTH_SYSTEM_URL=https://auth.example.com
AUTH_SYSTEM_SECRET=your_shared_secret

# API Keys
AUTH_API_KEY=your_api_key
```

### In Your Application

#### Login Flow

```typescript
// Login user
const response = await fetch('https://auth.example.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: user.email,
    password: user.password,
  })
});

const data = await response.json();
if (data.success) {
  localStorage.setItem('auth_token', data.token);
  // Redirect to app
}
```

#### Protected Requests

```typescript
// In your app, all requests to Auth API
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
  'Content-Type': 'application/json',
};

const response = await fetch('https://auth.example.com/api/messages', {
  headers
});
```

#### Using Laravel Service

```php
<?php
namespace App\Services;

use AuthSystem\Facades\Auth;

class MyService {
    public function getUser() {
        return Auth::user();
    }
    
    public function createToken($userId) {
        return Auth::createToken($userId);
    }
}
```

## 🛠️ Setup

### Prerequisites

- PHP 8.2+
- Composer
- MySQL 8.0+
- laravel/sanctum for token management

### Installation

```bash
# Clone repository
git clone https://github.com/YOUR-USERNAME/auth-system.git
cd auth-system

# Install dependencies
composer install

# Environment setup
cp .env.example .env
php artisan key:generate

# Database migrations
php artisan migrate

# Generate keys (for JWT if used)
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan vendor:publish --provider="AuthSystem\ServiceProvider"
```

### Starting the Service

```bash
# Development
php artisan serve --port=8000

# Production
# Use systemd/supervisor to keep service running
```

## ⚙️ Configuration

### User Roles

```php
// Seed default roles
php artisan db:seed --class=RoleSeeder

// Roles: admin, moderator, user
```

### Permissions

```php
// Define permissions for roles
Auth::definePermissions([
    'admin' => ['read', 'write', 'delete'],
    'user' => ['read', 'write'],
    'guest' => ['read'],
]);
```

### Token Expiration

```env
# In .env
AUTH_TOKEN_EXPIRY=3600  # 1 hour in seconds
AUTH_REFRESH_EXPIRY=604800  # 7 days
```

## 🔐 Security

### Password Policy

- Minimum 8 characters
- Must contain uppercase and lowercase
- Must contain numbers and special characters
- Hashed with bcrypt

### Token Security

- JWTs signed with app secret
- Tokens expire after configured time
- Refresh tokens for extended sessions
- HTTPS required in production

### CORS Configuration

```php
// config/cors.php
'allowed_origins' => [
    'https://project1.example.com',
    'https://project2.example.com',
    'https://project3.example.com',
],
```

## 🐛 Troubleshooting

### Token Invalid

- Check token hasn't expired
- Verify HTTPS in production
- Check CORS configuration
- Verify token format

### User Not Found

- Check email/username spelling
- Verify user exists in database
- Check user hasn't been deleted

### Connection Issues

- Verify Auth System URL is correct
- Check firewall rules
- Verify DNS resolution
- Check HTTPS certificates

## 📚 Resources

- [Laravel Authentication](https://laravel.com/docs/authentication)
- [JWT Documentation](https://jwt.io/)
- [OAuth 2.0](https://oauth.net/2/)

## 🤝 Contributing

All projects use this shared auth system. When making changes:

1. Update version in composer.json
2. Document API changes
3. Test with dependent projects
4. Update this documentation

## 📞 Support

- Check documentation
- Review error logs
- Test with Postman
- Contact development team
