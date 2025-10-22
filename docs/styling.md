# Styling Guide

This document outlines the styling architecture and best practices for the Hanasu project using Tailwind CSS v4 and Svelte 5.

## Architecture Overview

We use a **utility-first, component-second** approach with centralized theming:

- **Centralized theme** in `src/app.css` using CSS variables with the `@theme` directive
- Tailwind utility classes reference theme colors for consistency
- Repeated patterns are extracted into reusable Svelte components, not CSS classes
- Avoid `@apply` directive - prefer component composition instead

## Theme System

### Color Palette

All colors are centrally defined in `src/app.css` using Tailwind v4's `@theme` directive. This provides:

- **Single source of truth** - change colors in one place
- **Type-safe usage** - Tailwind utilities automatically reference theme colors
- **No repetition** - use semantic color names throughout your app

#### Available Color Scales

Each color has shades from 50 (lightest) to 950 (darkest):

- **Primary** (`primary-*`) - Main brand color (blue)
- **Secondary** (`secondary-*`) - Accent color (purple)
- **Success** (`success-*`) - Success states (green)
- **Warning** (`warning-*`) - Warning states (yellow/amber)
- **Danger** (`danger-*`) - Error/destructive actions (red)
- **Neutral** (`neutral-*`) - Grays for text, borders, backgrounds

#### Semantic Color Names

For common use cases, use these semantic names:

- **Backgrounds**: `bg-background` (white), `bg-surface` (neutral-50)
- **Borders**: `border-border` (neutral-200)
- **Text**: `text-text-primary` (neutral-900), `text-text-secondary` (neutral-600), `text-text-muted` (neutral-500)

### Using Theme Colors

```svelte
<!-- Primary colors -->
<button class="bg-primary-600 hover:bg-primary-700 text-white">
  Primary Button
</button>

<!-- Semantic colors -->
<div class="bg-surface border border-border">
  <p class="text-text-primary">Main text</p>
  <p class="text-text-secondary">Secondary text</p>
</div>

<!-- Success state -->
<div class="bg-success-100 text-success-800 border border-success-200">
  Success message
</div>

<!-- Dynamic shades -->
<div class="bg-primary-500 hover:bg-primary-600 active:bg-primary-700">
  Interactive element
</div>
```

### Customizing Theme Colors

To change your brand colors, edit `src/app.css`:

```css
@theme {
  /* Change primary color from blue to your brand color */
  --color-primary-500: #yourcolor;
  --color-primary-600: #yourdarkercolor;
  /* ... update all shades */
}
```

