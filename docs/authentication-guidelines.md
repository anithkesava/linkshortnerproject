# Authentication Guidelines - Clerk

## Overview

This document defines authentication standards and best practices for the Link Shortener application using **Clerk** as the sole authentication provider. All authentication must be handled through Clerk — no alternative authentication methods are permitted.

## Core Principles

### 1. Clerk is the Only Auth Provider

- **All authentication must go through Clerk**
- No custom auth, JWT tokens, or alternative providers
- Use official Clerk Next.js SDKs and components
- Never implement custom auth logic

### 2. Protected Routes

- The `/dashboard` route is **protected** and requires authentication
- Only authenticated users may access `/dashboard`
- Access control is enforced at the middleware level
- Return appropriate error responses for unauthorized access

### 3. Homepage Redirect Logic

- **Logged-in users accessing `/` must be redirected to `/dashboard`**
- Anonymous users can view the homepage
- Redirect happens via middleware or layout component
- Preserve query parameters when redirecting

### 4. Modal-Based Sign In/Out

- Sign in flows **always launch as a modal** (not a full page redirect)
- Sign out **always launches as a modal** (not a silent redirect)
- Use Clerk's `SignIn` modal component
- Use Clerk's `SignOut` trigger with modal presentation
- Never redirect to Clerk-hosted sign-in pages for this app

## Implementation Patterns

### Setting Up Clerk

```typescript
// lib/auth.ts - Clerk helpers and utilities
import { auth, currentUser } from "@clerk/nextjs/server";

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const user = await currentUser();
  return user ?? null;
}

/**
 * Get the current session
 * Returns null if no active session
 */
export async function getCurrentSession() {
  const session = await auth();
  return session;
}

/**
 * Check if user is authenticated
 * Throws error if not authenticated
 */
export async function requireAuth() {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized: User must be authenticated");
  }
  return userId;
}
```

### Protected Route Pattern

```typescript
// app/(dashboard)/layout.tsx - Protect dashboard routes
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const { userId } = await auth();

  // Redirect unauthenticated users
  if (!userId) {
    redirect("/");
  }

  return <div>{children}</div>;
}
```

### Homepage Redirect Pattern

```typescript
// app/layout.tsx - Redirect authenticated users from homepage
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function redirectIfAuthenticated() {
  // Only on homepage
  if (typeof window === "undefined") {
    // Server-side only
    const { userId } = await auth();
    if (userId) {
      redirect("/dashboard");
    }
  }
}

export default async function RootLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  // Apply redirect logic if needed
  await redirectIfAuthenticated();

  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
```

### Modal Sign In Component

```typescript
// components/auth/SignInModal.tsx
"use client";

import { SignIn } from "@clerk/nextjs";

interface SignInModalProps {
  readonly redirectUrl?: string;
}

export default function SignInModal({ redirectUrl }: SignInModalProps) {
  return (
    <div className="flex items-center justify-center">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
          },
        }}
        redirectUrl={redirectUrl ?? "/dashboard"}
        routing="virtual"
      />
    </div>
  );
}
```

### Modal Sign Out Trigger

```typescript
// components/auth/SignOutButton.tsx
"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export default function SignOutButtonComponent() {
  return (
    <SignOutButton signOutCallback={() => window.location.href = "/"}>
      <Button variant="outline">Sign Out</Button>
    </SignOutButton>
  );
}
```

## Clerk Components & Hooks

### Server-Side Functions

```typescript
import { auth, currentUser } from "@clerk/nextjs/server";

// Get authentication session
const { userId, sessionId } = await auth();

// Get full user object
const user = await currentUser();
const email = user?.emailAddresses[0]?.emailAddress;
```

### Client-Side Hooks

```typescript
"use client";

import { useAuth, useUser, useSignUp, useSignIn } from "@clerk/nextjs";

// Get current auth state
const { userId, isLoaded, isSignedIn } = useAuth();

// Get current user details
const { user, isLoaded } = useUser();

// Programmatic sign-up/sign-in
const { signUp, isLoaded } = useSignUp();
const { signIn, isLoaded } = useSignIn();
```

### UI Components

```typescript
// Render sign-in modal
import { SignIn } from "@clerk/nextjs";

// Render sign-up modal
import { SignUp } from "@clerk/nextjs";

// Sign out trigger
import { SignOutButton } from "@clerk/nextjs";

// User button menu (profile, settings, sign out)
import { UserButton } from "@clerk/nextjs";
```

## Database Integration with Clerk

### Storing User Information

When syncing Clerk users to your database:

