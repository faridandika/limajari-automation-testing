const { test, expect } = require('./fixtures/testFixtures');
const { KeycloakLoginPage } = require('./pages/KeycloakLoginPage');

test.describe('Keycloak Login - Positive Flow', () => {
  let keycloakPage;

  test.beforeEach(async ({ page }) => {
    keycloakPage = new KeycloakLoginPage(page);
  });

  test('TC001 - Successful login with valid credentials', async ({ page, testData }) => {
    // Test Data
    const username = testData.validCredentials.username;
    const password = testData.validCredentials.password;
    const authUrl = testData.keycloakAuthUrl;

    // Step 1: Navigate to Keycloak login page
    await test.step('Navigate to Keycloak login page', async () => {
      await keycloakPage.navigateToLogin(authUrl);
      await keycloakPage.verifyLoginPageLoaded();
    });

    // Step 2: Verify page elements are present
    await test.step('Verify login form elements are visible', async () => {
      await expect(keycloakPage.usernameInput).toBeVisible();
      await expect(keycloakPage.passwordInput).toBeVisible();
      await expect(keycloakPage.loginButton).toBeVisible();
    });

    // Step 3: Fill in credentials
    await test.step('Enter valid username and password', async () => {
      await keycloakPage.fillUsername(username);
      await keycloakPage.fillPassword(password);
    });

    // Step 4: Verify credentials are filled correctly
    await test.step('Verify credentials are entered correctly', async () => {
      await expect(keycloakPage.usernameInput).toHaveValue(username);
      await expect(keycloakPage.passwordInput).toHaveValue(password);
    });

    // Step 5: Click login button
    await test.step('Click login button', async () => {
      await keycloakPage.clickLogin();
    });

    // Step 6: Wait for login redirect
    await test.step('Wait for successful login redirect', async () => {
      try {
        await keycloakPage.waitForLoginRedirect(30000);
      } catch (error) {
        console.log('Login redirect timeout, checking current state...');
      }
    });

    // Step 7: Verify successful login
    await test.step('Verify successful login', async () => {
      await page.waitForTimeout(3000); // Wait for potential redirect
      
      const currentUrl = page.url();
      console.log('Current URL after login:', currentUrl);
      
      // Check if we've been redirected to expected callback URL
      // This might vary based on the actual application flow
      const isLoggedIn = await keycloakPage.verifySuccessfulLogin('localhost:3000');
      
      // Additional verification - check if we're no longer on the login page
      const isNoLongerOnLoginPage = !currentUrl.includes('keycloak-dev.logistical.one') || 
                                   currentUrl.includes('code=') || 
                                   currentUrl.includes('session_state=');
      
      expect(isNoLongerOnLoginPage).toBeTruthy();
      
      console.log('Login successful - redirected from Keycloak');
    });
  });

  test('TC002 - Verify login page accessibility and elements', async ({ testData }) => {
    const authUrl = testData.keycloakAuthUrl;

    await test.step('Navigate and verify page load', async () => {
      await keycloakPage.navigateToLogin(authUrl);
      await keycloakPage.verifyLoginPageLoaded();
    });

    await test.step('Verify page title and form elements', async () => {
      const pageTitle = await keycloakPage.getPageTitle();
      expect(pageTitle).toBeTruthy();
      
      await expect(keycloakPage.loginForm).toBeVisible();
      await expect(keycloakPage.usernameInput).toBeVisible();
      await expect(keycloakPage.passwordInput).toBeVisible();
      await expect(keycloakPage.loginButton).toBeVisible();
    });

    await test.step('Verify form field accessibility', async () => {
      // Check that form fields are accessible and can be interacted with
      await expect(keycloakPage.usernameInput).toBeEnabled();
      await expect(keycloakPage.passwordInput).toBeEnabled();
      await expect(keycloakPage.loginButton).toBeEnabled();
      
      console.log('✅ Form fields are accessible and enabled');
    });
  });

  test('TC003 - Login flow with form validation', async ({ page, testData }) => {
    const username = testData.validCredentials.username;
    const password = testData.validCredentials.password;
    const authUrl = testData.keycloakAuthUrl;

    await test.step('Navigate to login page', async () => {
      await keycloakPage.navigateToLogin(authUrl);
      await keycloakPage.verifyLoginPageLoaded();
    });

    await test.step('Test form clearing and refilling', async () => {
      // Fill with dummy data first
      await keycloakPage.fillUsername('testuser');
      await keycloakPage.fillPassword('testpass');
      
      // Clear form
      await keycloakPage.clearForm();
      
      // Verify fields are empty
      await expect(keycloakPage.usernameInput).toBeEmpty();
      await expect(keycloakPage.passwordInput).toBeEmpty();
      
      // Fill with correct credentials
      await keycloakPage.fillUsername(username);
      await keycloakPage.fillPassword(password);
    });

    await test.step('Submit login form', async () => {
      await keycloakPage.clickLogin();
    });

    await test.step('Verify login progression', async () => {
      await page.waitForTimeout(2000);
      
      // Check that we've moved away from the login form
      const currentUrl = page.url();
      const hasProgressed = currentUrl.includes('code=') || 
                           currentUrl.includes('session_state=') || 
                           !currentUrl.includes('keycloak-dev.logistical.one');
      
      expect(hasProgressed).toBeTruthy();
    });
  });

  test('TC004 - Complete end-to-end authentication flow', async ({ authenticatedPage, testData }) => {
    // This test uses the authenticatedPage fixture which performs login automatically
    await test.step('Verify authenticated session', async () => {
      const currentUrl = authenticatedPage.url();
      console.log('Authenticated page URL:', currentUrl);
      
      // Verify we're not on the login page anymore
      expect(currentUrl).not.toContain('keycloak-dev.logistical.one/realms/lq/protocol/openid-connect/auth');
      
      // Check for authentication indicators in URL or page content
      const hasAuthIndicators = currentUrl.includes('code=') || 
                               currentUrl.includes('session_state=') ||
                               currentUrl.includes('localhost:3000');
      
      expect(hasAuthIndicators).toBeTruthy();
    });

    await test.step('Verify page accessibility after login', async () => {
      // The page should be accessible after successful authentication
      await expect(authenticatedPage).toHaveTitle(/.+/); // Page should have some title
    });
  });
});
