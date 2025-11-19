'use client';

import { useState } from 'react';
import type { Component } from '@aem-portal/shared';
import { PreviewTab } from './PreviewTab';
import { DesignerTab } from './DesignerTab';
import { AuthoringTab } from './AuthoringTab';
import { ImplementationTab } from './ImplementationTab';
import { HistoryTab } from './HistoryTab';

interface ComponentTabsProps {
  component: Component;
}

const tabs = [
  { id: 'preview', label: 'Preview', icon: '👁️' },
  { id: 'designer', label: 'Designer', icon: '🎨' },
  { id: 'authoring', label: 'Authoring', icon: '✏️' },
  { id: 'implementation', label: 'Implementation', icon: '💻' },
  { id: 'history', label: 'History', icon: '📜' },
];

export function ComponentTabs({ component }: ComponentTabsProps) {
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
        {activeTab === 'preview' && <PreviewTab component={component} />}
        {activeTab === 'designer' && <DesignerTab component={component} />}
        {activeTab === 'authoring' && <AuthoringTab component={component} />}
        {activeTab === 'implementation' && <ImplementationTab component={component} />}
        {activeTab === 'history' && <HistoryTab component={component} />}
      </div>
    </div>
  );
}