**Tip**: Use a tool like [Tailwind Color Generator](https://uicolors.app) to generate a full color scale from a single base color.

## Directory Structure

```
src/lib/
├── components/
│   ├── ui/              # Primitive components (Button, Input, Card, Badge)
│   ├── layout/          # Layout components (Navbar, Container, Grid)
│   └── features/        # Feature-specific components
└── utils/
    ├── cn.ts            # Class name merging utility
    └── styles.ts        # Shared style constants and variants
```

## Core Utilities

### `cn()` Function

Located in `src/lib/utils/cn.ts`, this utility merges Tailwind classes intelligently:

```typescript
import { cn } from '$lib/utils/cn';

// Handles conflicts - last class wins
cn('px-4 py-2', 'px-6') // => 'py-2 px-6'

// Handles conditionals
cn('text-red-500', isActive && 'text-blue-500')

// Combines with component props
<div class={cn('base-classes', className)}>
```

### Style Constants

Located in `src/lib/utils/styles.ts`, this file contains:

- Button variants and sizes
- Badge variants
- Input base styles
- Common transitions and focus rings

Import these to maintain consistency:

```typescript
import { buttonVariants, buttonSizes, type ButtonVariant } from '$lib/utils/styles';
```

## Component Patterns

### 1. Props-Based Variants

Use TypeScript types and object lookups for variants:

```svelte
<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { buttonVariants, type ButtonVariant } from '$lib/utils/styles';

  interface Props {
    variant?: ButtonVariant;
  }

  let { variant = 'primary', class: className, ...rest }: Props = $props();
</script>

<button class={cn(buttonVariants[variant], className)} {...rest}>
  {@render children?.()}
</button>
```

**Why this pattern?**
- Type-safe variants
- Easy to extend
- Clear prop API
- Supports className overrides

### 2. Composition Over Configuration

Build small, focused components that compose together:

```svelte
<!-- Good: Composition -->
<Card>
  <CardHeader>
    <h2>Title</h2>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>

<!-- Avoid: Monolithic props -->
<Card title="Title" content="Content here" hasHeader={true} />
```

**Benefits:**
- Maximum flexibility
- Easy to understand
- Natural HTML-like structure

### 3. Props Interface Pattern

Always define a Props interface extending HTML element attributes:

```svelte
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary';
    // Custom props here
  }

  let { variant = 'primary', class: className, ...rest }: Props = $props();
</script>

<button class={cn('base-classes', className)} {...rest}>
```

This ensures all standard HTML attributes are supported (disabled, aria-*, etc.).

## Tailwind Class Ordering Convention

Order classes consistently for readability:

1. **Layout**: `flex`, `grid`, `block`, `inline`
2. **Spacing**: `p-*`, `m-*`, `gap-*`
3. **Sizing**: `w-*`, `h-*`
4. **Colors**: `bg-*`, `text-*`, `border-*`
5. **Typography**: `font-*`, `text-*` (size), `leading-*`
6. **Effects**: `shadow-*`, `rounded-*`, `opacity-*`
7. **Interactive**: `hover:*`, `focus:*`, `active:*`

**Example:**
```svelte
<button class="
  flex items-center gap-2
  px-4 py-2
  bg-blue-600 text-white border border-blue-700
  font-medium text-base
  rounded-md shadow-sm
  hover:bg-blue-700 focus:ring-2 focus:ring-blue-500
">
```

## When to Create New Components

**Create a component when:**
- Pattern repeats 3+ times across different routes
- Logic is complex (conditional classes, state management)
- Component has clear, reusable semantics (Button, Card, Input)

**Use inline utilities when:**
- Pattern is unique to one place
- Styling is simple and self-explanatory
- Adding a component would obscure the structure

## Responsive Design

Use Tailwind's responsive prefixes consistently:

```svelte
<div class="
  grid gap-4
  grid-cols-1
  sm:grid-cols-2
  md:grid-cols-3
  lg:grid-cols-4
">
```

Mobile-first approach: base classes apply to mobile, then override with breakpoints.

## Common Pitfalls to Avoid

### ❌ Don't concatenate dynamic classes
```svelte
<!-- Bad: Tailwind won't detect these classes -->
<div class="text-{color}-500">
```

### ✅ Do use conditional logic
```svelte
<!-- Good: Tailwind can detect all classes -->
<div class={color === 'blue' ? 'text-blue-500' : 'text-red-500'}>
```

### ❌ Don't use @apply for component styles
```css
/* Bad: Creates tight coupling, defeats Tailwind's purpose */
.btn { @apply px-4 py-2 bg-blue-500; }
```

### ✅ Do extract to Svelte components
```svelte
<!-- Good: Type-safe, flexible, composable -->
<Button variant="primary" size="md">Click me</Button>
```

## Extending the System

### Adding a New Variant

1. Add the variant to `src/lib/utils/styles.ts`:
```typescript
export const buttonVariants = {
  // ... existing variants
  outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50'
} as const;
```

2. TypeScript will automatically infer the new type
3. Use it in components: `<Button variant="outline">`

### Creating a New Component

1. Create file in `src/lib/components/ui/ComponentName.svelte`
2. Follow the Props interface pattern
3. Import and use `cn()` utility
4. Import style constants from `styles.ts` if applicable
5. Add usage examples to this documentation
