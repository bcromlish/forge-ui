# @anthropic-forge/ui

Design system and component library for Forge projects. Extracted from VidCruiter-ATS.

## Install

```bash
npm install @anthropic-forge/ui
```

## Usage

```tsx
import { Button, Card, Input } from '@anthropic-forge/ui';
import { Conversation, PromptInput } from '@anthropic-forge/ui/compositions/ai';
```

Import design tokens in your CSS:

```css
@import "@anthropic-forge/ui/styles/colors.css";
@import "@anthropic-forge/ui/styles/color-roles.css";
@import "@anthropic-forge/ui/styles/typography.css";
@import "@anthropic-forge/ui/styles/dimension.css";
@import "@anthropic-forge/ui/styles/shape.css";
```

## Component Tiers

- **Primitives** — Base UI atoms (Button, Input, Dialog, Select, etc.)
- **Patterns** — Reusable combinations (Card, Table, SearchInput, StatusBadge)
- **Layouts** — Page structure (AppSidebar, DashboardLayout, DetailPanel)
- **Compositions** — Feature-level groups (AI chat, Calendar, Settings, PageBuilder)

## Development

```bash
npm run build      # Build with tsup
npm run dev        # Watch mode
npm run typecheck  # TypeScript check
npm run lint       # ESLint
```
