import Link from 'next/link';
import Image from 'next/image';
import type { Component } from '@aem-portal/shared';
import { ComponentStatus } from '@aem-portal/shared';

interface ComponentCardProps {
  component: Component;
}

const statusColors = {
  [ComponentStatus.STABLE]: 'bg-green-100 text-green-800',
  [ComponentStatus.EXPERIMENTAL]: 'bg-yellow-100 text-yellow-800',
  [ComponentStatus.DEPRECATED]: 'bg-red-100 text-red-800',
};

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link
      href={`/component/${component.slug}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {component.visualAssets?.thumbnailUrl ? (
          <Image
            src={component.visualAssets.thumbnailUrl}
            alt={component.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-16 h-16"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {component.title}
          </h3>
          <span
            className={`px-2 py-1 text-xs font-medium rounded ${
              statusColors[component.status]
            }`}
          >
            {component.status}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {component.description}
        </p>

        {/* Tags */}
        {component.tags && component.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {component.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {tag}
              </span>
            ))}
            {component.tags.length > 3 && (
              <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                +{component.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Owner */}
        {component.ownerTeam && (
          <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500">
            {component.ownerTeam}
          </div>
        )}
      </div>
    </Link>
  );
}
