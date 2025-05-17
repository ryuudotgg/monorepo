# Pull Request Guidelines

## Before Creating a PR

1. Create an issue on [GitHub](https://github.com/ryuudotgg/monorepo/issues) for discussion (if it doesn't exist)
2. Fork the repository
3. Create a new branch
4. Write tests for new features
5. Ensure all tests pass
6. Update documentation

## PR Checklist

- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] Code follows style guidelines
- [ ] Branch is up to date with main
- [ ] All checks passing

## PR Title Format

We follow the [Conventional Commits](https://www.conventionalcommits.org) specification. Your PR title should be structured as:

```text
<type>[(optional scope)][!]: <description>
```

### Types

- `feat`: New features (correlates with MINOR in semver)
- `fix`: Bug fixes (correlates with PATCH in semver)
- `docs`: Documentation changes only
- `style`: Changes that don't affect code meaning (whitespace, formatting, etc)
- `refactor`: Code changes that neither fix a bug nor add a feature
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `build`: Changes affecting build system or external dependencies
- `ci`: Changes to CI configuration files and scripts
- `chore`: Other changes that don't modify src or test files

### Scope

Optional scope for providing additional context:

- `app`: Main Application
- `api`: API Server
- `docs`: Documentation
- `design`: Design System
- `deps`: Dependency Updates
- etc.

### Breaking Changes

For breaking changes, either:

- Add a `!` before the colon (e.g., `feat!: remove support for something`)
- Include `BREAKING CHANGE:` in the PR description

### Examples

```text
feat(app): add user profile image upload
fix(api): resolve internal server error in auth flow
docs: update deployment instructions
feat!: redesign comment system
refactor(design)!: simplify button component
```

Note: The PR title will be used for the squashed commit message when merging.

## Review Process

1. Automated checks must pass
2. Code review by maintainers
3. Changes requested must be addressed
4. Final approval needed before merge
