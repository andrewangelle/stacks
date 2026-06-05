import type { APIRequestContext } from '@playwright/test';

export async function resetDb(request: APIRequestContext) {
  const response = await request.post('/__test/reset');
  if (!response.ok()) {
    throw new Error(`Failed to reset test database: ${response.status()}`);
  }
}
