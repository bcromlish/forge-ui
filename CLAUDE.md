# Project: forge-ui

## Overview
Standalone component library extracted from VidCruiter-ATS. Provides a complete
design system with primitives, patterns, layouts, and complex compositions for
all Forge projects. Built on shadcn/ui patterns with Radix UI primitives,
Tailwind CSS 4, and TypeScript strict mode.

## Current Phase
Phase 0 — Extraction complete, imports fixed, not yet generalized. Components
with ATS-specific dependencies are marked with `// TODO: Replace with prop-based API`.

## Stack
| Layer | Choice |
|-------|--------|
| Framework | React 19 |
| Styling | Tailwind CSS 4 + CSS custom properties |
| Types | TypeScript strict mode |
| Primitives | Radix UI, Base UI, cmdk |
| Bundler | tsup (CJS + ESM + DTS) |
| Icons | lucide-react |
| Forms | react-hook-form + zod |
| Charts | recharts |
| Animations | motion (framer-motion) |
| Editor | TipTap |

## Commands
```
build: npm run build
dev: npm run dev
typecheck: npm run typecheck
lint: npm run lint
```

## Component Tiers

Components follow a strict dependency hierarchy. Higher tiers may import from
lower tiers, never the reverse.

### 1. Primitives (`src/primitives/`)
Base-level UI atoms. Thin wrappers around Radix/Base UI. No business logic.
Examples: Button, Input, Dialog, Select, Tabs, Tooltip.

### 2. Patterns (`src/patterns/`)
Mid-level combinations of primitives. Reusable across features.
Examples: Card, Table, SearchInput, StatusBadge, EmptyState, InputGroup.

### 3. Layouts (`src/layouts/`)
Page-level structure components: sidebars, headers, detail panels, dashboards.
Examples: AppSidebar, DashboardLayout, ListPageLayout, DetailPanel.

### 4. Compositions (`src/compositions/`)
Complex, feature-oriented component groups. Organized by domain:
- `ai-elements/` — AI chat, reasoning, code blocks, prompt input
- `calendar/` — Full calendar system (day/week/month views, events, forms)
- `settings/` — Member management, field definitions, profiles
- `page-builder/` — Block-based page/form builder
- `analytics/` — Charts, funnels, breakdowns
- `audit-log/` — Activity entries
- `showcase/` — Demo/showcase components

### 5. Foundations (`src/foundations/`)
Design token data and display components. Color palettes, typography specimens,
size tokens. Used for documentation and Storybook, not runtime UI.

### 6. Editor (`src/editor/`)
Rich text editor built on TipTap. Toolbar, bubble menu, slash commands,
link popover, image upload.

## Design Tokens

CSS custom properties defined in `src/styles/`:

| File | Tokens |
|------|--------|
| `colors.css` | Full color palette (gray, red, blue, green, etc.) |
| `colors-faded.css` | Faded color variants |
| `colors-washed.css` | Washed color variants |
| `color-roles.css` | Semantic color roles (background, foreground, primary, etc.) |
| `typography.css` | 14 semantic type utilities (display, title, body, caption, signal) |
| `dimension.css` | Spacing and sizing tokens |
| `shape.css` | Border radius tokens |
| `breakpoint.css` | Responsive breakpoints |
| `content-blocks.css` | Content block styling |

### Using tokens in a consuming project
```css
@import "@anthropic-forge/ui/styles/colors.css";
@import "@anthropic-forge/ui/styles/color-roles.css";
@import "@anthropic-forge/ui/styles/typography.css";
@import "@anthropic-forge/ui/styles/dimension.css";
@import "@anthropic-forge/ui/styles/shape.css";
```

## How to Add a Component

1. Determine the tier (primitive, pattern, layout, composition)
2. Create the component file in the appropriate directory
3. Export it from the directory's `index.ts`
4. If it's a primitive or pattern, it should accept all data via props (no hooks)
5. Follow the `cn()` utility for class merging (in `src/lib/utils.ts`)

## How to Use in a Consuming Project

```bash
npm install @anthropic-forge/ui
```

```tsx
// Import from the main bundle
import { Button, Card, Input } from '@anthropic-forge/ui';

// Or import from specific tiers for tree-shaking
import { Button } from '@anthropic-forge/ui/primitives';
import { Card } from '@anthropic-forge/ui/patterns';

// Import AI components
import { Conversation, PromptInput } from '@anthropic-forge/ui/compositions/ai';
```

## Conventions
- `cn()` for all className merging — never raw template literals
- CVA (class-variance-authority) for component variants
- All components use `React.forwardRef` where DOM refs are needed
- Components accept a `className` prop for consumer overrides
- No data fetching inside components — all data comes via props
- Radix UI for accessible primitive behavior

## Anti-Patterns
- Never import from `@/` paths — all imports must be relative within the package
- Never add data fetching hooks (useQuery, useMutation) to components
- Never import from Convex, WorkOS, or any backend directly
- Never add Next.js-specific code (server components, route handlers)
- Components marked with `// TODO: Replace with prop-based API` need their
  external imports replaced with props before they are production-ready

## TODO
- [ ] Generalize ATS-specific components (replace commented-out feature imports with props)
- [ ] Add Storybook configuration
- [ ] Verify build output
- [ ] Add component documentation
- [ ] Extract shared types to `src/types/`
