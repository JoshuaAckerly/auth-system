# Contributing to Auth System

Thank you for contributing to Auth System! This guide helps you get started.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Requirements](#testing-requirements)

## 🤝 Code of Conduct

We maintain an inclusive, welcoming community.

### Expected Behavior
- Use welcoming language
- Respect diverse perspectives
- Accept constructive feedback
- Prioritize community good
- Show respect and empathy

### Unacceptable Behavior
- Harassment or trolling
- Personal attacks
- Private information disclosure
- Inappropriate conduct

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+ with Composer
- MySQL 8.0+
- Git

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR-USERNAME/auth-system.git
cd auth-system

# Add upstream
git remote add upstream https://github.com/JoshuaAckerly/auth-system.git

# Install
composer install

# Environment
cp .env.example .env
php artisan key:generate

# Database
php artisan migrate

# Test your setup
php artisan tinker
```

## 🔄 Development Workflow

### 1. Create Branch

```bash
# Feature
git checkout -b feat/add-oauth-support

# Bug fix
git checkout -b fix/token-validation

# Docs
git checkout -b docs/update-api-guide

# Tests
git checkout -b test/add-token-tests
```

### 2. Make Changes

```bash
# Make edits
# Test locally
./vendor/bin/phpunit

# Commit
git commit -m "feat: add feature"

# Keep updated
git fetch upstream
git rebase upstream/main
```

### 3. Quality Checks

```bash
# Tests
./vendor/bin/phpunit

# Analysis
./vendor/bin/phpstan analyse
vendor/bin/pint

# Type checking
php artisan tinker < /dev/null
```

## 📝 Coding Standards

### PHP Standards

- **PSR-12** code style
- Type all parameters and returns
- Use meaningful names
- Single responsibility principle

**Example**:
```php
<?php
namespace App\Services;

class AuthService
{
    public function validateToken(string $token): bool {
        // Implementation
        return true;
    }
}
```

### Documentation

- Add PHPDoc comments
- Document auth flows
- Update API_DOCUMENTATION.md for endpoint changes
- Add usage examples

## ✅ Testing Requirements

### Unit Tests

```bash
./vendor/bin/phpunit tests/Unit
```

Must include:
- Token generation
- Token validation
- User creation
- Password hashing

### Feature Tests

```bash
./vendor/bin/phpunit tests/Feature
```

Must include:
- Login endpoint
- Token refresh
- User retrieval
- Message handling

### Run All Tests

```bash
./vendor/bin/phpunit
./vendor/bin/phpunit --coverage-html coverage
```

Target coverage: **85%+**

## 📋 Commit Guidelines

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `test`: Tests
- `refactor`: Refactoring
- `perf`: Performance

**Example**:
```
feat(auth): add OAuth 2.0 support

Implement OAuth 2.0 authentication flow with:
- Authorization code grant
- Refresh token handling
- Scope validation

Closes #789
```

## 🔄 Pull Requests

### Before Submitting

- [ ] Tests pass
- [ ] Code quality checks pass
- [ ] Documentation updated
- [ ] API changes documented
- [ ] Branch updated

### PR Title

```
feat: add OAuth support
fix: resolve token expiry bug
docs: update authentication guide
```

### PR Description

```markdown
## Description
What's changing?

## Why
Why needed?

## Types
- [ ] Feature
- [ ] Bug fix
- [ ] Docs
- [ ] Breaking change

## Testing
How tested?

## Checklist
- [ ] Tests pass
- [ ] QA checks pass
- [ ] Docs updated
- [ ] No breaking changes
```

## 🎯 Important Notes

### Security Considerations

When adding authentication features:

1. **Never log credentials**: No passwords in logs
2. **Hash passwords**: Always use bcrypt
3. **HTTPS only**: Enforce HTTPS in production
4. **Rate limiting**: Implement rate limits on auth endpoints
5. **Token expiry**: Set reasonable token expiration times
6. **CORS**: Properly configure CORS for security

### API Compatibility

- Maintain backward compatibility when possible
- Version breaking changes clearly
- Update API_DOCUMENTATION.md
- Notify dependent projects of changes

### Database Migrations

- Use Laravel migrations for schema changes
- Test migrations up and down
- Provide rollback procedure
- Document any data migrations

## 📞 Need Help?

- Check documentation
- Review existing code
- Ask in pull requests
- Contact maintainers

## 🎯 Areas for Contribution

- **Security**: Improve authentication security
- **Features**: Add OAuth, SAML, other auth methods
- **Performance**: Optimize token validation
- **Documentation**: Improve guides and examples
- **Tests**: Increase test coverage
- **Bug Fixes**: Fix reported issues

Thank you for contributing! 🔐
