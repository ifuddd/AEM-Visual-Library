'use client';

import { AddonTab, ComponentStories, ControlDefinition } from '@/lib/storybook/types';
import { ControlsPanel } from './addons/ControlsPanel';
import { DocsPanel } from './addons/DocsPanel';
import { AemPanel } from './addons/AemPanel';

interface AddonsPanelProps {
  activeTab: AddonTab;
  onTabChange: (tab: AddonTab) => void;
  component: ComponentStories;
  controls: ControlDefinition[];
  controlValues: Record<string, any>;
  onControlChange: (key: string, value: any) => void;
  onResetControls: () => void;
}

const TABS: { id: AddonTab; label: string }[] = [
  { id: 'controls', label: 'Controls' },
  { id: 'docs', label: 'Docs' },
  { id: 'aem', label: 'AEM' },
];

export function AddonsPanel({
  activeTab,
  onTabChange,
  component,
  controls,
  controlValues,
  onControlChange,
  onResetControls,
}: AddonsPanelProps) {
  return (
    <div className="flex flex-col border-t border-gray-200 bg-white flex-shrink-0" style={{ height: 260 }}>
      {/* Tab bar */}
      <div className="flex items-center border-b border-gray-100 px-3 bg-gray-50 flex-shrink-0">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 text-xs font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.id
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'controls' && (
          <ControlsPanel
            controls={controls}
            values={controlValues}
            onChange={onControlChange}
            onReset={onResetControls}
          />
        )}
        {activeTab === 'docs' && <DocsPanel component={component} />}
        {activeTab === 'aem' && <AemPanel component={component} />}
      </div>
    </div>
  );
}
