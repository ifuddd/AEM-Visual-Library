import Link from 'next/link';
import Image from 'next/image';
import type { Component } from '@aem-portal/shared';
import { ComponentStatus } from '@aem-portal/shared';

interface ComponentListItemProps {
  component: Component;
}

const statusColors = {
  [ComponentStatus.READY]: 'bg-emerald-100 text-emerald-800',
  [ComponentStatus.IN_REVIEW]: 'bg-amber-100 text-amber-800',
};

export function ComponentListItem({ component }: ComponentListItemProps) {
  return (
    <Link
      href={`/component/${component.slug}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      <div className="flex flex-col md:flex-row gap-4 p-4">
        {/* Thumbnail - responsive width */}
        <div className="w-full md:w-48 lg:w-56 flex-shrink-0 aspect-video bg-gray-100 relative overflow-hidden rounded">
          {component.visualAssets?.thumbnailUrl ? (
            <Image
              src={component.visualAssets.thumbnailUrl}
              alt={component.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Title + Status */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
              {component.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded whitespace-nowrap ${statusColors[component.status]}`}>
              {component.status === ComponentStatus.READY ? 'Ready' : 'In Review'}
            </span>
          </div>

          {/* Description - 3 lines for more context */}
          <p className="text-sm text-gray-600 mb-3 line-clamp-3">
            {component.description}
          </p>

          {/* Owner - pushed to bottom */}
          {component.ownerTeam && (
            <div className="mt-auto pt-3 border-t border-gray-100 text-xs text-gray-500">
              {component.ownerTeam}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
