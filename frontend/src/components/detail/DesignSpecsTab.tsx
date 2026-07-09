'use client';

import { useState } from 'react';
import { EmptyState } from './EmptyState';
import { ComponentPropertiesTable } from './ComponentPropertiesTable';
import { InteractionStatesMatrix } from './InteractionStatesMatrix';
import { getFigmaEmbedUrl, isValidFigmaUrl } from '@/lib/figmaUtils';
import type { ComponentVariant } from '@aem-portal/shared';

interface DesignSpecsTabProps {
  figmaLink: string;
  setFigmaLink: (value: string) => void;
  dialogSchema: Record<string, any>;
  setDialogSchema: (value: Record<string, any>) => void;
  variants: ComponentVariant[];
}

export function DesignSpecsTab({
  figmaLink,
  setFigmaLink,
  dialogSchema,
  setDialogSchema,
  variants,
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
    <div className="space-y-10">
      {/* Figma Design Preview */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Figma Design
        </h3>
        <div className="space-y-4">
          <div>
            <label htmlFor="figmaUrl" className="block text-sm text-gray-600 mb-2">
              Figma Design URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                id="figmaUrl"
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="https://www.figma.com/design/..."
                className={`flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:border-primary-500 ${
                  validationError ? 'border-red-400' : 'border-gray-300'
                }`}
              />
              {inputValue && (
                <button
                  onClick={handleClear}
                  className="px-3 py-2 text-sm text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Clear
                </button>
              )}
            </div>
            {validationError && <p className="mt-1 text-xs text-red-500">{validationError}</p>}
            {figmaLink && !validationError && (
              <a
                href={figmaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-xs text-primary-600 hover:text-primary-700"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Open in Figma
              </a>
            )}
          </div>
          {embedUrl && !validationError ? (
            <div className="border border-gray-200 rounded-lg overflow-hidden" style={{ height: '600px' }}>
              <iframe src={embedUrl} className="w-full h-full" allowFullScreen title="Figma Design Preview" />
            </div>
          ) : (
            <EmptyState
              icon={
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="No Figma design linked"
              message="Add a Figma URL above to embed the component design."
            />
          )}
        </div>
      </section>

      <hr className="border-gray-100" />

      {/* Component Properties */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Component Properties
        </h3>
        <ComponentPropertiesTable dialogSchema={dialogSchema} setDialogSchema={setDialogSchema} />
      </section>

      <hr className="border-gray-100" />

      {/* Interaction States */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Interaction States
        </h3>
        {variants.length > 0 ? (
          <InteractionStatesMatrix variants={variants} />
        ) : (
          <p className="text-sm text-gray-400 text-center py-8">No variants defined. Add variants in the Overview tab.</p>
        )}
      </section>
    </div>
  );
}
