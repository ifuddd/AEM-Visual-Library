'use client';

import { ComponentStories, StoryDefinition, ViewportKey, BackgroundKey } from '@/lib/storybook/types';
import { HeroBannerPreview } from './previews/HeroBannerPreview';
import { CtaButtonPreview } from './previews/CtaButtonPreview';
import { CardPreview } from './previews/CardPreview';
import { GenericPreview } from './previews/GenericPreview';

interface StorybookCanvasProps {
  component: ComponentStories;
  story: StoryDefinition;
  controlValues: Record<string, any>;
  viewport: ViewportKey;
  background: BackgroundKey;
  zoom: number;
  onViewportChange: (v: ViewportKey) => void;
  onBackgroundChange: (b: BackgroundKey) => void;
  onZoomChange: (z: number) => void;
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

function renderPreview(component: ComponentStories, story: StoryDefinition, values: Record<string, any>) {
  switch (component.slug) {
    case 'hero-banner':
      return <HeroBannerPreview {...values} />;
    case 'cta-button':
      return <CtaButtonPreview {...values} />;
    case 'card':
      return <CardPreview {...values} />;
    default:
      return <GenericPreview component={component} story={story} controlValues={values} />;
  }
}

export function StorybookCanvas({
  component,
  story,
  controlValues,
  viewport,
  background,
  zoom,
  onViewportChange,
  onBackgroundChange,
  onZoomChange,
}: StorybookCanvasProps) {
  const vpConfig = VIEWPORTS.find((v) => v.key === viewport)!;

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
        {/* Viewport switcher */}
        <div className="flex items-center gap-0.5 bg-white border border-gray-200 rounded-md p-0.5">
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

        {/* Background switcher */}
        <div className="flex items-center gap-0.5">
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

        {/* Zoom */}
        <div className="flex items-center gap-1">
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
        </div>
      </div>

      {/* Canvas area */}
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
            {renderPreview(component, story, controlValues)}
          </div>
        </div>
      </div>
    </div>
  );
}
