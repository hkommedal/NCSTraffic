---
applyTo: "apps/web/prisma/**"
---

# Prisma Schema Instructions

When modifying the Prisma schema (`schema.prisma`):

- Generator must be `prisma-client` (not `prisma-client-js`), outputting to `../generated/prisma`.
- Datasource uses `sqlite` provider. The `url` is no longer in the schema — it is configured in `prisma.config.ts` via `datasource.url`.
- After any schema change, remind the user to run `pnpm db:generate` and `pnpm db:push`.
- Use `@id @default(cuid())` for primary keys.
- Use `@unique` for fields that must be unique.
- Use `@relation` with explicit foreign key fields.
- Use `DateTime` with `@default(now())` for `createdAt` and `@updatedAt` for `updatedAt`.
