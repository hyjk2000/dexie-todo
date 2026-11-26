# Todos

A minimal, device-local todo list built with React, Dexie.js, and Shadcn UI.

## Getting started

Use the Node.js and pnpm versions pinned in `mise.toml` (or run `mise install` if you use mise).

```sh
pnpm install
pnpm dev
```

Build and preview the production app:

```sh
pnpm build
pnpm preview
```

## Behavior

- Type in the empty row and press Enter or the return button to add a todo.
- Edit titles directly. Enter saves; Escape restores the saved title; leaving the field saves valid text. Titles cannot be blank.
- Check or uncheck a todo to move it between Todo and Completed. Active todos appear oldest first; completed todos appear newest first.
- Deleting a todo requires confirmation and is permanent.
- Failed changes show dismissible error notifications. Failed additions and edits keep your text so you can retry.
- Appearance follows your system light/dark preference. Reduced-motion preferences disable list animations.

## Offline and storage

Todos are stored in IndexedDB through Dexie, not on a server. Production builds precache the app, including its bundled fonts, using a service worker. Once the first online visit has finished caching, it can reopen and work offline. Serve the production build over HTTPS or localhost; development mode does not install a service worker.

Existing todos are migrated automatically when the storage format changes. Cloud sync is not implemented.

Data belongs to this browser profile and origin. Clearing site data, browser eviction, private browsing, or losing the device can remove it. There is no backup, authentication, cloud sync, or export/import.

## Contributing

The app uses React, TypeScript, Dexie.js, Tailwind CSS, and Shadcn UI. Application components live in `src/components/`; shared UI components live in `src/components/ui`.

Before submitting changes, run:

```sh
pnpm lint
pnpm build
```

Check affected interactions in the browser, including keyboard use. To check offline support, use the production preview after an initial online visit has finished caching.

See [AGENTS.md](AGENTS.md) for implementation conventions and invariants.
