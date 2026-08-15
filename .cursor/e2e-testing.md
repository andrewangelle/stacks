# E2E testing findings (Stacks)

Reference doc for the Playwright E2E setup and CI. For how to run tests and add
coverage, start at [`tests/README.md`](../tests/README.md); this doc records the
architecture and the findings behind it.

## Philosophy

- **Default:** Playwright E2E from the user’s perspective (`data-testid`, roles, visible text). There is no unit test runner in the repo.
- **No test conditionals in `src/`** — mocks live under `tests/` and `vite.config.e2e.ts`. The single exception is `DevTools.tsx`, which checks `import.meta.env.VITE_E2E` so the TanStack devtools panel does not overlay the app under test.
- **Do not change app implementation to make tests pass.** Fix test infra, selectors, or timing; app bugs are app bugs.
- **Verify incrementally** — one test file at a time while debugging. Avoid running the full suite on repeat.

## Architecture

```text
Production          E2E only
──────────          ────────
vite.config.ts      vite.config.e2e.ts  (port 3100, Clerk aliases, test plugins)
pnpm dev :3000      pnpm dev:e2e :3100
real Prisma/Clerk   real Prisma against Dockerized Postgres + tests/mocks/clerk*.ts
```

**Only Clerk is mocked.** Prisma, the server functions, and the database are the
real thing: `pnpm test:db:setup` starts `postgres:16-alpine` from
`docker-compose.yml` and runs `prisma migrate deploy` against it, and `dev:e2e`
pins `DATABASE_URL` to `postgresql://test:test@localhost:5432/test`. So a schema
change needs a migration before the suite can run, but no `.env` and no cloud
credentials are involved.

Playwright (`playwright.config.ts`):

- `baseURL`: `http://localhost:3100`
- `webServer.command`: `pnpm test:db:setup && pnpm dev:e2e`
- `reuseExistingServer: false` — always starts its own server, and `vite.config.e2e.ts` sets `strictPort: true`
- `workers: 1`, `fullyParallel: false` — one Postgres shared across the whole run
- `retries: 1`, 30s test timeout / 5s expect timeout (60s and 10s under `CI`)
- Seven browser projects; `pnpm test` runs chromium only, which is what CI runs

### Why port 3100?

Avoids colliding with normal `pnpm dev` on 3000, which points at the real
database. Since `reuseExistingServer` is `false`, Playwright never attaches to a
server it did not start — but for the same reason a server you started yourself
on 3100 makes the run fail to boot rather than being reused.

## Test-only infrastructure

| Piece | Path | Role |
|--------|------|------|
| Clerk server mock | `tests/mocks/clerkServer.ts` | Replaces `@clerk/tanstack-react-start/server` |
| Clerk client mock | `tests/mocks/clerkClient.tsx` | Replaces `@clerk/tanstack-react-start` |
| Constants | `tests/mocks/constants.ts` | `TEST_USER_ID`, `TEST_USER_EMAIL`, fake Clerk user |
| Reset + seed HTTP | `tests/plugins/resetDB.ts` | `/__test/health`, `/__test/reset`, `/__test/seed-board`, `/__test/seed-card`, `/__test/seed-list-card`, `/__test/seed-activities` |
| Server-side fixtures | `tests/fixtures/*.ts` | The reset and seed routines those endpoints `ssrLoadModule` |
| Test-side helpers | `tests/helpers/*.ts` | `resetDb`, seed request wrappers, hydration waits |
| Playwright fixture | `tests/fixtures.ts` | The `test` export every spec imports; clamps the mobile viewport |
| Log suppression | `tests/plugins/suppressLogging.ts` | Keeps the e2e dev server’s output readable |
| dnd-kit sourcemap stub | `tests/plugins/stubDndKitSourcemaps.ts` | Silences missing-sourcemap noise from `@dnd-kit` |
| E2E Vite config | `vite.config.e2e.ts` | Aliases + plugins + `server.port: 3100` |

`resetDB` (in `tests/fixtures/reset.ts`) truncates every table in FK-safe order
and recreates the test user. Every test resets first — most call
`resetDb(request)` as their first line; `index.test.ts` uses a `beforeEach`.

### Health checks (manual)

Playwright will not reuse a server you start, so run these against your own
`pnpm dev:e2e` and stop it before running the suite.

```bash
pnpm dev:e2e
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3100/__test/health     # 204
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3100/__test/reset   # 204
curl -s -X POST http://localhost:3100/__test/seed-board \
  -H "Content-Type: application/json" \
  -d '{"boardTitle":"Test"}'   # 200 + JSON board
```

## Tests (current)

All specs run in CI against chromium; none are skipped. See the layout table in
[`tests/README.md`](../tests/README.md) for what each file covers.

```bash
pnpm exec playwright test tests/activity.test.ts --project=chromium
pnpm exec playwright test tests/activity.test.ts --project=chromium --grep "adds a comment"
```

Cold start is ~30s, nearly all of it the dev server booting; a single file adds
a few seconds on top.

## CI (`.github/workflows/ci.yml`)

1. `pnpm install --frozen-lockfile`
2. `pnpm db:generate` with a dummy `DATABASE_URL` (generate only — no connection)
3. `pnpm lint:check`
4. `pnpm test:types`
5. `playwright install --with-deps chromium`
6. `pnpm test --shard=N/3` with `CI=true`, across a 3-way matrix; the webServer step brings up Postgres in Docker on the runner
7. A `merge-reports` job stitches the per-shard blob reports into one HTML artifact

A `workflow_dispatch` input selects the other browser projects. No GitHub
secrets for the test job.

## Findings (lessons)

1. **Seed before `goto`.** Seeding after navigation leaves React Query holding the empty result it already loaded.
2. **SSR paints controls before React attaches handlers**, so an early click is dropped silently. Route actions that must land through `waitForHydratedAction` / `waitForInteractiveTrigger` rather than adding sleeps.
3. **A `fill` that lands before hydration wedges the form.** The text is in the DOM only; hydration then initializes React’s value tracker to that same text, so re-filling dispatches no change event and the submit button never enables. Always `fill('')` before re-filling — see `addComment` in `tests/activity.test.ts`.
4. **Playwright’s mobile emulation shrink-to-fits** wide content, zooming the layout viewport out until the card modal no longer fits. `tests/fixtures.ts` clamps the document to the viewport width for the Mobile projects only, so the emulator behaves like a real device.
5. **Don’t leave your own server on 3100.** `reuseExistingServer: false` + `strictPort: true` means the run fails before any test executes.
6. **Don’t change `src/` to satisfy a test.** An early attempt reworked `CreateBoard.tsx` for a flaky popover and was reverted.
7. **Adding workers cannot speed this suite up.** One Postgres is shared across the run, and a per-worker Vite dev server thrashes CPU and drives flakiness.

## Related docs

- User-facing: [`tests/README.md`](../tests/README.md)
- Root: [`README.md`](../README.md) Testing section
- Workspace types: `pnpm test:types`
