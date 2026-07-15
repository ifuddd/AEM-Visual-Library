'use client';

import { ComponentStories, StoryDefinition, ViewportKey, BackgroundKey, PreviewMode } from '@/lib/storybook/types';
import { getFigmaEmbedUrl } from '@/lib/figmaUtils';
import { HeroBannerPreview } from './previews/HeroBannerPreview';
import { CtaButtonPreview } from './previews/CtaButtonPreview';

interface StorybookCanvasProps {
  component: ComponentStories;
  story: StoryDefinition;
  controlValues: Record<string, any>;
  viewport: ViewportKey;
  background: BackgroundKey;
  zoom: number;
  previewMode: PreviewMode;
  onViewportChange: (v: ViewportKey) => void;
  onBackgroundChange: (b: BackgroundKey) => void;
  onZoomChange: (z: number) => void;
  onPreviewModeChange: (mode: PreviewMode) => void;
}

function FigmaEmptyState({ componentTitle }: { componentTitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[320px] gap-4 p-8 text-center">
      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
        <svg className="w-6 h-6 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zm-3.5 8H12v7H8.5a3.5 3.5 0 1 1 0-7zM17.5 10a3.5 3.5 0 1 1 0 7h-3.5v-7h3.5zM12 19h-3.5A3.5 3.5 0 1 0 12 22.5V19z"/>
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-700 mb-1">No Figma URL for {componentTitle}</p>
        <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
          Add a <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">figmaUrl</code> to the component entry
          or <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-600">figmaNodeUrl</code> to individual stories
          in <span className="font-medium text-gray-500">storiesRegistry.ts</span>.
        </p>
      </div>
      <p className="text-xs text-gray-300">The URL must be a public Figma share link (anyone with link can view)</p>
    </div>
  );
}

const VIEWPORTS: { key: ViewportKey; label: string; width: string; icon: string }[] = [
  { key: 'mobile', label: 'Mobile', width: '375px', icon: '📱' },
  { key: 'tablet', label: 'Tablet', width: '768px', icon: '📟' },
  { key: 'desktop', label: 'Desktop', width: '100%', icon: '🖥' },
];

const BG_OPTIONS: { key: BackgroundKey; icon: string; title: string }[] = [
  { key: 'light', icon: '☀️', title: 'Light background' },
  { key: 'dark', icon: '🌙', title: 'Dark background' },
  { key: 'transparent', icon: '◻️', title: 'Transparent background' },
];

function renderPreview(component: ComponentStories, values: Record<string, any>) {
  if (component.slug === 'hero-banner') return <HeroBannerPreview {...values} />;
  if (component.slug === 'cta-button') return <CtaButtonPreview {...values} />;
  return null;
}

