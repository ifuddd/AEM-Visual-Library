import Image from 'next/image';
import type { Component } from '@aem-portal/shared';

interface PreviewTabProps {
  component: Component;
}

export function PreviewTab({ component }: PreviewTabProps) {
  const hasScreenshots =
    component.visualAssets?.screenshotAuthorUrl ||
    component.visualAssets?.screenshotPublishedUrl ||
    component.visualAssets?.thumbnailUrl;

  if (!hasScreenshots) {
    return (
      <div className="text-center py-12 text-gray-500">
        No preview images available
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Published view */}
      {component.visualAssets?.screenshotPublishedUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Published View</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={component.visualAssets.screenshotPublishedUrl}
              alt={`${component.title} - Published`}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Author view */}
      {component.visualAssets?.screenshotAuthorUrl && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Author View</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Image
              src={component.visualAssets.screenshotAuthorUrl}
              alt={`${component.title} - Author`}
              width={1200}
              height={800}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Thumbnail */}
      {component.visualAssets?.thumbnailUrl &&
        !component.visualAssets?.screenshotPublishedUrl &&
        !component.visualAssets?.screenshotAuthorUrl && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Thumbnail</h3>
            <div className="border border-gray-200 rounded-lg overflow-hidden max-w-2xl">
              <Image
                src={component.visualAssets.thumbnailUrl}
                alt={component.title}
                width={800}
                height={450}
                className="w-full h-auto"
              />
            </div>
          </div>
        )}
    </div>
  );
}
