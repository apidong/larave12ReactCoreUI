# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of our software seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report a Security Vulnerability

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to [your-email@example.com]. You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

Please include the following information:

- Type of issue (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### What to Expect

- We will acknowledge your email within 48 hours
- We will provide a more detailed response within 7 days indicating the next steps
- We will keep you informed about the progress towards a fix
- We may ask for additional information or guidance

## Security Update Policy

- Security updates will be released as soon as possible
- We will publish security advisories for all security issues
- Critical security issues will be patched immediately

## Best Practices for Users

### General Security

1. **Keep Dependencies Updated**

   ```bash
   composer update
   npm update
   ```

2. **Use Environment Variables**

   - Never commit `.env` file
   - Use strong, unique passwords
   - Rotate secrets regularly

3. **Enable HTTPS**

   - Always use SSL/TLS in production
   - Redirect HTTP to HTTPS

4. **Database Security**

   - Use strong database passwords
   - Limit database user permissions
   - Never use root account for application

5. **File Permissions**
   ```bash
   chmod -R 755 /var/www/app
   chmod -R 775 storage bootstrap/cache
   ```

### Laravel-Specific Security

1. **CSRF Protection**

   - Always include CSRF token in forms
   - CSRF middleware is enabled by default

2. **SQL Injection Prevention**

   - Use Eloquent ORM or Query Builder
   - Never use raw queries with user input

3. **XSS Prevention**

   - Use Blade templating `{{ }}` for output escaping
   - Sanitize user input

4. **Authentication**

   - Use Laravel Sanctum for API authentication
   - Implement rate limiting
   - Use strong password policies

5. **Authorization**
   - Use Laravel Gates and Policies
   - Always check user permissions

### React-Specific Security

1. **XSS Prevention**

   - React escapes by default
   - Avoid `dangerouslySetInnerHTML`
   - Sanitize user input

2. **API Calls**

   - Always validate on backend
   - Use HTTPS for all API calls
   - Implement proper error handling

3. **Dependencies**
   - Audit packages regularly: `npm audit`
   - Update vulnerable packages immediately

### Production Configuration

1. **Disable Debug Mode**

   ```env
   APP_DEBUG=false
   APP_ENV=production
   ```

2. **Cache Configuration**

   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Rate Limiting**

   - Implement API rate limiting
   - Protect login routes from brute force

4. **Logging**

   - Monitor application logs
   - Set up error tracking (Sentry, Bugsnag)

5. **Backup Strategy**
   - Regular automated backups
   - Test restore procedures
   - Off-site backup storage

## Security Headers

Configure your web server to send security headers:

**Nginx Configuration:**

```nginx
add_header X-Frame-Options "SAMEORIGIN";
add_header X-Content-Type-Options "nosniff";
add_header X-XSS-Protection "1; mode=block";
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
add_header Content-Security-Policy "default-src 'self'";
```

## Known Security Considerations

- This application uses JWT tokens for API authentication - ensure proper token rotation
- File upload functionality (if implemented) requires validation and scanning
- User-generated content should be sanitized before display

## Additional Resources

- [Laravel Security Best Practices](https://laravel.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [React Security Best Practices](https://reactjs.org/docs/security.html)
- [NPM Security Advisories](https://www.npmjs.com/advisories)

## Updates

This security policy was last updated on October 28, 2025.

---

Thank you for helping keep our project and users safe!
