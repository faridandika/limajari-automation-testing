# Keycloak Login Automation Testing

Automation testing for Keycloak login using Playwright with Page Object Model pattern.

## 🚀 Features

- **Page Object Model (POM)** pattern for maintainable test code
- **4 Positive Test Cases** covering complete login scenarios
- **Cross-browser Support** (Chromium, Firefox, WebKit)
- **Allure Reporting** with detailed test reports
- **CI/CD Pipeline** with GitHub Actions
- **Scheduled Tests** every Tuesday 7AM and Friday 12PM UTC
- **Environment Configuration** with `.env` support
- **MCP Integration** with Playwright MCP Server
- **CLINE Integration** with MCP server configuration

## 📁 Project Structure

```
keycloak-automation-testing/
├── .github/workflows/
│   └── ci.yml                     # GitHub Actions workflow
├── tests/
│   ├── fixtures/
│   │   └── testFixtures.js       # Test fixtures and data
│   ├── pages/
│   │   └── KeycloakLoginPage.js  # Page Object for Keycloak
│   └── keycloak-login-positive.spec.js  # Test cases
├── utils/
│   └── testHelpers.js            # Utility functions
├── .env.example                  # Environment variables template
├── .gitignore                   # Git ignore rules
├── mcp-config.json              # MCP server configuration (VS Code)
├── mcp-server.json             # MCP server config (alternative)
├── cline-mcp-config.json        # CLINE MCP configuration
├── package.json                  # Dependencies and scripts
├── playwright.config.js          # Playwright configuration
└── README.md                     # This file
```

## 🛠️ Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- VS Code (recommended for MCP integration)
- CLINE (for enhanced AI-powered development)

### Setup Steps

```bash
# Clone the repository
git clone https://github.com/farid-again/playwright-test-automation-limajariUI.git
cd keycloak-automation-testing

# Install dependencies
npm install

# Install Playwright browsers
npm run install:browsers

# Copy environment variables template
cp .env.example .env

# Edit .env file with your credentials
nano .env  # or use your preferred editor
```

## 🤖 MCP Integration Setup

### For VS Code Users

#### 1. Install MCP Packages
```bash
# MCP packages are already installed
npm list | grep mcp
```

#### 2. VS Code Configuration
Add to your VS Code settings (`settings.json`):

```json
{
  "mcp.servers": [
    {
      "name": "playwright",
      "command": "npx",
      "args": ["playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_BROWSER": "chromium"
      }
    },
    {
      "name": "filesystem",
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/obo/Desktop/keycloak-automation-testing"]
    }
  ]
}
```

### For CLINE Users

#### 1. Use CLINE MCP Configuration
Copy the `cline-mcp-config.json` file to your CLINE configuration directory:

```bash
# The configuration file is already created
cat cline-mcp-config.json

# CLINE will automatically detect and use this configuration
# Place it in your CLINE settings directory
```

#### 2. Available MCP Tools in CLINE
- **Playwright MCP Server**: Browser automation capabilities
- **Filesystem MCP**: Project file access
- **Inspector MCP**: Debug and monitoring tools

#### 3. CLINE MCP Features
- **AI-Powered Testing**: Natural language test creation
- **Code Generation**: Automated test code generation
- **Debug Assistance**: AI-powered debugging help
- **Test Execution**: Run tests via natural language commands

## 🧪 Running Tests

### Local Testing

```bash
# Run all tests
npm test

# Run specific browser
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run with visible browser
npm run test:headed

# Run in debug mode
npm run test:debug

# Run with UI mode
npm run test:ui

# Run with custom timeout
npm run test:timeout
```

### Environment-Specific Testing

```bash
# Development (default)
npm test

# Production environment
NODE_ENV=production npm test

# Staging environment
NODE_ENV=staging npm test
```

### Allure Reporting

```bash
# Run tests with Allure reporter
npm run test:allure

# Generate Allure report
npm run allure:generate

# Open Allure report
npm run allure:open

# Clean Allure results
npm run allure:clean
```

### MCP-Enhanced Testing

#### With VS Code + MCP
```bash
# Use MCP to interact with tests
npx playwright-mcp-server

# Access filesystem via MCP
npx @modelcontextprotocol/server-filesystem /path/to/project

# Inspect MCP connections
mcp-inspector
```

