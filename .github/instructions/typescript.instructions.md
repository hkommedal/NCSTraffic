---
applyTo: "apps/web/**/*.{ts,tsx}"
---

# TypeScript Instructions

- Use `type` over `interface` unless declaration merging is needed.
- Prefer `const` assertions and `satisfies` operator where appropriate.
- Strict mode is enabled — do not use `any` unless absolutely necessary.
- Use ESM imports (`import`/`export`), never CommonJS (`require`/`module.exports`).
- Default to Server Components in Next.js. Only add `'use client'` when the component needs interactivity, browser APIs, or hooks.
- Import the Prisma client from `@/generated/prisma/client`.
- Import the singleton instance from `@/lib/prisma`.
- Import Zod as `import * as z from "zod"`.
- Import Zustand as `import { create } from "zustand"`.
