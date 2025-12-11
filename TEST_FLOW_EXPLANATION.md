# Keycloak Automation Testing - Complete Flow Explanation

## 📋 Table of Contents
1. [GitHub Actions CI/CD Workflow](#github-actions-cicd-workflow)
2. [Test Execution Flow](#test-execution-flow)
3. [Architecture Overview](#architecture-overview)
4. [Test Cases Breakdown](#test-cases-breakdown)

---

## 🔄 GitHub Actions CI/CD Workflow

### **When Tests Run Automatically**

The CI/CD pipeline is configured to run tests in these scenarios:

1. **Scheduled Runs** (Cron Jobs):
   - **Every Tuesday at 7:00 AM UTC** (2:00 PM WIB)
   - **Every Friday at 12:00 PM UTC** (7:00 PM WIB)

2. **On Code Push**:
   - When code is pushed to `main` or `develop` branches

3. **On Pull Requests**:
   - When a PR is created targeting the `main` branch

4. **Manual Trigger**:
   - Can be manually triggered from GitHub Actions UI (`workflow_dispatch`)

### **Workflow Structure**

The workflow consists of **2 main jobs**:

#### **Job 1: Test Execution** (`test`)

```
┌─────────────────────────────────────────────────────────┐
│  Test Job (Runs in parallel for each browser)         │
├─────────────────────────────────────────────────────────┤
│  1. Checkout code from repository                      │
│  2. Setup Node.js 18 with npm cache                    │
│  3. Install dependencies (npm ci)                      │
│  4. Install Playwright browsers                        │
│  5. Install Allure commandline                        │
│  6. Run tests for specific browser                     │
│     - Chromium, Firefox, or WebKit                     │
│     - Generates JSON results                          │
│  7. Generate Allure Report                            │
│  8. Upload artifacts:                                  │
│     - Allure reports                                  │
│     - Test results                                    │
│     - Screenshots (on failure)                         │
└─────────────────────────────────────────────────────────┘
```

**Browser Matrix Strategy:**
- Tests run in **parallel** across 3 browsers
- Each browser gets its own GitHub Actions runner
- Results are collected separately per browser

#### **Job 2: Report Aggregation** (`report`)

```
┌─────────────────────────────────────────────────────────┐
│  Report Job (Runs after all test jobs complete)        │
├─────────────────────────────────────────────────────────┤
│  1. Checkout code                                      │
│  2. Download all artifacts from test jobs             │
│  3. Setup Node.js                                      │
│  4. Install Allure                                     │
│  5. Combine all browser test results                   │
│  6. Generate combined Allure report                    │
│  7. Deploy to GitHub Pages (if on main branch)         │
└─────────────────────────────────────────────────────────┘
```

**GitHub Pages Deployment:**
- Combined Allure report is published to GitHub Pages
- Accessible at: `https://farid-again.github.io/playwright-test-automation-limajariUI/allure-report`
- Only deploys when running on `main` branch

---

## 🧪 Test Execution Flow

### **Complete Test Flow Diagram**

```
┌─────────────────────────────────────────────────────────────────┐
│                    TEST EXECUTION FLOW                         │
└─────────────────────────────────────────────────────────────────┘

1. INITIALIZATION
   ├─ Load environment variables (.env)
   ├─ Initialize Playwright test framework
   ├─ Setup custom fixtures (testFixtures.js)
   └─ Configure test data from environment

2. TEST SUITE SETUP
   ├─ Create KeycloakLoginPage instance (Page Object Model)
   └─ Setup before each test (beforeEach hook)

3. TEST EXECUTION (4 Test Cases × 3 Browsers = 12 Tests)
   │
   ├─ TC001: Successful Login with Valid Credentials
   │   ├─ Navigate to Keycloak login page
   │   ├─ Verify page elements are visible
   │   ├─ Fill username and password
   │   ├─ Verify credentials entered correctly
   │   ├─ Click login button
   │   ├─ Wait for redirect
   │   └─ Verify successful login (check URL)
   │
   ├─ TC002: Verify Login Page Accessibility
   │   ├─ Navigate to login page
   │   ├─ Verify page loads correctly
   │   ├─ Check form elements visibility
   │   └─ Verify form fields are enabled
   │
   ├─ TC003: Login Flow with Form Validation
   │   ├─ Navigate to login page
   │   ├─ Fill with dummy data
   │   ├─ Clear form
   │   ├─ Fill with correct credentials
   │   ├─ Submit form
   │   └─ Verify login progression
   │
   └─ TC004: Complete E2E Authentication Flow
       ├─ Use authenticatedPage fixture (auto-login)
       ├─ Verify authenticated session
       └─ Verify page accessibility after login

4. REPORTING
   ├─ Generate Playwright HTML report
   ├─ Generate Allure results (JSON)
   ├─ Capture screenshots (on failure)
   ├─ Record videos (on failure)
   └─ Generate trace files (on retry)

5. ARTIFACTS
   ├─ Playwright Report: playwright-report/index.html
   ├─ Allure Results: allure-results/*.json
   ├─ Test Results: test-results/results.json
   └─ Screenshots/Videos: test-results/*/
```

### **Detailed Step-by-Step Flow**

#### **Step 1: Environment Setup**
```javascript
// testFixtures.js loads:
- KEYCLOAK_USERNAME from .env
- KEYCLOAK_PASSWORD from .env
- KEYCLOAK_URL from .env
- Other configuration values
```

#### **Step 2: Test Data Preparation**
```javascript
// testFixtures.js creates testData object:
{
  validCredentials: { username, password },
  keycloakAuthUrl: "https://keycloak-dev.logistical.one/...",
  appUrl: "http://localhost:3000",
  // ... other config
}
```

#### **Step 3: Page Object Model Initialization**
```javascript
// Before each test:
keycloakPage = new KeycloakLoginPage(page)
// This creates locators for:
// - usernameInput
// - passwordInput
// - loginButton
// - loginForm
// etc.
```

#### **Step 4: Test Execution (Example: TC001)**

```
┌──────────────────────────────────────────────┐
│ TC001: Successful Login Flow                 │
├──────────────────────────────────────────────┤
│ Step 1: Navigate to Keycloak                 │
│   → page.goto(authUrl)                       │
│   → waitForLoadState('networkidle')          │
│                                              │
│ Step 2: Verify Page Loaded                   │
│   → Check loginForm is visible               │
│   → Check usernameInput is visible           │
│   → Check passwordInput is visible           │
│   → Check loginButton is visible             │
│                                              │
│ Step 3: Fill Credentials                      │
│   → Fill username field                      │
│   → Fill password field                      │
│                                              │
│ Step 4: Verify Input                          │
│   → Assert usernameInput has value           │
│   → Assert passwordInput has value           │
│                                              │
│ Step 5: Submit Form                           │
│   → Click login button                       │
│                                              │
│ Step 6: Wait for Redirect                    │
│   → Wait for navigation (30s timeout)       │
│                                              │
│ Step 7: Verify Success                        │
│   → Check URL contains 'localhost:3000'      │
│   → Check URL doesn't contain Keycloak URL  │
│   → Check for auth indicators (code=, etc.)  │
└──────────────────────────────────────────────┘
```

#### **Step 5: Authentication Flow (OAuth2/OpenID Connect)**

```
User Flow:
1. Navigate to Keycloak Auth URL
   └─ Contains: client_id, redirect_uri, state, nonce, etc.

2. Keycloak Login Page
   ├─ User enters credentials
   └─ Submits form

3. Keycloak Authentication
   ├─ Validates credentials
   ├─ Creates session
   └─ Generates authorization code

4. Redirect to Callback URL
   ├─ URL: http://localhost:3000/#/login?
   ├─ Contains: code=..., session_state=...
   └─ Application receives auth code

5. Application Processes
   └─ Exchanges code for tokens (not tested here)
```

---

## 🏗️ Architecture Overview

### **Project Structure**

```
keycloak-automation-testing/
│
├── .github/workflows/
│   └── ci.yml                    # GitHub Actions workflow
│
├── tests/
│   ├── fixtures/
│   │   └── testFixtures.js       # Custom fixtures & test data
│   ├── pages/
│   │   └── KeycloakLoginPage.js  # Page Object Model
│   └── keycloak-login-positive.spec.js  # Test cases
│
├── playwright.config.js          # Playwright configuration
├── package.json                  # Dependencies & scripts
└── .env                          # Environment variables
```

### **Key Components**

#### **1. Page Object Model (POM)**
- **Purpose**: Encapsulates page interactions
- **File**: `tests/pages/KeycloakLoginPage.js`
- **Benefits**: 
  - Reusable page interactions
  - Easy maintenance
  - Separation of concerns

#### **2. Custom Fixtures**
- **Purpose**: Provides test data and pre-authenticated pages
- **File**: `tests/fixtures/testFixtures.js`
- **Features**:
  - `testData`: Environment-based test data
  - `authenticatedPage`: Pre-logged-in page fixture
  - `pageWithTimeout`: Custom timeout configuration

#### **3. Test Configuration**
- **File**: `playwright.config.js`
- **Settings**:
  - 3 browser projects (Chromium, Firefox, WebKit)
  - Parallel execution (4 workers locally, 1 in CI)
  - Retries: 2 in CI, 0 locally
  - Reporters: HTML, JSON, Allure
  - Screenshots on failure
  - Videos on failure

---

## 📊 Test Cases Breakdown

### **TC001: Successful Login with Valid Credentials**
- **Purpose**: Verify complete authentication flow
- **Steps**: 7 detailed steps
- **Validates**: 
  - Page navigation
  - Form interaction
  - Successful authentication
  - Redirect handling

### **TC002: Verify Login Page Accessibility**
- **Purpose**: Test page structure and accessibility
- **Steps**: 3 steps
- **Validates**:
  - Page loads correctly
  - All form elements visible
  - Form fields are enabled

### **TC003: Login Flow with Form Validation**
- **Purpose**: Test form interaction and validation
- **Steps**: 4 steps
- **Validates**:
  - Form clearing functionality
  - Form refilling
  - Login progression

### **TC004: Complete End-to-End Authentication Flow**
- **Purpose**: Test using authenticated fixture
- **Steps**: 2 steps
- **Validates**:
  - Pre-authenticated session
  - Post-login page accessibility
- **Special**: Uses `authenticatedPage` fixture (auto-login)

---

## 🔍 How It All Works Together

### **Local Execution Flow**

```bash
npm test
  ↓
Playwright reads playwright.config.js
  ↓
Loads testFixtures.js (custom fixtures)
  ↓
Runs tests in parallel (4 workers)
  ↓
For each test:
  - Creates browser instance
  - Initializes KeycloakLoginPage
  - Executes test steps
  - Captures results
  ↓
Generates reports:
  - HTML report → playwright-report/
  - Allure results → allure-results/
  - JSON results → test-results/
```

### **CI/CD Execution Flow**

```bash
GitHub Actions Trigger
  ↓
Checkout code
  ↓
Setup Node.js & Install dependencies
  ↓
Install Playwright browsers
  ↓
Run tests (3 parallel jobs for 3 browsers)
  ↓
Each browser job:
  - Runs tests
  - Generates Allure results
  - Uploads artifacts
  ↓
Report aggregation job:
  - Downloads all artifacts
  - Combines results
  - Generates combined Allure report
  - Deploys to GitHub Pages
```

---

## 📈 Reporting & Artifacts

### **Generated Reports**

1. **Playwright HTML Report**
   - Location: `playwright-report/index.html`
   - View: `npm run test:report`
   - Contains: Test results, timelines, traces

2. **Allure Report**
   - Location: `allure-report/` (generated)
   - View: `npm run allure:open`
   - Contains: Detailed test history, trends, attachments

3. **JSON Results**
   - Location: `test-results/results.json`
   - Purpose: Machine-readable test results

### **Artifacts in CI/CD**

- **Allure Reports**: Per browser and combined
- **Test Results**: JSON files, screenshots, videos
- **Screenshots**: Only on test failures
- **Videos**: Only on test failures
- **Retention**: 30 days (reports), 7 days (screenshots)

---

## 🎯 Key Features

1. **Cross-Browser Testing**: Tests run on Chromium, Firefox, WebKit
2. **Parallel Execution**: Tests run in parallel for speed
3. **Retry Logic**: Failed tests retry 2 times in CI
4. **Comprehensive Reporting**: HTML, JSON, and Allure reports
5. **Artifact Collection**: Screenshots and videos on failure
6. **Scheduled Testing**: Automated runs on schedule
7. **GitHub Pages Integration**: Reports published automatically

---

## 🔧 Configuration Points

### **Environment Variables** (`.env`)
- `KEYCLOAK_USERNAME`: Login username
- `KEYCLOAK_PASSWORD`: Login password
- `KEYCLOAK_URL`: Full Keycloak authentication URL
- `APP_URL`: Application base URL
- `TEST_TIMEOUT`: Test timeout in milliseconds

### **Playwright Config**
- `testDir`: `./tests`
- `fullyParallel`: `true`
- `retries`: `2` (CI) or `0` (local)
- `workers`: `1` (CI) or `4` (local)

### **CI/CD Config**
- Node.js version: `18`
- Browser matrix: `[chromium, firefox, webkit]`
- Allure retention: `30 days`
- Screenshot retention: `7 days`

---

This is a complete, production-ready test automation framework with CI/CD integration! 🚀





