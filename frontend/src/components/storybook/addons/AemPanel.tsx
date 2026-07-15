'use client';

import { ComponentStories } from '@/lib/storybook/types';

interface AemPanelProps {
  component: ComponentStories;
}

export function AemPanel({ component }: AemPanelProps) {
  const hasData =
    component.aemComponentPath ||
    (component.aemAllowedChildren && component.aemAllowedChildren.length > 0) ||
    (component.aemLimitations && component.aemLimitations.length > 0);

  if (!hasData) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-400">
        No AEM metadata available for this component.
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 space-y-4">
      {/* Component Path */}
      {component.aemComponentPath && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Component Path</div>
          <code className="block bg-gray-900 text-green-400 text-xs px-3 py-2 rounded font-mono break-all select-all">
            {component.aemComponentPath}
          </code>
        </div>
      )}

      {/* Allowed Children */}
      {component.aemAllowedChildren && component.aemAllowedChildren.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Allowed Children</div>
          <div className="flex flex-wrap gap-1.5">
            {component.aemAllowedChildren.map((child) => (
              <span key={child} className="px-2 py-0.5 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 font-mono">
                {child}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Limitations */}
      {component.aemLimitations && component.aemLimitations.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Known Limitations</div>
          <ul className="space-y-1">
            {component.aemLimitations.map((lim, i) => (
              <li key={i} className="flex items-start gap-1.5 text-xs text-gray-600">
                <svg className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                {lim}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
