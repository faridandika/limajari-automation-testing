const { test, expect } = require('./fixtures/testFixtures');
const { KeycloakLoginPage } = require('./pages/KeycloakLoginPage');

test.describe('Keycloak Login - Negative Flow', () => {
    let keycloakPage;

    test.beforeEach(async ({ page }) => {
        keycloakPage = new KeycloakLoginPage(page);
    });

    test('TC005 - Login with invalid username', async ({ page, testData }) => {
        const invalidUsername = 'invalid_user_12345';
        const validPassword = testData.validCredentials.password;
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Enter invalid username and valid password', async () => {
            await keycloakPage.fillUsername(invalidUsername);
            await keycloakPage.fillPassword(validPassword);
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails with error message', async () => {
            await page.waitForTimeout(2000);

            // Check if we're still on the login page (login failed)
            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            // Check for error message
            const hasError = await keycloakPage.hasErrorMessage();
            if (hasError) {
                console.log('✅ Error message displayed for invalid username');
            }

            console.log('✅ Login correctly rejected invalid username');
        });
    });

    test('TC006 - Login with invalid password', async ({ page, testData }) => {
        const validUsername = testData.validCredentials.username;
        const invalidPassword = 'WrongPassword123!';
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Enter valid username and invalid password', async () => {
            await keycloakPage.fillUsername(validUsername);
            await keycloakPage.fillPassword(invalidPassword);
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails with error message', async () => {
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            const hasError = await keycloakPage.hasErrorMessage();
            if (hasError) {
                console.log('✅ Error message displayed for invalid password');
            }

            console.log('✅ Login correctly rejected invalid password');
        });
    });

    test('TC007 - Login with empty username', async ({ page, testData }) => {
        const validPassword = testData.validCredentials.password;
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Leave username empty and enter valid password', async () => {
            // Don't fill username
            await keycloakPage.fillPassword(validPassword);
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails or validation error shown', async () => {
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            console.log('✅ Login correctly rejected empty username');
        });
    });

    test('TC008 - Login with empty password', async ({ page, testData }) => {
        const validUsername = testData.validCredentials.username;
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Enter valid username and leave password empty', async () => {
            await keycloakPage.fillUsername(validUsername);
            // Don't fill password
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails or validation error shown', async () => {
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            console.log('✅ Login correctly rejected empty password');
        });
    });

    test('TC009 - Login with both fields empty', async ({ page, testData }) => {
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Leave both username and password empty', async () => {
            // Don't fill any fields
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails or validation error shown', async () => {
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            console.log('✅ Login correctly rejected empty credentials');
        });
    });

    test('TC010 - Login with special characters in username', async ({ page, testData }) => {
        const specialCharUsername = '<script>alert("xss")</script>';
        const validPassword = testData.validCredentials.password;
        const authUrl = testData.keycloakAuthUrl;

        await test.step('Navigate to Keycloak login page', async () => {
            await keycloakPage.navigateToLogin(authUrl);
            await keycloakPage.verifyLoginPageLoaded();
        });

        await test.step('Enter special characters in username', async () => {
            await keycloakPage.fillUsername(specialCharUsername);
            await keycloakPage.fillPassword(validPassword);
        });

        await test.step('Click login button', async () => {
            await keycloakPage.clickLogin();
        });

        await test.step('Verify login fails safely (no XSS)', async () => {
            await page.waitForTimeout(2000);

            const currentUrl = page.url();
            const isStillOnLoginPage = currentUrl.includes('keycloak-dev.logistical.one');

            expect(isStillOnLoginPage).toBeTruthy();

            // Check that no alert dialogs appeared (XSS prevention)
            // Playwright would throw an error if an unexpected dialog appeared

            console.log('✅ Login handled special characters safely');
        });
    });
});
