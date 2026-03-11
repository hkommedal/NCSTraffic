# Copilot Instructions — Demoapp

## Project Overview

Monorepo-style repository using **pnpm workspaces**. The primary application lives in `apps/web` (Next.js App Router).

## Tech Stack

- **Runtime:** Node.js 20 LTS
- **Package manager:** pnpm 9.x via Corepack (`packageManager` field in root `package.json`)
- **Framework:** Next.js 16 (App Router, Turbopack) with React 19
- **Language:** TypeScript 5.x — strict mode, ES2022 target, bundler module resolution
- **Styling:** Tailwind CSS v4 — CSS-first config via `@import "tailwindcss"`, `@tailwindcss/postcss` plugin
- **State management:** Zustand 5 — lightweight hook-based stores, no providers
- **Validation:** Zod 4 — TypeScript-first schema validation with static type inference
- **Database:** Prisma ORM 7 + SQLite via `@prisma/adapter-better-sqlite3` (driver adapter pattern)
- **Linting:** ESLint 9 flat config with `eslint-config-next`
- **Formatting:** Prettier — `semi: true`, `singleQuote: false` (double quotes), `trailingComma: "all"`, `printWidth: 100`

## Workspace Structure

```
apps/web/          → Next.js app (App Router)
packages/          → Shared packages (future)
.github/           → Copilot instructions and skills
```

## Key Conventions

### General

- Keep it simple and idiomatic — the code should be easy to read and understand for any TypeScript/Next.js developer. Do not over engineer or add unnecessary abstractions.
- Only add dependencies that are truly needed. Avoid adding libraries for things that can be done easily with built-in features or minimal code.
- Only write necessary documentation and comments. The code should be self-explanatory as much as possible. Use comments to explain why something is done a certain way, not what the code is doing.
- Follow standard TypeScript best practices and idioms.
- Use `type` over `interface` unless declaration merging is needed.
- Prefer `const` assertions and `satisfies` operator where appropriate.
- All modules use ESM (`"type": "module"` in root `package.json`).
- Cross-platform compatible — avoid OS-specific paths or shell syntax.
- Keep all secrets and environment variables in `.env.local` (gitignored) and access via `process.env`. Do not write to .env files programmatically. Instead write to example env files like `.env.local.example` with placeholder values and instructions for developers to copy to `.env.local` and fill in real values.

### Next.js

- Default to **Server Components**. Only add `'use client'` when the component needs interactivity, browser APIs, or hooks.
- Use the App Router file conventions: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `route.ts`.
- API routes go in `app/api/` as `route.ts` files using `NextRequest`/`NextResponse`.
- Use `next/image` for images, `next/link` for navigation, `next/font` for fonts.
- Make sure all calls to external services (like the database) are done in Server Components or API routes, never in Client Components.

### Tailwind CSS v4

- No `tailwind.config.js` — configuration is done in CSS with `@theme` blocks.
- Import via `@import "tailwindcss"` in `globals.css`.
- Use utility classes directly; avoid `@apply` except in global styles.

### Zustand 5

- If there is need for persisting data in a store, use zustand's `persist` middleware to automatically sync state to `localStorage`. Import from `"zustand/middleware"`.
- Stores live in `lib/store/`. Each store is a single file exporting a typed hook created with `create`.
- Import as `import { create } from "zustand"`. No `<Provider>` wrapper — stores are plain hook imports.
- Type the full store shape as a `type` and pass it as a generic: `create<MyStore>()((set, get) => ({ ... }))`.
- Use selectors to subscribe to specific slices and avoid unnecessary re-renders: `const count = useAppStore((s) => s.count)`. Never destructure the entire store in a component.
- Keep stores small and focused. Split unrelated state into separate stores rather than building one monolithic store.
- Stores require `'use client'` — only consume them in Client Components. For server-fetched data that needs client-side reactivity, hydrate the store from a Client Component that receives server data as props.
- Use the `persist` middleware only when state genuinely needs to survive page reloads (e.g. user preferences, theme). Import from `"zustand/middleware"`.
- Colocate actions with state inside `create` — avoid standalone setter functions outside the store.
- For computed/derived values, use `get()` inside actions or derive inline in selectors rather than storing redundant state.

