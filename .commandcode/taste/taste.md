# auth

- On app load, if an access token exists, hit /auth/me endpoint and store the result in authContext. Re-check on every login/logout cycle. Confidence: 0.70

# codebase

- Do not modify files under src/app/\_components/ui/. For new UI primitives, look up existing shadcn patterns or ask the user instead. Confidence: 0.70
- Place reusable utility/library code in `src/libs/{category}/` (e.g., `src/libs/nuqs/parse-sort-by.ts`) rather than `src/app/_lib/`. Confidence: 0.70

# api-design

- When designing utility functions, make non-essential parameters optional with sensible defaults so callers aren't forced to specify them when the default is acceptable. Confidence: 0.70

# data-table

- Row numbering in data tables should be continuous across pages using `pageIndex * pageSize + row.index + 1` so numbers don't reset on each page. Confidence: 0.65

# forms

- Keep react-hook-form as the form library even when validation is removed; don't replace it with plain useState. Confidence: 0.65

# typescript

See [typescript/taste.md](typescript/taste.md)

# docker

- Prefer platform-native static serving (e.g., Dokploy static mode) over custom servers like Express or nginx for SPAs. Confidence: 0.80

# naming

- Suffix destructured `mutate` aliases from `useMutation` with `Mutate` (e.g., `const { mutate: deleteUser } = useMutation(...)` → `const { mutate: deleteUserMutate } = useMutation(...)`). Do NOT rename the underlying API functions in `src/api/` that are passed as `mutationFn`. Confidence: 0.80
- For `useMutation` result properties like `isPending`, `isError`, `isSuccess`, destructure them with meaningful names suffixed by the property name rather than accessing off a mutation object. Example: destructure `isPending` as `updateUserIsPending` instead of `updateUserMutation.isPending`. Confidence: 0.70
- When an intermediate variable or transformation step is removed from a data pipeline, rename downstream variables to reflect their new, direct data source rather than keeping stale names that reference the removed intermediate (e.g., `queryUrlIntoPayload` → `queryStatesIntoPayload` after `queryUrl` was deleted). Confidence: 0.65

# data-table

- For DataTable components wrapping TanStack Table, group library-native options into a single `tableOptions` prop: `columns` at root, `pageCount`/`pageIndex` under `state.pagination`, `sorting`/`columnFilters` under `state`, and `rowCount` under `state`. Confidence: 0.75
- Consolidate individual URL/pagination/sort/search props into a single `queryTable` object (with `page`, `pageSize`, `sortBy`, `order`, `search` fields) instead of passing each as a separate prop to table components. Confidence: 0.70

# plan-mode

- When in plan mode and user makes a request, write the plan to a plan file and exit plan mode to execute it, rather than telling the user to manually exit plan mode. Confidence: 0.70

# hooks

- Prefer generic reusable hooks (e.g., useFilter) over per-module entity-specific hooks (e.g., useUserFilter) when the pattern is shared across multiple modules. Confidence: 0.65
- Split mutations and queries into custom hooks with one file per endpoint; place shared hooks in `src/app/_hooks` and module-specific hooks in `src/app/:module/_hooks`. Confidence: 0.70
- React Query mutation hooks should include default side effects (toast.loading/toast.success, queryClient.invalidateQueries) inside the hook and accept `UseMutationOptions` params (same shape as `useMutation`'s options argument) instead of a custom callback signature, so the interface is familiar and TypeScript infers callback args automatically. Confidence: 0.70
- Name React Query hook files using kebab-case with a 'use-' prefix (e.g., use-get-user-pagination.ts, use-create-user.ts). Confidence: 0.70

# package-manager

- Use npm instead of pnpm for running commands. Confidence: 0.65

# icons

- Use ArrowUp01 from lucide-react for ascending sort direction icons in data table headers. Confidence: 0.70

# comments

- When making code changes that involve framework/library quirks or non-obvious transformations (e.g., nuqs returning `null` but the API expecting `undefined`), add inline comments explaining **why** the coercion/transformation is needed so other developers can understand the reasoning without tracing through library internals. Confidence: 0.70
- Place such explanatory comments directly above the first line that uses the pattern (e.g., above `sort_by`), not above the enclosing variable declaration or block header, so the comment is as close as possible to the code it describes. Confidence: 0.55

# documentation

- Keep the README tech stack section up-to-date when adding new project dependencies. Confidence: 0.60
- Version requirements in the README (e.g., Node.js, package manager) must stay in sync with the authoritative config files — `.nvmrc`, `Dockerfile`, `package.json` `engines` field, etc. When one changes, update all others to match. Confidence: 0.70

# git

- Commit messages follow the format `type: :gitmoji: short description` using gitmoji conventions (e.g., `refactor: :truck: rename requestor API layer to main for boilerplate reuse`). Match the existing repo style visible in `git log`. Confidence: 0.70

# architecture

- Place all data-fetching queries (useQuery) at the page level instead of inside child components. Mutations (useMutation) stay in their respective components. Confidence: 0.75
- Avoid intermediate mapping/translation variables that merely remap keys between data shapes (e.g., snake_case → camelCase for API payloads). Instead, change the consumers (types, hooks, components) to accept the original shape directly so data flows without indirection. Exception: for URL query params, auto-mapping in a reusable custom hook wrapping nuqs is acceptable (see routing/taste.md). Confidence: 0.75
