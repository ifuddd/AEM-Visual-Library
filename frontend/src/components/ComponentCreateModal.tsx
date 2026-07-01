'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ComponentStatus } from '@aem-portal/shared';

interface ComponentCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  teams: string[];
}

export function ComponentCreateModal({ isOpen, onClose, teams }: ComponentCreateModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ownerTeam: '',
    status: ComponentStatus.IN_REVIEW,
  });

  const [validationErrors, setValidationErrors] = useState({
    title: '',
    description: '',
    ownerTeam: '',
  });

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {
      title: '',
      description: '',
      ownerTeam: '',
    };

    if (!formData.title || formData.title.length < 3 || formData.title.length > 100) {
      errors.title = 'Title must be between 3 and 100 characters';
    }

    if (!formData.description || formData.description.length < 10 || formData.description.length > 500) {
      errors.description = 'Description must be between 10 and 500 characters';
    }

    if (!formData.ownerTeam) {
      errors.ownerTeam = 'Owner team is required';
    }

    setValidationErrors(errors);
    return !Object.values(errors).some(err => err !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/components', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error?.message || 'Failed to create component');
      }

      // Redirect to the new component's detail page
      router.push(`/component/${result.data.slug}`);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create component');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        title: '',
        description: '',
        ownerTeam: '',
        status: ComponentStatus.IN_REVIEW,
      });
      setValidationErrors({ title: '', description: '', ownerTeam: '' });
      setError(null);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Create New Component</h2>
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-800 p-4 rounded-md">
              {error}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Component Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="e.g., Hero Banner"
              disabled={isSubmitting}
            />
            {validationErrors.title && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.title}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">3-100 characters</p>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Describe the component's purpose and key features..."
              disabled={isSubmitting}
            />
            {validationErrors.description && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">10-500 characters</p>
          </div>

          {/* Owner Team */}
          <div>
            <label htmlFor="ownerTeam" className="block text-sm font-medium text-gray-700 mb-1">
              Owner Team <span className="text-red-500">*</span>
            </label>
            <select
              id="ownerTeam"
              value={formData.ownerTeam}
              onChange={(e) => setFormData({ ...formData, ownerTeam: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-primary-500 focus:border-primary-500 ${
                validationErrors.ownerTeam ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isSubmitting}
            >
              <option value="">Select a team...</option>
              {teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            {validationErrors.ownerTeam && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.ownerTeam}</p>
            )}
          </div>

          {/* Initial Status */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Initial Status
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as ComponentStatus })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
              disabled={isSubmitting}
            >
              <option value={ComponentStatus.IN_REVIEW}>In Review</option>
              <option value={ComponentStatus.READY}>Ready</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">Components typically start as "In Review"</p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Component'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
