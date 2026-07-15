'use client';

interface HeroBannerPreviewProps {
  title?: string;
  subtitle?: string;
  alignment?: 'left' | 'center';
  overlay?: 'none' | 'dark' | 'light';
  ctaText?: string;
  ctaSecondaryText?: string;
  bgColor?: string;
}

export function HeroBannerPreview({
  title = 'Experience More with AEM',
  subtitle = 'Build faster, author smarter.',
  alignment = 'left',
  overlay = 'dark',
  ctaText = 'Get Started',
  ctaSecondaryText = 'Learn More',
  bgColor = '#2563eb',
}: HeroBannerPreviewProps) {
  const overlayClass =
    overlay === 'dark' ? 'bg-black/50' : overlay === 'light' ? 'bg-white/30' : '';

  return (
    <div
      className="relative w-full min-h-[320px] flex items-center overflow-hidden rounded-lg"
      style={{ backgroundColor: bgColor }}
    >
      {overlayClass && <div className={`absolute inset-0 ${overlayClass}`} />}
      <div className="absolute right-0 top-0 w-72 h-72 rounded-full bg-white/5 -translate-y-1/3 translate-x-1/3" />
      <div className="absolute right-16 bottom-0 w-56 h-56 rounded-full bg-white/5 translate-y-1/3" />

      <div className={`relative z-10 px-10 py-12 max-w-2xl ${alignment === 'center' ? 'mx-auto text-center' : ''}`}>
        <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">AEM Component</p>
        <h1 className="text-4xl font-bold text-white leading-tight mb-4">{title}</h1>
        {subtitle && <p className="text-white/80 text-lg mb-8">{subtitle}</p>}
        <div className={`flex gap-3 flex-wrap ${alignment === 'center' ? 'justify-center' : ''}`}>
          {ctaText && (
            <button className="px-6 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-sm shadow">
              {ctaText}
            </button>
          )}
          {ctaSecondaryText && (
            <button className="px-6 py-3 border border-white/50 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-sm">
              {ctaSecondaryText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
