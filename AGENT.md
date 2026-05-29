# AGENT.md

Guidance for AI agents (Claude Code, etc.) working in this repository.

## What this is

A **LINE LIFF mini-app** (runs inside the LINE messaging app) for ordering drinks from a single store ("Sketchy"). It is a client-only Vue 3 SPA — there is no server in this repo. **Notion databases are the datastore**, reached through an external backend proxy. Users browse a menu, pick sweetness + a note per item, manage a cart, save a delivery address, place orders, and view order history.

## Commands

Package manager is **npm** (CI uses `npm ci`; a `pnpm-lock.yaml` also exists but npm is canonical).

```bash
npm install
npm run dev        # vite --mode dev  → loads .env.dev, bypasses the LINE-only gate, allows external-browser login
npm run build      # vue-tsc -b && vite build  → type-check THEN bundle (type errors fail the build)
npm run preview    # serve the production build locally

npx eslint .                 # lint (flat config in eslint.config.js)
npx prettier --check .       # or --write to format (config in .prettierrc; not wired into ESLint)
```

There is **no test runner and no tests** in this project — do not look for a `test` script or invent one.

Type-checking is not a standalone script; it runs via `vue-tsc -b` as the first half of `npm run build`.

## Environment

Vite only exposes vars prefixed `APP_` (`envPrefix: 'APP_'` in [vite.config.ts](vite.config.ts)). `.env` is used by the production build; `.env.dev` is used by `npm run dev` (via `--mode dev`). Both are gitignored.

- `APP_LIFF_ID` — LINE LIFF app id (required; `useLiff.initialize()` throws without it)
- `APP_BACKEND_PORT` — **misnamed: it is the backend base URL**, not a port. All Notion calls hit `${APP_BACKEND_PORT}/notion/...`
- `APP_NOTION_API_KEY` — sent as a `Bearer` token to the backend proxy
- `APP_NOTION_DATABASE_ID` — orders DB (written on checkout)
- `APP_NOTION_STORE_INFO_DATABASE_ID` — store open/closed status
- `APP_NOTION_PRODUCT_DATABASE_ID` — menu/products

## Architecture

### Bootstrap & app shell
[src/main.ts](src/main.ts) creates the app, installs the router and Pinia (with `pinia-plugin-persistedstate`), globally configures VeeValidate for **submit-only validation**, mounts, then fires LIFF `initialize()`. [src/App.vue](src/App.vue) is the persistent shell: it renders the global `<Toaster/>` and `<Header/>`, runs the LIFF login flow in `onMounted` (`initialize → login → getProfile`) and pushes the result into the profile store, and hosts the `<router-view>` with a fade transition. Routes are lazy-loaded in [src/route/router.ts](src/route/router.ts); the typed path constants live in [src/constants/route.ts](src/constants/route.ts).

### LIFF lifecycle and the "LINE-only" gate
[src/features/shared/composables/useLiff.ts](src/features/shared/composables/useLiff.ts) wraps `@line/liff`. `initialize()` is guarded by an `isInitialized` ref and is called from several places (main, App, router guard) — treat it as idempotent. **The gate lives in `router.beforeEach`**: in production (`import.meta.env.PROD`) any user not inside the LINE client is redirected to `/line-only`. In dev this gate is bypassed and `withLoginOnExternalBrowser` is enabled, so you can run the app in a normal browser. `/line-only` is always allowed through.

### Notion access (important)
[src/features/shared/composables/useNotion.ts](src/features/shared/composables/useNotion.ts) imports `@notionhq/client` and constructs a `Client`, **but the SDK client is never used to make requests** — it only serves as a non-null "initialized" guard. Every read/write is a `fetch` to the backend proxy:
- `POST ${APP_BACKEND_PORT}/notion/database` with `{ type, query }`, where `type` is `'store' | 'product' | 'order-history'` — used for all reads.
- `POST ${APP_BACKEND_PORT}/notion/page` — used to create one order page per cart item on checkout.

A composable must call `initNotion()` (sets `client.value`) before any `getDatabase`/`updateDatabase`, or those throw. The Vite dev proxy `/api/notion` in [vite.config.ts](vite.config.ts) is **not** used by current code.

### Feature module convention (the core pattern)
Code is organized **by feature**, not by type, under `src/features/<feature>/`. Each feature follows the same shape:

