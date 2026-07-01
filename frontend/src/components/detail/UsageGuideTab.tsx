'use client';

import { CollapsibleSection } from './CollapsibleSection';
import { RichTextEditor } from './RichTextEditor';
import { EmptyState } from './EmptyState';

interface UsageGuideTabProps {
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
}

export function UsageGuideTab({
  authoringNotes,
  setAuthoringNotes,
}: UsageGuideTabProps) {
  const hasContent = authoringNotes && authoringNotes.trim() && authoringNotes !== '<p></p>';

  return (
    <div className="space-y-6">
      {/* Authoring Guide Section */}
      <CollapsibleSection title="Usage Guide for Content Authors" defaultOpen={true} icon="📖">
        {hasContent ? (
          <RichTextEditor
            content={authoringNotes}
            onChange={setAuthoringNotes}
            placeholder="Explain how to use this component in AEM: Touch UI Dialog fields, authoring steps, best practices, examples..."
          />
        ) : (
          <div className="space-y-4">
            <EmptyState
              icon={
                <svg
                  className="w-12 h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              }
              title="No usage guide yet"
              message="Help content authors understand how to configure and use this component in the AEM Touch UI. Include Dialog field descriptions, authoring steps, best practices, and examples."
              action={{
                label: 'Start Writing Usage Guide',
                onClick: () => setAuthoringNotes('<h2>Usage Guide</h2><p></p>'),
              }}
            />
          </div>
        )}
      </CollapsibleSection>

      {/* Additional Help Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 What to include in the usage guide</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Touch UI Dialog field descriptions and required fields</li>
          <li>• Step-by-step authoring instructions</li>
          <li>• Best practices and common use cases</li>
          <li>• Examples with screenshots or links</li>
          <li>• Limitations and what to avoid</li>
          <li>• Troubleshooting tips for content authors</li>
        </ul>
      </div>
    </div>
  );
}
