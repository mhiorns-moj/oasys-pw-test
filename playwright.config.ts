import { defineConfig, devices } from '@playwright/test'
import { testEnvironment } from 'localSettings'

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
  workers: 1,
  timeout: 600_000,
  // maxFailures: 1,

  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['html', { open: 'never', noSnippets: false }]],

  use: {
    trace: 'on-first-retry',
    screenshot: { mode: 'on-first-failure', fullPage: true },
    headless: true,
    actionTimeout: 10_000,
    navigationTimeout: 10_000,
    launchOptions: {
      downloadsPath: './test-results/downloads',
      args: ['--disable-pdf-viewer'],
    },
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },

    },
  ],
})