- `XxxPage.vue` — a **thin** SFC. It imports a single `useXxxPage()` composable and binds the returned state/handlers to the template. Pages contain almost no logic.
- `XxxPage.composable.ts` — the "controller": holds all refs, derived state, and event handlers, wires together stores + `useNotion`/`useLiff`, and is the file you edit for behavior changes.
- `stores/*.ts` — Pinia setup-stores for cross-page state. `cart` and `profile` use `{ persist: true }` (localStorage); `product` does not.
- `schemas/*.ts` — Zod schemas backing the feature's forms.

Cross-feature composables live in `src/features/shared/composables/`. Shared TypeScript types are in `src/types/` and re-exported through [src/types/index.ts](src/types/index.ts) — import types from `@/types`. The `@/` alias maps to `src/`.

Current features: `home` (menu, product drawer, cart, checkout — the bulk of the logic is in [HomePage.composable.ts](src/features/home/HomePage.composable.ts)), `profile` (delivery address form), `order-history` (read-only order list), `line-only` (out-of-LINE fallback).

### Forms (VeeValidate v4 + Zod v3)
Forms use **VeeValidate v4** (`vee-validate` + `@vee-validate/zod`) over **Zod v3** schemas. The composable calls `useForm({ validationSchema: toTypedSchema(schema), initialValues })` and exposes a `handleSubmit(...)` handler. Because `useForm` runs in the page's setup, templates use bare `<Field name="x" v-slot="{ componentField, errorMessage }">` (no `<Form>` wrapper), bind the custom input via `v-bind="componentField"`, and render `<p v-if="errorMessage" …>` for inline errors (see [ProfilePage.vue](src/features/profile/ProfilePage.vue)). Validation is **submit-only** (configured in [main.ts](src/main.ts)).

**Zod is pinned to v3 on purpose** — `toTypedSchema` peer-depends on Zod `^3.24`. Do not bump Zod to v4 without also migrating to vee-validate v5. Raw schemas are also reused directly outside forms (e.g. `profileAddressSchema.safeParse(...)` for an address presence check in the home composable).

### UI components
`src/components/` holds **shadcn-vue** components (new-york style, [components.json](components.json)) built on **reka-ui**, styled with Tailwind. They are flattened — each component is `src/components/<name>/` with an `index.ts` barrel; there is **no `ui/` subfolder** (the `ui` alias in components.json points at `@/components`, and ESLint's ignore of `src/components/ui/**` is vestigial). Use `cn()` from [src/libs/utils.ts](src/libs/utils.ts) to merge Tailwind classes. Toasts go through `use-toast.ts` + the `<Toaster/>` mounted in App.vue. Icons come from `lucide-vue-next`.

## Gotchas

- **`buliding` is a deliberate spelling.** The Notion property is literally misspelled `buliding`. The order write in [useNotion.ts](src/features/shared/composables/useNotion.ts) and the read in [OrderHistoryPage.composable.ts](src/features/order-history/OrderHistoryPage.composable.ts) both depend on this exact key — do not "fix" it without changing Notion.
- **`sweetness` is a literal union** `100 | 75 | 50 | 25 | 0`. The Zod schema validates it with a `.refine((v): v is 100|75|50|25|0 => …)` type predicate rather than `z.union`, because a Zod-3 union of literals surfaces every per-option message and hides a custom one.
- **Notion response mapping is unguarded.** Map functions reach deep into the API shape (e.g. `result.properties.id.unique_id.number`); they assume a specific column layout in the Notion DBs. Schema drift in Notion breaks these silently.
- **Deploy targets both Pages and Vercel.** `vite.config.ts` sets `base: ''` (relative asset paths). [.github/workflows/build-deploy.yml](.github/workflows/build-deploy.yml) builds and deploys to **GitHub Pages** on push to `main`/`master`; [vercel.json](vercel.json) provides SPA fallback rewrites for Vercel. Both are SPA-rewrite setups.

## Code style

Prettier: no semicolons, single quotes, no trailing commas, width 100, 2-space indent. ESLint flat config = JS recommended + typescript-eslint recommended + vue `flat/essential`. TypeScript is `strict` with `noUnusedLocals`/`noUnusedParameters` on.
