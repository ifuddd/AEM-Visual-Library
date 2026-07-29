'use client';

import { useState, useMemo } from 'react';
import { ComponentStories } from '@/lib/storybook/types';
import { buildStoryId } from '@/lib/storybook/utils';

interface StorybookSidebarProps {
  components: ComponentStories[];
  selectedStoryId: string;
  onStorySelect: (storyId: string) => void;
}

export function StorybookSidebar({ components, selectedStoryId, onStorySelect }: StorybookSidebarProps) {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState<Set<string>>(() => {
    const slug = selectedStoryId.split('--')[0];
    return new Set([slug]);
  });

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return components;
    return components.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.stories.some((s) => s.name.toLowerCase().includes(q))
    );
  }, [components, search]);

  const toggleExpand = (slug: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectedSlug = selectedStoryId.split('--')[0];

  return (
    <aside className="w-56 flex-shrink-0 flex flex-col border-r border-gray-200 bg-white overflow-hidden">
      {/* Search */}
      <div className="p-2 border-b border-gray-100">
        <div className="relative">
          <svg className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Find component…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoComplete="off"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-md bg-gray-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-2">
        {filtered.length === 0 && (
          <div className="px-4 py-6 text-xs text-gray-400 text-center">No components match</div>
        )}
        {filtered.map((component) => {
          const isExpanded = expanded.has(component.slug);
          const isActive = selectedSlug === component.slug;

          return (
            <div key={component.slug} className="mb-0.5">
              {/* Component group header */}
              <button
                onClick={() => toggleExpand(component.slug)}
                className={`w-full flex items-center gap-2 px-3 py-1.5 text-left transition-colors ${
                  isActive ? 'text-primary-700' : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <svg
                  className={`w-3 h-3 flex-shrink-0 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className={`text-xs font-semibold truncate ${isActive ? 'text-primary-700' : 'text-gray-700'}`}>
                  {component.title}
                </span>
                {component.status === 'IN_REVIEW' && (
                  <span className="ml-auto flex-shrink-0 w-1.5 h-1.5 rounded-full bg-amber-400" title="In Review" />
                )}
              </button>

              {/* Stories list */}
              {isExpanded && (
                <div className="ml-5 border-l border-gray-100">
                  {component.stories.map((story) => {
                    const storyId = buildStoryId(component.slug, story.id);
                    const isSelected = selectedStoryId === storyId;
                    return (
                      <button
                        key={story.id}
                        onClick={() => onStorySelect(storyId)}
                        className={`w-full text-left px-3 py-1.5 text-xs transition-colors truncate block ${
                          isSelected
                            ? 'text-primary-600 font-semibold bg-primary-50'
                            : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        {story.name}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-100 px-3 py-2 flex-shrink-0">
        <div className="text-xs text-gray-400">{components.length} components</div>
      </div>
    </aside>
  );
}
