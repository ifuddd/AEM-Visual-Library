# Local Development Setup

This guide will help you set up the AEM Visual Portal on your local machine for development.

## Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+ (or Docker)
- Azure DevOps account with Wiki access
- Azure AD application (for authentication testing)

## Step 1: Clone Repository

```bash
git clone <repository-url>
cd AEM-Visual-Library
```

## Step 2: Install Dependencies

```bash
# Install all workspace dependencies
npm install
```

This will install dependencies for all packages (shared, backend, frontend, sync-service).

## Step 3: Set Up PostgreSQL Database

### Option A: Using Docker (Recommended)

```bash
docker run --name aem-portal-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=aem_portal \
  -p 5432:5432 \
  -d postgres:14
```

### Option B: Local PostgreSQL

1. Install PostgreSQL 14+
2. Create database:
   ```sql
   CREATE DATABASE aem_portal;
   ```

## Step 4: Configure Environment Variables

### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aem_portal

# Azure AD (get from Azure Portal)
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret
AZURE_AD_AUTHORITY=https://login.microsoftonline.com/your-tenant-id

# Azure DevOps
AZURE_DEVOPS_ORG=your-org
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_WIKI_ID=your-wiki-id
AZURE_DEVOPS_PAT=your-pat

# Azure Blob Storage (can use local development)
AZURE_STORAGE_ACCOUNT=devstoreaccount1
AZURE_STORAGE_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
AZURE_STORAGE_CONTAINER=component-assets

# Server config
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=dev-secret-change-in-production
LOG_LEVEL=debug
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_AD_REDIRECT_URI=http://localhost:3000
```

### Sync Service

```bash
cd sync-service
cp local.settings.example.json local.settings.json
```

Edit `local.settings.json` with same values as backend.

## Step 5: Run Database Migrations

```bash
cd backend
npx prisma generate
npx prisma migrate dev
```

This will create all tables in your database.

## Step 6: Seed Database (Optional)

Create a seed script or manually insert test data:

```bash
cd backend
npx prisma studio
```

This opens a GUI where you can add test components.

## Step 7: Start Development Servers

### Option A: Start All Services (Recommended)

From the root directory:
```bash
npm run dev
```

This starts:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

### Option B: Start Individually

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

**Sync Service:**
```bash
cd sync-service
npm run dev
```

## Step 8: Verify Setup

1. **Backend API:** http://localhost:4000/health
   - Should return: `{"status":"ok","timestamp":"...","environment":"development"}`

2. **Frontend:** http://localhost:3000
   - Should show the homepage

3. **Test Authentication:**
   - Click "Browse Components"
   - Should redirect to Azure AD login (if configured)

## Development Workflow

### Database Changes

1. Modify `backend/prisma/schema.prisma`
2. Run migration:
   ```bash
   cd backend
   npx prisma migrate dev --name description_of_change
   ```
3. Prisma Client is automatically regenerated

### View Database

```bash
cd backend
npx prisma studio
```

Opens GUI at http://localhost:5555

### API Testing

Use tools like:
- Thunder Client (VS Code extension)
- Postman
- curl

Example:
```bash
# Get components (requires auth token)
curl -H "Authorization: Bearer <token>" http://localhost:4000/api/components
```

### Frontend Development

Hot reload is enabled - changes appear automatically.

### Running Sync Service Locally

```bash
cd sync-service
npm run dev
```

Manually trigger:
```bash
# The timer trigger will run based on schedule in function.json
# For testing, you can modify the schedule to run more frequently
```

## Troubleshooting

### Database Connection Issues

**Error:** `Can't reach database server`

**Solution:**
- Verify PostgreSQL is running: `docker ps` or `pg_isready`
- Check DATABASE_URL in .env
- Ensure port 5432 is not blocked

### Prisma Client Not Found

**Error:** `@prisma/client did not initialize yet`

**Solution:**
```bash
cd backend
npx prisma generate
```

### CORS Errors

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Verify CORS_ORIGIN in backend/.env matches frontend URL
- Restart backend server after changing .env

### Azure AD Login Issues

**Error:** `AADSTS50011: The reply URL specified in the request does not match`

**Solution:**
- Add redirect URI to Azure AD app registration
- Ensure NEXT_PUBLIC_AZURE_AD_REDIRECT_URI matches

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::4000`

**Solution:**
```bash
# Find process using port
lsof -ti:4000 | xargs kill -9

# Or change PORT in backend/.env
```

## VS Code Setup (Recommended)

### Extensions

- ESLint
- Prettier
- Prisma
- Thunder Client (API testing)
- Azure Functions

### Settings

Create `.vscode/settings.json`:
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "eslint.workingDirectories": [
    "backend",
    "frontend",
    "sync-service"
  ]
}
```

### Launch Configuration

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/src/server.ts",
      "preLaunchTask": "tsc: build - backend/tsconfig.json",
      "outFiles": ["${workspaceFolder}/backend/dist/**/*.js"]
    }
  ]
}
```

## Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Next Steps

1. Review [Architecture Documentation](architecture.md)
2. Read [API Documentation](api.md)
3. Check [Contributing Guidelines](contributing.md)
4. Review [Wiki Template](WIKI_TEMPLATE.md) for creating component docs

## Getting Help

- Check existing issues in repository
- Review deployment logs
- Ask in team Slack channel
- Contact maintainers
