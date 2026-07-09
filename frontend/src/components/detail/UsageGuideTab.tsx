'use client';

import { LimitationsEditor } from './LimitationsEditor';
import { VariantsSection } from './VariantsSection';
import { ComponentPropertiesTable } from './ComponentPropertiesTable';
import { InteractionStatesMatrix } from './InteractionStatesMatrix';
import type { ComponentVariant, AEMMetadata } from '@aem-portal/shared';

interface UsageGuideTabProps {
  variants: ComponentVariant[];
  setVariants: (variants: ComponentVariant[]) => void;
  aemMetadata?: AEMMetadata;
  limitations: string[];
  setLimitations: (limitations: string[]) => void;
  dialogSchema: Record<string, any>;
  setDialogSchema: (value: Record<string, any>) => void;
}

export function UsageGuideTab({
  variants,
  setVariants,
  limitations,
  setLimitations,
  dialogSchema,
  setDialogSchema,
}: UsageGuideTabProps) {
  return (
    <div className="space-y-10">
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

      <hr className="border-gray-100" />

      {/* Available Styling Options */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          Available Styling Options
        </h3>
        <VariantsSection variants={variants} setVariants={setVariants} />
        <p className="text-xs text-gray-400 mt-4">
          Upload images and add descriptions for each styling variant. These help authors understand the visual differences.
        </p>
      </section>

      <hr className="border-gray-100" />

      {/* When NOT to Use */}
      <section>
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
          When NOT to Use
        </h3>
        {limitations.length > 0 ? (
          <LimitationsEditor limitations={limitations} setLimitations={setLimitations} />
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-gray-400 mb-4">No limitations defined yet.</p>
            <button
              onClick={() => setLimitations([''])}
              className="px-4 py-2 text-sm bg-amber-600 text-white rounded-md hover:bg-amber-700"
            >
              Add First Limitation
            </button>
          </div>
        )}
        <p className="text-xs text-gray-400 mt-4">
          Document scenarios where this component should NOT be used or technical constraints authors should be aware of.
        </p>
      </section>
    </div>
  );
}