#### With CLINE + MCP
```bash
# CLINE automatically detects cline-mcp-config.json
# No additional setup required

# Use natural language to run tests
# Example: "Run the Keycloak login tests in Chrome"

# Generate test code via AI
# Example: "Create a new test case for password validation"

# Debug with AI assistance
# Example: "Help me debug the failing test case"
```

## 📊 CI/CD Pipeline

### GitHub Actions Schedule

The automation tests are configured to run automatically:

- **Every Tuesday at 7:00 AM UTC** (2:00 PM WIB)
- **Every Friday at 12:00 PM UTC** (7:00 PM WIB)
- **Manual trigger** available via GitHub Actions UI
- **Push/PR triggers** for main and develop branches

### Test Matrix

Tests run across multiple browsers:
- **Chromium** (Desktop Chrome)
- **Firefox** (Desktop Firefox)
- **WebKit** (Desktop Safari)

### Artifacts

- **Allure Reports** - Detailed test reports with history
- **Test Results** - JSON results and screenshots
- **Video Recordings** - Test execution videos on failure
- **MCP Logs** - MCP server interaction logs

## 🧪 Test Cases

### TC001 - Successful Login with Valid Credentials
✅ Verifies complete authentication flow
- Navigate to Keycloak login page
- Fill valid credentials
- Submit login form
- Verify successful redirect

### TC002 - Verify Login Page Accessibility and Elements
✅ Tests page structure and form elements
- Verify page loads correctly
- Check all form elements are visible and enabled
- Validate form field accessibility

### TC003 - Login Flow with Form Validation
✅ Tests form interaction and validation
- Clear and refill form fields
- Submit login with correct credentials
- Verify login progression

### TC004 - Complete End-to-End Authentication Flow
✅ Uses authenticatedPage fixture for pre-authenticated session
- Verifies authenticated session state
- Tests post-login page accessibility

## 🔧 Configuration

### Environment Variables

#### Required Variables
```bash
# Test Credentials
KEYCLOAK_USERNAME=devonebyone
KEYCLOAK_PASSWORD=Qq121212
KEYCLOAK_URL=https://keycloak-dev.logistical.one/realms/lq/protocol/openid-connect/auth?client_id=loglines-fe&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F%23%2Flogin%3F&state=66f1cf3b-ee9f-41da-a5a1-8f2423bbbdb2&response_mode=fragment&response_type=code&scope=openid&nonce=baca162c-a37e-4573-8ed9-49a37503f2c1&code_challenge=q5Z1up1GgLRkmIqcjHRSreZgdURHQ72I2ti_k5pyQhI&code_challenge_method=S256
```

#### Optional Variables
```bash
# Application Configuration
BASE_URL=http://localhost:3000
APP_URL=http://localhost:3000

# Test Configuration
TEST_TIMEOUT=30000
RETRY_COUNT=2
PARALLEL_WORKERS=4

# Browser Configuration
DEFAULT_BROWSER=chromium
HEADED_MODE=false
DEBUG_MODE=false

# Reporting Configuration
ALLURE_RESULTS_DIR=allure-results
ALLURE_REPORT_DIR=allure-report
PLAYWRIGHT_REPORT_DIR=playwright-report

# MCP Configuration
PLAYWRIGHT_HEADLESS=true
PLAYWRIGHT_BROWSER=chromium
MCP_FILESYSTEM_PATH=/Users/obo/Desktop/keycloak-automation-testing
```

#### Environment-Specific Overrides
```bash
# Production overrides
PROD_KEYCLOAK_USERNAME=prod_username
PROD_KEYCLOAK_PASSWORD=prod_password

# Staging overrides
STAGING_KEYCLOAK_URL=staging_keycloak_url
```

### MCP Configuration

The project includes multiple MCP server configuration files:

