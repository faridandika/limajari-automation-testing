const { expect } = require('@playwright/test');

class KeycloakLoginPage {
  constructor(page) {
    this.page = page;

    // Locators for Keycloak login form elements
    this.usernameInput = page.locator('input[name="username"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.loginButton = page.locator('#kc-login');
    this.errorMessage = page.locator('#input-error');
    this.loginForm = page.locator('#kc-form-login');
    this.title = page.locator('.pf-c-title');
    this.socialLoginButtons = page.locator('.social-provider-button');
  }

  /**
   * Navigate to the Keycloak login page
   * @param {string} authUrl - The full Keycloak auth URL
   */
  async navigateToLogin(authUrl) {
    await this.page.goto(authUrl);
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Fill in the username field
   * @param {string} username - The username to enter
   */
  async fillUsername(username) {
    await expect(this.usernameInput).toBeVisible();
    await this.usernameInput.fill(username);
  }

  /**
   * Fill in the password field
   * @param {string} password - The password to enter
   */
  async fillPassword(password) {
    await expect(this.passwordInput).toBeVisible();
    await this.passwordInput.fill(password);
  }

  /**
   * Click the login button
   */
  async clickLogin() {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }

  /**
   * Perform complete login with username and password
   * @param {string} username - The username to enter
   * @param {string} password - The password to enter
   */
  async login(username, password) {
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickLogin();
  }

  /**
   * Verify that the login page is loaded and ready
   */
  async verifyLoginPageLoaded() {
    await expect(this.loginForm).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  /**
   * Verify that login failed with error message
   * @param {string} expectedErrorMessage - Expected error message
   */
  async verifyLoginError(expectedErrorMessage) {
    await expect(this.errorMessage).toBeVisible();
    if (expectedErrorMessage) {
      await expect(this.errorMessage).toContainText(expectedErrorMessage);
    }
  }

  /**
   * Check if an error message is displayed
   * @returns {boolean} - True if error message is visible
   */
  async hasErrorMessage() {
    try {
      return await this.errorMessage.isVisible({ timeout: 2000 });
    } catch (error) {
      // Also check for other common error selectors
      const alternativeSelectors = [
        '.alert-error',
        '.error-message',
        '[role="alert"]',
        '.kc-feedback-text'
      ];

      for (const selector of alternativeSelectors) {
        try {
          const element = this.page.locator(selector);
          if (await element.isVisible({ timeout: 500 })) {
            return true;
          }
        } catch (e) {
          continue;
        }
      }

      return false;
    }
  }

  /**
   * Get the current page title
   */
  async getPageTitle() {
    return await this.page.title();
  }

  /**
   * Wait for navigation after login (redirect to callback URL)
   * @param {number} timeout - Maximum time to wait in milliseconds
   */
  async waitForLoginRedirect(timeout = 30000) {
    await this.page.waitForNavigation({
      waitUntil: 'networkidle',
      timeout: timeout
    });
  }

  /**
   * Check if user is successfully logged in (by checking URL or page content)
   * @param {string} expectedUrlFragment - Expected fragment in the redirect URL
   */
  async verifySuccessfulLogin(expectedUrlFragment = 'localhost:3000') {
    await this.page.waitForTimeout(2000); // Wait for potential redirect
    const currentUrl = this.page.url();
    return currentUrl.includes(expectedUrlFragment);
  }

  /**
   * Clear form fields
   */
  async clearForm() {
    await this.usernameInput.clear();
    await this.passwordInput.clear();
  }

  /**
   * Get placeholder text for username field
   */
  async getUsernamePlaceholder() {
    return await this.usernameInput.getAttribute('placeholder');
  }

  /**
   * Get placeholder text for password field
   */
  async getPasswordPlaceholder() {
    return await this.passwordInput.getAttribute('placeholder');
  }
}

module.exports = { KeycloakLoginPage };
