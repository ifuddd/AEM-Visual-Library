'use client';

import { RichTextEditor } from './RichTextEditor';

interface UsageGuideTabProps {
  authoringNotes: string;
  setAuthoringNotes: (value: string) => void;
}

export function UsageGuideTab({
  authoringNotes,
  setAuthoringNotes,
}: UsageGuideTabProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-4">Usage Guide for Content Authors</h3>
      <RichTextEditor
        content={authoringNotes}
        onChange={setAuthoringNotes}
        placeholder="Explain how to use this component in AEM Touch UI: Dialog fields, authoring steps, best practices, examples, limitations, and troubleshooting tips..."
      />
    </div>
  );
}
