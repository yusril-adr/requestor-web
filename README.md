<p align="center">
  <a href="https://react.dev/" target="blank"><img src="./react_js.png" width="360" alt="React js Logo" /></a>
</p>

# Requestor Web

Web client for the Requestor application — a React Router 7 SPA built with Vite, TypeScript, Tailwind CSS v4, and TanStack Query.

## Requirements

- Node.js **20.19+** or **22.12+** (Vite 8 requirement)
- npm, pnpm, yarn, or bun

## Install

```bash
# pick your package manager
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

## Run (development)

```bash
npm run dev
```

Opens the app at [http://localhost:3000](http://localhost:3000) with HMR enabled.

## Build

```bash
npm run build
```

Type-checks (`tsc -b`) then bundles the client and server outputs to `./build/`.

## Preview production build

```bash
npm run preview
```

Serves the production build at [http://localhost:3010](http://localhost:3010).

## Lint

```bash
npm run lint
```

## Available scripts

| Script                 | What it does                               |
| ---------------------- | ------------------------------------------ |
| `npm run dev`          | Start the React Router dev server with HMR |
| `npm run build`        | Type-check and produce a production build  |
| `npm run preview`      | Serve the production build locally         |
| `npm run lint`         | Run ESLint across the project              |
| `npm run vite:dev`     | Start raw Vite (no React Router plugins)   |
| `npm run vite:build`   | Type-check and run a Vite-only build       |
| `npm run vite:preview` | Preview the Vite-only build                |

## Project layout

```
src/
├── app/                 # Application code
│   ├── _components/     # Shared UI, layout, providers
│   ├── _hooks/          # Reusable hooks
│   ├── _types/          # Shared types
│   ├── dashboard/       # /dashboard
│   ├── users/           # /users (list, create, detail, edit)
│   ├── requests/        # /requests (list, create, detail, edit)
│   ├── audit-logs/      # /audit-logs
│   ├── login/           # /login
│   ├── errors/          # 404 / error pages
│   └── page.tsx         # Index route
├── api/                 # API client (requestor, endpoints)
├── common/              # Enums, constants
├── libs/                # local-storage, dayjs wrappers
├── utils/               # Generic helpers
├── routes.ts            # Route table
├── root.tsx             # HTML shell + providers
└── index.css            # Tailwind v4 entry
```

The `@/` alias resolves to `src/` (configured in `vite.config.ts` and `tsconfig.app.json`).

## Tech stack

- [React Router 7](https://reactrouter.com/) (file/folder-based routing, SSR off)
- [Vite 8](https://vite.dev/)
- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/) via `@tailwindcss/vite`
- [TanStack Query](https://tanstack.com/query) for server state
- [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) for forms/validation
- [shadcn/ui](https://ui.shadcn.com/) + [Base UI](https://base-ui.com/) primitives
- [Axios](https://axios-http.com/) for HTTP
- [Sonner](https://sonner.emilkowal.ski/) for toasts
- [Day.js](https://day.js.org/) for dates
- [lucide-react](https://lucide.dev/) for icons

## Configuration

The dev server binds to `0.0.0.0:3000` and the preview server to port `3010` — both configurable in `vite.config.ts`.