### Zod 4

- If there is need for runtime validation of data (e.g. request bodies, external API responses), use Zod schemas to validate and infer static types.
- Schemas live in `lib/schemas/`. Group by domain (e.g. `user.ts`, `project.ts`).
- Import as `import * as z from "zod"` (namespace import).
- Use top-level format functions — `z.email()`, `z.url()`, `z.uuidv4()`, `z.iso.datetime()` — instead of the deprecated `.email()` / `.url()` methods on `z.string()`.
- Always export inferred types alongside schemas: `export type User = z.infer<typeof userSchema>`. Use these types throughout the codebase instead of manually duplicating shapes.
- Prefer `safeParse` over `parse` in API routes and form handlers — handle `{ success, data, error }` explicitly rather than relying on try/catch.
- Use `z.object()` for request bodies in API routes. Validate early at the boundary (route handler entry point), then pass typed data inward.
- Use `.transform()` for coercion (e.g. string-to-number from query params) and `.pipe()` to chain schemas.
- Keep schemas as the single source of truth for both runtime validation and static types. Do not define a `type` separately and then a matching Zod schema — derive the type from the schema.

### Prisma ORM 7

- Schema at `apps/web/prisma/schema.prisma`, config at `apps/web/prisma.config.ts`.
- Generator is `prisma-client` (not `prisma-client-js`), outputs to `apps/web/generated/prisma/`.
- Import the client from `@/generated/prisma/client`.
- The datasource `url` is configured in `prisma.config.ts` via `datasource.url` (not in the schema file).
- Uses driver adapter pattern: `PrismaBetterSqlite3` from `@prisma/adapter-better-sqlite3` with `{ url }` constructor.
- Singleton pattern via `globalThis` caching in `apps/web/lib/prisma.ts`.
- The `generated/` directory is gitignored — run `pnpm db:generate` after cloning.

### Code Style

- Prettier is the source of truth for formatting (see `.prettierrc`).
- ESLint flat config lives at `apps/web/eslint.config.mjs`.
- Generated files (`generated/**`) are excluded from both linting and formatting.

## Common Commands

| Command            | Description                    |
| ------------------ | ------------------------------ |
| `pnpm dev`         | Start dev server (Turbopack)   |
| `pnpm build`       | Production build               |
| `pnpm lint`        | Run ESLint                     |
| `pnpm format`      | Format all files with Prettier |
| `pnpm db:generate` | Generate Prisma Client         |
| `pnpm db:push`     | Push schema to SQLite          |
| `pnpm db:studio`   | Open Prisma Studio             |

## Additional Instructions & Skills

Scoped instruction files in `.github/instructions/` provide detailed rules for specific file types. Skill files in `.github/skills/` provide domain-specific Prisma guidance.

## Application Goals
The goal of the NCS Traffic app is to provide a map of the North Sea with the following content displayed:
Petroleum field polygons and facilities from Sodir (Sokkeldirektoratet)
Flights from Avinor or Flightradar, including helichopter traffic to installations on the Norwegian Continental Shelf
All essel traffic from Barentswatch
Weather data from Met API
All data are to be visualized on a leaflet map. 
For more accurate icons use Leaflet.IconMaterial

## Weather data
Use the Met API to fetch current weather conditions and forecasts for locations in the North Sea. Display this information in a tooltip or sidebar when users click on a location on the map.

## Petroleum field data
For petroleum field data, use the Sodir.no API to fetch polygons and facility locations. Display these as layers on the map, with different colors or icons for fields vs facilities. Include tooltips with key information about each field/facility.

