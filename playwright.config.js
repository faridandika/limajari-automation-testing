const { defineConfig, devices } = require('@playwright/test');

// Detect CI environment
const isCI = !!process.env.CI;

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  workers: isCI ? 1 : undefined,
  
  // Timeout settings - more generous for CI
  timeout: isCI ? 60000 : 30000,
  expect: {
    timeout: isCI ? 10000 : 5000,
  },
  
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['allure-playwright', { 
      outputFolder: 'allure-results',
      // Embed screenshots and videos directly in Allure report
      detail: true,
      suiteTitle: true,
    }],
  ],
  
  use: {
    baseURL: 'http://localhost:3000',
    
    // Trace on first retry for debugging
    trace: 'on-first-retry',
    
    // Screenshots - capture on failure and embed in report
    screenshot: 'only-on-failure',
    
    // Video - only on failure to save space, stored in test-results
    // Allure will pick these up automatically
    video: 'retain-on-failure',
    
    // Navigation timeout
    navigationTimeout: isCI ? 30000 : 15000,
    
    // Action timeout
    actionTimeout: isCI ? 15000 : 10000,
  },
  
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        // Ignore HTTPS errors for dev environments
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        ignoreHTTPSErrors: true,
      },
    },
  ],
});
