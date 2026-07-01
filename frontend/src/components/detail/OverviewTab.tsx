'use client';

import { CollapsibleSection } from './CollapsibleSection';
import { ThumbnailUpload } from './ThumbnailUpload';
import { VariantsSection } from './VariantsSection';
import { EmptyState } from './EmptyState';

interface OverviewTabProps {
  description: string;
  thumbnailUrl: string | null;
  onThumbnailChange: (url: string | null) => void;
  variants: any[];
  setVariants: (variants: any[]) => void;
}

export function OverviewTab({
  description,
  thumbnailUrl,
  onThumbnailChange,
  variants,
  setVariants,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Component Info Section - Not collapsible */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Component Information</h3>

        <div className="flex gap-6">
          {/* Thumbnail on left */}
          <div className="flex-shrink-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Component Thumbnail
            </label>
            <ThumbnailUpload
              thumbnailUrl={thumbnailUrl}
              onThumbnailChange={onThumbnailChange}
            />
          </div>

          {/* Description on right */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
              <p className="text-gray-700 text-sm leading-relaxed">
                {description || 'No description available'}
              </p>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Description is edited in the page header above. Thumbnail is shown in catalog cards.
            </p>
          </div>
        </div>
      </div>

      {/* Variants Section - Collapsible */}
      <CollapsibleSection title="Component Variants" defaultOpen={true} icon="🎭">
        {variants && variants.length > 0 ? (
          <VariantsSection variants={variants} setVariants={setVariants} />
        ) : (
          <EmptyState
            icon={
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            }
            title="No variants defined"
            message="Variants help content authors understand different configurations available in the Touch UI Dialog. Add variants to show how this component can be used in different contexts."
            action={{
              label: 'Add First Variant',
              onClick: () => {
                setVariants([
                  {
                    id: `v${Date.now()}`,
                    name: '',
                    description: '',
                    imageUrl: '',
                    order: 0,
                  },
                ]);
              },
            }}
          />
        )}
      </CollapsibleSection>
    </div>
  );
}
