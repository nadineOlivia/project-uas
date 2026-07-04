# shadcn

React

## Installation

```bash
npx skills add https://github.com/shadcn/ui --skill shadcn
```

## Summary

Complete shadcn/ui component management for adding, searching, fixing, styling, and composing UI.

## Description

- Manages the full component lifecycle: search registries, add components, view docs, preview changes with --dry-run and --diff, and intelligently merge upstream updates while preserving local modifications
- Enforces critical rules across forms (FieldGroup, Field, InputGroup, validation states), composition (Groups, overlays, Card structure), styling (semantic colors, gap spacing, size shorthand), and icons (data-icon attributes)
- Supports multiple registries (@shadcn, @magicui, @tailark, community presets) and provides component selection guidance via a reference table covering buttons, forms, overlays, navigation, charts, and layouts
- Injects project context automatically including aliases, framework, base library (radix vs base), icon library, Tailwind version, and resolved paths to ensure correct imports and APIs

## SKILL.md

# shadcn/ui

A framework for building ui, components and design systems. Components are added as source code to the user's project via the CLI.

**IMPORTANT**: Run all CLI commands using the project's package runner: `npx shadcn@latest`, `pnpm dlx shadcn@latest`, or `bunx --bun shadcn@latest` — based on the project's `packageManager`. Examples below use `npx shadcn@latest` but substitute the correct runner for the project.

### Current Project Context

```bash
npx shadcn@latest info --json
```

The JSON above contains the project config and installed components. Use `npx shadcn@latest docs <component>` to get documentation and example URLs for any component.

### Principles

- Components are added as source code, not as a dependency
- Use the CLI to add components: `npx shadcn@latest add <component>`
- Components are customizable and can be modified to fit your design system
- Follow the shadcn/ui design system for consistency
