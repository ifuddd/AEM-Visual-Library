import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../../.env') });

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  database: {
    url: string;
  };
  azureAd: {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    authority: string;
  };
  azureDevOps: {
    org: string;
    project: string;
    wikiId: string;
    pat: string;
  };
  azureStorage: {
    account: string;
    key: string;
    container: string;
  };
  jwt: {
    secret: string;
  };
  logging: {
    level: string;
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || '4000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  database: {
    url: process.env.DATABASE_URL || '',
  },
  azureAd: {
    tenantId: process.env.AZURE_AD_TENANT_ID || '',
    clientId: process.env.AZURE_AD_CLIENT_ID || '',
    clientSecret: process.env.AZURE_AD_CLIENT_SECRET || '',
    authority: process.env.AZURE_AD_AUTHORITY || '',
  },
  azureDevOps: {
    org: process.env.AZURE_DEVOPS_ORG || '',
    project: process.env.AZURE_DEVOPS_PROJECT || '',
    wikiId: process.env.AZURE_DEVOPS_WIKI_ID || '',
    pat: process.env.AZURE_DEVOPS_PAT || '',
  },
  azureStorage: {
    account: process.env.AZURE_STORAGE_ACCOUNT || '',
    key: process.env.AZURE_STORAGE_KEY || '',
    container: process.env.AZURE_STORAGE_CONTAINER || 'component-assets',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'development-secret-change-in-production',
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};
