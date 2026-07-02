'use client';

import Image from 'next/image';
import { useState } from 'react';

interface ComponentImageProps {
  src: string | null;
  alt: string;
  aspectRatio?: '16/9' | '4/3' | 'square';
  className?: string;
  fallbackIcon?: React.ReactNode;
}

export function ComponentImage({
  src,
  alt,
  aspectRatio = '16/9',
  className = '',
  fallbackIcon,
}: ComponentImageProps) {
  const [error, setError] = useState(false);

  // Determine if src is base64 data URL
  const isBase64 = src?.startsWith('data:');

  // Map aspect ratios to Tailwind classes
  const aspectClasses = {
    '16/9': 'aspect-video',
    '4/3': 'aspect-[4/3]',
    square: 'aspect-square',
  };

  // Fallback UI
  const FallbackContent = () => (
    <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-100">
      {fallbackIcon || (
        <svg
          className="w-16 h-16"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )}
    </div>
  );

  if (!src || error) {
    return (
      <div className={`${aspectClasses[aspectRatio]} relative overflow-hidden ${className}`}>
        <FallbackContent />
      </div>
    );
  }

  // Use regular img for base64, Next.js Image for URLs
  if (isBase64) {
    return (
      <div className={`${aspectClasses[aspectRatio]} relative overflow-hidden ${className}`}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={() => setError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`${aspectClasses[aspectRatio]} relative overflow-hidden ${className}`}>
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
