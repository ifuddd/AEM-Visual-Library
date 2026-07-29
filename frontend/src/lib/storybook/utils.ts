import { ComponentStories, StoryDefinition } from './types';

export function findStoryById(
  id: string,
  registry: ComponentStories[]
): { component: ComponentStories; story: StoryDefinition } | null {
  const delimIdx = id.lastIndexOf('--');
  if (delimIdx === -1) return null;
  const slug = id.slice(0, delimIdx);
  const storyId = id.slice(delimIdx + 2);

  const component = registry.find((c) => c.slug === slug);
  if (!component) return null;
  const story = component.stories.find((s) => s.id === storyId);
  if (!story) return null;

  return { component, story };
}

export function buildInitialControlValues(
  component: ComponentStories,
  story: StoryDefinition
): Record<string, any> {
  const defaults: Record<string, any> = {};
  for (const ctrl of component.controls) {
    defaults[ctrl.key] = ctrl.defaultValue;
  }
  return { ...defaults, ...story.args };
}

export function buildStoryId(slug: string, storyId: string): string {
  return `${slug}--${storyId}`;
}
