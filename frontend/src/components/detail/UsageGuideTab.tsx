'use client';

import { RichTextEditor } from './RichTextEditor';
import { LimitationsEditor } from './LimitationsEditor';
import { DialogSchemaEditor } from './DialogSchemaEditor';
import type { ComponentVariant, AEMMetadata } from '@aem-portal/shared';
import {
  BookOpenIcon,
  RectangleGroupIcon,
  ExclamationTriangleIcon,
  WrenchScrewdriverIcon
} from '@heroicons/react/24/outline';
import Image from 'next/image';

interface UsageGuideTabProps {
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
  variants: ComponentVariant[];
  aemMetadata?: AEMMetadata;
  limitations: string[];
  setLimitations: (limitations: string[]) => void;
  dialogSchema: Record<string, any>;
  setDialogSchema: (schema: Record<string, any>) => void;
}

export function UsageGuideTab({
  authoringNotes,
  setAuthoringNotes,
  variants,
  aemMetadata,
  limitations,
  setLimitations,
  dialogSchema,
  setDialogSchema,
}: UsageGuideTabProps) {
  return (
    <div className="space-y-6">
      {/* Section 1: Component Styling Options (Variants) - Read Only */}
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
            These variants can be selected in the AEM Touch UI dialog when authoring. To edit styling options, go to the Overview tab.
          </p>
        </div>
      )}

      {/* Section 2: Limitations & Constraints - NOW EDITABLE */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-amber-900">
          <ExclamationTriangleIcon className="w-5 h-5 text-amber-600" />
          When NOT to Use (Limitations)
        </h3>
        {limitations.length > 0 ? (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <LimitationsEditor
              limitations={limitations}
              setLimitations={setLimitations}
            />
          </div>
        ) : (
          <div className="text-center py-8 bg-amber-50 border border-amber-200 rounded-lg">
            <ExclamationTriangleIcon className="w-12 h-12 text-amber-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No limitations defined yet.</p>
            <button
              onClick={() => setLimitations([''])}
              className="px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Add First Limitation
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">
          Document scenarios where this component should NOT be used or technical limitations authors should be aware of.
        </p>
      </div>

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

      {/* Section 4: AEM Dialog Fields Reference - NOW EDITABLE */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <WrenchScrewdriverIcon className="w-5 h-5 text-gray-500" />
          Dialog Fields Reference
        </h3>
        {Object.keys(dialogSchema).length > 0 ? (
          <DialogSchemaEditor
            dialogSchema={dialogSchema}
            setDialogSchema={setDialogSchema}
          />
        ) : (
          <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
            <WrenchScrewdriverIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">No dialog fields defined yet.</p>
            <button
              onClick={() => setDialogSchema({ title: { type: 'textfield', required: true } })}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              Add First Field
            </button>
          </div>
        )}
        <p className="text-xs text-gray-500 mt-4">
          Define the Touch UI dialog fields that authors will see when configuring this component in AEM.
        </p>
      </div>
    </div>
  );
}
