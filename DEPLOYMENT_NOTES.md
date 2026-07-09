# Deployment Notes - Production Checklist

## 🚨 CRITICAL: Azure AD Setup Required for Production

The AEM Visual Portal uses **Azure Active Directory (Azure AD)** for authentication. Currently, the system runs in **development mode** with a mock authentication bypass.

### ⚠️ Development Mode (Current State)

**What's enabled:**
- ✅ Mock authentication bypass
- ✅ Automatic admin user (`dev@localhost`)
- ✅ No Azure AD configuration needed
- ✅ Works for local development

**Security Warning:**
- ❌ **DO NOT** deploy with `NODE_ENV=development`
- ❌ **DO NOT** deploy without Azure AD configured
- ❌ Anyone can access the API without authentication

### ✅ Production Mode (Required for Deployment)

Before deploying to production, you **MUST** configure Azure AD authentication.

---

## Step 1: Register Application in Azure AD

### 1.1 Create App Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: **Azure Active Directory** → **App registrations**
3. Click **"New registration"**
4. Configure:
   - **Name**: `AEM Visual Portal` (or your preferred name)
   - **Supported account types**:
     - Single tenant (recommended for internal tools)
     - Or multi-tenant if needed
   - **Redirect URI**:
     - Platform: `Single-page application (SPA)`
     - URI: `https://your-domain.com` (your production URL)
5. Click **Register**

### 1.2 Note the Application IDs

After registration, you'll see:
- **Application (client) ID** - Copy this
- **Directory (tenant) ID** - Copy this

### 1.3 Create Client Secret

