# AEM Visual Portal

A visual, designer-friendly portal that maps Adobe Experience Manager (AEM) components to developer documentation stored in Azure DevOps Wiki.

## 🏗️ Architecture

This is a monorepo containing:

- **frontend/** - Next.js 14 web application with React 18 and TailwindCSS
- **backend/** - Node.js/Express API server with Prisma ORM
- **sync-service/** - Azure Function for syncing Wiki content
- **shared/** - Shared TypeScript types and utilities

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm 9+
- PostgreSQL 14+
- Azure subscription (for deployment)
- Azure DevOps organization with Wiki enabled

### Installation

```bash
# Install all dependencies
npm install

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
cp sync-service/local.settings.example.json sync-service/local.settings.json

# Edit .env files with your configuration

# Run database migrations
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate
```

### Development

```bash
# Run frontend and backend concurrently
npm run dev

# Or run individually
npm run dev:frontend   # Next.js dev server (http://localhost:3000)
npm run dev:backend    # Express API (http://localhost:4000)
npm run dev:sync       # Azure Functions local runtime
```

### Database

```bash
# Create a new migration
npm run prisma:migrate

# Open Prisma Studio (DB GUI)
npm run prisma:studio

# Reset database (WARNING: deletes all data)
cd backend && npx prisma migrate reset
```

## 📁 Project Structure

```
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   ├── lib/          # Utilities and API clients
│   │   └── types/        # TypeScript types
│   └── public/           # Static assets
│
├── backend/              # Express API server
│   ├── src/
│   │   ├── routes/       # API route handlers
│   │   ├── services/     # Business logic
│   │   ├── middleware/   # Express middleware
│   │   └── db/           # Prisma schema and migrations
│   └── prisma/           # Database schema
│
├── sync-service/         # Azure Function
│   └── WikiSyncTimer/    # Timer-triggered function
│
└── shared/               # Shared code
    └── src/
        └── types/        # Shared TypeScript types
```

## 🔧 Configuration

### Backend Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/aem_portal

# Azure AD Authentication
AZURE_AD_TENANT_ID=your-tenant-id
AZURE_AD_CLIENT_ID=your-client-id
AZURE_AD_CLIENT_SECRET=your-client-secret

# Azure DevOps
AZURE_DEVOPS_ORG=your-org
AZURE_DEVOPS_PROJECT=your-project
AZURE_DEVOPS_PAT=your-personal-access-token

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT=your-storage-account
AZURE_STORAGE_KEY=your-storage-key
AZURE_STORAGE_CONTAINER=component-assets

# App Configuration
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

### Frontend Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AZURE_AD_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_AD_TENANT_ID=your-tenant-id
```

## 🗄️ Database Schema

See `backend/prisma/schema.prisma` for the complete schema.

Key entities:
- **Component** - AEM components with metadata
- **Fragment** - Content and Experience Fragments
- **Pattern** - Component composition patterns
- **SyncLog** - Sync job execution logs
- **ContributionRequest** - User contribution submissions

## 🔐 Authentication

The portal uses Azure AD (OAuth 2.0) for authentication:

1. Users authenticate via Azure AD
2. JWT tokens are validated on the backend
3. User permissions are checked against Azure DevOps Wiki access
4. Role-based access control (RBAC) for portal features

Roles:
- **Viewer** - Read-only access
- **Contributor** - Can submit contribution requests
- **Doc Owner** - Can approve contributions and trigger syncs
- **Admin** - Full access including admin dashboard

## 🔄 Sync Service

The Azure Function runs every 6 hours to:

1. Fetch Wiki pages from Azure DevOps
2. Parse Markdown frontmatter for component metadata
3. Download and store images in Azure Blob Storage
4. Update database with latest content
5. Log sync status and errors

### Wiki Markdown Template

```markdown
---
component_id: hero-banner
title: Hero Banner
status: stable
owner_team: Marketing Platform
figma_links:
  - https://figma.com/file/abc/Hero
aem_component_path: /apps/project/components/hero
aem_allowed_children: [teaser, cta]
tags: [layout, marketing, author-editable]
---

# Hero Banner Component

Component documentation content here...
```

## 📦 Deployment

### Azure Resources Required

- Azure App Service (or Container Apps) - Backend API
- Azure Static Web Apps - Frontend
- Azure Database for PostgreSQL
- Azure Blob Storage
- Azure Functions
- Azure Key Vault

### Deployment Steps

```bash
# Build all packages
npm run build

# Deploy frontend (Azure Static Web Apps)
cd frontend && npx @azure/static-web-apps-cli deploy

# Deploy backend (Azure App Service)
cd backend && az webapp up --name aem-portal-api

# Deploy sync service (Azure Functions)
cd sync-service && func azure functionapp publish aem-portal-sync
```

See `docs/deployment.md` for detailed deployment instructions.

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm run test -w backend

# Run frontend tests
npm run test -w frontend
```

## 📚 Documentation

- [Architecture Overview](docs/architecture.md)
- [API Documentation](docs/api.md)
- [Deployment Guide](docs/deployment.md)
- [Contributing Guide](docs/contributing.md)
- [Security](docs/security.md)

## 🤝 Contributing

See [CONTRIBUTING.md](docs/contributing.md) for contribution guidelines.

## 📄 License

Internal use only - Proprietary

## 🆘 Support

For issues and questions:
- Create an issue in this repository
- Contact the development team at dev-team@example.com
