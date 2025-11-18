'use client';

import { use } from 'react';
import { useQuery } from '@tanstack/react-query';
import { componentApi } from '@/lib/api';
import { ComponentTabs } from '@/components/detail/ComponentTabs';
import { ComponentStatus } from '@aem-portal/shared';
import Link from 'next/link';

const statusColors = {
  [ComponentStatus.STABLE]: 'bg-green-100 text-green-800',
  [ComponentStatus.EXPERIMENTAL]: 'bg-yellow-100 text-yellow-800',
  [ComponentStatus.DEPRECATED]: 'bg-red-100 text-red-800',
};

export default function ComponentDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const { data: component, isLoading, error } = useQuery({
    queryKey: ['component', slug],
    queryFn: () => componentApi.getBySlug(slug),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            Component not found
          </div>
          <Link
            href="/catalog"
            className="inline-block mt-4 text-primary-600 hover:text-primary-700 underline"
          >
            ← Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to catalog
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {component.title}
                </h1>
                <span
                  className={`px-3 py-1 text-sm font-medium rounded ${
                    statusColors[component.status]
                  }`}
                >
                  {component.status}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{component.description}</p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                {component.ownerTeam && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                    {component.ownerTeam}
                  </div>
                )}
                {component.lastUpdate && (
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Updated {new Date(component.lastUpdate.date).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* Tags */}
              {component.tags && component.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {component.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Component detail tabs */}
      <main className="container mx-auto px-4 py-8">
        <ComponentTabs component={component} />
      </main>
    </div>
  );
}
