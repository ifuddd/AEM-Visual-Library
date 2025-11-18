'use client';

import { useQuery } from '@tanstack/react-query';
import { wikiApi } from '@/lib/api';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import type { Component } from '@aem-portal/shared';

interface ImplementationTabProps {
  component: Component;
}

export function ImplementationTab({ component }: ImplementationTabProps) {
  const { data: wikiContent, isLoading, error } = useQuery({
    queryKey: ['wiki-content', component.azureWikiPath],
    queryFn: () => wikiApi.getContent(component.azureWikiPath!),
    enabled: !!component.azureWikiPath,
  });

  return (
    <div className="space-y-6">
      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {component.repoLink && (
          <a
            href={component.repoLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <div>
              <div className="text-sm font-medium text-gray-900">Repository</div>
              <div className="text-xs text-gray-500">View source code</div>
            </div>
          </a>
        )}

        {component.azureWikiUrl && (
          <a
            href={component.azureWikiUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-primary-600 hover:bg-primary-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
            <div>
              <div className="text-sm font-medium text-gray-900">Azure Wiki</div>
              <div className="text-xs text-gray-500">Full documentation</div>
            </div>
          </a>
        )}

        {component.aemMetadata?.componentPath && (
          <div className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
            </svg>
            <div>
              <div className="text-sm font-medium text-gray-900">Component Path</div>
              <div className="text-xs text-gray-500 font-mono">
                {component.aemMetadata.componentPath}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wiki content */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Implementation Documentation</h3>
          {component.azureWikiUrl && (
            <a
              href={component.azureWikiUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
            >
              Open in Azure DevOps
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
              </svg>
            </a>
          )}
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
          </div>
        ) : error ? (
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded">
            <p className="text-sm text-yellow-800">
              Unable to load wiki content. Please check the Azure Wiki link above.
            </p>
          </div>
        ) : wikiContent ? (
          <div className="prose prose-sm max-w-none markdown-content bg-white border border-gray-200 rounded-lg p-6">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw, rehypeSanitize]}
            >
              {wikiContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No implementation documentation available
          </div>
        )}
      </div>
    </div>
  );
}
