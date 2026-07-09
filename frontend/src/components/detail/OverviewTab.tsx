'use client';

import { CollapsibleSection } from './CollapsibleSection';
import { ThumbnailUpload } from './ThumbnailUpload';
import { VariantsSection } from './VariantsSection';
import { EmptyState } from './EmptyState';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';

interface OverviewTabProps {
  description: string;
  thumbnailUrl: string | null;
  onThumbnailChange: (url: string | null) => void;
  variants: any[];
  setVariants: (variants: any[]) => void;
  azureDevOpsWorkItem: string;
  setAzureDevOpsWorkItem: (value: string) => void;
}

export function OverviewTab({
  description,
  thumbnailUrl,
  onThumbnailChange,
  variants,
  setVariants,
  azureDevOpsWorkItem,
  setAzureDevOpsWorkItem,
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

      {/* ADO Tickets Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">ADO Tickets</h3>

        {azureDevOpsWorkItem ? (
          <div className="space-y-3">
            {/* Display ticket as a chip */}
            <div className="flex items-center gap-2 flex-wrap">
              <a
                href={
                  azureDevOpsWorkItem.startsWith('http')
                    ? azureDevOpsWorkItem
                    : `https://dev.azure.com/${azureDevOpsWorkItem}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                <span className="text-sm font-medium">
                  {azureDevOpsWorkItem.includes('/_workitems/edit/')
                    ? `#${azureDevOpsWorkItem.split('/_workitems/edit/')[1]?.split('/')[0]}`
                    : azureDevOpsWorkItem.length > 40
                    ? azureDevOpsWorkItem.substring(0, 40) + '...'
                    : azureDevOpsWorkItem}
                </span>
              </a>
              <button
                onClick={() => setAzureDevOpsWorkItem('')}
                className="inline-flex items-center justify-center w-6 h-6 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Remove ticket"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => setAzureDevOpsWorkItem('')}
              className="text-sm text-primary-600 hover:text-primary-700 underline"
            >
              + Add another ticket
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={azureDevOpsWorkItem}
              onChange={(e) => setAzureDevOpsWorkItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Paste ADO work item URL or ID..."
            />
            <p className="mt-2 text-xs text-gray-500">
              e.g., https://dev.azure.com/org/project/_workitems/edit/12345
            </p>
          </div>
        )}
      </div>

      {/* Variants Section - Collapsible */}
      <CollapsibleSection title="Component Variants" defaultOpen={true} Icon={RectangleGroupIcon}>
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
