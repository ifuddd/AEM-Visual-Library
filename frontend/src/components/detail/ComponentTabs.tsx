'use client';

import { useState } from 'react';
import type { Component } from '@aem-portal/shared';
import { PreviewTab } from './PreviewTab';
import { DesignerTab } from './DesignerTab';
import { AuthoringTab } from './AuthoringTab';

interface ComponentTabsProps {
  component: Component;
  figmaLink: string;
  setFigmaLink: (value: string) => void;
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
  variants: any[];
  setVariants: (value: any[]) => void;
  azureDevOpsWorkItem: string;
  setAzureDevOpsWorkItem: (value: string) => void;
}

const tabs = [
  { id: 'preview', label: 'Preview', icon: '👁️' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'authoring', label: 'Authoring', icon: '✏️' },
];

export function ComponentTabs({
  component,
  figmaLink,
  setFigmaLink,
  authoringNotes,
  setAuthoringNotes,
  variants,
  setVariants,
  azureDevOpsWorkItem,
  setAzureDevOpsWorkItem,
}: ComponentTabsProps) {
  const [activeTab, setActiveTab] = useState('preview');

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Tab navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-6">
        {activeTab === 'preview' && (
          <PreviewTab figmaLink={figmaLink} />
        )}
        {activeTab === 'designer' && (
          <DesignerTab
            figmaLink={figmaLink}
            setFigmaLink={setFigmaLink}
          />
        )}
        {activeTab === 'authoring' && (
          <AuthoringTab
            authoringNotes={authoringNotes}
            setAuthoringNotes={setAuthoringNotes}
            variants={variants}
            setVariants={setVariants}
          />
        )}
      </div>
    </div>
  );
}
