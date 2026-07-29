'use client';

import { useState } from 'react';
import type { ComponentVariant } from '@aem-portal/shared';

interface InteractionStatesMatrixProps {
  variants: ComponentVariant[];
}

const STATE_KEYS = ['default', 'hover', 'focus', 'disabled', 'active'] as const;
const STATE_LABELS: Record<string, string> = {
  default: 'Default',
  hover: 'Hover',
  focus: 'Focus',
  disabled: 'Disabled',
  active: 'Active',
};

export function InteractionStatesMatrix({ variants }: InteractionStatesMatrixProps) {
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(variants.slice(0, 1).map((v) => v.id))
  );

  const toggleVariant = (id: string) => {
    setExpandedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const hasAnyStateImages = variants.some((v) => v.stateImages && Object.values(v.stateImages).some(Boolean));

  if (!hasAnyStateImages) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400">No interaction state images uploaded yet.</p>
        <p className="text-xs text-gray-300 mt-1">State images can be added per variant in the Overview tab.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {variants.map((variant) => {
        const stateImages = variant.stateImages as Record<string, string> | undefined;
        const availableStates = STATE_KEYS.filter((k) => stateImages?.[k]);
        const isExpanded = expandedVariants.has(variant.id);

        return (
          <div key={variant.id} className="border border-gray-100 rounded-lg overflow-hidden">
            <button
              onClick={() => toggleVariant(variant.id)}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm font-medium text-gray-800">{variant.name}</span>
              <div className="flex items-center gap-3">
                {availableStates.length > 0 ? (
                  <span className="text-xs text-gray-400">
                    {availableStates.map((k) => STATE_LABELS[k]).join(' · ')}
                  </span>
                ) : (
                  <span className="text-xs text-gray-300 italic">No state images</span>
                )}
                <svg
                  className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </button>

            {isExpanded && availableStates.length > 0 && (
              <div className="px-4 pb-4 border-t border-gray-100">
                <div className="flex gap-4 mt-4 overflow-x-auto pb-1">
                  {availableStates.map((stateKey) => (
                    <div key={stateKey} className="flex-shrink-0">
                      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                        {STATE_LABELS[stateKey]}
                      </p>
                      <div
                        className="rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                        style={{ width: '320px', height: '180px' }}
                      >
                        <img
                          src={stateImages![stateKey]}
                          alt={`${variant.name} — ${STATE_LABELS[stateKey]}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isExpanded && availableStates.length === 0 && (
              <div className="px-4 pb-4 pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-300 italic">No state images for this variant.</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