1. In your app registration, go to: **Certificates & secrets**
2. Click **"New client secret"**
3. Add description: `AEM Portal Backend`
4. Choose expiration (recommend: 24 months)
5. Click **Add**
6. **⚠️ IMPORTANT**: Copy the **Value** immediately (you can't see it again!)

### 1.4 Configure API Permissions

1. Go to: **API permissions**
2. Click **"Add a permission"**
3. Select **"Microsoft Graph"**
4. Choose **"Delegated permissions"**
5. Add these permissions:
   - `User.Read` (Read user profile)
   - `email` (Read user email)
   - `openid` (Sign in)
   - `profile` (Read user profile)
6. Click **"Add permissions"**
7. Click **"Grant admin consent"** (requires admin role)

### 1.5 Configure Authentication

1. Go to: **Authentication**
2. Under **"Implicit grant and hybrid flows"**, enable:
   - ✅ **Access tokens**
   - ✅ **ID tokens**
3. Under **"Supported account types"**:
   - Choose appropriate option for your organization
4. Click **Save**

---

## Step 2: Configure Backend Environment

### 2.1 Update `.env` File

Edit `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://user:password@your-db-server:5432/aem_portal

# Server
PORT=4000
NODE_ENV=production  # 🚨 IMPORTANT: Change to production!
CORS_ORIGIN=https://your-frontend-domain.com

# Azure AD Authentication (REQUIRED)
AZURE_AD_TENANT_ID=your-tenant-id-from-step-1.2
AZURE_AD_CLIENT_ID=your-client-id-from-step-1.2
AZURE_AD_CLIENT_SECRET=your-client-secret-from-step-1.3
AZURE_AD_AUTHORITY=https://login.microsoftonline.com/your-tenant-id

# Azure DevOps (Optional - for Wiki sync)
AZURE_DEVOPS_ORG=your-organization
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_WIKI_ID=your-wiki-id
AZURE_DEVOPS_PAT=your-personal-access-token

# Azure Blob Storage (Optional - for file uploads)
AZURE_STORAGE_ACCOUNT=your-storage-account
AZURE_STORAGE_KEY=your-storage-key
AZURE_STORAGE_CONTAINER=component-assets

# JWT Secret (Generate a strong random secret!)
JWT_SECRET=generate-a-strong-random-secret-here-min-32-characters

# Logging
LOG_LEVEL=info
```

### 2.2 Generate Strong JWT Secret

```bash
# Generate a random 32-character secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output to `JWT_SECRET` in `.env`.

---

## Step 3: Configure Frontend

### 3.1 Update Frontend Configuration

Edit `frontend/src/lib/msalConfig.ts` (or create if missing):

```typescript
import { Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: 'your-client-id-from-step-1.2',
    authority: 'https://login.microsoftonline.com/your-tenant-id',
    redirectUri: 'https://your-frontend-domain.com',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};

export const loginRequest = {
  scopes: ['User.Read', 'email', 'openid', 'profile'],
};
```

### 3.2 Update Frontend Environment

Edit `frontend/.env.production`:

```bash
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

---

## Step 4: Test Before Production Deployment

### 4.1 Local Testing with Azure AD

1. Update `backend/.env`:
   ```bash
   NODE_ENV=production
   # Add Azure AD credentials
   ```

2. Restart backend:
   ```bash
   cd backend
   npm run dev
   ```

3. Try accessing API:
   ```bash
   curl http://localhost:4000/api/components
   # Should return 401 Unauthorized (good!)
   ```

4. Test with frontend:
   ```bash
   cd frontend
   npm run dev
   # Should show Azure AD login screen
   ```

### 4.2 Verify Authentication Flow

1. Open frontend in browser
2. Click login → Should redirect to Microsoft login
3. Enter credentials → Should redirect back
4. Browse components → Should work without errors

---

## Step 5: Database Setup

### 5.1 Run Migrations

```bash
cd backend
npm run prisma:migrate
```

### 5.2 Seed Initial Data (Optional)

```bash
npm run prisma:seed
```

This creates 15 example components. Remove or customize as needed.

---

## Step 6: Deploy to Production

### 6.1 Backend Deployment Checklist

- [ ] `NODE_ENV=production` in `.env`
- [ ] Azure AD credentials configured
- [ ] Strong JWT secret generated
- [ ] Database migrations run
- [ ] CORS origin set to frontend domain
- [ ] Environment variables set in hosting platform
- [ ] SSL/TLS certificate configured
- [ ] Database connection uses SSL

### 6.2 Frontend Deployment Checklist

- [ ] Azure AD client ID configured
- [ ] API URL points to production backend
- [ ] Build completed: `npm run build`
- [ ] Environment variables set
- [ ] SSL/TLS certificate configured
- [ ] CSP headers configured

### 6.3 Post-Deployment Verification

1. **Test Authentication**:
   - Visit frontend URL
   - Should redirect to Azure AD login
   - After login, should access portal

2. **Test API Endpoints**:
   ```bash
   curl https://your-backend.com/api/components
   # Should return 401 without token
   ```

3. **Test Components**:
   - Browse component catalog
   - View component details
   - Search and filter

4. **Check Logs**:
   - No "Development mode" warnings
   - No "Mock authentication" messages
   - Successful Azure AD token validations

---

## Security Best Practices

### Environment Variables

- ✅ Never commit `.env` to version control
- ✅ Use environment variables in hosting platform
- ✅ Rotate client secrets every 12-24 months
- ✅ Use different secrets for dev/staging/prod

### Database

- ✅ Use SSL/TLS for database connections
- ✅ Restrict database access by IP
- ✅ Use strong database passwords
- ✅ Enable database backups

### API

- ✅ Enable HTTPS only
- ✅ Configure CORS properly
- ✅ Set rate limiting
- ✅ Enable security headers (helmet)
- ✅ Monitor for suspicious activity

### Azure AD

- ✅ Enable Conditional Access policies
- ✅ Require MFA for admin users
- ✅ Review app permissions regularly
- ✅ Monitor sign-in logs

---

## Common Issues

### Issue: "Invalid token" errors in production

**Cause**: Token issuer/audience mismatch
**Solution**: Verify `AZURE_AD_TENANT_ID` and `AZURE_AD_CLIENT_ID` match exactly

### Issue: CORS errors in production

**Cause**: `CORS_ORIGIN` not set correctly
**Solution**: Set to exact frontend URL (no trailing slash)

### Issue: Users can't log in

**Cause**: App registration not configured properly
**Solution**: Check API permissions and admin consent

### Issue: "Development mode" warnings in logs

**Cause**: `NODE_ENV` still set to `development`
**Solution**: Set `NODE_ENV=production`

---

## Rollback Plan

If issues occur after deployment:

1. **Immediate**: Revert to previous version
2. **Check logs**: Review error logs for specific issues
3. **Verify config**: Double-check all environment variables
4. **Test locally**: Reproduce issue in local environment
5. **Fix**: Apply fixes and redeploy

---

## Support Resources

- **Azure AD Documentation**: https://docs.microsoft.com/azure/active-directory/
- **MSAL.js Documentation**: https://github.com/AzureAD/microsoft-authentication-library-for-js
- **Deployment Guide**: See `README.md`
- **Example Components**: See `EXAMPLE_COMPONENTS_GUIDE.md`

---

## Development vs Production Comparison

| Feature | Development Mode | Production Mode |
|---------|-----------------|-----------------|
| Authentication | Mock bypass | Azure AD required |
| Default user | dev@localhost (admin) | Real Azure AD users |
| Token validation | Skipped | Full JWT verification |
| HTTPS | Optional | Required |
| Error messages | Verbose | Limited |
| Logging | DEBUG | INFO/WARN/ERROR |

---

## Quick Reference: Environment Variables

### Required for Production

```bash
NODE_ENV=production                    # CRITICAL!
DATABASE_URL=postgresql://...          # Database connection
CORS_ORIGIN=https://frontend.com       # Frontend URL
AZURE_AD_TENANT_ID=xxx                 # From Azure Portal
AZURE_AD_CLIENT_ID=xxx                 # From Azure Portal
AZURE_AD_CLIENT_SECRET=xxx             # From Azure Portal
AZURE_AD_AUTHORITY=https://login...    # Azure AD authority URL
JWT_SECRET=xxx                         # Strong random secret
```

### Optional (Feature-specific)

```bash
AZURE_DEVOPS_ORG=xxx                  # For Wiki sync
AZURE_DEVOPS_PROJECT=xxx              # For Wiki sync
AZURE_DEVOPS_WIKI_ID=xxx              # For Wiki sync
AZURE_DEVOPS_PAT=xxx                  # For Wiki sync
AZURE_STORAGE_ACCOUNT=xxx             # For file uploads
AZURE_STORAGE_KEY=xxx                 # For file uploads
AZURE_STORAGE_CONTAINER=xxx           # For file uploads
LOG_LEVEL=info                        # Logging level
```

---

## Final Checklist

Before going live, ensure:

- [ ] Azure AD app registered and configured
- [ ] All environment variables set correctly
- [ ] `NODE_ENV=production` in backend
- [ ] Strong JWT secret generated
- [ ] Database migrations run successfully
- [ ] Frontend configured with Azure AD
- [ ] HTTPS/SSL certificates installed
- [ ] CORS configured correctly
- [ ] Tested authentication flow
- [ ] Verified API security (401 without token)
- [ ] Checked logs for warnings
- [ ] Backup and rollback plan ready

---

**Last Updated**: 2024-12-27
**Deployment Status**: Development mode enabled, Azure AD not configured
**Action Required**: Configure Azure AD before production deployment
