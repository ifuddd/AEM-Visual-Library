'use client';

import { useRef, useState } from 'react';
import type { ComponentVariant, ComponentVariantStateImages } from '@aem-portal/shared';
import { ComponentImage } from '@/components/common/ComponentImage';

const STATE_KEYS: { key: keyof ComponentVariantStateImages; label: string }[] = [
  { key: 'default', label: 'Default' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'disabled', label: 'Disabled' },
  { key: 'active', label: 'Active' },
];

interface VariantsSectionProps {
  variants: ComponentVariant[];
  setVariants: (value: ComponentVariant[]) => void;
}

export function VariantsSection({ variants, setVariants }: VariantsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ComponentVariant>>({});
  const [useStateImages, setUseStateImages] = useState(false);
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(
    new Set(variants.slice(0, 1).map((v) => v.id))
  );
  const stateFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const toggleVariant = (id: string) => {
    setExpandedVariants((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAdd = () => {
    const newVariant: ComponentVariant = {
      id: `v${Date.now()}`,
      name: '',
      description: '',
      imageUrl: '',
      order: variants.length,
    };
    setEditingId(newVariant.id);
    setEditForm(newVariant);
    setUseStateImages(false);
    setVariants([...variants, newVariant]);
  };

  const handleEdit = (variant: ComponentVariant) => {
    setEditingId(variant.id);
    setEditForm(variant);
    setUseStateImages(!!variant.stateImages);
  };

  const handleSave = () => {
    if (editingId && editForm.name) {
      const merged: Partial<ComponentVariant> = { ...editForm };
      if (useStateImages) {
        merged.imageUrl = undefined;
      } else {
        merged.stateImages = undefined;
      }
      const updatedVariants = variants.map((v) =>
        v.id === editingId ? { ...v, ...merged } : v
      );
      setVariants(updatedVariants);
      setExpandedVariants((prev) => new Set([...prev, editingId]));
      setEditingId(null);
      setEditForm({});
    }
  };

  const handleCancel = () => {
    if (editForm.name === '') {
      setVariants(variants.filter((v) => v.id !== editingId));
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this variant?')) {
      const updatedVariants = variants
        .filter((v) => v.id !== id)
        .map((v, index) => ({ ...v, order: index }));
      setVariants(updatedVariants);
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= variants.length) return;
    const newVariants = [...variants];
    [newVariants[index], newVariants[newIndex]] = [newVariants[newIndex], newVariants[index]];
    newVariants.forEach((v, i) => { v.order = i; });
    setVariants(newVariants);
  };

  const VALID_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const MAX_FILE_SIZE = 5 * 1024 * 1024;

  const readFileAsDataUrl = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const validateImageFile = (file: File): string | null => {
    if (!VALID_IMAGE_TYPES.includes(file.type)) return 'Invalid file type. Use JPG, PNG, WebP, or GIF.';
    if (file.size > MAX_FILE_SIZE) return 'File too large. Maximum 5 MB.';
    return null;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const err = validateImageFile(file);
      if (err) { alert(err); e.target.value = ''; return; }
      const dataUrl = await readFileAsDataUrl(file);
      setEditForm((prev) => ({ ...prev, imageUrl: dataUrl }));
    }
  };

  const handleRemoveImage = () => {
    setEditForm((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleStateImageUpload = async (
    stateKey: keyof ComponentVariantStateImages,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const err = validateImageFile(file);
      if (err) { alert(err); e.target.value = ''; return; }
      const dataUrl = await readFileAsDataUrl(file);
      setEditForm((prev) => ({
        ...prev,
        stateImages: { ...prev.stateImages, [stateKey]: dataUrl },
      }));
    }
  };

  const handleRemoveStateImage = (stateKey: keyof ComponentVariantStateImages) => {
    setEditForm((prev) => {
      const updated = { ...prev.stateImages };
      delete updated[stateKey];
      return { ...prev, stateImages: Object.keys(updated).length ? updated : undefined };
    });
    const ref = stateFileRefs.current[stateKey];
    if (ref) ref.value = '';
  };

  const handleToggleStateImages = (on: boolean) => {
    setUseStateImages(on);
    if (on) {
      setEditForm((prev) => ({ ...prev, imageUrl: undefined, stateImages: prev.stateImages ?? {} }));
    } else {
      setEditForm((prev) => ({ ...prev, stateImages: undefined }));
    }
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-2 text-sm bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Variant
        </button>
      </div>

      <div className="space-y-2">
        {variants.length === 0 ? (
          <div className="text-center py-8 text-gray-500 border border-dashed border-gray-300 rounded-lg">
            No variants added yet. Click "Add Variant" to create one.
          </div>
        ) : (
          variants.map((variant, index) => {
            const isEditing = editingId === variant.id;
            const isExpanded = isEditing || expandedVariants.has(variant.id);
            const stateImages = variant.stateImages as Record<string, string> | undefined;
            const availableStates = STATE_KEYS.filter((s) => stateImages?.[s.key]);

            return (
              <div key={variant.id} className="border border-gray-100 rounded-lg overflow-hidden">
                {/* Accordion header — hidden while editing */}
                {!isEditing ? (
                  <div className="flex items-center w-full px-4 py-3 hover:bg-gray-50 transition-colors">
                    {/* Clickable area to toggle expand */}
                    <button
                      onClick={() => toggleVariant(variant.id)}
                      className="flex-1 flex items-center gap-3 text-left min-w-0"
                    >
                      <span className="text-sm font-medium text-gray-800 truncate">{variant.name}</span>
                      {availableStates.length > 0 ? (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {availableStates.map((s) => s.label).join(' · ')}
                        </span>
                      ) : variant.imageUrl ? (
                        <span className="text-xs text-gray-400 flex-shrink-0">Single image</span>
                      ) : (
                        <span className="text-xs text-gray-300 italic flex-shrink-0">No images</span>
                      )}
                    </button>

                    {/* Action buttons + chevron */}
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <button
                        onClick={() => handleEdit(variant)}
                        className="p-1 text-gray-400 hover:text-primary-600 transition-colors"
                        title="Edit"
                        aria-label={`Edit ${variant.name} variant`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(variant.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete"
                        aria-label={`Delete ${variant.name} variant`}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                      <div className="flex flex-col ml-0.5">
                        <button
                          onClick={() => handleMove(index, 'up')}
                          disabled={index === 0}
                          className="p-0.5 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                          title="Move up"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleMove(index, 'down')}
                          disabled={index === variants.length - 1}
                          className="p-0.5 text-gray-400 hover:text-primary-600 disabled:opacity-30 transition-colors"
                          title="Move down"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </div>
                      <button
                        onClick={() => toggleVariant(variant.id)}
                        className="p-1 ml-1"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        <svg
                          className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Compact header shown while editing */
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-600">
                      {editForm.name || 'New Variant'}
                    </span>
                  </div>
                )}

                {/* Edit form */}
                {isEditing && (
                  <div className="px-4 pb-4 pt-4 space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Variant Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={editForm.name || ''}
                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="e.g., Primary, Large, Mobile"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        value={editForm.description || ''}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe this variant..."
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-sm font-medium text-gray-700">Variant Image</label>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={!useStateImages ? 'font-medium text-gray-900' : 'text-gray-500'}>Single</span>
                          <button
                            type="button"
                            role="switch"
                            aria-checked={useStateImages}
                            onClick={() => handleToggleStateImages(!useStateImages)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${useStateImages ? 'bg-primary-600' : 'bg-gray-300'}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${useStateImages ? 'translate-x-4' : 'translate-x-1'}`} />
                          </button>
                          <span className={useStateImages ? 'font-medium text-gray-900' : 'text-gray-500'}>State matrix</span>
                        </div>
                      </div>

                      {!useStateImages ? (
                        editForm.imageUrl ? (
                          <div className="space-y-2">
                            <div className="max-w-md">
                              <ComponentImage
                                src={editForm.imageUrl}
                                alt="Variant preview"
                                aspectRatio="16/9"
                                className="border border-gray-300 rounded-md"
                              />
                            </div>
                            <button onClick={handleRemoveImage} className="text-sm text-red-600 hover:text-red-700">
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Upload an image showing this variant</p>
                          </div>
                        )
                      ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {STATE_KEYS.map(({ key, label }) => {
                            const url = editForm.stateImages?.[key];
                            return (
                              <div key={key} className="border border-gray-200 rounded-lg overflow-hidden">
                                {url ? (
                                  <div className="relative">
                                    <ComponentImage src={url} alt={label} aspectRatio="16/9" className="w-full" />
                                    <button
                                      onClick={() => handleRemoveStateImage(key)}
                                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-700 text-xs"
                                      aria-label={`Remove ${label} state image`}
                                    >
                                      ×
                                    </button>
                                  </div>
                                ) : (
                                  <label className="flex flex-col items-center justify-center aspect-video cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                    <svg className="w-6 h-6 text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span className="text-xs text-gray-500">Upload</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="hidden"
                                      ref={(el) => { stateFileRefs.current[key] = el; }}
                                      onChange={(e) => handleStateImageUpload(key, e)}
                                    />
                                  </label>
                                )}
                                <div className="px-2 py-1 bg-gray-50 border-t border-gray-200">
                                  <p className="text-xs font-medium text-gray-700">{label}</p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={handleSave}
                        disabled={!editForm.name}
                        className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancel}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* View mode expanded body */}
                {!isEditing && isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    {availableStates.length > 0 ? (
                      <div className="flex gap-4 mt-4 overflow-x-auto pb-1">
                        {availableStates.map(({ key, label }) => (
                          <div key={key} className="flex-shrink-0">
                            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                              {label}
                            </p>
                            <div
                              className="rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                              style={{ width: '320px', height: '180px' }}
                            >
                              <img
                                src={stateImages![key]}
                                alt={`${variant.name} — ${label}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : variant.imageUrl ? (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                          Variant Image
                        </p>
                        <div
                          className="rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                          style={{ width: '320px', height: '180px' }}
                        >
                          <img
                            src={variant.imageUrl}
                            alt={variant.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-gray-300 italic mt-4">No images for this variant.</p>
                    )}
                    {variant.description && (
                      <p className="text-sm text-gray-600 mt-3">{variant.description}</p>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
