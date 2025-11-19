import type { Component } from '@aem-portal/shared';

interface HistoryTabProps {
  component: Component;
}

export function HistoryTab({ component }: HistoryTabProps) {
  return (
    <div className="space-y-6">
      {/* Last update info */}
      {component.lastUpdate && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Last Update</h3>
          <dl className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Date</dt>
              <dd className="text-gray-900">
                {new Date(component.lastUpdate.date).toLocaleString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Source</dt>
              <dd className="text-gray-900 capitalize">{component.lastUpdate.source}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-600 mb-1">Author</dt>
              <dd className="text-gray-900">{component.lastUpdate.author}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* Created/Updated dates */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Metadata</h3>
        <dl className="space-y-3">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-600">Created</dt>
            <dd className="text-gray-900">
              {new Date(component.createdAt).toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <dt className="text-sm font-medium text-gray-600">Last Modified</dt>
            <dd className="text-gray-900">
              {new Date(component.updatedAt).toLocaleString()}
            </dd>
          </div>
          <div className="flex justify-between py-2">
            <dt className="text-sm font-medium text-gray-600">Component ID</dt>
            <dd className="text-gray-900 font-mono text-sm">{component.slug}</dd>
          </div>
        </dl>
      </div>

      {/* Changelog placeholder */}
      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
        <div className="flex items-start">
          <svg
            className="w-5 h-5 text-blue-500 mt-0.5 mr-3"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">Detailed Changelog</p>
            <p>
              For a complete changelog including all historical updates, please refer to
              the component's repository or Azure DevOps Wiki.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
