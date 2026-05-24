--- 
description: Read this before implementing or modifying UI components in the project.
---

# shadcn/ui Component Guidelines

## Overview

This document defines standards for using **shadcn/ui** components in the Link Shortener application. **All UI elements must be built using shadcn/ui components — custom components are strictly prohibited.**

shadcn/ui is a collection of re-usable components built with Radix UI and Tailwind CSS. Components are copied into the project (not npm dependencies), allowing full customization while maintaining consistency.

## Core Principles

### 1. Always Use shadcn/ui

- **Every UI element must use a shadcn/ui component**
- No custom HTML components (no custom buttons, inputs, cards, etc.)
- No CSS-in-JS or inline styles — only Tailwind + shadcn
- If shadcn doesn't have a component, compose existing components

### 2. No Custom Components

- Do not create custom wrapper components unless strictly necessary
- If a use case isn't covered, combine shadcn components
- Example: Don't create `CustomButton` — use `Button` from shadcn

### 3. Leverage Composition

- Combine shadcn components to create complex UI
- Use component slots and composition patterns
- Keep components small and reusable
- Prefer shadcn's built-in customization over wrappers

### 4. Tailwind + shadcn Integration

- Use Tailwind classes to extend shadcn components
- Use `cn()` utility for conditional class merging
- Maintain dark mode support with `dark:` prefixes
- Keep styling consistent across the app

## Available Components

The project comes with these shadcn/ui components pre-installed in `components/ui/`:

### Form Components

- `Button` — For all button interactions
- `Input` — Text and number inputs
- `Textarea` — Multi-line text input
- `Select` — Dropdown selection
- `Checkbox` — Boolean selections
- `Radio` — Single-option selection
- `Label` — Form field labels
- `Form` — Complete form management

### Layout Components

- `Card` — Container with border/shadow
- `Dialog` — Modal dialogs
- `Drawer` — Side panels
- `Tabs` — Tabbed content
- `Accordion` — Collapsible sections

### Display Components

- `Badge` — Status indicators
- `Avatar` — User profile images
- `Alert` — Status messages
- `Toast` — Notifications
- `Tooltip` — Help text on hover
- `Popover` — Click-triggered content

### Table & Data

- `Table` — Data tables with sorting
- `Pagination` — Page navigation
- `Skeleton` — Loading placeholders

## Usage Patterns

### Buttons

```typescript
import { Button } from "@/components/ui/button";

// Basic button
<Button>Click me</Button>

// With variants
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Link-style</Button>

// With size
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>

// Disabled state
<Button disabled>Disabled</Button>

// With icon (use icon from lucide-react)
import { ChevronDown } from "lucide-react";
<Button>
  Download <ChevronDown className="ml-2 h-4 w-4" />
</Button>
```

### Form Components

```typescript
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

// Basic form layout
<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input
      id="email"
      type="email"
      placeholder="Enter your email"
      required
    />
  </div>
  <Button type="submit">Submit</Button>
</div>
```

### Cards

```typescript
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

<Card>
  <CardHeader>
    <CardTitle>Link Details</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Original URL: https://example.com</p>
  </CardContent>
  <CardFooter>
    <Button>Copy Link</Button>
  </CardFooter>
</Card>
```

### Dialogs/Modals

```typescript
"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Confirm Action</DialogTitle>
      <DialogDescription>
        Are you sure you want to proceed?
      </DialogDescription>
    </DialogHeader>
    {/* Content here */}
  </DialogContent>
</Dialog>
```

### Alerts

```typescript
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

<Alert variant="destructive">
  <AlertCircle className="h-4 w-4" />
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please sign in again.
  </AlertDescription>
</Alert>
```

### Tabs

```typescript
"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

<Tabs defaultValue="links">
  <TabsList>
    <TabsTrigger value="links">My Links</TabsTrigger>
    <TabsTrigger value="stats">Statistics</TabsTrigger>
  </TabsList>
  <TabsContent value="links">
    {/* Links content */}
  </TabsContent>
  <TabsContent value="stats">
    {/* Stats content */}
  </TabsContent>
</Tabs>
```

### Combining Components

```typescript
// Create complex UI by combining shadcn components
// Don't create a custom "LinkCard" component
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

<Card>
  <CardHeader className="flex flex-row items-center justify-between">
    <CardTitle>Short Link</CardTitle>
    <Badge>Active</Badge>
  </CardHeader>
  <CardContent className="space-y-4">
    <div>
      <p className="text-sm text-muted-foreground">Original URL</p>
      <p className="break-all">https://example.com/very/long/url</p>
    </div>
    <div className="flex gap-2">
      <Button size="sm">Copy</Button>
      <Button size="sm" variant="outline">Edit</Button>
      <Button size="sm" variant="destructive">Delete</Button>
    </div>
  </CardContent>
</Card>
```

## Styling Guidelines

### Using Tailwind with shadcn

```typescript
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Extend with Tailwind classes
<Button className="w-full sm:w-auto">Submit</Button>

// Conditional styling with cn()
interface LinkButtonProps {
  readonly isActive?: boolean;
  readonly isLoading?: boolean;
}

function LinkButton({ isActive, isLoading }: LinkButtonProps) {
  return (
    <Button
      disabled={isLoading}
      className={cn(
        "transition-colors",
        isActive && "bg-blue-600 text-white",
        !isActive && "bg-gray-200 text-gray-700"
      )}
    >
      {isLoading ? "Loading..." : "Click"}
    </Button>
  );
}
```

