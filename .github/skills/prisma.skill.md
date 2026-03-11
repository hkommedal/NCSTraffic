# Prisma Skill

This skill provides guidance for working with the Prisma ORM in this project.

## Configuration

- **Schema:** `apps/web/prisma/schema.prisma`
- **Config:** `apps/web/prisma.config.ts`
- **Generator:** `prisma-client` → outputs to `apps/web/generated/prisma/`
- **Database:** SQLite via `@prisma/adapter-better-sqlite3`
- **Singleton:** `apps/web/lib/prisma.ts` (uses `globalThis` caching)

## Adding a New Model

1. Define the model in `apps/web/prisma/schema.prisma`.
2. Run `pnpm db:generate` to regenerate the client.
3. Run `pnpm db:push` to apply changes to the database.
4. Import `prisma` from `@/lib/prisma` to query the new model.

## Best Practices

- Always use the driver adapter pattern with `PrismaBetterSqlite3`.
- Use `cuid()` for IDs: `id String @id @default(cuid())`.
- Add `createdAt DateTime @default(now())` and `updatedAt DateTime @updatedAt` to all models.
- Use `@relation` with explicit foreign key fields for relations.
- Access the database only in Server Components or API routes, never Client Components.
