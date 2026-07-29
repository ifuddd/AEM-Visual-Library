import { Suspense } from 'react';
import { StorybookLayout } from '@/components/storybook/StorybookLayout';

export const metadata = {
  title: 'Visual Library | AEM Component Storybook',
};

export default function StorybookPage() {
  return (
    <Suspense>
      <StorybookLayout />
    </Suspense>
  );
}
