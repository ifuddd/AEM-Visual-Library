import { getFigmaEmbedUrl } from '@/lib/figmaUtils';

interface PreviewTabProps {
  figmaLink: string;
}

export function PreviewTab({ figmaLink }: PreviewTabProps) {
  if (!figmaLink) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
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
        <p className="text-gray-500 mb-2">No Figma design linked yet</p>
        <p className="text-sm text-gray-400">
          Go to the Designer tab to add a Figma link
        </p>
      </div>
    );
  }

  // Convert Figma URL to embed URL using utility function
  const embedUrl = getFigmaEmbedUrl(figmaLink);

  if (!embedUrl) {
    return (
      <div className="text-center py-12">
        <div className="bg-red-50 text-red-800 p-4 rounded-lg max-w-md mx-auto">
          <p className="font-medium mb-2">Invalid Figma URL</p>
          <p className="text-sm">
            Please provide a valid Figma design or file URL in the Designer tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Figma Design Preview</h3>
      <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          title="Figma Design Preview"
        />
      </div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-sm text-gray-500">
          Embedded from Figma
        </p>
        <a
          href={figmaLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          Open in Figma
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </div>
  );
}
