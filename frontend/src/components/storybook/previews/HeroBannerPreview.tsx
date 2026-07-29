'use client';

import { Lora } from 'next/font/google';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

const lora = Lora({ subsets: ['latin'], weight: ['400'] });

interface HeroBannerPreviewProps {
  title?: string;
  courseType?: string;
  ucasCode?: string;
  showUcasCode?: boolean;
  bgImage?: string;
  showAlert?: boolean;
  alertText?: string;
}

const OVERLAY_GRADIENT =
  'linear-gradient(180deg, rgba(9,21,31,0.79) 0%, rgba(9,21,31,0.79) 5.668%, rgba(9,21,31,0) 23.381%, rgba(9,21,31,0.79) 75.095%, rgba(9,21,31,0.79) 100%)';

// Sky-toned placeholder used until a real photo is supplied via `bgImage`.
const FALLBACK_BACKGROUND = 'linear-gradient(180deg, #0b1a24 0%, #0f2f42 28%, #1c5478 52%, #0f2f42 78%, #0b1a24 100%)';

export function HeroBannerPreview({
  title = 'Course title',
  courseType = 'Bachelor of Engineering with Honors',
  ucasCode = 'H402',
  showUcasCode = true,
  bgImage = '',
  showAlert = true,
  alertText = 'This course is now closed for UK and International applications for 2025 entry. You can start an application for 2026 entry in UCAS, on 14 May 2025.',
}: HeroBannerPreviewProps) {
  return (
    <div
      className="relative w-full min-h-[400px] flex flex-col justify-end overflow-hidden rounded-lg px-10 py-8"
      style={{
        backgroundImage: bgImage ? `url(${bgImage})` : FALLBACK_BACKGROUND,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: OVERLAY_GRADIENT }} />

      <div className="relative z-10 flex flex-col gap-8 w-full">
        <div className="flex flex-col gap-2">
          <div className="flex items-start gap-6">
            <span className="w-px self-stretch bg-white/70" aria-hidden="true" />
            <h1 className={`${lora.className} text-white text-[42px] leading-[1.3] tracking-[-0.21px]`}>{title}</h1>
          </div>
          <div className="flex items-center gap-6 flex-wrap">
            <span className="w-px self-stretch bg-white/70" aria-hidden="true" />
            <p className="text-white text-[22px] tracking-[0.33px] whitespace-nowrap">{courseType}</p>
            {showUcasCode && ucasCode && (
              <>
                <span className="w-px self-stretch bg-white/70" aria-hidden="true" />
                <p className="text-white text-[22px] tracking-[0.33px] whitespace-nowrap">
                  UCAS Code <strong className="font-bold">{ucasCode}</strong>
                </p>
              </>
            )}
          </div>
        </div>

        {showAlert && alertText && (
          <div className="flex items-center gap-4 bg-white rounded-lg p-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-full border border-[#cfd4d8] shrink-0">
              <InformationCircleIcon className="w-5 h-5 text-[#10263b]" />
            </span>
            <p className="text-[#10263b] text-base leading-tight tracking-[0.24px]">{alertText}</p>
          </div>
        )}
      </div>
    </div>
  );
}
