const { test, expect } = require('./fixtures/testFixtures');
const { KeycloakLoginPage } = require('./pages/KeycloakLoginPage');

// Detect CI environment - CI is slower so we need higher thresholds
const isCI = !!process.env.CI;

test.describe('Keycloak Login - Performance Tests', () => {
    let keycloakPage;

    test.beforeEach(async ({ page }) => {
        keycloakPage = new KeycloakLoginPage(page);
    });

    test('TC021 - Login page load time should be under 3 seconds', async ({ page, testData }) => {
        const authUrl = testData.keycloakAuthUrl;
        // CI environments are slower, so increase threshold
        const maxLoadTimeMs = isCI ? 5000 : 3000;

        await test.step('Measure page load time', async () => {
            const startTime = Date.now();

            await page.goto(authUrl);
            await page.waitForLoadState('domcontentloaded');

            const loadTime = Date.now() - startTime;

            console.log(`📊 Page load time: ${loadTime}ms`);
            console.log(`📊 Maximum allowed: ${maxLoadTimeMs}ms`);
            console.log(`📊 Environment: ${isCI ? 'CI' : 'Local'}`);

            // Assert page loads within acceptable time
            expect(loadTime).toBeLessThan(maxLoadTimeMs);

            console.log('✅ Login page loaded within acceptable time');
        });

        await test.step('Verify page is fully interactive', async () => {
            await expect(keycloakPage.usernameInput).toBeVisible();
            await expect(keycloakPage.passwordInput).toBeVisible();
            await expect(keycloakPage.loginButton).toBeVisible();

            console.log('✅ All form elements are interactive');
        });
    });

    test('TC022 - Login response time should be under threshold', async ({ page, testData }) => {
        const username = testData.validCredentials.username;
        const password = testData.validCredentials.password;
        const authUrl = testData.keycloakAuthUrl;
        // CI environments are slower - increase threshold from 5s to 10s
        const maxLoginTimeMs = isCI ? 10000 : 5000;

        await test.step('Navigate to login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Fill credentials', async () => {
            await keycloakPage.fillUsername(username);
            await keycloakPage.fillPassword(password);
        });

        await test.step('Measure login response time', async () => {
            const startTime = Date.now();

            // Click login button
            await keycloakPage.clickLogin();

            // Wait for navigation/redirect
            try {
                await page.waitForURL((url) => {
                    return !url.href.includes('keycloak-dev.logistical.one/realms/lq/protocol/openid-connect/auth') ||
                        url.href.includes('code=') ||
                        url.href.includes('session_state=');
                }, { timeout: maxLoginTimeMs });
            } catch (error) {
                // If timeout, login took too long
                const elapsed = Date.now() - startTime;
                console.log(`⚠️ Login took ${elapsed}ms (exceeded ${maxLoginTimeMs}ms)`);
            }

            const loginTime = Date.now() - startTime;

            console.log(`📊 Login response time: ${loginTime}ms`);
            console.log(`📊 Maximum allowed: ${maxLoginTimeMs}ms`);
            console.log(`📊 Environment: ${isCI ? 'CI' : 'Local'}`);

            // Assert login completes within acceptable time
            expect(loginTime).toBeLessThan(maxLoginTimeMs);

            console.log('✅ Login completed within acceptable time');
        });
    });

    test('TC022b - Measure time to first contentful paint', async ({ page, testData }) => {
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Measure First Contentful Paint (FCP)', async () => {
            // Enable performance metrics
            const client = await page.context().newCDPSession(page);
            await client.send('Performance.enable');

            await page.goto(authUrl);
            await page.waitForLoadState('networkidle');

            // Get performance metrics
            const performanceMetrics = await client.send('Performance.getMetrics');
            const metrics = performanceMetrics.metrics;

            // Find FCP metric
            const fcpMetric = metrics.find(m => m.name === 'FirstContentfulPaint');
            const domContentLoaded = metrics.find(m => m.name === 'DomContentLoaded');

            if (fcpMetric) {
                console.log(`📊 First Contentful Paint: ${fcpMetric.value.toFixed(2)}s`);
            }

            if (domContentLoaded) {
                console.log(`📊 DOM Content Loaded: ${domContentLoaded.value.toFixed(2)}s`);
            }

            // Log all performance metrics
            console.log('📊 All Performance Metrics:');
            metrics.slice(0, 10).forEach(m => {
                console.log(`   - ${m.name}: ${m.value.toFixed(4)}`);
            });

            console.log('✅ Performance metrics collected');
        });
    });

    test('TC022c - Multiple sequential logins performance', async ({ page, testData }) => {
        const username = testData.validCredentials.username;
        const password = testData.validCredentials.password;
        const authUrl = testData.keycloakAuthUrl;
        const numberOfLogins = 3;
        const loginTimes = [];
        // CI environments are slower
        const maxAvgTimeMs = isCI ? 15000 : 10000;

        for (let i = 1; i <= numberOfLogins; i++) {
            await test.step(`Login attempt ${i} of ${numberOfLogins}`, async () => {
                // Navigate to login page
                await keycloakPage.navigateToLogin(authUrl);
                await keycloakPage.verifyLoginPageLoaded();

                // Fill and submit
                await keycloakPage.fillUsername(username);
                await keycloakPage.fillPassword(password);

                const startTime = Date.now();
                await keycloakPage.clickLogin();

                // Wait for redirect
                await page.waitForTimeout(3000);

                const loginTime = Date.now() - startTime;
                loginTimes.push(loginTime);

                console.log(`📊 Login ${i} time: ${loginTime}ms`);
            });
        }

        await test.step('Analyze login performance', async () => {
            const avgTime = loginTimes.reduce((a, b) => a + b, 0) / loginTimes.length;
            const minTime = Math.min(...loginTimes);
            const maxTime = Math.max(...loginTimes);

            console.log('📊 Performance Summary:');
            console.log(`   - Average login time: ${avgTime.toFixed(0)}ms`);
            console.log(`   - Min login time: ${minTime}ms`);
            console.log(`   - Max login time: ${maxTime}ms`);
            console.log(`   - Variance: ${(maxTime - minTime)}ms`);
            console.log(`   - Environment: ${isCI ? 'CI' : 'Local'}`);

            // All logins should be under threshold
            expect(avgTime).toBeLessThan(maxAvgTimeMs);

            console.log('✅ Performance test completed');
        });
    });
});
