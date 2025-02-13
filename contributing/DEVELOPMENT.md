# Development Guide

## Prerequisites

Ensure you have the following installed:

- Node.js
  - Version: [.nvmrc](../.nvmrc)
- PNPM
  - Version: [package.json#packageManager](../package.json#L5)

## Development Environment

1. Copy the environment variables:

```bash
cp .env.example .env
```

2. Start the development server:

```bash
pnpm dev
```

## Structure

```text
.vscode
  └─ Recommended Extensions & Settings
packages
  ├─ analytics
  |   ├─ Product Analytics with PostHog
  |   └─ Web Analytics with Vercel
  ├─ auth
  |   └─ BetterAuth
  ├─ cache
  |   ├─ Upstash
  |   └─ Vercel KV
  ├─ db
  |   ├─ MySQL
  |   ├─ PlanetScale
  |   └─ Drizzle ORM
  ├─ design
  |   ├─ Radix UI
  |   ├─ Tiptap
  |   └─ Tailwind CSS
  ├─ emails
  |   ├─ Resend
  |   └─ React Email Templates
  ├─ env
  |   └─ Shared Environment Variables
  ├─ flags
  |   └─ Vercel Edge Config
  |   └─ LaunchDarkly
  ├─ observability
  |   ├─ Error Monitoring with Sentry
  |   └─ Logging with BetterStack
  ├─ security
  |   └─ Arcjet
  ├─ shared
  |   ├─ Constants
  |   ├─ Helpers
  |   └─ Types
  ├─ trpc
  |   └─ API Routes & Procedures
  └─ validators
      └─ Data Validation using Zod
tooling
  ├─ eslint
  |   └─ ESLint Configuration
  ├─ github
  |   └─ GitHub Action Steps
  ├─ prettier
  |   └─ Prettier Configuration
  └─ typescript
      └─ TypeScript Configuration
```

## Code Style

### TypeScript

- Enable strict mode
- Proper type definitions
- No `any` types without explicit justification

### React Components

- Use function declarations for components
- Proper prop typing
- Follow React 19 best practices

#### Example

```typescript
export function MyComponent({
  title,
  onClick 
}: {
  title: string;
  onClick: () => void;
}) {
  return <button onClick={onClick}>{title}</button>;
}
```
