import Link from 'next/link';
import type { Component } from '@aem-portal/shared';
import { ComponentStatus } from '@aem-portal/shared';
import { ComponentImage } from '@/components/common/ComponentImage';

interface ComponentCardProps {
  component: Component;
}

const statusColors = {
  [ComponentStatus.READY]: 'bg-emerald-100 text-emerald-800',
  [ComponentStatus.IN_REVIEW]: 'bg-amber-100 text-amber-800',
};

export function ComponentCard({ component }: ComponentCardProps) {
  return (
    <Link
      href={`/component/${component.slug}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
    >
      {/* Thumbnail */}
      <ComponentImage
        src={component.visualAssets?.thumbnailUrl || null}
        alt={component.title}
        aspectRatio="16/9"
        className="group-hover:scale-105 transition-transform"
      />

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
            {component.status === ComponentStatus.READY ? 'Ready' : 'In Review'}
          </span>
        </div>

        <p className="text-sm text-gray-600 line-clamp-2">
          {component.description}
        </p>
      </div>
    </Link>
  );
}
