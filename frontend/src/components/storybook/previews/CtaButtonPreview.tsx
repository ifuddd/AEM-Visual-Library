'use client';

interface CtaButtonPreviewProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export function CtaButtonPreview({
  label = 'Get Started',
  variant = 'primary',
  size = 'md',
  disabled = false,
}: CtaButtonPreviewProps) {
  const base = 'rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed';

  const sizes: Record<string, string> = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  const variants: Record<string, string> = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-primary-100 text-primary-800 hover:bg-primary-200 focus:ring-primary-400',
    ghost: 'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300',
    link: 'text-primary-600 underline hover:text-primary-800 focus:ring-primary-400',
  };

  const allVariants = ['primary', 'secondary', 'ghost', 'link'] as const;

  return (
    <div className="flex items-center justify-center gap-6 flex-wrap p-8 min-h-[160px]">
      {allVariants.map((v) => {
        const isActive = v === variant;
        return (
          <div key={v} className={`text-center transition-opacity ${isActive ? '' : 'opacity-30'}`}>
            <button
              disabled={disabled && isActive}
              className={`${base} ${sizes[size]} ${variants[v]}`}
            >
              {label}
            </button>
            <div className="mt-2 text-xs text-gray-400">{v}</div>
          </div>
        );
      })}
    </div>
  );
}
