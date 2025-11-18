# Deployment Guide - AEM Visual Portal

This guide covers deploying the AEM Visual Portal to Azure.

## Prerequisites

- Azure subscription with Contributor access
- Azure CLI installed and authenticated
- Node.js 18+ installed locally
- Azure DevOps organization with Wiki enabled
- Registered Azure AD application

## Architecture Overview

```
Frontend (Azure Static Web Apps)
    ↓
Backend API (Azure App Service)
    ↓
Database (Azure Database for PostgreSQL)
Blob Storage (Azure Storage Account)
Sync Service (Azure Functions)
```

## Step 1: Azure AD Application Setup

1. Register a new app in Azure AD:
   ```bash
   az ad app create --display-name "AEM Visual Portal" \
     --sign-in-audience "AzureADMyOrg" \
     --web-redirect-uris "https://your-domain.com" "http://localhost:3000"
   ```

2. Note the Application (client) ID and Tenant ID

3. Create a client secret:
   ```bash
   az ad app credential reset --id <APP_ID>
   ```

4. Add required API permissions:
   - Microsoft Graph: User.Read
   - Azure DevOps: user_impersonation

## Step 2: Database Setup

1. Create PostgreSQL server:
   ```bash
   az postgres flexible-server create \
     --name aem-portal-db \
     --resource-group aem-portal-rg \
     --location eastus \
     --admin-user adminuser \
     --admin-password <STRONG_PASSWORD> \
     --sku-name Standard_B1ms \
     --tier Burstable \
     --version 14
   ```

