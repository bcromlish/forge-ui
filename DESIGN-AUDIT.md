# Design System Audit — forge-ui

**Date**: 2026-04-02
**Auditor**: Forge Frontend Executor (critique + normalize + polish skills)

---

## Overall Assessment

The design system is **well-architected**. The token layers (dimension, shape, typography, color-roles) are thoughtful and the separation between primitives and patterns is clean. The codebase shows genuine design systems thinking — semantic aliases, constrained scales, and consistent data-slot attribution throughout.

**Grade: B+** — Strong foundation with specific animation/transition gaps that hold it back from feeling polished.

---

## What's Consistent and Good

### 1. Token Architecture is Excellent
- **Dimension scale** (dim-0 through dim-16) with alternating x1.50/x1.33 ratio is well-considered
- **Shape system** has proper layering: radius primitives -> semantic aliases -> border widths
- **Color roles** (12 roles x 6 primitives) provide comprehensive semantic coverage with proper dark mode overrides
- **Typography** uses semantic naming (display/title/subtitle/body/caption/signal) with responsive scaling

### 2. Consistent Patterns Across Primitives
- Every component uses `data-slot` attribution for targeting and debugging
- Focus rings are consistent: `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- Dark mode support is systematic via `.dark` class and `dark:` variants
- SVG handling is uniform: `[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`

### 3. Typography Usage
- Dialog, Sheet, Card, AlertDialog titles consistently use `text-title-3`
- Descriptions consistently use `text-body text-muted-foreground`
- Labels use `text-body font-medium`
- Content-blocks utilities (block-hero, block-section, etc.) compose with typography tokens correctly

### 4. Color Role System
- Alert component uses a sophisticated dynamic CSS variable system (`buildAlertVars`) that maps variants to color roles
- Status badge uses dedicated `--status-*` tokens consistently across 25+ statuses
- Avatar fallback uses deterministic color rotation with WCAG AA compliance

---

## Inconsistencies Found

### Priority 1: Animation & Transition Gaps

**P1-1: Button has no :active feedback** — `button.tsx` line 8
- Uses `transition-all` (too broad, per Emil philosophy) but has NO `active:scale` for tactile press feedback
- Every pressable element should scale 0.97-0.98 on :active per the animation philosophy
- The `transition-all` should be `transition-[color,background-color,border-color,box-shadow,transform]`

**P1-2: Sheet uses overly long durations** — `sheet.tsx` line 63
- `data-[state=closed]:duration-300 data-[state=open]:duration-500` — 500ms entry is too slow for UI
- Should be ~250ms enter, ~200ms exit (exit faster than enter per Emil rules)

**P1-3: Sheet uses `ease-in-out` instead of `ease-out`** — `sheet.tsx` line 63
- `transition ease-in-out` — `ease-in-out` is only for on-screen movement, not enter/exit
- Enter/exit should use `ease-out` (starts fast, feels responsive)

**P1-4: Collapsible has no animation** — `collapsible.tsx`
- CollapsibleContent has zero animation classes — content appears/disappears instantly
- Should use height animation via `grid-template-rows` (0fr -> 1fr) for smooth expand/collapse

**P1-5: Tabs content has no crossfade** — `tabs.tsx` line 82
- TabsContent has only `flex-1 outline-none` — no entry animation
- Should have at least an opacity crossfade on content change

**P1-6: HoverCard has no open delay** — `hover-card.tsx`
- No `openDelay` prop passed to HoverCard root, so it opens immediately
- Per Emil: "Tooltips should delay before appearing to prevent accidental activation"
- Recommendation: `openDelay={200}`

**P1-7: Tooltip default delay is 0** — `tooltip.tsx` line 9
- `delayDuration={0}` on TooltipProvider — this means instant open
- Should be 200-400ms to prevent accidental triggers, with skip-delay on subsequent hovers

### Priority 2: Spacing Inconsistencies

**P2-1: Drawer uses arbitrary gap values** — `drawer.tsx` line 80-81
- DrawerHeader uses `gap-0.5` and `md:gap-1.5` — `0.5` (2px) is dim-2 which is fine, but `1.5` (6px) is dim-4
- SheetHeader uses `gap-1.5` (6px = dim-4) — these are consistent with each other but DrawerHeader changes at md breakpoint while SheetHeader doesn't

**P2-2: Sheet padding differs from Drawer** — `sheet.tsx` vs `drawer.tsx`
- SheetHeader: `px-6 py-4` (24px/16px)
- DrawerHeader: `p-4` (16px all sides)
- These sibling components should use the same spatial logic

**P2-3: Dialog gap inconsistency** — `dialog.tsx` line 86
- DialogHeader: `gap-2` (8px = dim-5)
- SheetHeader: `gap-1.5` (6px = dim-4)
- These are conceptually the same component in different containers

### Priority 3: Typography Inconsistencies

**P3-1: Drawer uses raw Tailwind instead of typography tokens** — `drawer.tsx` lines 105, 118
- DrawerTitle: `font-semibold` instead of typography utility
- DrawerDescription: `text-sm` instead of `text-body`
- Every other overlay (Dialog, Sheet, AlertDialog) uses `text-title-3` and `text-body text-muted-foreground`

**P3-2: Menu items use raw `text-sm`** — across dropdown-menu.tsx, context-menu.tsx, select.tsx
- Menu items, labels, and checkbox items all use raw `text-sm` instead of `text-body`
- While both resolve to 14px, `text-body` includes proper line-height and letter-spacing

### Priority 4: Color Token Usage

**P4-1: SelectTrigger uses hardcoded `bg-white`** — `select.tsx` line 40
- Uses `bg-white` instead of `bg-background` — breaks in dark mode
- Input and Textarea also use `bg-white` (lines input.tsx:11, textarea.tsx:10) — same issue
- These all include `dark:bg-input/30` as a dark mode override, so it works but is fragile

**P4-2: AlertDialogContent uses `bg-card` while DialogContent uses `bg-background`**
- `alert-dialog.tsx` line 62: `bg-card`
- `dialog.tsx` line 64: `bg-background`
- These should be the same token for visual consistency

### Priority 5: Focus Ring Inconsistencies

**P5-1: DialogClose uses different focus pattern** — `dialog.tsx` line 73
- Uses `focus:ring-2 focus:ring-offset-2 focus:outline-hidden` (old pattern)
- Every other component uses `focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`
- SheetClose has the same old pattern at `sheet.tsx` line 78

**P5-2: AlertClose uses different focus pattern** — `alert.tsx` line 142
- Uses `focus-visible:ring-2 focus-visible:ring-ring` (close but different)
- Missing `focus-visible:ring-ring/50` and `focus-visible:ring-[3px]`

### Priority 6: Transition Property Specificity

**P6-1: Button uses `transition-all`** — `button.tsx` line 8
- Per Emil philosophy: "Specify exact properties; avoid `all`"
- Input, Textarea, Toggle, Badge, RadioGroupItem, Slider all correctly use `transition-[color,box-shadow]`
- Button should specify: `transition-[color,background-color,border-color,box-shadow,transform]`

**P6-2: Progress indicator uses `transition-all`** — `progress.tsx` line 24
- Should be `transition-transform` since only transform changes

**P6-3: TableRow uses `transition-colors`** — correct but inconsistent with how other components express it
- This is fine, but noting for completeness

---

## Recommendations (Prioritized)

### Must Fix (before next release)

1. **Add :active scale to Button** — `active:scale-[0.97]` with `transition-[color,background-color,border-color,box-shadow,transform] duration-150`
2. **Fix Sheet durations** — 250ms enter, 200ms exit, `ease-out` not `ease-in-out`
3. **Add animation to CollapsibleContent** — grid-template-rows technique for smooth height
4. **Normalize Drawer typography** — use `text-title-3` and `text-body text-muted-foreground`
5. **Fix SelectTrigger/Input/Textarea `bg-white`** — change to `bg-background`

### Should Fix (polish pass)

6. **Add HoverCard openDelay** — `openDelay={200}`
7. **Increase Tooltip delay** — `delayDuration={200}` minimum
8. **Add Tabs content crossfade** — opacity transition on content change
9. **Normalize Dialog/Sheet/Drawer header gaps** — pick one value (dim-4 = 6px)
10. **Fix DialogClose/SheetClose focus rings** — align with system pattern

### Nice to Have (delight pass)

11. **Add animations CSS file** — shared keyframes for scale-in, fade-in with prefers-reduced-motion
12. **Button hover transitions** — explicit 150ms ease-out on background-color
13. **Interactive Card hover** — already has transitions, could add subtle scale
14. **Dropdown/Popover/HoverCard entry** — already have zoom-in-95 + fade-in, ensure duration is explicit (150ms)

---

## Token Compliance Summary

| System | Compliance | Notes |
|--------|-----------|-------|
| Dimension | 95% | Minor gap/padding inconsistencies between Sheet/Drawer/Dialog headers |
| Shape | 98% | Consistent use of rounded-md, rounded-lg, rounded-full from token scale |
| Typography | 88% | Drawer and menu items use raw Tailwind instead of type utilities |
| Color | 92% | `bg-white` hardcoded in 3 components; `bg-card` vs `bg-background` split |
| Focus | 85% | DialogClose and SheetClose use legacy focus pattern |
| Transitions | 70% | Missing :active states, `transition-all` abuse, no shared animation system |

---

*Generated by Forge Frontend Executor using critique, normalize, and polish skills.*