#### VS Code Configuration (mcp-config.json)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_BROWSER": "chromium"
      },
      "description": "Playwright MCP Server for browser automation and testing"
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/obo/Desktop/keycloak-automation-testing"],
      "description": "Filesystem access for the keycloak automation testing project"
    },
    "inspector": {
      "command": "mcp-inspector",
      "description": "MCP Inspector for debugging and monitoring MCP connections"
    }
  }
}
```

#### CLINE Configuration (cline-mcp-config.json)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true",
        "PLAYWRIGHT_BROWSER": "chromium"
      },
      "description": "Playwright MCP Server for browser automation and testing"
    },
    "filesystem": {
      "command": "npx",
      "args": ["@modelcontextprotocol/server-filesystem", "/Users/obo/Desktop/keycloak-automation-testing"],
      "description": "Filesystem access for the keycloak automation testing project"
    },
    "inspector": {
      "command": "mcp-inspector",
      "description": "MCP Inspector for debugging and monitoring MCP connections"
    }
  }
}
```

#### Alternative Configuration (mcp-server.json)
```json
{
  "mcpServers": {
    "playwright": {
      "command": "npx",
      "args": ["playwright-mcp-server"],
      "env": {
        "PLAYWRIGHT_HEADLESS": "true"
      }
    }
  }
}
```

### Playwright Configuration

- **Test Directory**: `./tests`
- **Parallel Execution**: Enabled
- **Retries**: 2 (CI), 0 (local)
- **Reporters**: HTML, JSON, Allure
- **Screenshots**: On failure
- **Video**: On failure
- **Trace**: On first retry

## 📈 Allure Report Features

- **Test History**: Track test results over time
- **Detailed Logs**: Step-by-step execution details
- **Screenshots**: Visual evidence of test execution
- **Timeline**: Performance metrics and timing
- **Categories**: Group tests by functionality
- **Environment Info**: Browser and system details
- **MCP Integration**: MCP server status and interactions

## 🚀 Deployment

### GitHub Pages

Allure reports are automatically deployed to GitHub Pages when:
- Tests run on `main` branch
- Report generation is successful
- GitHub Pages is enabled in repository settings

Access reports at: `https://farid-again.github.io/playwright-test-automation-limajariUI/allure-report`

## 📝 Development

### Adding New Tests

1. Create test functions in appropriate `.spec.js` files
2. Use Page Object Model for element interactions
3. Follow naming convention: `TC### - Description`
4. Include proper assertions and error handling
5. Test across all supported browsers

### Using Fixtures

```javascript
// Use test data fixture
test.describe('New Test Suite', () => {
  test('New test case', async ({ page, testData }) => {
    // Access environment variables
    const { username, password } = testData.validCredentials;
    
    // Your test code here
  });
});

// Use authenticated page fixture
test('Authenticated test', async ({ authenticatedPage }) => {
  // Page is already authenticated
  await authenticatedPage.goto('/dashboard');
  // Your test code here
});

// Use page with timeout configuration
test('Timeout test', async ({ pageWithTimeout }) => {
  // Page has custom timeout from environment
  await pageWithTimeout.goto('/some-page');
  // Your test code here
});
```

### Page Object Model

```javascript
// Example usage
const keycloakPage = new KeycloakLoginPage(page);
await keycloakPage.navigateToLogin(authUrl);
await keycloakPage.login(username, password);
await keycloakPage.verifySuccessfulLogin();
```

### AI-Powered Development with CLINE + MCP

With CLINE integration, you can:

```bash
# Generate test cases using natural language
"Create a test case for invalid login credentials"

# Debug failing tests with AI assistance
"Help me fix the timeout issue in TC001"

# Run tests using natural commands
"Run all Keycloak tests in headed mode"

# Analyze test results
"Analyze the latest test results and suggest improvements"

# Generate page objects
"Create a page object for the user profile page"
```

## 🐛 Troubleshooting

### Common Issues

1. **Browser Installation**: Run `npm run install:browsers`
2. **Test Failures**: Check screenshots and videos in artifacts
3. **Allure Issues**: Ensure `allure-commandline` is installed globally
4. **CI Failures**: Check GitHub Actions logs and artifacts
5. **Environment Variables**: Verify `.env` file is properly configured
6. **MCP Issues**: Check MCP server configuration and VS Code/CLINE settings

### Debug Mode

```bash
# Run with debugging
npm run test:debug

# Or use VS Code debugging
npm run test:ui

# Run with visible browser for debugging
npm run test:headed

# Debug MCP server
npx playwright-mcp-server --debug
```

### Environment Issues

```bash
# Check current environment
echo $NODE_ENV

# Load specific environment file
cp .env.staging .env
npm test

# Verify environment variables are loaded
npm run test:env
```

