# Server Components — Reference

Detailed setup, advanced patterns, and low-level APIs for TanStack Start RSC. The main workflow lives in [SKILL.md](SKILL.md).

## Setup (fresh projects only)

RSC is **already enabled** in this repo. These steps are only for a brand new project. **Requirements:** React 19+, Vite 7+ or Rsbuild 2+.

### Vite

```bash
pnpm add -D @vitejs/plugin-rsc
```

```ts title="vite.config.ts"
import { defineConfig } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import rsc from '@vitejs/plugin-rsc'

export default defineConfig({
  plugins: [
    tanstackStart({ rsc: { enabled: true } }),
    rsc(),
    viteReact(),
  ],
})
```

### Rsbuild

Rsbuild needs no separate RSC plugin; just `@rsbuild/core` + `@rsbuild/plugin-react`.

```ts title="rsbuild.config.ts"
import { defineConfig } from '@rsbuild/core'
import { pluginReact } from '@rsbuild/plugin-react'
import { tanstackStart } from '@tanstack/react-start/plugin/rsbuild'

export default defineConfig({
  plugins: [
    pluginReact({ splitChunks: false }),
    tanstackStart({ rsc: { enabled: true } }),
  ],
})
```

## Advanced patterns

### Multiple components in parallel

Independent data sources, no shared deps — maximize concurrency with `Promise.all`. Each server fn runs concurrently; the page renders when all complete.

```tsx
export const Route = createFileRoute('/news')({
  loader: async () => {
    const [ArticleA, ArticleB, Sidebar] = await Promise.all([
      getArticleA(),
      getArticleB(),
      getSidebar(),
    ])
    return { ArticleA, ArticleB, Sidebar }
  },
  component: NewsPage,
})
```

### Bundling multiple components

Components that share fetched data, need a single cache key, or invalidate together — fetch once, return many. Reduces DB queries and round trips.

```tsx
const getPageLayout = createServerFn().handler(async () => {
  const user = await db.users.getCurrent()
  const config = await db.config.get()
  const [Header, Content, Footer] = await Promise.all([
    renderServerComponent(<header>{/* uses user + config */}</header>),
    renderServerComponent(<main>Welcome, {user.name}</main>),
    renderServerComponent(<footer>{config.copyright}</footer>),
  ])
  return { Header, Content, Footer }
})
```

For slot support, swap `renderServerComponent` for `createCompositeComponent` and render nested composites by dot notation or destructuring:

```tsx
function DashboardPage() {
  const { Header, Content, Footer } = Route.useLoaderData().Layout
  return (
    <>
      <CompositeComponent src={Header}>
        <button onClick={() => setMenuOpen(true)}>Menu</button>
      </CompositeComponent>
      <CompositeComponent src={Content} renderActions={() => <ActionButtons />} />
      <CompositeComponent src={Footer} />
    </>
  )
}
```

Each nested component receives its own slot props independently while sharing the upstream data.

### Deferred component loading

