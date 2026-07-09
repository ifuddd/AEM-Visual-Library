'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, XCircleIcon } from '@heroicons/react/24/outline';

interface LimitationsEditorProps {
  limitations: string[];
  setLimitations: (limitations: string[]) => void;
}

export function LimitationsEditor({ limitations, setLimitations }: LimitationsEditorProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const handleAdd = () => {
    setLimitations([...limitations, '']);
    setEditingIndex(limitations.length);
    setEditValue('');
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setEditValue(limitations[index]);
  };

  const handleSave = () => {
    if (editingIndex !== null && editValue.trim()) {
      const updated = [...limitations];
      updated[editingIndex] = editValue.trim();
      setLimitations(updated);
      setEditingIndex(null);
    }
  };

  const handleCancel = () => {
    // If was a new empty item, remove it
    if (editingIndex === limitations.length - 1 && limitations[editingIndex] === '') {
      setLimitations(limitations.slice(0, -1));
    }
    setEditingIndex(null);
  };

  const handleDelete = (index: number) => {
    if (confirm('Delete this limitation?')) {
      setLimitations(limitations.filter((_, i) => i !== index));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div className="space-y-3">
      {limitations.map((limitation, index) => (
        <div key={index} className="border-l-2 border-amber-500 pl-4 py-2">
          {editingIndex === index ? (
            // Edit mode
            <div className="space-y-2">
              <textarea
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-amber-500 focus:border-amber-500"
                placeholder="Describe this limitation..."
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-amber-600 text-white text-sm rounded hover:bg-amber-700"
                  disabled={!editValue.trim()}
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                >
                  Cancel
                </button>
                <span className="text-xs text-gray-500 self-center ml-2">
                  Ctrl+Enter to save, Esc to cancel
                </span>
              </div>
            </div>
          ) : (
            // View mode
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-start gap-2 flex-1">
                <XCircleIcon className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-900">{limitation}</p>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(index)}
                  className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                  title="Edit"
                  aria-label="Edit limitation"
                >
                  <PencilIcon className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(index)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                  aria-label="Delete limitation"
                >
                  <TrashIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleAdd}
        className="flex items-center gap-2 px-3 py-2 text-sm text-amber-600 hover:bg-amber-50 border border-amber-300 rounded-md transition-colors"
      >
        <PlusIcon className="w-4 h-4" />
        Add Limitation
      </button>
    </div>
  );
}
