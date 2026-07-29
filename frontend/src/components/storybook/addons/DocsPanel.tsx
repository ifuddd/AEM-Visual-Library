'use client';

import { ComponentStories } from '@/lib/storybook/types';

interface DocsPanelProps {
  component: ComponentStories;
}

export function DocsPanel({ component }: DocsPanelProps) {
  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-3xl mx-auto p-4 space-y-5">
        {/* Component header */}
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-base font-bold text-gray-900">{component.title}</h1>
              <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${
                component.status === 'READY'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}>
                {component.status === 'READY' ? 'Ready' : 'In Review'}
              </span>
            </div>
            <p className="text-xs text-gray-500">{component.description}</p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            {component.figmaUrl && (
              <a href={component.figmaUrl} target="_blank" rel="noopener noreferrer"
                className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
                Figma
              </a>
            )}
            {component.adoTicketUrl && (
              <a href={component.adoTicketUrl} target="_blank" rel="noopener noreferrer"
                className="px-2.5 py-1 border border-gray-200 rounded text-xs text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
                ADO
              </a>
            )}
          </div>
        </div>

        {/* Stories */}
        <div>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Stories</h2>
          <div className="flex gap-2 flex-wrap">
            {component.stories.map((story) => (
              <div key={story.id} className="border border-gray-100 rounded px-2.5 py-1 bg-gray-50 text-xs">
                <span className="font-medium text-gray-700">{story.name}</span>
                {story.description && <span className="text-gray-400 ml-1">— {story.description}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Authoring notes */}
        {component.authoringNotes && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Authoring Notes</h2>
            <div
              className="prose prose-xs max-w-none text-gray-700 text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: component.authoringNotes }}
            />
          </div>
        )}

        {/* Design specs */}
        {component.designSpecsNotes && (
          <div>
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Design Specifications</h2>
            <div
              className="prose prose-xs max-w-none text-gray-700 text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: component.designSpecsNotes }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
