# Auth System

> Centralized authentication and authorization service for the portfolio of web applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Laravel](https://img.shields.io/badge/Laravel-12.x-FF2D20?logo=laravel)](https://laravel.com)

## 📋 Overview

Auth System is a shared authentication service that provides centralized user management, JWT-based authentication, and role-based access control for all applications in the portfolio.

**Key Features**:

- 🔐 **Centralized Authentication**: Single sign-on across all apps
- 🎫 **JWT Tokens**: Secure bearer token authentication
- 👥 **User Management**: Create, read, update user accounts
- 🔑 **Role-Based Access**: User roles and permissions
- 💬 **Messaging**: User notifications and messages
- ⚡ **Fast & Secure**: Optimized for performance and security

## 🛠 Tech Stack

- **Backend**: Laravel 12 with Sanctum
- **Database**: MySQL 8.0+
- **Authentication**: JWT via Laravel Sanctum
- **Language**: PHP 8.2+

## 🚀 Quick Start

### Prerequisites

- PHP 8.2 or higher
- Composer
- MySQL 8.0 or higher
- Git

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

# Database setup
php artisan migrate

# Start service
php artisan serve
```

### Configuration

Edit `.env`:

```env
APP_NAME=AuthSystem
APP_URL=https://auth.example.com

DB_CONNECTION=mysql
DB_HOST=localhost
DB_DATABASE=auth_system
DB_USERNAME=root
DB_PASSWORD=password

SANCTUM_STATEFUL_DOMAINS=app1.local,app2.local,app3.local
```

## 📡 API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### User Management

- `GET /api/user` - Get current user
- `PATCH /api/user` - Update user profile
- `POST /api/user/password` - Change password

### Messages

- `GET /api/messages` - Get user messages
- `PATCH /api/messages/{id}/read` - Mark message as read
- `PATCH /api/messages/read-all` - Mark all as read

## 🔗 Integration

### From Another Project

```bash
# In your project's .env
AUTH_SYSTEM_URL=https://auth.example.com
```

### Login

```javascript
const response = await fetch('https://auth.example.com/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password'
  })
});

const data = await response.json();
localStorage.setItem('auth_token', data.token);
```

### Protected Requests

```javascript
const response = await fetch('https://auth.example.com/api/user', {
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
  }
});
```

## 📚 Full Documentation

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for complete API reference.

## 🧪 Testing

```bash
# Run tests
./vendor/bin/phpunit

# With coverage
./vendor/bin/phpunit --coverage-html coverage
```

## 🔐 Security

- Passwords hashed with bcrypt
- JWTs signed with app secret
- CORS enabled for authorized domains
- HTTPS required in production
- Rate limiting on auth endpoints

## 📝 License

Licensed under the MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📞 Support

For issues and questions, open an issue on GitHub.

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

## Integration with Other Projects

This auth-system is the central authentication and user management service for all related projects in the polyrepo (e.g., graveyardjokes, hollowpress, lunarblood, etc.).

### Features
- Centralized login and registration for all users
- API endpoints for user and purchase management
- Purchases from other projects (e.g., PayPal payments from graveyardjokes) are recorded here
- Purchases are visible on the user dashboard (via Inertia.js props)
- Secure, scalable, and ready for multi-project SSO

### Purchase Flow
- External projects POST purchase/payment details to `/api/purchases` (see API docs)
- Purchases are linked to the authenticated user
- Dashboard displays all purchases for the logged-in user

### Integration Steps
1. Configure all frontend projects to use this auth-system for login/registration (via API or Inertia)
2. On successful payment in external projects, POST purchase details to `/api/purchases` with the user's token
3. Purchases will appear on the dashboard for the user

---

## Testing & Coverage

### Prerequisites
- MySQL running locally
- Test database created (default: `auth_system_test`)
- PHPUnit DB test env configured in `phpunit.xml`
- Xdebug installed for coverage reporting

### Run Tests
- Full Unit + Feature suite:
	- `php artisan test`
- Focused tests (example):
	- `php artisan test --filter=Api`

### Run Coverage
- `XDEBUG_MODE=coverage php artisan test --coverage`

### Current Baseline
- Full suite passes locally
- Coverage baseline: `100.0%` total

---

## Test Server Setup

For unified test server deployment, see [../docs/standards/TEST_DEPLOYMENT.md](../docs/standards/TEST_DEPLOYMENT.md) for a complete guide.

**Quick summary:**
- Prepare Ubuntu VM, configure DNS for all subdomains
- Use `setup-all-test-servers.sh` to install dependencies, clone repos, set up .env, run migrations, build assets, and configure Nginx/SSL
- Visit each subdomain to verify

For full details and troubleshooting, always refer to the main ../docs/standards/TEST_DEPLOYMENT.md.