```typescript
// db/schema.ts
import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  clerkId: text("clerk_id").primaryKey(), // Clerk user ID
  email: text("email").notNull(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
```

### Webhook for User Sync

```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";
import { db } from "@/db";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SIGNING_SECRET;

  const payload = await req.json();
  const evt: WebhookEvent = payload;

  // Handle user creation
  if (evt.type === "user.created") {
    const { id, email_addresses, first_name, last_name } = evt.data;

    await db.insert(users).values({
      clerkId: id,
      email: email_addresses[0].email_address,
      firstName: first_name,
      lastName: last_name,
    });
  }

  // Handle user deletion
  if (evt.type === "user.deleted") {
    const { id } = evt.data;
    await db.delete(users).where(users.clerkId === id);
  }

  return Response.json({ success: true });
}
```

## Middleware Pattern

```typescript
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/dashboard(.*)",
  "/api/links(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
```

## Error Handling

### Unauthorized Access

```typescript
// Handle unauthorized access gracefully
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function getProtectedData() {
  const { userId } = await auth();

  if (!userId) {
    // Redirect to home or show sign-in modal
    redirect("/");
  }

  // Fetch protected data
  return fetchData(userId);
}
```

### Session Expiration

- Clerk handles session management automatically
- Expired sessions are refreshed transparently
- Users are silently logged out after extended inactivity
- No manual session management needed

## Security Best Practices

### 1. Never Expose Secrets

- Keep `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` in `.env.local`
- Keep `CLERK_SECRET_KEY` private (server-side only)
- Never log or expose user IDs in client code

### 2. Validate on Server

```typescript
// Always validate on the server
export async function protectedAction() {
  const userId = await requireAuth(); // Throws if not authenticated

  // Now safe to use userId for database queries
  const data = await getDataForUser(userId);
  return data;
}
```

### 3. Use Server Actions for Auth-Required Operations

```typescript
"use server";

import { requireAuth } from "@/lib/auth";

export async function createLink(url: string) {
  const userId = await requireAuth(); // Server-side validation

  // Safe to proceed with authenticated operation
  return db.insert(links).values({
    userId,
    originalUrl: url,
  });
}
```

### 4. Protect API Routes

```typescript
// app/api/links/route.ts
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Process authenticated request
  const data = await req.json();
  return Response.json({ success: true });
}
```

## Configuration Checklist

- [ ] Clerk app created at clerk.com
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set in `.env.local`
- [ ] `CLERK_SECRET_KEY` set in `.env.local`
- [ ] Middleware configured in `middleware.ts`
- [ ] ClerkProvider added to root layout
- [ ] Dashboard routes protected with `auth.protect()`
- [ ] Homepage redirect logic implemented
- [ ] Sign in/out modals configured
- [ ] Clerk webhooks configured (optional, for user sync)
- [ ] Error handling tested

## Common Workflows

### Add Sign In to Page

1. Import `SignIn` from `@clerk/nextjs`
2. Render with `routing="virtual"` for modal behavior
3. Set `redirectUrl` to desired post-signin route
4. Style with Clerk appearance API

### Protect a Route

1. Check authentication in layout or middleware
2. Redirect unauthenticated users
3. Use `auth.protect()` in middleware for enforcement
4. Return 401 for API routes without auth

### Get Current User

1. Use `currentUser()` on server components
2. Use `useUser()` hook on client components
3. Access email/name from `user.emailAddresses[0]`
4. Store Clerk ID in database if needed

### Sign Out User

1. Use `SignOutButton` component
2. Set `signOutCallback` for redirect
3. Component becomes a button trigger
4. Clerk handles session cleanup

## Troubleshooting

**User stays on homepage after sign in:**

- Verify `redirectUrl` is correctly set to `/dashboard`
- Check that dashboard layout has auth protection
- Ensure Clerk provider is in root layout

**Sign in doesn't show as modal:**

- Verify `routing="virtual"` is set on SignIn component
- Ensure component is wrapped with `"use client"`
- Check for conflicting stylesheets

**Protected route allows unauthorized access:**

- Verify `auth.protect()` is called in middleware
- Check middleware configuration matches routes
- Ensure `middleware.ts` is in project root

## References

- [Clerk Next.js Documentation](https://clerk.com/docs/nextjs)
- [Clerk API Reference](https://clerk.com/docs/reference)
- [Clerk Components](https://clerk.com/docs/components/overview)
- [Clerk Webhooks](https://clerk.com/docs/webhooks/overview)

**Last Updated:** May 2026
