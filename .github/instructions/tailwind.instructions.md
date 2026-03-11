---
applyTo: "apps/web/app/**/*.css"
---

# Tailwind CSS v4 Instructions

- No `tailwind.config.js` — all config is CSS-first via `@theme` blocks in `globals.css`.
- Import Tailwind with `@import "tailwindcss"`.
- Use utility classes directly in JSX; avoid `@apply` except in global styles.
- Custom theme tokens go in a `@theme` block in `globals.css`.
