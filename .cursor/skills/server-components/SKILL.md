---
name: server-components
description: >-
  Build TanStack Start React Server Components (RSC) in the stacks app — render
  components on the server and stream them to the client via server functions and
  route loaders. Use when the user asks to add a server component, use
  renderServerComponent or createCompositeComponent / CompositeComponent, keep a
  heavy dependency out of the client bundle, fetch data inside a component, or
  stream/defer server-rendered UI.
---

# TanStack Start Server Components (RSC)

> RSC is **experimental** in TanStack Start. The helper APIs may see refinements.

Server Components render on the server and stream to the client. Heavy deps stay out of the bundle, data fetching lives in the component, and secrets never reach the browser.

## Already enabled in this repo

RSC is configured in `vite.config.ts` (`tanstackStart({ rsc: { enabled: true } })` + `rsc()` from `@vitejs/plugin-rsc`, React 19, Vite 8). **Do not re-run setup.** Setup steps only matter for a fresh project — see [reference.md](reference.md#setup-fresh-projects-only).

## Pattern: server function → route loader → component

Create server-rendered UI inside a `createServerFn`, return it through a route `loader`, and render it in the component. Import helpers from `@tanstack/react-start/rsc`.

Two helpers, pick by whether you need client-provided slots:

| Helper | Returns | Render with | Slots? |
| --- | --- | --- | --- |
| `renderServerComponent(<El />)` | renderable value | inline `{Renderable}` | No |
| `createCompositeComponent((props) => <El />)` | composite source | `<CompositeComponent src={...} />` | Yes |

### Renderable (no slots)

```tsx
import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { renderServerComponent } from '@tanstack/react-start/rsc'

function Greeting() {
  return <h1>Hello from RSC</h1>
}

const getGreeting = createServerFn().handler(async () => {
  const Renderable = await renderServerComponent(<Greeting />)
  return { Renderable }
})

export const Route = createFileRoute('/')({
  loader: async () => ({ Greeting: (await getGreeting()).Renderable }),
  component: HomePage,
})

function HomePage() {
  const { Greeting } = Route.useLoaderData()
  return <>{Greeting}</>
}
```

### Composite (slots)

```tsx
import { CompositeComponent, createCompositeComponent } from '@tanstack/react-start/rsc'

const getCard = createServerFn().handler(async () => ({
  src: await createCompositeComponent((props: { children?: React.ReactNode }) => (
    <div className="card">
      <h2>Server-rendered header</h2>
      <div>{props.children}</div>
    </div>
  )),
}))

export const Route = createFileRoute('/')({
  loader: async () => ({ Card: await getCard() }),
  component: HomePage,
})

function HomePage() {
  const { Card } = Route.useLoaderData()
  return (
    <CompositeComponent src={Card.src}>
      <Counter />
    </CompositeComponent>
  )
}
```

## Slots (props for composites)

`renderServerComponent` values do **not** support slots. For client-provided props, use `createCompositeComponent`. Three slot types:

| Slot type | Use case | Server passes data? |
| --- | --- | --- |
| `children` | simple composition | No |
| Render props | server passes data to client-rendered content | Yes |
| Component props | reusable client components receiving server data | Yes |

**Render props** — server hands data to client content:

```tsx
createCompositeComponent<{
  renderActions?: (data: { postId: string }) => React.ReactNode
}>((props) => (
  <article>
    <h1>{post.title}</h1>
    <footer>{props.renderActions?.({ postId: post.id })}</footer>
  </article>
))
// client:
<CompositeComponent src={src} renderActions={({ postId }) => <PostActions postId={postId} />} />
```

**Component props** — pass a reusable client component; server feeds it props:

```tsx
createCompositeComponent(({ AddToCart }: {
  AddToCart: React.ComponentType<{ productId: string; price: number }>
}) => <AddToCart productId={product.id} price={product.price} />)
// client:
<CompositeComponent src={src} AddToCart={AddToCartButton} />
```

All three can be combined; `createCompositeComponent` provides full slot type safety.

## Caching & invalidation

Server components use Router's built-in cache (key = route path + params). Use `staleTime` for freshness and `loaderDeps` for keys beyond params.

```tsx
export const Route = createFileRoute('/posts/$postId')({
  staleTime: 10_000,
  loaderDeps: ({ search }) => ({ tab: search.tab }),
  loader: async ({ params, deps }) => ({
    Post: await getPost({ data: { postId: params.postId, tab: deps.tab } }),
  }),
})
```

**TanStack Query** (this repo uses `@tanstack/react-query`): set `structuralSharing: false` — required, RSC values must not be merged.

```tsx
const postQueryOptions = (postId: string) => ({
  queryKey: ['post', postId],
  structuralSharing: false,
  queryFn: () => getPost({ data: { postId } }),
})
```

**Refetch after a mutation:** `router.invalidate()` re-runs the loader (and the RSC).

## Combine with Selective SSR

Pair RSC with Selective SSR when you need server-fetched content but client-only rendering:

- `ssr: 'data-only'` — server fetches the RSC, route component renders on the client (use for `window`/`localStorage`).
- `ssr: false` — loader and component both run on the client (use when the loader itself needs browser APIs).

## Error handling

- **Route level:** if the RSC fails in an awaited `loader`, the route `errorComponent` renders.
- **Component level (isolate failures):** return a Promise from the loader (don't await), then wrap with `ErrorBoundary` + `Suspense` and resolve with `React.use()`. See Deferred Loading in [reference.md](reference.md#deferred-component-loading).

## Rules & limitations

- **Slots are opaque on the server.** `React.Children.map()` / `cloneElement()` don't work on `props.children`. Use render props to pass data instead.
- **Render-prop / component-prop args must be serializable** (Flight protocol): strings, numbers, booleans, null, plain objects, arrays. Primitives, Dates, and React elements work; custom serialization isn't available yet.

## Tips

- `React.cache(fn)` gives request-scoped memoization shared across server components.
- TanStack Router's `<Link>` works inside server components (serialized, hydrates client-side).
- CSS Modules and global CSS imports work in server components (styles extracted to client).

## Advanced patterns & low-level APIs

For parallel/bundled components, deferred loading, `Suspense` inside RSC, async-generator streaming, and the low-level Flight stream APIs (`renderToReadableStream`, `createFromFetch`, `createFromReadableStream`), see [reference.md](reference.md).

## Verify

```bash
pnpm test:types
pnpm build
```
