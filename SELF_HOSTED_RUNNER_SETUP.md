# Self-Hosted GitHub Actions Runner Setup Guide

This guide helps you set up a self-hosted GitHub Actions runner on your Mac device.

## 🚀 Quick Setup (5 minutes)

### Step 1: Go to GitHub Runner Settings

1. Open your browser and go to:
   ```
   https://github.com/farid-again/playwright-test-automation-limajariUI/settings/actions/runners
   ```

2. Click **"New self-hosted runner"**

3. Select:
   - **Operating System**: macOS
   - **Architecture**: x64 (or ARM64 if you have Apple Silicon M1/M2/M3)

### Step 2: Download and Configure Runner

GitHub will show you commands to copy. Run them in Terminal:

```bash
# Create a folder for the runner
mkdir -p ~/actions-runner && cd ~/actions-runner

# Download the runner (GitHub will show you the exact version)
curl -o actions-runner-osx-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-osx-x64-2.311.0.tar.gz

# Extract the installer
tar xzf ./actions-runner-osx-x64-2.311.0.tar.gz
```

> ⚠️ **Note**: Use the exact download URL shown on GitHub - it may be different!

### Step 3: Configure the Runner

```bash
# Configure the runner (GitHub will give you the exact token)
./config.sh --url https://github.com/farid-again/playwright-test-automation-limajariUI --token YOUR_TOKEN_HERE
```

When prompted:
- **Runner group**: Press Enter for default
- **Runner name**: Press Enter or type a custom name like `macbook-runner`
- **Labels**: Press Enter for default (or add `macos`)
- **Work folder**: Press Enter for default

### Step 4: Start the Runner

```bash
# Run interactively (for testing)
./run.sh

# OR install as a service (recommended for long-term use)
./svc.sh install
./svc.sh start
```

## 🔧 Runner Service Commands

```bash
# Check status
./svc.sh status

# Start the service
./svc.sh start

# Stop the service
./svc.sh stop

# Uninstall the service
./svc.sh uninstall
```

## ✅ Verify Setup

1. Go to: https://github.com/farid-again/playwright-test-automation-limajariUI/settings/actions/runners
2. You should see your runner listed with a **green "Idle"** status
3. Trigger a workflow manually to test it

## 🔄 Triggering Workflows

After setup, you can trigger workflows:

1. **Manual trigger**:
   - Go to Actions tab in your repository
   - Select "Keycloak Automation Tests"
   - Click "Run workflow"

2. **Push to main/develop**:
   - Any push to main or develop branch will trigger the workflow

## 📋 Prerequisites on Your Mac

Make sure these are installed:

```bash
# Check Node.js (required)
node --version  # Should be v18+

# Install Node.js if needed
brew install node@18

# Check Git
git --version

# Playwright browsers will be installed automatically by the workflow
```

## 🐛 Troubleshooting

### Runner not connecting
```bash
# Check if runner process is running
ps aux | grep Runner

# Restart the service
cd ~/actions-runner
./svc.sh stop
./svc.sh start
```

### Permission issues
```bash
# Give execute permissions
chmod +x *.sh
```

### Browser issues with Playwright
```bash
# Install browsers manually
cd ~/Desktop/keycloak-automation-testing
npx playwright install chromium
```

## 🔐 Security Notes

- The runner only processes jobs from your repository
- Keep your Mac secure as the runner has access to your system
- Consider using a dedicated user account for the runner

## 📁 Files Modified

- `.github/workflows/ci.yml` - Updated to use `self-hosted` runners instead of `ubuntu-latest`

## 💡 Benefits of Self-Hosted Runners

| Benefit | Description |
|---------|-------------|
| **Free** | No billing for Actions minutes |
| **Faster** | Uses your local machine speed |
| **No limits** | No monthly minute restrictions |
| **Persistent** | Cached dependencies stay available |
| **Custom software** | Pre-install any tools you need |

---

📌 **Need Help?** Check the [GitHub Self-Hosted Runner Documentation](https://docs.github.com/en/actions/hosting-your-own-runners)
