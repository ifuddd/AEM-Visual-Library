'use client';

import { useState } from 'react';
import { RichTextEditor } from './RichTextEditor';
import { EmptyState } from './EmptyState';
import { getFigmaEmbedUrl, isValidFigmaUrl } from '@/lib/figmaUtils';

interface DesignSpecsTabProps {
  figmaLink: string;
  setFigmaLink: (value: string) => void;
  designSpecsNotes: string;
  setDesignSpecsNotes: (value: string) => void;
}

export function DesignSpecsTab({
  figmaLink,
  setFigmaLink,
  designSpecsNotes,
  setDesignSpecsNotes,
}: DesignSpecsTabProps) {
  const [inputValue, setInputValue] = useState(figmaLink);
  const [validationError, setValidationError] = useState('');

  const validateFigmaUrl = (url: string): boolean => {
    if (!url) {
      setValidationError('');
      return true;
    }

    if (!isValidFigmaUrl(url)) {
      setValidationError('Please enter a valid Figma URL (must contain figma.com/file/ or figma.com/design/)');
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

  const embedUrl = figmaLink ? getFigmaEmbedUrl(figmaLink) : undefined;

  return (
    <div className="space-y-6">
      {/* Figma Preview Section - Simple, not collapsible */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Figma Design Preview</h3>

        <div className="space-y-4">
          {/* Figma URL Input */}
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
                placeholder="https://www.figma.com/design/..."
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

          {/* Figma Preview or Empty State */}
          {embedUrl && !validationError ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <iframe
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                title="Figma Design Preview"
              />
            </div>
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
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              }
              title="No Figma design linked"
              message="Add a Figma design URL above to embed the design specifications and visual mockups for this component."
            />
          )}
        </div>
      </div>

      {/* Design Notes Section - Simple, one editor */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Design Specifications</h3>
        <RichTextEditor
          content={designSpecsNotes}
          onChange={setDesignSpecsNotes}
          placeholder="Document design specifications: spacing, colors, typography, Touch UI Dialog properties, component behavior..."
        />
      </div>
    </div>
  );
}
