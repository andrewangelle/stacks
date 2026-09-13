import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  tsconfig: './tests/tsconfig.json',
  globalSetup: './tests/global-setup.ts',
  fullyParallel: false,   // Shared local Postgres via dev:e2e — one worker avoids cross-test races.
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 1,
  reporter: process.env.CI ? [['blob'], ['list']] : [['list'], ['html', { open: 'never' }]],
  timeout: process.env.CI ? 60_000 : 30_000,
  expect: { timeout: process.env.CI ? 10_000 : 5_000 },
  use: {
    baseURL: 'http://localhost:3100',
    trace: 'on-first-retry',
    video: 'on',
  },
  webServer: {
    command: 'pnpm test:db:setup && pnpm dev:e2e',
    url: 'http://localhost:3100/__test/health',
    reuseExistingServer: false,
    timeout: 120_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ]
}); 