'use client';

import { ComponentImage } from '@/components/common/ComponentImage';
import type { ComponentVariantStateImages } from '@aem-portal/shared';

interface StateImageMatrixProps {
  variantName: string;
  stateImages: ComponentVariantStateImages;
  editable?: boolean;
}

export function StateImageMatrix({
  variantName,
  stateImages,
  editable = false
}: StateImageMatrixProps) {
  const states = [
    { key: 'default', label: 'Default', url: stateImages.default },
    { key: 'hover', label: 'Hover', url: stateImages.hover },
    { key: 'focus', label: 'Focus', url: stateImages.focus },
    { key: 'disabled', label: 'Disabled', url: stateImages.disabled },
  ];

  const availableStates = states.filter(s => s.url);

  if (availableStates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-medium text-gray-700">State Variations</h4>
      <div className="grid grid-cols-2 gap-4">
        {availableStates.map(state => (
          <div key={state.key} className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-50">
              <ComponentImage
                src={state.url || null}
                alt={`${variantName} - ${state.label}`}
                aspectRatio="16/9"
                className="w-full"
              />
            </div>
            <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
              <p className="text-xs font-medium text-gray-700">{state.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
