'use client';

import { ComponentStories, StoryDefinition } from '@/lib/storybook/types';

interface GenericPreviewProps {
  component: ComponentStories;
  story: StoryDefinition;
  controlValues: Record<string, any>;
}

function NavigationHeaderPreview({ theme = 'light', showSearch = true, sticky = true, logoText = 'My Brand' }: Record<string, any>) {
  const isDark = theme === 'dark';
  return (
    <div className={`w-full rounded-lg overflow-hidden ${isDark ? 'bg-gray-900' : 'bg-white border border-gray-200'} shadow`}>
      <div className={`flex items-center justify-between px-6 py-4 ${isDark ? 'border-b border-gray-700' : 'border-b border-gray-100'}`}>
        <div className={`font-bold text-lg ${isDark ? 'text-white' : 'text-gray-900'}`}>{logoText}</div>
        <nav className="hidden md:flex gap-6">
          {['Home', 'Products', 'About', 'Contact'].map((item) => (
            <span key={item} className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item}</span>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {showSearch && (
            <button className={`p-2 rounded-lg ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          )}
          {sticky && <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>sticky</span>}
        </div>
      </div>
    </div>
  );
}

function AccordionPreview({ allowMultiple = false, theme = 'light', itemTitle = 'What is AEM?' }: Record<string, any>) {
  const isDark = theme === 'dark';
  const items = [
    { title: itemTitle, content: 'Adobe Experience Manager (AEM) is a comprehensive content management solution for building websites, mobile apps and forms.', open: true },
    { title: 'How do components work?', content: 'Components are reusable building blocks authored through the Touch UI dialog.', open: Boolean(allowMultiple) },
    { title: 'What is the AEM Dialog?', content: 'A Touch UI dialog allows authors to configure component properties.', open: false },
  ];
  return (
    <div className={`w-full max-w-xl mx-auto rounded-lg overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-100'}`}>
      {items.map((item, i) => (
        <div key={i}>
          <button className={`w-full flex items-center justify-between px-5 py-4 text-left font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <span>{item.title}</span>
            <svg className={`w-4 h-4 transition-transform ${item.open ? 'rotate-180' : ''} text-gray-400`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {item.open && <div className={`px-5 pb-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{item.content}</div>}
        </div>
      ))}
    </div>
  );
}

function AlertPreview({ type = 'info', message = 'This is an informational alert message.', dismissible = true }: Record<string, any>) {
  const styles: Record<string, { bg: string; border: string; text: string; icon: string }> = {
    info: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-800', icon: 'ℹ' },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', icon: '✓' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', icon: '⚠' },
    error: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-800', icon: '✕' },
  };
  const s = styles[type as string] ?? styles.info;
  return (
    <div className={`w-full max-w-xl mx-auto flex items-start gap-3 px-4 py-3 rounded-lg border ${s.bg} ${s.border}`}>
      <span className={`font-bold text-base flex-shrink-0 ${s.text}`}>{s.icon}</span>
      <span className={`flex-1 text-sm ${s.text}`}>{message}</span>
      {dismissible && <button className={`text-lg leading-none flex-shrink-0 ${s.text} opacity-60 hover:opacity-100`}>×</button>}
    </div>
  );
}

function FormFieldPreview({ label = 'Email Address', placeholder = 'you@example.com', type = 'text', required = false, error = false }: Record<string, any>) {
  return (
    <div className="w-full max-w-sm mx-auto">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {type === 'textarea' ? (
        <textarea rows={4} placeholder={placeholder} readOnly className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${error ? 'border-red-400' : 'border-gray-300'}`} />
      ) : type === 'select' ? (
        <select className={`w-full px-3 py-2 border rounded-lg text-sm ${error ? 'border-red-400' : 'border-gray-300'}`}>
          <option>Option 1</option><option>Option 2</option><option>Option 3</option>
        </select>
      ) : (
        <input type={type} placeholder={placeholder} readOnly className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none ${error ? 'border-red-400' : 'border-gray-300'}`} />
      )}
      {error && <p className="mt-1 text-xs text-red-500">This field has an error.</p>}
    </div>
  );
}

function BreadcrumbPreview({ separator = '/', showHome = true, theme = 'light' }: Record<string, any>) {
  const isDark = theme === 'dark';
  const crumbs = ([showHome ? 'Home' : null, 'Products', 'Components', 'Current Page'].filter(Boolean)) as string[];
  return (
    <nav className={`flex items-center gap-1 text-sm flex-wrap ${isDark ? 'bg-gray-800 px-4 py-3 rounded-lg' : ''}`}>
      {crumbs.map((crumb, i) => (
        <span key={crumb} className="flex items-center gap-1">
          {i < crumbs.length - 1 ? (
            <span className={`hover:underline cursor-pointer ${isDark ? 'text-gray-300' : 'text-primary-600'}`}>{crumb}</span>
          ) : (
            <span className={isDark ? 'text-white font-medium' : 'text-gray-900 font-medium'}>{crumb}</span>
          )}
          {i < crumbs.length - 1 && <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>{separator}</span>}
        </span>
      ))}
    </nav>
  );
}

function TabsPreview({ orientation = 'horizontal', theme = 'light', activeTab = 'Overview' }: Record<string, any>) {
  const isDark = theme === 'dark';
  const tabs = ['Overview', 'Details', 'Resources', 'FAQs'];
  const isVertical = orientation === 'vertical';
  return (
    <div className={`w-full max-w-xl mx-auto ${isVertical ? 'flex' : ''} ${isDark ? 'bg-gray-800' : 'bg-white'} rounded-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
      <div className={`${isVertical ? 'flex flex-col border-r' : 'flex border-b'} ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        {tabs.map((tab) => (
          <button key={tab} className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${isVertical ? 'text-left' : ''} ${tab === activeTab ? `${isDark ? 'text-white border-white' : 'text-primary-600 border-primary-600'}` : `${isDark ? 'text-gray-400 border-transparent' : 'text-gray-500 border-transparent'}`}`}>
            {tab}
          </button>
        ))}
      </div>
      <div className={`p-4 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
        Content for the <strong>{activeTab}</strong> tab appears here.
      </div>
    </div>
  );
}

function ImagePreview({ ratio = '16/9', caption = 'An AEM-managed image asset', showCaption = true }: Record<string, any>) {
  const aspectMap: Record<string, string> = { '16/9': 'aspect-video', '4/3': 'aspect-[4/3]', '1/1': 'aspect-square', '3/2': 'aspect-[3/2]' };
  return (
    <div className="w-full max-w-md mx-auto">
      <div className={`${aspectMap[ratio as string] ?? 'aspect-video'} bg-gradient-to-br from-pink-400 to-rose-600 rounded-lg flex items-center justify-center`}>
        <svg className="w-12 h-12 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      {showCaption && caption && <p className="mt-2 text-xs text-gray-500 text-center italic">{caption}</p>}
    </div>
  );
}

function VideoPlayerPreview({ source = 'youtube', autoplay = false, showControls = true }: Record<string, any>) {
  const colors: Record<string, string> = { youtube: 'from-red-500 to-red-700', vimeo: 'from-blue-400 to-blue-600', 'self-hosted': 'from-gray-600 to-gray-800' };
  const gradient = colors[source as string] ?? colors.youtube;
  return (
    <div className="w-full max-w-xl mx-auto">
      <div className={`aspect-video bg-gradient-to-br ${gradient} rounded-lg flex flex-col items-center justify-center gap-4 relative overflow-hidden`}>
        <svg className="w-16 h-16 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
        <span className="text-white/60 text-sm uppercase tracking-wide">{source}</span>
        {autoplay && <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-0.5 rounded">autoplay</span>}
      </div>
      {showControls && (
        <div className="flex items-center gap-3 mt-2 px-1">
          <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
          <div className="flex-1 h-1 bg-gray-200 rounded-full"><div className="w-1/3 h-full bg-gray-500 rounded-full" /></div>
          <span className="text-xs text-gray-400 flex-shrink-0">1:23 / 4:56</span>
        </div>
      )}
    </div>
  );
}

function TeaserPreview({ variant = 'default', title = 'Teaser Headline', pretitle = 'FEATURED', showImage = true, theme = 'light' }: Record<string, any>) {
  const isDark = theme === 'dark';
  const isHero = variant === 'hero';
  const isPromo = variant === 'promo';
  return (
    <div className={`w-full max-w-sm mx-auto rounded-xl overflow-hidden ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-100'} shadow`}>
      {showImage && (
        <div className={`bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center ${isHero ? 'h-48' : 'h-32'}`}>
          <svg className="w-10 h-10 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
          </svg>
        </div>
      )}
      <div className={`p-5 ${isPromo ? 'bg-gradient-to-r from-violet-600 to-purple-700' : ''}`}>
        <div className={`text-xs font-semibold uppercase tracking-widest mb-1 ${isPromo ? 'text-purple-200' : isDark ? 'text-gray-400' : 'text-primary-500'}`}>{pretitle}</div>
        <h3 className={`font-bold text-lg mb-2 ${isPromo ? 'text-white' : isDark ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
        <p className={`text-sm mb-3 ${isPromo ? 'text-purple-100' : isDark ? 'text-gray-300' : 'text-gray-500'}`}>A versatile content promotion component for enterprise pages.</p>
        <span className={`text-sm font-semibold inline-flex items-center gap-1 ${isPromo ? 'text-white' : 'text-primary-600'}`}>
          Learn More
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </span>
      </div>
    </div>
  );
}

const previewMap: Record<string, React.FC<Record<string, any>>> = {
  'navigation-header': NavigationHeaderPreview,
  accordion: AccordionPreview,
  alert: AlertPreview,
  'form-field': FormFieldPreview,
  breadcrumb: BreadcrumbPreview,
  tabs: TabsPreview,
  image: ImagePreview,
  'video-player': VideoPlayerPreview,
  teaser: TeaserPreview,
};

const slugColors: Record<string, string> = {
  'navigation-header': '#7c3aed',
  accordion: '#ea580c',
  tabs: '#0891b2',
  'form-field': '#65a30d',
  image: '#ec4899',
  'video-player': '#8b5cf6',
  breadcrumb: '#14b8a6',
  teaser: '#6366f1',
};

export function GenericPreview({ component, story, controlValues }: GenericPreviewProps) {
  const SpecificPreview = previewMap[component.slug];
  if (SpecificPreview) {
    return (
      <div className="p-8">
        <SpecificPreview {...controlValues} />
      </div>
    );
  }

  const color = slugColors[component.slug] ?? '#6366f1';
  return (
    <div className="flex items-center justify-center p-8 min-h-[200px]">
      <div className="text-center max-w-sm">
        <div
          className="w-full h-44 rounded-xl flex flex-col items-center justify-center mb-5"
          style={{ backgroundColor: color + '12', border: `2px dashed ${color}40` }}
        >
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: color }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <div className="font-semibold text-gray-700">{component.title}</div>
          <div className="text-xs text-gray-400 mt-1">{story.name}</div>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">{component.description}</p>
      </div>
    </div>
  );
}