### Dark Mode Support

```typescript
import { Card } from "@/components/ui/card";

// shadcn components automatically support dark mode
// Use dark: prefix for custom Tailwind additions
<Card className="bg-white dark:bg-slate-900">
  <p className="text-black dark:text-white">Content</p>
</Card>
```

### Spacing & Layout

```typescript
import { Button } from "@/components/ui/button";

// Use space utilities for consistent spacing
<div className="space-y-4">
  <input className="w-full" />
  <Button className="w-full">Submit</Button>
</div>

// Flexbox layouts
<div className="flex items-center justify-between gap-4">
  <span>Label</span>
  <Button>Action</Button>
</div>
```

## Icons Integration

shadcn/ui projects use **lucide-react** for icons:

```typescript
import { ChevronDown, Copy, Trash2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";

// Icons in buttons
<Button>
  <Copy className="mr-2 h-4 w-4" />
  Copy Link
</Button>

// Icon-only buttons
<Button size="icon">
  <Trash2 className="h-4 w-4" />
</Button>

// Icon sizing
<ChevronDown className="h-4 w-4" /> {/* Small */}
<ChevronDown className="h-6 w-6" /> {/* Medium */}
<ChevronDown className="h-8 w-8" /> {/* Large */}
```

## Common Patterns

### Loading State

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

export function CreateLinkForm() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit() {
    setIsLoading(true);
    try {
      // API call
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <Input placeholder="Enter URL" disabled={isLoading} />
      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Creating..." : "Create Link"}
      </Button>
    </div>
  );
}
```

### Empty State

```typescript
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

<div className="flex flex-col items-center justify-center py-12 text-center">
  <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
  <h3 className="mb-2 font-semibold">No links yet</h3>
  <p className="mb-4 text-sm text-muted-foreground">
    Create your first short link to get started
  </p>
  <Button>Create Link</Button>
</div>
```

### Form with Validation

```typescript
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function URLForm() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  function validate(): boolean {
    if (!url) {
      setError("URL is required");
      return false;
    }
    try {
      new URL(url);
      setError(null);
      return true;
    } catch {
      setError("Please enter a valid URL");
      return false;
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
        />
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Button onClick={() => validate()}>Submit</Button>
    </div>
  );
}
```

## When to Add New Components

Only add a new shadcn/ui component when:

1. **Core UI need exists** — Button, Input, Card, Dialog, etc.
2. **Composition isn't sufficient** — Multiple shadcn components can't solve it
3. **Multiple instances needed** — The pattern repeats across the app

Example: If you need a notification system, use shadcn `Toast` (not create custom toasts).

## What NOT to Do

```typescript
// ✗ Don't create custom components
export function CustomButton({ label }) {
  return <button className="...">{label}</button>;
}

// ✓ Use shadcn Button
import { Button } from "@/components/ui/button";
<Button>{label}</Button>

// ✗ Don't style with CSS-in-JS
const styles = { button: { color: "red" } };
<button style={styles.button}>Click</button>

// ✓ Use Tailwind + shadcn
import { Button } from "@/components/ui/button";
<Button className="text-red-600">Click</Button>

// ✗ Don't create a CardComponent wrapper
export function CardComponent({ title, children }) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

// ✓ Use Card components directly in your component
import { Card, CardHeader, CardContent } from "@/components/ui/card";
export function MyComponent({ title, children }) {
  return (
    <Card>
      <CardHeader>{title}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

## Adding New shadcn Components

If you need a component not yet installed:

```bash
npx shadcn-ui@latest add [component-name]
```

For example:

```bash
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add popover
```

After installation, the component is available in `components/ui/`.

## Customization

shadcn components use CSS variables for theming. Customize in `globals.css`:

```css
@layer base {
  :root {
    --primary: 222.2 47.4% 11.2%;
    --secondary: 210 40% 96%;
    --accent: 210 40% 96%;
  }

  .dark {
    --primary: 210 40% 98%;
    --secondary: 222.2 47.4% 11.2%;
    --accent: 222.2 47.4% 11.2%;
  }
}
```

## Accessibility

shadcn/ui components built on Radix UI include:

- ARIA attributes
- Keyboard navigation
- Focus management
- Semantic HTML

**Always ensure:**

- Form inputs have associated `<Label>` elements
- Use `htmlFor` attribute on labels
- Include `alt` text on images
- Test keyboard navigation
- Provide error messages for form validation

## Checklist for UI Development

- [ ] Using only shadcn/ui components
- [ ] No custom styled components created
- [ ] Using Tailwind for styling extensions
- [ ] Using `cn()` for conditional classes
- [ ] Dark mode supported with `dark:` prefix
- [ ] Responsive design with breakpoints (`sm:`, `md:`, `lg:`)
- [ ] Icons from lucide-react
- [ ] Form labels properly associated
- [ ] Disabled states handled
- [ ] Loading states indicated
- [ ] Error states displayed

## References

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Component Gallery](https://ui.shadcn.com/docs/components)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Radix UI Documentation](https://www.radix-ui.com)
- [lucide-react Icons](https://lucide.dev)

**Last Updated:** May 2026
