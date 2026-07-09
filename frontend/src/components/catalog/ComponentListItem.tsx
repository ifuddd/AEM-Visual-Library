import Link from 'next/link';
import type { Component } from '@aem-portal/shared';
import { ComponentStatus } from '@aem-portal/shared';
import { ComponentImage } from '@/components/common/ComponentImage';

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
        <div className="w-full md:w-48 lg:w-56 flex-shrink-0">
          <ComponentImage
            src={component.visualAssets?.thumbnailUrl || null}
            alt={component.title}
            aspectRatio="16/9"
            className="rounded group-hover:scale-105 transition-transform"
          />
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
          <p className="text-sm text-gray-600 line-clamp-3">
            {component.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