Return promises (don't await) so the route renders immediately; resolve each with `React.use()` inside `Suspense`. Faster results render before slower ones — also the mechanism for component-level error isolation.

```tsx
import { Suspense, use } from 'react'

const getDashboardBundle = createServerFn().handler(() => ({
  QuickStats: (async () => renderServerComponent(<StatsCard data={await cache.getStats()} />))(),
  Analytics: (async () => renderServerComponent(<AnalyticsChart data={await analytics.computeMetrics()} />))(),
}))

export const Route = createFileRoute('/dashboard')({
  loader: () => getDashboardBundle(),
  component: DashboardPage,
})

function Deferred({ promise }: { promise: Promise<unknown> }) {
  const Renderable = use(promise)
  return <>{Renderable}</>
}

function DashboardPage() {
  const { QuickStats, Analytics } = Route.useLoaderData()
  return (
    <div>
      <Suspense fallback={<Skeleton />}><Deferred promise={QuickStats} /></Suspense>
      <Suspense fallback={<Skeleton />}><Deferred promise={Analytics} /></Suspense>
    </div>
  )
}
```

**Error isolation:** wrap a `Deferred` in `<ErrorBoundary>` so a single rejected promise shows a fallback instead of crashing the route.

### Suspense inside a server component

For one component with multiple async children that should stream independently:

```tsx
const getAnalyticsDashboard = createServerFn().handler(() =>
  renderServerComponent(
    <div>
      <Suspense fallback={<MetricSkeleton label="Active Users" />}>
        <SlowMetric label="Active Users" delay={500} />
      </Suspense>
      <Suspense fallback={<MetricSkeleton label="Revenue" />}>
        <SlowMetric label="Revenue" delay={1500} />
      </Suspense>
    </div>,
  ),
)
```

The shell appears immediately; metrics pop in as data loads.

### Streaming with async generators

Unbounded/large result sets that should render incrementally — `handler` is an async generator; the client iterates with `for await`.

```tsx
const streamNotifications = createServerFn().handler(async function* () {
  for (const n of await db.notifications.getRecent(3)) {
    yield await createCompositeComponent<{
      renderActions?: (data: { id: string }) => React.ReactNode
    }>((props) => (
      <div className="notification">
        <h3>{n.title}</h3>
        {props.renderActions?.({ id: n.id })}
      </div>
    ))
  }
})

function NotificationsPage() {
  const [items, setItems] = React.useState<Array<unknown>>([])
  const start = React.useCallback(async () => {
    setItems([])
    const stream = await streamNotifications()
    for await (const n of stream) setItems((prev) => [...prev, n])
  }, [])
  return (
    <>
      <button onClick={start}>Load</button>
      {items.map((src, i) => (
        <CompositeComponent key={i} src={src}
          renderActions={({ id }) => <button onClick={() => markAsRead(id)}>Mark read</button>} />
      ))}
    </>
  )
}
```

## How slots work (mental model)

When a server component reads slot props it accesses a proxy:
- Reading `props.children` creates a placeholder for "whatever the caller provides".
- Calling `props.renderFn(args)` records `args` into a placeholder.

TanStack Start sends a React Flight stream with these placeholders; the client swaps them for the props you passed to `<CompositeComponent>`. That's why slots are opaque on the server and render-prop args must be serializable.

## Low-level Flight stream APIs

Prefer the high-level helpers (they handle caching, streaming, and slots). Use these only for custom streaming protocols, API-route integration, or external RSC-aware systems. Import from `@tanstack/react-start/rsc`.

| Function | Available in | Description |
| --- | --- | --- |
| `renderToReadableStream` | server functions only | Renders React elements to a Flight stream |
| `createFromFetch` | Client | Decodes a Flight stream from a `Promise<Response>` |
| `createFromReadableStream` | Client / SSR | Decodes a Flight stream from a `ReadableStream` |

`createFromFetch` wraps `createFromReadableStream`, taking a fetch promise and extracting the body internally.

```tsx
// src/routes/api/rsc.ts
import { createAPIFileRoute } from '@tanstack/react-start/api'
import { createServerFn } from '@tanstack/react-start'
import { renderToReadableStream } from '@tanstack/react-start/rsc'

const getFlightStream = createServerFn({ method: 'GET' }).handler(async () =>
  renderToReadableStream(<div>Server Rendered Content</div>),
)

export const APIRoute = createAPIFileRoute('/api/rsc')({
  GET: async () => new Response(await getFlightStream(), {
    headers: { 'Content-Type': 'text/x-component' },
  }),
})
```

```tsx
// Client
import { createFromFetch } from '@tanstack/react-start/rsc'
const fetchRSC = () => createFromFetch(fetch('/api/rsc'))
```

## Current status

- **Experimental** into early v1; helper APIs may change.
- **Serialization:** React's native Flight protocol. Primitives, Dates, and React elements work; TanStack Start's custom serialization isn't available in server components yet.
