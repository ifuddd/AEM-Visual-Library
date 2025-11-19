# Contributing to AEM Visual Portal

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project and community

## How to Contribute

### Reporting Bugs

1. Check existing issues to avoid duplicates
2. Create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Environment details (browser, OS, etc.)

### Suggesting Enhancements

1. Check existing feature requests
2. Create an issue describing:
   - Use case and problem it solves
   - Proposed solution
   - Alternative approaches considered
   - Impact on existing functionality

### Pull Requests

1. **Fork and Clone**
   ```bash
   git clone <your-fork-url>
   cd AEM-Visual-Library
   ```

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/issue-description
   ```

3. **Make Changes**
   - Follow coding standards (see below)
   - Write/update tests
   - Update documentation

4. **Test Locally**
   ```bash
   npm run dev
   npm test
   ```

5. **Commit**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

   Use conventional commits:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation only
   - `style:` Code style (formatting, semicolons)
   - `refactor:` Code refactoring
   - `test:` Adding tests
   - `chore:` Maintenance tasks

6. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

   Then create a Pull Request on GitHub with:
   - Clear description of changes
   - Link to related issues
   - Screenshots for UI changes
   - Testing instructions

## Development Guidelines

### Code Style

- **TypeScript:** Use strict mode, avoid `any`
- **Formatting:** Prettier (runs on save)
- **Linting:** ESLint rules enforced
- **Naming:**
  - `camelCase` for variables and functions
  - `PascalCase` for components and classes
  - `UPPER_SNAKE_CASE` for constants

### Backend

- Use async/await over promises
- Validate input with Joi
- Handle errors with try/catch
- Log meaningful messages
- Write unit tests for services

### Frontend

- Use functional components with hooks
- Prop types via TypeScript interfaces
- Extract reusable logic to hooks
- Optimize re-renders
- Accessibility: ARIA labels, keyboard nav

### Database

- Use Prisma migrations
- Never edit generated files
- Test migrations locally first
- Add indexes for query performance

### Documentation

- Update README for major changes
- Document complex logic with comments
- Update API docs for endpoint changes
- Add JSDoc for exported functions

## Testing

### Backend Tests

```bash
cd backend
npm test
```

Test structure:
```typescript
describe('ComponentService', () => {
  describe('getComponentBySlug', () => {
    it('should return component when found', async () => {
      // Arrange
      // Act
      // Assert
    });

    it('should return null when not found', async () => {
      // ...
    });
  });
});
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Review Process

1. **Automated Checks:** CI pipeline must pass
2. **Code Review:** At least one approval required
3. **Testing:** Reviewer tests changes locally
4. **Documentation:** Verify docs are updated
5. **Merge:** Squash and merge to main

## Release Process

1. Version bump in package.json
2. Update CHANGELOG.md
3. Create release tag
4. Deploy to staging
5. QA testing
6. Deploy to production

## Getting Help

- **Questions:** Create a Discussion on GitHub
- **Bugs:** Create an Issue
- **Chat:** Join team Slack channel
- **Urgent:** Contact maintainers directly

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Mentioned in release notes
- Credited in documentation

Thank you for contributing! 🎉
