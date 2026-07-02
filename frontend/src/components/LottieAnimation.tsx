'use client';

import { useEffect, useRef } from 'react';
import Lottie, { LottieRefCurrentProps } from 'lottie-react';

interface LottieAnimationProps {
  animationPath: string;
  size?: 'small' | 'medium' | 'large';
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
}

const sizeMap = {
  small: 48,
  medium: 96,
  large: 144,
};

export function LottieAnimation({
  animationPath,
  size = 'medium',
  loop = false,
  autoplay = true,
  className = '',
}: LottieAnimationProps) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);
  const animationData = useRef<any>(null);

  useEffect(() => {
    // Dynamically import animation JSON
    fetch(animationPath)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load animation: ${animationPath}`);
        }
        return response.json();
      })
      .then((data) => {
        animationData.current = data;
      })
      .catch((error) => {
        console.error('Error loading Lottie animation:', error);
      });
  }, [animationPath]);

  if (!animationData.current) {
    // Return placeholder while loading
    return (
      <div
        style={{
          width: sizeMap[size],
          height: sizeMap[size],
        }}
        className={className}
      />
    );
  }

  return (
    <div
      style={{
        width: sizeMap[size],
        height: sizeMap[size],
      }}
      className={className}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData.current}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
}
