import { chromium, request as playwrightRequest } from '@playwright/test';
import { resetDb } from './helpers/resetDb';
import { seedBoard, seedCard } from './helpers/seed';

const BASE_URL = 'http://localhost:3100';

// Vite's SSR/RSC module graph throws once per route on that route's very
// first real render in dev mode ("Cannot read properties of null (reading
// 'useContext')" — a cold-start chunk race, not app or test flakiness).
// Absorb that hit here, against throwaway data, before the real suite
// starts timing individual tests against a 60s budget.
export default async function globalSetup() {
  const requestContext = await playwrightRequest.newContext({
    baseURL: BASE_URL,
  });

  await resetDb(requestContext);
  const board = await seedBoard(requestContext, 'Warmup Board');
  const { card } = await seedCard(requestContext, {
    boardId: board.id,
    listTitle: 'Warmup List',
    cardTitle: 'Warmup Card',
  });

  const routes = [
    '/boards',
    `/board/${board.id}`,
    `/board/${board.id}/card/${card.id}`,
  ];

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL: BASE_URL });

  for (const route of routes) {
    try {
      await page.goto(route, { timeout: 45_000 });
    } catch {
      // expected on the first hit; the second pass below confirms recovery
    }
  }

  for (const route of routes) {
    await page.goto(route, { timeout: 45_000 });
  }

  await browser.close();
  await resetDb(requestContext);
  await requestContext.dispose();
}
