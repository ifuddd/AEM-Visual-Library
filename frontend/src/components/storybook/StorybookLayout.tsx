'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StorybookUIState, ViewportKey, BackgroundKey, AddonTab } from '@/lib/storybook/types';
import { storiesRegistry, DEFAULT_STORY_ID } from '@/lib/storybook/storiesRegistry';
import { findStoryById, buildInitialControlValues } from '@/lib/storybook/utils';
import { StorybookTopBar } from './StorybookTopBar';
import { StorybookSidebar } from './StorybookSidebar';
import { StorybookCanvas } from './StorybookCanvas';
import { AddonsPanel } from './AddonsPanel';

function getInitialStoryId(pathParam: string | null): string {
  if (!pathParam) return DEFAULT_STORY_ID;
  const id = pathParam.startsWith('/story/') ? pathParam.slice('/story/'.length) : pathParam;
  return findStoryById(id, storiesRegistry) ? id : DEFAULT_STORY_ID;
}

export function StorybookLayout() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState<StorybookUIState>(() => {
    const storyId = getInitialStoryId(searchParams.get('path'));
    const found = findStoryById(storyId, storiesRegistry)!;
    return {
      selectedStoryId: storyId,
      controlValues: buildInitialControlValues(found.component, found.story),
      viewport: 'desktop',
      background: 'light',
      zoom: 1,
      addonsOpen: true,
      sidebarOpen: true,
      activeAddon: 'controls',
    };
  });

  // Sync URL
  useEffect(() => {
    const next = `/story/${state.selectedStoryId}`;
    if ((searchParams.get('path') ?? '') !== next) {
      router.replace(`/storybook?path=${next}`, { scroll: false });
    }
  }, [state.selectedStoryId, router, searchParams]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === 's') setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }));
      if (e.key === 'a') setState((s) => ({ ...s, addonsOpen: !s.addonsOpen }));
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const selectStory = useCallback((storyId: string) => {
    const found = findStoryById(storyId, storiesRegistry);
    if (!found) return;
    setState((s) => ({
      ...s,
      selectedStoryId: storyId,
      controlValues: buildInitialControlValues(found.component, found.story),
    }));
  }, []);

  const handleControlChange = useCallback((key: string, value: any) => {
    setState((s) => ({ ...s, controlValues: { ...s.controlValues, [key]: value } }));
  }, []);

  const handleResetControls = useCallback(() => {
    const found = findStoryById(state.selectedStoryId, storiesRegistry);
    if (!found) return;
    setState((s) => ({
      ...s,
      controlValues: buildInitialControlValues(found.component, found.story),
    }));
  }, [state.selectedStoryId]);

  const found = findStoryById(state.selectedStoryId, storiesRegistry);
  if (!found) return null;
  const { component, story } = found;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white">
      <StorybookTopBar
        sidebarOpen={state.sidebarOpen}
        onToggleSidebar={() => setState((s) => ({ ...s, sidebarOpen: !s.sidebarOpen }))}
      />

      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {state.sidebarOpen && (
          <StorybookSidebar
            components={storiesRegistry}
            selectedStoryId={state.selectedStoryId}
            onStorySelect={selectStory}
          />
        )}

        <div className="flex flex-col flex-1 min-w-0 min-h-0 overflow-hidden">
          <StorybookCanvas
            component={component}
            story={story}
            controlValues={state.controlValues}
            viewport={state.viewport}
            background={state.background}
            zoom={state.zoom}
            onViewportChange={(v: ViewportKey) => setState((s) => ({ ...s, viewport: v }))}
            onBackgroundChange={(b: BackgroundKey) => setState((s) => ({ ...s, background: b }))}
            onZoomChange={(z: number) => setState((s) => ({ ...s, zoom: z }))}
          />

          {state.addonsOpen && (
            <AddonsPanel
              activeTab={state.activeAddon}
              onTabChange={(tab: AddonTab) => setState((s) => ({ ...s, activeAddon: tab }))}
              component={component}
              controls={component.controls}
              controlValues={state.controlValues}
              onControlChange={handleControlChange}
              onResetControls={handleResetControls}
            />
          )}
        </div>

        {/* Addons toggle button */}
        <button
          onClick={() => setState((s) => ({ ...s, addonsOpen: !s.addonsOpen }))}
          className="absolute bottom-4 right-4 w-8 h-8 bg-white border border-gray-200 rounded-full shadow-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:shadow-lg transition-all z-30"
          title="Toggle addons (A)"
        >
          <svg
            className={`w-4 h-4 transition-transform ${state.addonsOpen ? '' : 'rotate-180'}`}
            fill="none" viewBox="0 0 24 24" stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
}
