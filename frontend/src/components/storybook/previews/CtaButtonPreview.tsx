'use client';

import { Bars3Icon } from '@heroicons/react/24/outline';

interface CtaButtonPreviewProps {
  label?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="1" fill="currentColor" />
    </svg>
  );
}

const SIZE_STYLES: Record<string, { padding: string; text: string; tracking: string; icon: string }> = {
  sm: { padding: 'px-4 py-3', text: 'text-xs', tracking: 'tracking-[0.18px]', icon: 'w-3.5 h-3.5' },
  md: { padding: 'px-6 py-4', text: 'text-base', tracking: 'tracking-[0.24px]', icon: 'w-[18px] h-[18px]' },
  lg: { padding: 'px-8 py-4', text: 'text-[22px]', tracking: 'tracking-[0.33px]', icon: 'w-5 h-5' },
};

export function CtaButtonPreview({
  label = 'Button text',
  variant = 'primary',
  size = 'md',
  disabled = false,
}: CtaButtonPreviewProps) {
  const s = SIZE_STYLES[size] ?? SIZE_STYLES.md;
  const isPrimary = variant === 'primary';

  const variantClass = isPrimary
    ? 'bg-[#deb406] text-[#10263b]'
    : 'bg-transparent border border-[#cfd4d8] text-[#10263b]';

  return (
    <div className="flex items-center justify-center p-8 min-h-[160px]">
      <button
        disabled={disabled}
        className={`inline-flex items-center justify-center gap-4 rounded-full font-medium whitespace-nowrap transition-opacity disabled:opacity-40 disabled:cursor-not-allowed ${s.padding} ${s.text} ${s.tracking} ${variantClass}`}
      >
        <Bars3Icon className={s.icon} />
        <span>{label}</span>
        <TargetIcon className={s.icon} />
      </button>
    </div>
  );
}
