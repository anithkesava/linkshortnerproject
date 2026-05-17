# LLM Agent Instructions for Link Shortener Project

## Overview

This document defines the coding standards, best practices, and development guidelines that all LLM agents must follow when working on this Next.js link shortener project. These guidelines ensure consistency, maintainability, and quality across the codebase.

**Project Stack:**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5 (strict mode)
- **UI Library:** React 19 with shadcn/ui
- **Styling:** Tailwind CSS v4
- **Database:** Drizzle ORM + Neon PostgreSQL
- **Authentication:** Clerk
- **Build Tools:** ESLint 9, PostCSS

## Quick Start for LLMs

### How to Use These Guidelines

1. **Read this file first** - understand the project structure and key principles
2. **Reference the `/docs` directory** for detailed guidelines.ALWAYS refer to relavant .md file BEFORE generating code:

3. **Always apply relevant guidelines** when creating or modifying code
4. **Ask for clarification** when guidelines seem ambiguous

### Core Principles

#### 1. Type Safety First

- Never use `any` without justification
- Always define function return types explicitly
- Use TypeScript strict mode features fully
- Prefer union types and discriminated unions over `any`

#### 2. Server Components by Default

- Default all components to Server Components
- Mark interactivity with `"use client"` directive
- Keep client components small and focused
- Leverage Server Actions for mutations

#### 3. Component Quality

- One component per file
- Export as default if it's the only export
- Always define Props interface with proper typing
- Use `React.PropsWithChildren<T>` when appropriate

#### 4. Styling Consistency

- Use Tailwind CSS exclusively (no CSS-in-JS or inline styles)
- Leverage shadcn/ui components for UI elements
- Use the `cn()` utility for conditional class merging
- Support dark mode with `dark:` prefix

#### 5. Database Best Practices

- Always define explicit types for schema
- Use transactions for multi-step operations
- Implement pagination for large datasets
- Include timestamps (`createdAt`, `updatedAt`) on all tables

#### 6. Code Organization

- Follow directory structure guidelines
- Use path aliases (`@/*`) for all imports
- Group related code together (layouts, routes, components)
- Keep files focused and single-purpose

## Code Style Summary

### TypeScript

```typescript
// Always explicit return types
export const formatUrl = (url: string): string => {
  return url.toLowerCase();
};

// Always define interfaces for props
interface ButtonProps {
  readonly label: string;
  readonly onClick: () => void;
}

// Strict null checking enforced
const value: string | null = getValue();
if (value !== null) {
  console.log(value);
}
```

### React Components

```typescript
// Server Components by default
export default function LinksPage() {
  const links = await fetchLinks();
  return <LinksList links={links} />;
}

// "use client" only for interactivity
"use client";
export function LinkForm() {
  const [url, setUrl] = useState("");
  // ...
}

// Props interface always required
interface LinkCardProps {
  readonly id: string;
  readonly url: string;
  readonly onClick?: () => void;
}

export function LinkCard({ id, url, onClick }: LinkCardProps) {
  return <div onClick={onClick}>{url}</div>;
}
```

### Styling with Tailwind & shadcn

```typescript
// Use shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

// Extend with Tailwind classes
<Button className="w-full sm:w-auto dark:bg-blue-700" />

// Use cn() for conditional classes
import { cn } from "@/lib/utils";

<div className={cn(
  "base-styles",
  isActive && "active-styles",
  error && "error-styles"
)}>
  Content
</div>
```

### Database Operations

```typescript
// Always type query results
export async function getLink(id: string): Promise<Link | null> {
  return db.query.links.findFirst({
    where: eq(links.id, id),
  });
}

// Use Server Actions for mutations
("use server");
export async function createLink(url: string) {
  const link = await db.insert(links).values({ originalUrl: url }).returning();
  return link;
}

// Handle errors explicitly
try {
  await createLink(url);
} catch (error) {
  if (error instanceof Error) {
    return { error: error.message };
  }
  throw error;
}
```

## File Naming Quick Reference

| Type              | Casing           | Example                              |
| ----------------- | ---------------- | ------------------------------------ |
| React Component   | PascalCase       | `LinkCard.tsx`, `CreateLinkForm.tsx` |
| Utility Function  | camelCase        | `linkGenerator.ts`, `validateUrl.ts` |
| Route Page        | lowercase/kebab  | `app/links/[id]/page.tsx`            |
| Type Definition   | PascalCase       | `Link.ts`, `UserProps.ts`            |
| Database Table    | snake_case       | `users`, `link_clicks`               |
| Variable/Function | camelCase        | `linkId`, `fetchLinks()`             |
| Constant          | UPPER_SNAKE_CASE | `MAX_URL_LENGTH`, `DEFAULT_TIMEOUT`  |

## Project Directory Structure

```
app/                              # Next.js app directory (routes)
├── (auth)/                       # Auth route group
├── (dashboard)/                  # Protected route group
├── api/                          # API routes
└── globals.css                   # Global styles

components/                       # React components
├── ui/                          # shadcn/ui components
├── forms/                       # Form components
├── layout/                      # Layout components
└── links/                       # Domain-specific components

db/                              # Database layer
├── index.ts                     # Drizzle client
├── schema.ts                    # Schema definitions
└── queries.ts                   # Query functions (optional)

lib/                             # Utilities & helpers
├── utils.ts                     # Common utilities (cn, etc.)
├── auth.ts                      # Auth helpers
├── validators.ts                # Input validation
└── linkGenerator.ts             # Link generation logic

docs/                            # Documentation (this system)
├── typescript-guidelines.md
├── react-nextjs-guidelines.md
├── database-guidelines.md
├── styling-guidelines.md
├── code-organization.md
└── naming-conventions.md

public/                          # Static assets
```

