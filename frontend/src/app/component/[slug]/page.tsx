'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { componentApi } from '@/lib/api';
import { ComponentTabs } from '@/components/detail/ComponentTabs';
import { ComponentStatus } from '@aem-portal/shared';
import type { Component } from '@aem-portal/shared';
import { isValidFigmaUrl } from '@/lib/figmaUtils';
import Link from 'next/link';

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
      azureDevOpsWorkItem !== (component.azureDevOpsWorkItem || '');

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

    const updateData = {
      title,
      description,
      status,
      figmaLink,
      authoringNotes,
      designSpecsNotes,
      variants,
      azureDevOpsWorkItem,
      visualAssets: {
        thumbnailUrl: finalThumbnailUrl,
      },
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
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
            {component.ownerTeam && (
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                {component.ownerTeam}
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

            {/* Azure DevOps Work Item */}
            {azureDevOpsWorkItem && (
              <a
                href={azureDevOpsWorkItem.startsWith('http') ? azureDevOpsWorkItem : `https://dev.azure.com/${azureDevOpsWorkItem}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-primary-600 hover:text-primary-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Azure DevOps
              </a>
            )}
          </div>

          {/* Azure DevOps Input (if empty) */}
          {!azureDevOpsWorkItem && (
            <div className="mt-4">
              <input
                type="text"
                value={azureDevOpsWorkItem}
                onChange={(e) => setAzureDevOpsWorkItem(e.target.value)}
                className="text-sm px-3 py-2 border border-gray-300 rounded-md w-96 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Azure DevOps work item URL or ID..."
              />
            </div>
          )}

          {/* Tags */}
          {component.tags && component.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {component.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
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
