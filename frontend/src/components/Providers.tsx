'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MsalProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { useState, useEffect } from 'react';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * ⚠️ DEVELOPMENT MODE: Azure AD authentication is bypassed when not configured
 * 🚨 IMPORTANT: Configure Azure AD before deploying to production!
 * See DEPLOYMENT_NOTES.md for setup instructions.
 */

// Check if Azure AD is configured
const hasAzureAdConfig = Boolean(
  process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID &&
  process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID
);

// Only initialize MSAL if Azure AD is configured
let msalInstance: PublicClientApplication | null = null;

if (hasAzureAdConfig) {
  const msalConfig = {
    auth: {
      clientId: process.env.NEXT_PUBLIC_AZURE_AD_CLIENT_ID!,
      authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_AD_TENANT_ID}`,
      redirectUri: process.env.NEXT_PUBLIC_AZURE_AD_REDIRECT_URI || 'http://localhost:3000',
    },
    cache: {
      cacheLocation: 'localStorage' as const,
      storeAuthStateInCookie: false,
    },
  };
  msalInstance = new PublicClientApplication(msalConfig);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  // Log warning in development mode
  useEffect(() => {
    if (!hasAzureAdConfig && process.env.NODE_ENV === 'development') {
      console.warn('⚠️  Development mode: Azure AD not configured');
      console.warn('🚨 Configure Azure AD before deploying to production!');
      console.warn('📝 See DEPLOYMENT_NOTES.md for setup instructions');
    }
  }, []);

  return (
    <ErrorBoundary>
      {hasAzureAdConfig && msalInstance ? (
        <MsalProvider instance={msalInstance}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </MsalProvider>
      ) : (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )}
    </ErrorBoundary>
  );
}