2. Configure firewall to allow Azure services:
   ```bash
   az postgres flexible-server firewall-rule create \
     --resource-group aem-portal-rg \
     --name aem-portal-db \
     --rule-name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

3. Get connection string:
   ```bash
   postgresql://adminuser:<PASSWORD>@aem-portal-db.postgres.database.azure.com:5432/postgres?sslmode=require
   ```

## Step 3: Storage Account Setup

1. Create storage account:
   ```bash
   az storage account create \
     --name aemportalstore \
     --resource-group aem-portal-rg \
     --location eastus \
     --sku Standard_LRS
   ```

2. Create container for component assets:
   ```bash
   az storage container create \
     --name component-assets \
     --account-name aemportalstore \
     --public-access blob
   ```

3. Get storage keys:
   ```bash
   az storage account keys list \
     --account-name aemportalstore \
     --resource-group aem-portal-rg
   ```

## Step 4: Key Vault Setup

1. Create Key Vault:
   ```bash
   az keyvault create \
     --name aem-portal-kv \
     --resource-group aem-portal-rg \
     --location eastus
   ```

2. Add secrets:
   ```bash
   az keyvault secret set --vault-name aem-portal-kv --name "DATABASE-URL" --value "<DB_CONNECTION_STRING>"
   az keyvault secret set --vault-name aem-portal-kv --name "AZURE-AD-CLIENT-SECRET" --value "<CLIENT_SECRET>"
   az keyvault secret set --vault-name aem-portal-kv --name "AZURE-DEVOPS-PAT" --value "<PAT>"
   az keyvault secret set --vault-name aem-portal-kv --name "AZURE-STORAGE-KEY" --value "<STORAGE_KEY>"
   az keyvault secret set --vault-name aem-portal-kv --name "JWT-SECRET" --value "<RANDOM_SECRET>"
   ```

## Step 5: Deploy Backend API

1. Build backend:
   ```bash
   cd backend
   npm install
   npm run build
   ```

2. Create App Service:
   ```bash
   az appservice plan create \
     --name aem-portal-plan \
     --resource-group aem-portal-rg \
     --sku B1 \
     --is-linux

   az webapp create \
     --name aem-portal-api \
     --resource-group aem-portal-rg \
     --plan aem-portal-plan \
     --runtime "NODE:18-lts"
   ```

3. Configure environment variables:
   ```bash
   az webapp config appsettings set \
     --name aem-portal-api \
     --resource-group aem-portal-rg \
     --settings \
       NODE_ENV=production \
       PORT=8080 \
       DATABASE_URL="@Microsoft.KeyVault(SecretUri=https://aem-portal-kv.vault.azure.net/secrets/DATABASE-URL/)" \
       AZURE_AD_TENANT_ID="<TENANT_ID>" \
       AZURE_AD_CLIENT_ID="<CLIENT_ID>" \
       AZURE_AD_CLIENT_SECRET="@Microsoft.KeyVault(SecretUri=https://aem-portal-kv.vault.azure.net/secrets/AZURE-AD-CLIENT-SECRET/)" \
       AZURE_DEVOPS_ORG="<ORG_NAME>" \
       AZURE_DEVOPS_PROJECT="<PROJECT_NAME>" \
       AZURE_DEVOPS_WIKI_ID="<WIKI_ID>" \
       AZURE_DEVOPS_PAT="@Microsoft.KeyVault(SecretUri=https://aem-portal-kv.vault.azure.net/secrets/AZURE-DEVOPS-PAT/)" \
       AZURE_STORAGE_ACCOUNT="aemportalstore" \
       AZURE_STORAGE_KEY="@Microsoft.KeyVault(SecretUri=https://aem-portal-kv.vault.azure.net/secrets/AZURE-STORAGE-KEY/)" \
       JWT_SECRET="@Microsoft.KeyVault(SecretUri=https://aem-portal-kv.vault.azure.net/secrets/JWT-SECRET/)" \
       CORS_ORIGIN="https://your-frontend-domain.azurestaticapps.net"
   ```

4. Enable managed identity and grant Key Vault access:
   ```bash
   az webapp identity assign --name aem-portal-api --resource-group aem-portal-rg
   PRINCIPAL_ID=$(az webapp identity show --name aem-portal-api --resource-group aem-portal-rg --query principalId -o tsv)
   az keyvault set-policy --name aem-portal-kv --object-id $PRINCIPAL_ID --secret-permissions get list
   ```

5. Deploy:
   ```bash
   cd backend
   zip -r deploy.zip dist node_modules package.json prisma
   az webapp deployment source config-zip \
     --name aem-portal-api \
     --resource-group aem-portal-rg \
     --src deploy.zip
   ```

6. Run database migrations:
   ```bash
   # SSH into app service and run:
   npx prisma migrate deploy
   ```

## Step 6: Deploy Sync Service (Azure Functions)

1. Create Function App:
   ```bash
   az functionapp create \
     --name aem-portal-sync \
     --resource-group aem-portal-rg \
     --consumption-plan-location eastus \
     --runtime node \
     --runtime-version 18 \
     --storage-account aemportalstore \
     --functions-version 4
   ```

2. Configure app settings (same as backend API)

3. Deploy function:
   ```bash
   cd sync-service
   npm install
   npm run build
   func azure functionapp publish aem-portal-sync
   ```

## Step 7: Deploy Frontend

1. Build frontend:
   ```bash
   cd frontend
   npm install
   npm run build
   ```

2. Create Static Web App:
   ```bash
   az staticwebapp create \
     --name aem-portal-frontend \
     --resource-group aem-portal-rg \
     --location eastus2
   ```

3. Configure environment variables in Azure Portal:
   - NEXT_PUBLIC_API_URL: https://aem-portal-api.azurewebsites.net
   - NEXT_PUBLIC_AZURE_AD_CLIENT_ID: <CLIENT_ID>
   - NEXT_PUBLIC_AZURE_AD_TENANT_ID: <TENANT_ID>
   - NEXT_PUBLIC_AZURE_AD_REDIRECT_URI: https://your-app.azurestaticapps.net

4. Deploy via GitHub Actions or Azure CLI:
   ```bash
   az staticwebapp deployment create \
     --name aem-portal-frontend \
     --resource-group aem-portal-rg \
     --source .
   ```

## Step 8: Configure Custom Domain (Optional)

1. Add custom domain to Static Web App
2. Update Azure AD redirect URIs
3. Update CORS settings in backend

## Step 9: Monitoring and Alerts

1. Enable Application Insights:
   ```bash
   az monitor app-insights component create \
     --app aem-portal-insights \
     --location eastus \
     --resource-group aem-portal-rg
   ```

2. Connect to App Service and Functions

3. Set up alerts for:
   - API errors > 10/hour
   - Sync failures
   - Database connection issues

## Post-Deployment Checklist

- [ ] Test Azure AD login
- [ ] Verify database connection
- [ ] Test component catalog loading
- [ ] Verify sync service runs successfully
- [ ] Test contribution workflow
- [ ] Check blob storage uploads
- [ ] Verify Wiki content renders
- [ ] Test all API endpoints
- [ ] Review Application Insights logs

## Troubleshooting

### Database Connection Issues
```bash
# Test connection from App Service
az webapp ssh --name aem-portal-api --resource-group aem-portal-rg
# Inside SSH: psql "<CONNECTION_STRING>"
```

### Function Not Triggering
- Check timer expression in function.json
- Review function logs in Azure Portal
- Verify environment variables are set

### CORS Errors
- Verify CORS_ORIGIN in backend matches frontend domain
- Check Azure AD redirect URIs

## Backup and Disaster Recovery

1. Database backups (automated by Azure):
   ```bash
   az postgres flexible-server backup list \
     --resource-group aem-portal-rg \
     --name aem-portal-db
   ```

2. Blob storage lifecycle policy for retention

3. Export Key Vault secrets regularly

## Cost Optimization

- Use B-series VMs for non-production
- Enable auto-shutdown for dev environments
- Use Reserved Instances for production
- Monitor with Azure Cost Management

## Estimated Monthly Costs

- App Service (B1): ~$13/month
- PostgreSQL (B1ms): ~$12/month
- Function App (Consumption): ~$5/month
- Storage Account: ~$2/month
- Static Web App: Free tier
- **Total: ~$32/month** (plus data transfer)
