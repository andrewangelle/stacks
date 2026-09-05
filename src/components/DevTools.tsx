import { TanStackDevtools } from '@tanstack/react-devtools';
import { ReactQueryDevtoolsPanel } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;

export function usePreventModalCloseOnDevToolsEvent() {
  return (event: PointerDownOutsideEvent) => {
    if (
      import.meta.env.DEV &&
      event.target instanceof Element &&
      event.target.closest('.tsqd-parent-container')
    ) {
      event.preventDefault();
    }
  };
}

export function DevTools() {
  if (import.meta.env.PROD || import.meta.env.VITE_E2E) {
    return null;
  }

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <TanStackDevtools
        config={{
          position: 'bottom-left',
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'React Query',
            render: <ReactQueryDevtoolsPanel />,
          },
        ]}
      />
    </div>
  );
}
