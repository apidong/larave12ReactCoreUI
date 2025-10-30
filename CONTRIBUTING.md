# Contributing to Laravel 12 + React + CoreUI

Thank you for considering contributing to this project! We welcome contributions from the community.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:

- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Your environment (OS, PHP version, Node version, etc.)

### Suggesting Features

Feature requests are welcome! Please:

- Check if the feature has already been requested
- Explain the use case
- Provide examples if possible

### Pull Requests

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/laravel12coreui.git
   cd laravel12coreui
   ```

2. **Create a feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**

   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

4. **Test your changes**

   ```bash
   # Run Laravel tests
   php artisan test

   # Run frontend tests (if available)
   npm run test
   ```

5. **Commit your changes**

   ```bash
   git add .
   git commit -m "Add: Brief description of changes"
   ```

   Commit message format:

   - `Add:` for new features
   - `Fix:` for bug fixes
   - `Update:` for updates to existing features
   - `Refactor:` for code refactoring
   - `Docs:` for documentation changes

6. **Push to your fork**

   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Select your branch
   - Fill in the PR template
   - Wait for review

## Code Style Guidelines

### PHP (Laravel)

- Follow PSR-12 coding standards
- Use type hints
- Write descriptive variable names
- Use Laravel conventions

```php
// Good
public function getUserById(int $id): User
{
    return User::findOrFail($id);
}

// Bad
public function get($i)
{
    return User::find($i);
}
```

### TypeScript/React

- Use functional components
- Use TypeScript types/interfaces
- Follow React hooks best practices
- Use meaningful component names

```tsx
// Good
interface UserProps {
  user: User
  onDelete: (id: number) => void
}

function UserCard({ user, onDelete }: UserProps) {
  return <div>{user.name}</div>
}

// Bad
function Card(props: any) {
  return <div>{props.u.name}</div>
}
```

### General Guidelines

- Keep functions small and focused
- Avoid deep nesting
- Write self-documenting code
- Add comments for complex logic only
- No commented-out code in commits

## Testing

- Write tests for new features
- Ensure existing tests pass
- Aim for good test coverage

### Laravel Tests

```bash
php artisan test
php artisan test --filter=UserTest
```

### Frontend Tests

```bash
npm run test
npm run test:coverage
```

## Documentation

- Update README.md if needed
- Add inline documentation for complex code
- Update CHANGELOG.md for notable changes
- Keep documentation clear and concise

## Development Setup

1. Install dependencies

   ```bash
   composer install
   npm install
   ```

2. Setup environment

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

3. Setup database

   ```bash
   php artisan migrate
   ```

4. Start development servers
   ```bash
   php artisan serve
   npm run dev
   ```

## Questions?

Feel free to:

- Open an issue for discussion
- Reach out to maintainers
- Join our community chat (if available)

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Follow the GitHub Community Guidelines

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉
