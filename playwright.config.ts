import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: 'tests',
  testMatch: '**/*.test.ts',
  fullyParallel: false,
  timeout: 300_000,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never' }]],

  use: {
    trace: 'on-first-retry',
    screenshot: { mode: 'on-first-failure', fullPage: true },
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
  },

  /* Configure projects for major browsers */
  projects: [
    // {
    //   name: 'startup',
    //   testMatch: /global\.startup\.ts/,
    // },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      // dependencies: ['startup'],
    },
  ],
})
