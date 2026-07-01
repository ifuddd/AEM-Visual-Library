import { useState } from 'react';

interface DesignerTabProps {
  figmaLink: string;
  setFigmaLink: (value: string) => void;
}

export function DesignerTab({ figmaLink, setFigmaLink }: DesignerTabProps) {
  const [inputValue, setInputValue] = useState(figmaLink);
  const [validationError, setValidationError] = useState('');

  const validateFigmaUrl = (url: string): boolean => {
    if (!url) {
      setValidationError('');
      return true;
    }

    if (!url.includes('figma.com')) {
      setValidationError('Please enter a valid Figma URL');
      return false;
    }

    setValidationError('');
    return true;
  };

  const handleChange = (value: string) => {
    setInputValue(value);
    if (validateFigmaUrl(value)) {
      setFigmaLink(value);
    }
  };

  const handleClear = () => {
    setInputValue('');
    setFigmaLink('');
    setValidationError('');
  };

  // Convert Figma URL to embed URL
  const embedUrl = figmaLink && figmaLink.includes('figma.com')
    ? figmaLink.replace('figma.com/file/', 'figma.com/embed?embed_host=share&url=') ||
      `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(figmaLink)}`
    : '';

  return (
    <div className="space-y-6">
      {/* Figma Link Input */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Figma Link</h3>
        <div className="space-y-3">
          <div>
            <label htmlFor="figmaUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Figma Design URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="figmaUrl"
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="https://www.figma.com/file/..."
                className={`flex-1 px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                  validationError ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {inputValue && (
                <button
                  onClick={handleClear}
                  className="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            {validationError && (
              <p className="mt-1 text-sm text-red-600">{validationError}</p>
            )}
            {figmaLink && !validationError && (
              <a
                href={figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                Open in Figma
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Figma Preview */}
      {figmaLink && !validationError && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Figma Preview</h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
            <iframe
              src={embedUrl}
              className="w-full h-full"
              allowFullScreen
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Live preview from Figma
          </p>
        </div>
      )}

      {/* Design guidelines section */}
      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">Design Guidelines</h3>
        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            Link your Figma design file above to provide designers with access to
            spacing, colors, typography, and component specifications. The design
            will be embedded for quick reference.
          </p>
        </div>
      </div>
    </div>
  );
}
