'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { componentApi } from '@/lib/api';
import { ComponentTabs } from '@/components/detail/ComponentTabs';
import { ComponentStatus } from '@aem-portal/shared';
import type { Component } from '@aem-portal/shared';
import { isValidFigmaUrl } from '@/lib/figmaUtils';
import Link from 'next/link';
import { LottieAnimation } from '@/components/LottieAnimation';

const statusColors = {
  [ComponentStatus.READY]: 'bg-emerald-100 text-emerald-800',
  [ComponentStatus.IN_REVIEW]: 'bg-amber-100 text-amber-800',
};

export default function ComponentDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const queryClient = useQueryClient();

  const { data: component, isLoading, error } = useQuery({
    queryKey: ['component', slug],
    queryFn: () => componentApi.getBySlug(slug),
  });

  // Editable state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<ComponentStatus>(ComponentStatus.READY);
  const [figmaLink, setFigmaLink] = useState('');
  const [authoringNotes, setAuthoringNotes] = useState('');
  const [designSpecsNotes, setDesignSpecsNotes] = useState('');
  const [variants, setVariants] = useState<any[]>([]);
  const [azureDevOpsWorkItem, setAzureDevOpsWorkItem] = useState('');
  const [limitations, setLimitations] = useState<string[]>([]);
  const [dialogSchema, setDialogSchema] = useState<Record<string, any>>({});

  // Thumbnail state
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailBase64, setThumbnailBase64] = useState<string | null>(null);

  // Save state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Initialize editable fields when component loads
  useEffect(() => {
    if (component) {
      setTitle(component.title);
      setDescription(component.description);
      setStatus(component.status);
      setFigmaLink(component.figmaLink || '');
      setAuthoringNotes(component.authoringNotes || '');
      setDesignSpecsNotes(component.designSpecsNotes || '');
      setVariants(component.variants || []);
      setAzureDevOpsWorkItem(component.azureDevOpsWorkItem || '');
      setLimitations(component.aemMetadata?.limitations || []);
      setDialogSchema(component.aemMetadata?.dialogSchema || {});
      setThumbnailUrl(component.visualAssets?.thumbnailUrl || null);
    }
  }, [component]);

  // Track unsaved changes
  useEffect(() => {
    if (!component) return;

    const hasChanges =
      title !== component.title ||
      description !== component.description ||
      status !== component.status ||
      figmaLink !== (component.figmaLink || '') ||
      authoringNotes !== (component.authoringNotes || '') ||
      designSpecsNotes !== (component.designSpecsNotes || '') ||
      thumbnailBase64 !== null ||
      JSON.stringify(variants) !== JSON.stringify(component.variants || []) ||
      azureDevOpsWorkItem !== (component.azureDevOpsWorkItem || '') ||
      JSON.stringify(limitations) !== JSON.stringify(component.aemMetadata?.limitations || []) ||
      JSON.stringify(dialogSchema) !== JSON.stringify(component.aemMetadata?.dialogSchema || {});

    setHasUnsavedChanges(hasChanges);
  }, [
    title,
    description,
    status,
    figmaLink,
    authoringNotes,
    designSpecsNotes,
    thumbnailBase64,
    variants,
    azureDevOpsWorkItem,
    limitations,
    dialogSchema,
    component,
  ]);

  // Beforeunload warning for unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: (data: Partial<Component>) =>
      fetch(`/api/components/slug/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((res) => {
        if (!res.ok) throw new Error('Update failed');
        return res.json();
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['component', slug] });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    },
    onError: () => {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 3000);
    },
  });

  // Validation before save
  const validateBeforeSave = () => {
    const errors: string[] = [];

    if (!title || title.trim().length < 3) {
      errors.push('Title must be at least 3 characters');
    }

    if (!description || description.trim().length < 10) {
      errors.push('Description must be at least 10 characters');
    }

    if (figmaLink && !isValidFigmaUrl(figmaLink)) {
      errors.push('Invalid Figma URL');
    }

    for (const variant of variants) {
      if (!variant.name || variant.name.trim().length === 0) {
        errors.push('All variants must have a name');
      }
    }

    if (errors.length > 0) {
      alert(errors.join('\n'));
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    // Validate first
    if (!validateBeforeSave()) return;

    setSaveStatus('saving');

    let finalThumbnailUrl = thumbnailUrl;

    // Upload thumbnail if there's a new one (base64)
    if (thumbnailBase64) {
      try {
        const uploadResponse = await fetch('/api/upload/thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: thumbnailBase64 }),
        });

        if (uploadResponse.ok) {
          const { url } = await uploadResponse.json();
          finalThumbnailUrl = url;
        }
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        // Continue with save even if upload fails
      }
    }

    const updateData: any = {
      title,
      description,
      status,
      figmaLink,
      authoringNotes,
      designSpecsNotes,
      variants,
      azureDevOpsWorkItem,
      aemMetadata: {
        ...(component?.aemMetadata || {}),
        limitations,
        dialogSchema,
      },
      ...(finalThumbnailUrl && {
        visualAssets: {
          thumbnailUrl: finalThumbnailUrl,
        },
      }),
    };

    updateMutation.mutate(updateData);
    setThumbnailBase64(null);
    setHasUnsavedChanges(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-8" />
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !component) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 text-red-800 p-4 rounded-lg">
            Component not found
          </div>
          <Link
            href="/catalog"
            className="inline-block mt-4 text-primary-600 hover:text-primary-700 underline"
          >
            ← Back to catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link
            href="/catalog"
            className="inline-flex items-center text-sm text-primary-600 hover:text-primary-700 mb-4"
          >
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to catalog
          </Link>

          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              {/* Editable Title */}
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-3xl font-bold text-gray-900 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none w-full mb-2 px-2 -ml-2"
                placeholder="Component title..."
              />

              {/* Editable Description */}
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="text-gray-600 bg-transparent border-b-2 border-transparent hover:border-gray-300 focus:border-primary-500 focus:outline-none w-full resize-none px-2 -ml-2"
                placeholder="Component description..."
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Status Dropdown */}
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ComponentStatus)}
                className={`px-3 py-1 text-sm font-medium rounded cursor-pointer border-2 border-transparent hover:border-gray-300 focus:outline-none focus:border-primary-500 ${
                  statusColors[status]
                }`}
              >
                <option value={ComponentStatus.READY}>Ready</option>
                <option value={ComponentStatus.IN_REVIEW}>In Review</option>
              </select>

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={saveStatus === 'saving' || !hasUnsavedChanges}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  hasUnsavedChanges
                    ? saveStatus === 'saving'
                      ? 'bg-primary-600 text-white opacity-75'
                      : 'bg-primary-600 text-white hover:bg-primary-700'
                    : saveStatus === 'saved'
                    ? 'bg-green-600 text-white'
                    : saveStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {saveStatus === 'saving' && 'Saving...'}
                {saveStatus === 'saved' && (
                  <span className="flex items-center gap-1">
                    <LottieAnimation
                      animationPath="/animations/success.json"
                      size="small"
                      loop={false}
                      autoplay={true}
                    />
                    Saved
                  </span>
                )}
                {saveStatus === 'error' && (
                  <span className="flex items-center gap-1">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Error
                  </span>
                )}
                {saveStatus === 'idle' && (hasUnsavedChanges ? 'Save Changes' : 'No Changes')}
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {component.aemMetadata?.componentPath && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
                <span className="text-gray-500">AEM:</span>
                <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono">
                  {component.aemMetadata.componentPath.split('/').pop()}
                </code>
              </div>
            )}
            {component.updatedAt && (
              <div className="flex items-center gap-1">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Updated {new Date(component.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Component detail tabs */}
      <main className="container mx-auto px-4 py-8">
        <ComponentTabs
          component={component}
          thumbnailUrl={thumbnailBase64 || thumbnailUrl}
          setThumbnailUrl={(url) => {
            if (url?.startsWith('data:')) {
              setThumbnailBase64(url);
            } else {
              setThumbnailUrl(url);
              setThumbnailBase64(null);
            }
          }}
          variants={variants}
          setVariants={setVariants}
          figmaLink={figmaLink}
          setFigmaLink={setFigmaLink}
          designSpecsNotes={designSpecsNotes}
          setDesignSpecsNotes={setDesignSpecsNotes}
          authoringNotes={authoringNotes}
          setAuthoringNotes={setAuthoringNotes}
          azureDevOpsWorkItem={azureDevOpsWorkItem}
          setAzureDevOpsWorkItem={setAzureDevOpsWorkItem}
          limitations={limitations}
          setLimitations={setLimitations}
          dialogSchema={dialogSchema}
          setDialogSchema={setDialogSchema}
        />
      </main>

      {/* Metadata Footer */}
      <footer className="container mx-auto px-4 py-8">
        <div className="border-t border-gray-200 pt-4 flex justify-between items-center text-xs text-gray-500">
          <div>
            Created: {new Date(component.createdAt).toLocaleDateString()}
          </div>
          <div>
            Last modified: {new Date(component.updatedAt).toLocaleDateString()}
            {component.lastUpdate?.author && ` by ${component.lastUpdate.author}`}
          </div>
        </div>
      </footer>
    </div>
  );
}