### MCP Troubleshooting

#### VS Code Integration
```bash
# Check MCP packages
npm list | grep mcp

# Test MCP server
npx playwright-mcp-server --help

# Verify MCP configuration
cat mcp-config.json

# Check VS Code MCP integration
# Open Command Palette (Ctrl+Shift+P) and search for "MCP"
```

#### CLINE Integration
```bash
# Check CLINE MCP configuration
cat cline-mcp-config.json

# Test MCP server functionality
npx playwright-mcp-server --test

# Verify CLINE detects MCP
# CLINE should show available MCP tools automatically
```

## 📞 Support

For issues and questions:
- Check GitHub Issues
- Review test artifacts
- Consult Allure reports
- Review workflow logs
- Check MCP server documentation
- Review CLINE integration documentation

## 📄 License

ISC License - Free to use, modify, and distribute.

## 🔄 Continuous Integration

### Workflow Triggers

1. **Scheduled**: Tuesday 07:00 UTC & Friday 12:00 UTC
2. **Push**: Code pushed to `main` or `develop` branches
3. **Pull Request**: PRs targeting `main` branch
4. **Manual**: Via GitHub Actions UI

### Environment Setup

The CI/CD pipeline automatically:
- Installs dependencies
- Configures environment variables
- Runs tests across multiple browsers
- Generates Allure reports
- Uploads artifacts
- Deploys to GitHub Pages
- Integrates MCP server for enhanced debugging

### Monitoring

- **GitHub Actions Dashboard**: Monitor test execution
- **Allure Reports**: Analyze test results
- **Artifacts**: Download detailed reports
- **GitHub Pages**: View historical reports
- **MCP Inspector**: Debug MCP server interactions

## 🔧 MCP Integration Benefits

### Enhanced Development Experience
- **Direct Test Execution**: Run tests from IDE
- **File Access**: Navigate project files via MCP
- **Debug Support**: Integrated debugging capabilities
- **Automation**: Streamlined test workflow
- **AI Assistance**: Natural language test creation and debugging

### IDE Integration
- **VS Code Support**: Native MCP integration
- **CLINE Support**: AI-powered development environment
- **Command Palette**: Quick access to MCP tools
- **Real-time Feedback**: Immediate test results
- **Context Awareness**: Project-aware assistance

### Advanced Features
- **Browser Control**: MCP-driven browser automation
- **Test Management**: Organize and run tests via MCP
- **Report Generation**: Automated report creation
- **Error Analysis**: Enhanced error diagnostics
- **AI-Powered Development**: Natural language test creation and debugging
- **Multi-Environment Support**: VS Code and CLINE integration

## 🤖 CLINE + MCP Usage Examples

### Natural Language Test Creation
```
User: "Create a test for login with empty password"
CLINE: [Generates complete test case with proper assertions]
```

### AI-Powered Debugging
```
User: "The login test is failing in WebKit"
CLINE: [Analyzes failure, suggests fixes, provides code examples]
```

### Automated Test Execution
```
User: "Run all tests in Chrome with coverage reporting"
CLINE: [Executes tests with specified parameters]
```

### Intelligent Code Analysis
```
User: "Review the test suite for optimization opportunities"
CLINE: [Analyzes code, suggests improvements, provides refactored examples]
```

## 🎯 Best Practices

### Development Workflow
1. **Use Environment Variables**: Never hardcode credentials
2. **Follow POM Pattern**: Maintainable page objects
3. **Write Descriptive Tests**: Clear test names and documentation
4. **Leverage MCP Tools**: Use AI assistance for complex scenarios
5. **Test Across Browsers**: Ensure cross-browser compatibility
6. **Monitor Reports**: Regularly check Allure reports for trends

### MCP Integration Best Practices
1. **Configure Properly**: Set up MCP servers correctly
2. **Use Natural Language**: Leverage AI for test creation
3. **Debug Collaboratively**: Work with AI to solve issues
4. **Maintain Context**: Keep MCP configuration updated
5. **Secure Configuration**: Protect sensitive data in MCP settings

This project now provides a comprehensive, AI-enhanced testing environment with both traditional IDE support (VS Code) and next-generation AI assistance (CLINE)! 🚀
