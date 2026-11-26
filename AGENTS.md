# Project conventions

- Use `#src/…` imports with explicit file extensions.
- Follow the official Shadcn Base UI registry; compose with `render`, not Radix's `asChild`.
- Use Tailwind utilities for styling; keep the Shadcn-generated theme as the only global stylesheet.
- Use Shadcn's CLI to install new components, never hand-write them, avoid editing them.
- Keep composer draft state local so typing does not rerender existing todos.
- Keep todos in one keyed list so moving between sections preserves the focused control.
