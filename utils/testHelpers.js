/**
 * Utility functions for test helpers and common operations
 */

class TestHelpers {
  /**
   * Generate random test data
   */
  static generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Wait for a specific amount of time with logging
   */
  static async waitForLogging(time, message = 'Waiting...') {
    console.log(`${message} (${time}ms)`);
    await new Promise(resolve => setTimeout(resolve, time));
  }

  /**
   * Take screenshot with timestamp
   */
  static async takeScreenshot(page, testName) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${timestamp}.png`;
    await page.screenshot({ path: `tests/screenshots/${filename}`, fullPage: true });
    return filename;
  }

  /**
   * Log test information
   */
  static logTestInfo(testName, message) {
    console.log(`[${testName}] ${message}`);
  }

  /**
   * Verify URL contains expected parameters
   */
  static verifyUrlParameters(url, expectedParams) {
    const urlObj = new URL(url);
    const searchParams = urlObj.searchParams;
    
    for (const [key, value] of Object.entries(expectedParams)) {
      if (value) {
        expect(searchParams.get(key)).toBe(value);
      } else {
        expect(searchParams.has(key)).toBeTruthy();
      }
    }
  }

  /**
   * Extract auth code from URL
   */
  static extractAuthCode(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('code');
  }

  /**
   * Extract session state from URL
   */
  static extractSessionState(url) {
    const urlObj = new URL(url);
    return urlObj.searchParams.get('session_state');
  }

  /**
   * Check if URL contains authentication indicators
   */
  static hasAuthenticationIndicators(url) {
    return url.includes('code=') || 
           url.includes('session_state=') || 
           url.includes('access_token=') ||
           url.includes('id_token=');
  }
}

module.exports = { TestHelpers };
