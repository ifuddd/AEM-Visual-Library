# Azure Functions Setup

## Installing Azure Functions Core Tools

Azure Functions Core Tools is a **global CLI tool**, not an npm package dependency.

### ❌ WRONG (Don't do this):

```json
{
  "devDependencies": {
    "@azure/functions-core-tools": "^4.0.5382"  // This will fail!
  }
}
```

### ✅ CORRECT (Do this instead):

Install globally using npm:

```bash
npm install -g azure-functions-core-tools@4 --unsafe-perm true
```

Or using other package managers:

**Windows (using Chocolatey):**
```bash
choco install azure-functions-core-tools-4
```

**Mac (using Homebrew):**
```bash
brew tap azure/functions
brew install azure-functions-core-tools@4
```

**Linux (using APT):**
```bash
wget -q https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb
sudo dpkg -i packages-microsoft-prod.deb
sudo apt-get update
sudo apt-get install azure-functions-core-tools-4
```

## Running the Sync Service

After installing Azure Functions Core Tools globally:

```bash
cd sync-service
npm install
npm run dev
```

The `func` CLI will be available globally on your system.

## Why This Error Occurred

The package `@azure/functions-core-tools` was incorrectly listed in `package.json` as a devDependency. This caused npm install failures because:

1. It's not available as a regular npm package in the registry
2. It's meant to be installed globally as a CLI tool
3. It caused workspace-level npm install failures for the entire monorepo

**Fixed in commit:** Removed `@azure/functions-core-tools` from sync-service/package.json

## References

- [Azure Functions Core Tools Documentation](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- [Installation Guide](https://github.com/Azure/azure-functions-core-tools)
