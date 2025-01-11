# Contributing to Create Ryuu App

Thanks for your interest in contributing to Create Ryuu App! We're excited to have you join us. This document outlines the process and guidelines for contributing.

## Getting Started

1. Fork the Repository

2. Clone Your Fork:

```bash
git clone git@github.com:YOUR_USERNAME/create-ryuu-app.git
```

3. Install Dependencies:

```bash
pnpm install
```

4. Create a Branch:

```bash
git checkout -b feat/something-awesome
```

## Development Workflow

Please read our [development guide](contributing/DEVELOPMENT.md) for detailed information about:

- Setting up your development environment
- Running tests
- Code style and conventions
- Monorepo structure

## Pull Request Process

We follow a structured process for contributions. See our [Pull Request Guide](contributing/PULL_REQUESTS.md) for details.

## Notable Features

- 🏗️ Full type-safety with strict type checking
- 📦 PNPM for fast, disk-efficient package management
- 🏃 Turborepo for high-performance build system
- 🔒 Environment variable validation using t3-env
- 📝 ESLint & Prettier for consistent code style
- 🧪 Testing setup with Vitest & Codecov
- 🚀 CI/CD with GitHub Actions

## Code Style

We use strict TypeScript and follow modern React practices:

- Use TypeScript to the fullest extent
- Follow React 19 best practices
- Use proper component typing
- Prefer function over const for components (unless single-line return)
- Use ESLint and Prettier for code formatting

## Testing

All new features should include tests:

- Integration tests for all tRPC routes

## Documentation

For any new features or changes:

1. Update relevant documentation in the `apps/docs` directory
2. Add inline documentation for complex logic
3. Update README if adding new features or changing setup steps

## Need Help?

- Ask for help on [GitHub](https://github.com/ryuudotgg/create-ryuu-app/discussions)
- Check existing issues on [GitHub](https://github.com/ryuudotgg/create-ryuu-app/issues)
- Review Create Ryuu App's [Documentation](https://create.ryuu.gg/docs)
