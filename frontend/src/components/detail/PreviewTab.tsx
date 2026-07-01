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

  // Convert Figma URL to embed URL
  const embedUrl = figmaLink.includes('embed')
    ? figmaLink
    : figmaLink.replace('figma.com/file/', 'figma.com/embed?embed_host=share&url=') ||
      `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaLink)}`;

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Figma Design Preview</h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
        />
      </div>
      <p className="text-sm text-gray-500 mt-2">
        Embedded from Figma
      </p>
    </div>
  );
}
