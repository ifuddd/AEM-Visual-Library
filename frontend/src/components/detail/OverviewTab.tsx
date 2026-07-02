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

      {/* Azure DevOps Section */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Azure DevOps</h3>

        {azureDevOpsWorkItem ? (
          <div className="space-y-2">
            <a
              href={
                azureDevOpsWorkItem.startsWith('http')
                  ? azureDevOpsWorkItem
                  : `https://dev.azure.com/${azureDevOpsWorkItem}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View in Azure DevOps
            </a>
            <button
              onClick={() => setAzureDevOpsWorkItem('')}
              className="ml-4 text-sm text-gray-500 hover:text-gray-700 underline"
            >
              Change
            </button>
          </div>
        ) : (
          <div>
            <input
              type="text"
              value={azureDevOpsWorkItem}
              onChange={(e) => setAzureDevOpsWorkItem(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              placeholder="Azure DevOps work item URL or ID..."
            />
            <p className="mt-2 text-xs text-gray-500">
              Link to the Azure DevOps work item for this component
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