export function StorybookCanvas({
  component,
  story,
  controlValues,
  viewport,
  background,
  zoom,
  previewMode,
  onViewportChange,
  onBackgroundChange,
  onZoomChange,
  onPreviewModeChange,
}: StorybookCanvasProps) {
  const vpConfig = VIEWPORTS.find((v) => v.key === viewport)!;
  const isFigmaMode = previewMode === 'figma';

  const figmaUrl = story.figmaNodeUrl ?? component.figmaUrl;
  const figmaEmbedUrl = figmaUrl ? getFigmaEmbedUrl(figmaUrl) : undefined;

  const bgClass =
    background === 'dark'
      ? 'bg-gray-900'
      : background === 'transparent'
      ? 'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'16\' height=\'16\'%3E%3Crect width=\'8\' height=\'8\' fill=\'%23e5e7eb\'/%3E%3Crect x=\'8\' y=\'8\' width=\'8\' height=\'8\' fill=\'%23e5e7eb\'/%3E%3C/svg%3E")]'
      : 'bg-white';

  return (
    <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        {/* Live / Design mode toggle */}
        <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md p-0.5">
          <button
            onClick={() => onPreviewModeChange('live')}
            title="Interactive preview with live controls"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
              !isFigmaMode ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Live
          </button>
          <button
            onClick={() => onPreviewModeChange('figma')}
            title="Figma design embed"
            className={`px-2.5 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1 ${
              isFigmaMode ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5zM12 2h3.5a3.5 3.5 0 1 1 0 7H12V2zm-3.5 8H12v7H8.5a3.5 3.5 0 1 1 0-7zM17.5 10a3.5 3.5 0 1 1 0 7h-3.5v-7h3.5zM12 19h-3.5A3.5 3.5 0 1 0 12 22.5V19z"/>
            </svg>
            Design
          </button>
        </div>

        <div className="w-px h-4 bg-gray-200" />

        {/* Viewport switcher — disabled in Figma mode */}
        <div className={`flex items-center gap-0.5 bg-white border border-gray-200 rounded-md p-0.5 transition-opacity ${isFigmaMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {VIEWPORTS.map((vp) => (
            <button
              key={vp.key}
              onClick={() => onViewportChange(vp.key)}
              title={`${vp.label} (${vp.width})`}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                viewport === vp.key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-1">{vp.icon}</span>
              <span className="hidden sm:inline">{vp.label}</span>
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-200" />

        {/* Background switcher — disabled in Figma mode */}
        <div className={`flex items-center gap-0.5 transition-opacity ${isFigmaMode ? 'opacity-30 pointer-events-none' : ''}`}>
          {BG_OPTIONS.map(({ key, icon, title }) => (
            <button
              key={key}
              onClick={() => onBackgroundChange(key)}
              title={title}
              className={`px-2 py-1 rounded text-xs transition-colors ${
                background === key ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {icon}
            </button>
          ))}
        </div>

        <div className="w-px h-4 bg-gray-200" />

        {/* Zoom — disabled in Figma mode */}
        <div className={`flex items-center gap-1 transition-opacity ${isFigmaMode ? 'opacity-30 pointer-events-none' : ''}`}>
          <button
            onClick={() => onZoomChange(Math.max(0.5, Math.round((zoom - 0.25) * 100) / 100))}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded text-sm"
          >
            −
          </button>
          <span className="text-xs text-gray-500 w-9 text-center tabular-nums">{Math.round(zoom * 100)}%</span>
          <button
            onClick={() => onZoomChange(Math.min(1.5, Math.round((zoom + 0.25) * 100) / 100))}
            className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded text-sm"
          >
            +
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex-1 hidden md:flex items-center gap-1 text-xs text-gray-400 truncate ml-2">
          <span className="text-gray-600 font-medium truncate">{component.title}</span>
          <span className="text-gray-300">›</span>
          <span className="truncate">{story.name}</span>
          {isFigmaMode && (
            <span className="ml-1 px-1.5 py-0.5 rounded bg-purple-100 text-purple-600 text-xs font-medium flex-shrink-0">Figma</span>
          )}
        </div>
      </div>

      {/* Canvas area */}
      {isFigmaMode ? (
        <div className="flex-1 overflow-hidden bg-gray-100/70">
          {figmaEmbedUrl ? (
            <iframe
              key={figmaEmbedUrl}
              src={figmaEmbedUrl}
              className="w-full h-full border-0"
              allowFullScreen
              title={`${component.title} — ${story.name} — Figma`}
            />
          ) : (
            <FigmaEmptyState componentTitle={component.title} />
          )}
        </div>
      ) : (
        <div className="flex-1 overflow-auto bg-gray-100/70 p-6">
          <div
            className="mx-auto transition-all duration-200"
            style={{ width: vpConfig.width, maxWidth: '100%' }}
          >
            <div
              className={`rounded-lg overflow-hidden ${bgClass} shadow border border-gray-200`}
              style={
                zoom !== 1
                  ? {
                      transform: `scale(${zoom})`,
                      transformOrigin: 'top left',
                      width: `${Math.round((100 / zoom) * 100) / 100}%`,
                    }
                  : undefined
              }
            >
              {renderPreview(component, controlValues)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
