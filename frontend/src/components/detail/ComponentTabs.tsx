'use client';

import { useState } from 'react';
import type { Component, ComponentVariant } from '@aem-portal/shared';
import { OverviewTab } from './OverviewTab';
import { DesignSpecsTab } from './DesignSpecsTab';
import { UsageGuideTab } from './UsageGuideTab';
import { DocumentTextIcon, SwatchIcon, BookOpenIcon } from '@heroicons/react/24/outline';

interface ComponentTabsProps {
  component: Component;

  // Overview tab
  thumbnailUrl: string | null;
  setThumbnailUrl: (value: string | null) => void;
  variants: ComponentVariant[];
  setVariants: (value: ComponentVariant[]) => void;

  // Design specs tab
  figmaLink: string;
  setFigmaLink: (value: string) => void;
  designSpecsNotes: string;
  setDesignSpecsNotes: (value: string) => void;

  // Usage guide tab
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;

  // Metadata
  azureDevOpsWorkItem: string;
  setAzureDevOpsWorkItem: (value: string) => void;
}

const tabs = [
  { id: 'overview', label: 'Overview', Icon: DocumentTextIcon },
  { id: 'design-specs', label: 'Design specs', Icon: SwatchIcon },
  { id: 'usage-guide', label: 'Usage guide', Icon: BookOpenIcon },
];

export function ComponentTabs({
  component,
  thumbnailUrl,
  setThumbnailUrl,
  variants,
  setVariants,
  figmaLink,
  setFigmaLink,
  designSpecsNotes,
  setDesignSpecsNotes,
  authoringNotes,
  setAuthoringNotes,
  azureDevOpsWorkItem,
  setAzureDevOpsWorkItem,
}: ComponentTabsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <tab.Icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab
            description={component.description}
            thumbnailUrl={thumbnailUrl}
            onThumbnailChange={setThumbnailUrl}
            variants={variants}
            setVariants={setVariants}
            azureDevOpsWorkItem={azureDevOpsWorkItem}
            setAzureDevOpsWorkItem={setAzureDevOpsWorkItem}
          />
        )}
        {activeTab === 'design-specs' && (
          <DesignSpecsTab
            figmaLink={figmaLink}
            setFigmaLink={setFigmaLink}
            designSpecsNotes={designSpecsNotes}
            setDesignSpecsNotes={setDesignSpecsNotes}
          />
        )}
        {activeTab === 'usage-guide' && (
          <UsageGuideTab
            authoringNotes={authoringNotes}
            setAuthoringNotes={setAuthoringNotes}
          />
        )}
      </div>
    </div>
  );
}
