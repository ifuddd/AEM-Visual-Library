'use client';

import { RichTextEditor } from './RichTextEditor';
import type { ComponentVariant, AEMMetadata } from '@aem-portal/shared';
import {
  BookOpenIcon,
  RectangleGroupIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UsageGuideTabProps {
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
  variants: ComponentVariant[];
  aemMetadata?: AEMMetadata;
}

export function UsageGuideTab({
  authoringNotes,
  setAuthoringNotes,
  variants,
  aemMetadata,
}: UsageGuideTabProps) {
  return (
    <div className="space-y-6">
      {/* Section 1: Component Styling Options (Variants) */}
      {variants && variants.length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <RectangleGroupIcon className="w-5 h-5 text-gray-500" />
            Available Styling Options
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {variants.map((variant) => (
              <div key={variant.id} className="border border-gray-200 rounded-lg p-4">
                {variant.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded mb-3 overflow-hidden relative">
                    <Image
                      src={variant.imageUrl}
                      alt={variant.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h4 className="font-medium text-gray-900">{variant.name}</h4>
                {variant.description && (
                  <p className="text-sm text-gray-600 mt-1">{variant.description}</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-4">
            These variants can be selected in the AEM Touch UI dialog when authoring.
          </p>
        </div>
      )}

      {/* Section 2: Limitations & Constraints */}
      {aemMetadata?.limitations && aemMetadata.limitations.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-900">
            <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
            When NOT to Use (Limitations)
          </h3>
          <ul className="space-y-2">
            {aemMetadata.limitations.map((limitation, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-amber-900">
                <XCircleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{limitation}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Section 3: Usage Guidance (Rich Text Editor) */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BookOpenIcon className="w-5 h-5 text-gray-500" />
          Usage Guidelines
        </h3>
        <RichTextEditor
          content={authoringNotes}
          onChange={setAuthoringNotes}
          placeholder="When to use this component:
• Best for [use case]
• Ideal when [scenario]
• Recommended for [context]

How to configure:
1. [Step one]
2. [Step two]

Best practices:
• [Practice one]
• [Practice two]

Examples:
[Describe example scenarios]"
        />
        <p className="text-xs text-gray-500 mt-2">
          Provide clear guidance on when this component should be used, configuration steps, best practices, and examples.
        </p>
      </div>

      {/* Section 4: AEM Dialog Fields Reference */}
      {aemMetadata?.dialogSchema && Object.keys(aemMetadata.dialogSchema).length > 0 && (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <WrenchScrewdriverIcon className="w-5 h-5 text-gray-500" />
            Dialog Fields Reference
          </h3>
          <div className="space-y-3">
            {Object.entries(aemMetadata.dialogSchema).map(([fieldName, config]: [string, any]) => (
              <div key={fieldName} className="border-l-2 border-primary-500 pl-4 py-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {fieldName}
                  </code>
                  <span className="text-xs text-gray-500">
                    ({config.type})
                  </span>
                  {config.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                {config.maxlength && (
                  <p className="text-xs text-gray-500 mt-1">Max length: {config.maxlength}</p>
                )}
                {config.options && Array.isArray(config.options) && (
                  <p className="text-xs text-gray-500 mt-1">
                    Options: {config.options.join(', ')}
                  </p>
                )}
                {config.rootPath && (
                  <p className="text-xs text-gray-500 mt-1">Root path: {config.rootPath}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
