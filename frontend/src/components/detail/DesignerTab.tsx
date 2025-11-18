import type { Component } from '@aem-portal/shared';

interface DesignerTabProps {
  component: Component;
}

export function DesignerTab({ component }: DesignerTabProps) {
  const hasFigmaLinks = component.figmaLinks && component.figmaLinks.length > 0;

  return (
    <div className="space-y-6">
      {hasFigmaLinks ? (
        <>
          <div>
            <h3 className="text-lg font-semibold mb-4">Figma Designs</h3>
            <div className="space-y-4">
              {component.figmaLinks!.map((link, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-primary-600 hover:text-primary-700"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.019 3.019 3.019h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z" />
                    </svg>
                    Open in Figma
                  </a>
                  <div className="mt-2 text-sm text-gray-600 break-all">
                    {link}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Embedded Figma (if first link is a file) */}
          {component.figmaLinks![0].includes('figma.com/file/') && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
                <iframe
                  src={`https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(component.figmaLinks![0])}`}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-4">No Figma designs linked yet</p>
          <a
            href="/contribute"
            className="text-primary-600 hover:text-primary-700 underline"
          >
            Contribute design files
          </a>
        </div>
      )}

      {/* Design guidelines section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Design Guidelines</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            For detailed design guidelines, spacing, colors, and typography, refer to
            the Figma design system above.
          </p>
        </div>
      </div>
    </div>
  );
}
