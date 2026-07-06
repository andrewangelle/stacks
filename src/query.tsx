import {
  defaultShouldDehydrateQuery,
  environmentManager,
  QueryClient,
} from '@tanstack/react-query';
import { cache } from 'react';

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60_000,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function __getQueryClient() {
  if (environmentManager.isServer()) {
    return createQueryClient();
  }

  if (!browserQueryClient) {
    browserQueryClient = createQueryClient();
  }

  return browserQueryClient;
}

export const getQueryClient = cache(() => __getQueryClient());
