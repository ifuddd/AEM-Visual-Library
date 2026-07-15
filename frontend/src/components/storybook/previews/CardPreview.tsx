'use client';

interface CardPreviewProps {
  title?: string;
  description?: string;
  ctaText?: string;
  layout?: 'vertical' | 'horizontal';
  variant?: 'default' | 'elevated' | 'outline';
  showImage?: boolean;
}

export function CardPreview({
  title = 'Card Heading',
  description = 'A brief description of this card content.',
  ctaText = 'Read More',
  layout = 'vertical',
  variant = 'default',
  showImage = true,
}: CardPreviewProps) {
  const containerClass =
    variant === 'elevated'
      ? 'shadow-lg border border-gray-100'
      : variant === 'outline'
      ? 'border-2 border-gray-200'
      : 'border border-gray-100 shadow-sm';

  const isHorizontal = layout === 'horizontal';

  return (
    <div className="flex items-center justify-center p-8">
      <div
        className={`rounded-xl overflow-hidden bg-white ${containerClass} ${
          isHorizontal ? 'flex max-w-lg w-full' : 'max-w-xs w-full'
        }`}
      >
        {showImage && (
          <div
            className={`bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0 ${
              isHorizontal ? 'w-32' : 'h-40 w-full'
            }`}
          >
            <svg className="w-10 h-10 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="p-5 flex flex-col justify-between gap-3 flex-1">
          <div>
            <h3 className="font-bold text-gray-900 text-base mb-1">{title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
          </div>
          {ctaText && (
            <a href="#" className="text-sm font-semibold text-primary-600 hover:text-primary-700 flex items-center gap-1">
              {ctaText}
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