## Common Workflows

### Creating a New Component

1. Create file in appropriate directory: `components/links/LinkCard.tsx`
2. Define Props interface: `interface LinkCardProps { ... }`
3. Use proper TypeScript typing for all parameters
4. Default to Server Component (no `"use client"`)
5. Export as default: `export default function LinkCard(...) { ... }`
6. Follow Tailwind + shadcn styling patterns
7. Add JSDoc comments for public components

**Reference:** [Code Organization](./docs/code-organization.md), [React Guidelines](./docs/react-nextjs-guidelines.md)

### Adding a Database Feature

1. Update schema in `db/schema.ts` with proper types and relationships
2. Add indexes on frequently filtered columns
3. Include `createdAt` and `updatedAt` timestamps
4. Create query functions in `db/queries.ts` or alongside usage
5. Handle errors and validation
6. Use TypeScript strict types for all database operations

**Reference:** [Database Guidelines](./docs/database-guidelines.md)

### Creating a Form

1. Create component file: `components/forms/MyForm.tsx`
2. Mark as client component: `"use client"` at top
3. Define form data interface
4. Create Server Action for submission
5. Handle loading, error, and success states
6. Use shadcn form components when applicable
7. Include proper validation

**Reference:** [React Guidelines](./docs/react-nextjs-guidelines.md), [Styling Guidelines](./docs/styling-guidelines.md)

### Styling a Component

1. Use Tailwind classes exclusively (no inline styles)
2. Use the `cn()` utility for conditional classes
3. Support dark mode with `dark:` prefix
4. Ensure mobile-responsive with breakpoints (`sm:`, `md:`, `lg:`)
5. Leverage shadcn pre-styled components for UI elements
6. Maintain sufficient color contrast (WCAG AA)

**Reference:** [Styling Guidelines](./docs/styling-guidelines.md)

## LLM-Specific Instructions

### Before Writing Code

- [ ] Understand the feature requirements
- [ ] Check for existing components that could be reused
- [ ] Review relevant guideline section(s)
- [ ] Plan the implementation (types, structure, flow)

### While Writing Code

- [ ] Follow all TypeScript strict rules
- [ ] Add type annotations explicitly
- [ ] Use path aliases (`@/`) for imports
- [ ] Follow naming conventions
- [ ] Add JSDoc comments for public functions/components
- [ ] Keep components small and focused

### After Writing Code

- [ ] Verify all TypeScript errors are resolved
- [ ] Check that code matches style guidelines
- [ ] Ensure proper error handling
- [ ] Test edge cases and error states
- [ ] Verify responsive design (mobile, tablet, desktop)
- [ ] Confirm dark mode support

### When Uncertain

- Reference the specific guideline document
- Look for similar patterns in the codebase
- Ask clarifying questions
- Default to stricter/safer choices (explicit types, Server Components, etc.)

## ESLint & TypeScript Configuration

The project enforces strict rules via:

- **TypeScript:** strict mode enabled in `tsconfig.json`
- **ESLint:** configured with Next.js rules in `eslint.config.mjs`

These **must not be bypassed** - fix underlying code instead of disabling rules.

```typescript
// ✗ Don't do this
// eslint-disable-next-line
const x: any = value;

// ✓ Do this
const x: unknown = value;
if (typeof x === "string") {
  // use x
}
```

## Testing & Quality Checks

### Before Committing

- [ ] No ESLint errors: `npm run lint`
- [ ] No TypeScript errors: `tsc --noEmit`
- [ ] All imports use path aliases
- [ ] Components are properly typed
- [ ] Error handling is implemented
- [ ] No `any` types (unless documented)

### Best Practices

- Write type-safe code from the start
- Validate user input server-side
- Handle all error states
- Test with both light and dark themes
- Test on mobile viewports
- Ensure keyboard navigation works

## Reference Documents

Quick links to detailed guidelines:

1. **[Authentication Guidelines](./docs/authentication-guidelines.md)**
   - Clerk integration, protected routes, sign in/out modals, security best practices

2. **[shadcn/ui Component Guidelines](./docs/shadcn-ui-guidelines.md)**
   - All UI elements use shadcn/ui, composition patterns, no custom components, Tailwind integration

3. **[TypeScript Guidelines](./docs/typescript-guidelines.md)**
   - Type safety rules, function declarations, interfaces, generics

4. **[React & Next.js Guidelines](./docs/react-nextjs-guidelines.md)**
   - Component structure, Server/Client boundaries, data fetching, forms

5. **[Database & Drizzle Guidelines](./docs/database-guidelines.md)**
   - Schema design, relationships, queries, migrations, optimization

6. **[Styling & CSS Guidelines](./docs/styling-guidelines.md)**
   - Tailwind usage, shadcn/ui components, dark mode, accessibility

7. **[Code Organization Guidelines](./docs/code-organization.md)**
   - Directory structure, file naming, imports, comments, exports

8. **[Naming Conventions](./docs/naming-conventions.md)**
   - Variables, functions, components, database columns, API routes

## Questions & Updates

If you encounter ambiguous situations or believe these guidelines need updates:

1. Reference existing code patterns
2. Apply the most restrictive/safe interpretation
3. Document your decision in comments
4. Consider suggesting updates to this guide

## Summary

Follow these guidelines to ensure:

- ✅ Type-safe, maintainable code
- ✅ Consistent project structure
- ✅ Best practices across the team
- ✅ Easy collaboration and code reviews
- ✅ Scalable, professional quality

**Last Updated:** May 2026
