'use client';

import { useEffect, useRef, useState } from 'react';
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
  const [animationData, setAnimationData] = useState<any>(null);
  const [error, setError] = useState(false);

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
        setAnimationData(data);
        setError(false);
      })
      .catch((error) => {
        console.error('Error loading Lottie animation:', error);
        setError(true);
      });
  }, [animationPath]);

  const width = sizeMap[size];
  const height = sizeMap[size];

  // Show nothing while loading or on error
  if (!animationData || error) {
    return (
      <div
        style={{
          width,
          height,
        }}
        className={className}
      />
    );
  }

  return (
    <div
      style={{
        width,
        height,
      }}
      className={className}
    >
      <Lottie
        lottieRef={lottieRef}
        animationData={animationData}
        loop={loop}
        autoplay={autoplay}
      />
    </div>
  );
}
