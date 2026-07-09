'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface ComponentPropertiesTableProps {
  dialogSchema: Record<string, any>;
  setDialogSchema: (schema: Record<string, any>) => void;
}

const FIELD_TYPES = ['textfield', 'textarea', 'select', 'checkbox', 'pathbrowser', 'pathfield', 'number'];

interface EditingField {
  originalName: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
}

export function ComponentPropertiesTable({ dialogSchema, setDialogSchema }: ComponentPropertiesTableProps) {
  const [editingField, setEditingField] = useState<EditingField | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newField, setNewField] = useState<EditingField>({
    originalName: '',
    name: '',
    type: 'textfield',
    required: false,
    description: '',
  });

  const entries = Object.entries(dialogSchema);

  const startEdit = (fieldName: string, config: any) => {
    setEditingField({
      originalName: fieldName,
      name: fieldName,
      type: config.type || 'textfield',
      required: config.required || false,
      description: config.description || '',
    });
    setIsAddingNew(false);
  };

  const saveEdit = () => {
    if (!editingField || !editingField.name.trim()) return;
    const updated = { ...dialogSchema };
    if (editingField.originalName !== editingField.name) {
      delete updated[editingField.originalName];
    }
    updated[editingField.name] = {
      ...dialogSchema[editingField.originalName],
      type: editingField.type,
      required: editingField.required || undefined,
      description: editingField.description || undefined,
    };
    setDialogSchema(updated);
    setEditingField(null);
  };

  const cancelEdit = () => setEditingField(null);

  const startAdd = () => {
    setIsAddingNew(true);
    setEditingField(null);
    setNewField({ originalName: '', name: '', type: 'textfield', required: false, description: '' });
  };

  const saveNew = () => {
    if (!newField.name.trim()) return;
    const updated = {
      ...dialogSchema,
      [newField.name]: {
        type: newField.type,
        required: newField.required || undefined,
        description: newField.description || undefined,
      },
    };
    setDialogSchema(updated);
    setIsAddingNew(false);
  };

  const cancelAdd = () => setIsAddingNew(false);

  const deleteField = (fieldName: string) => {
    if (!confirm(`Delete field "${fieldName}"?`)) return;
    const updated = { ...dialogSchema };
    delete updated[fieldName];
    setDialogSchema(updated);
  };

  if (entries.length === 0 && !isAddingNew) {
    return (
      <div className="text-center py-10">
        <p className="text-sm text-gray-400 mb-4">No dialog fields defined yet.</p>
        <button
          onClick={startAdd}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add field
        </button>
      </div>
    );
  }

  return (
    <div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-gray-400 w-36">Property</th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-gray-400 w-28">Type</th>
            <th className="text-left py-2 pr-4 text-xs font-semibold uppercase tracking-widest text-gray-400 w-20">Required</th>
            <th className="text-left py-2 text-xs font-semibold uppercase tracking-widest text-gray-400">Description</th>
            <th className="w-16" />
          </tr>
        </thead>
        <tbody>
          {entries.map(([fieldName, config]) => (
            <tr key={fieldName} className="border-b border-gray-100 group">
              {editingField?.originalName === fieldName ? (
                <td colSpan={5} className="py-3">
                  <div className="flex flex-wrap gap-3 items-end">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={editingField.name}
                        onChange={(e) => setEditingField({ ...editingField, name: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm font-mono w-36 focus:outline-none focus:border-primary-500"
                        autoFocus
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Type</label>
                      <select
                        value={editingField.type}
                        onChange={(e) => setEditingField({ ...editingField, type: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm w-32 focus:outline-none focus:border-primary-500"
                      >
                        {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center gap-1.5 pb-1.5">
                      <input
                        type="checkbox"
                        id={`req-${fieldName}`}
                        checked={editingField.required}
                        onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                        className="rounded border-gray-300"
                      />
                      <label htmlFor={`req-${fieldName}`} className="text-sm text-gray-600">Required</label>
                    </div>
                    <div className="flex-1 min-w-48">
                      <label className="block text-xs text-gray-500 mb-1">Description</label>
                      <input
                        type="text"
                        value={editingField.description}
                        onChange={(e) => setEditingField({ ...editingField, description: e.target.value })}
                        className="px-2 py-1.5 border border-gray-300 rounded text-sm w-full focus:outline-none focus:border-primary-500"
                        placeholder="What this field configures..."
                        onKeyDown={(e) => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit(); }}
                      />
                    </div>
                    <div className="flex gap-1 pb-1.5">
                      <button onClick={saveEdit} className="p-1.5 bg-primary-600 text-white rounded hover:bg-primary-700" title="Save">
                        <CheckIcon className="w-4 h-4" />
                      </button>
                      <button onClick={cancelEdit} className="p-1.5 text-gray-500 border border-gray-300 rounded hover:bg-gray-50" title="Cancel">
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </td>
              ) : (
                <>
                  <td className="py-3 pr-4 align-top">
                    <code className="text-xs font-mono bg-gray-50 px-1.5 py-0.5 rounded text-gray-800">{fieldName}</code>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <span className="text-xs text-gray-500">{config.type || '—'}</span>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    {config.required ? (
                      <span className="inline-block text-xs bg-red-50 text-red-600 px-1.5 py-0.5 rounded">Yes</span>
                    ) : (
                      <span className="text-xs text-gray-300">No</span>
                    )}
                  </td>
                  <td className="py-3 pr-4 align-top text-gray-600">
                    {config.description || <span className="text-gray-300 italic">No description</span>}
                  </td>
                  <td className="py-3 align-top">
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(fieldName, config)}
                        className="p-1 text-gray-400 hover:text-primary-600 rounded"
                        title="Edit"
                      >
                        <PencilIcon className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteField(fieldName)}
                        className="p-1 text-gray-400 hover:text-red-600 rounded"
                        title="Delete"
                      >
                        <TrashIcon className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}

          {/* Add new field row */}
          {isAddingNew && (
            <tr className="border-b border-gray-100">
              <td colSpan={5} className="py-3">
                <div className="flex flex-wrap gap-3 items-end">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Name</label>
                    <input
                      type="text"
                      value={newField.name}
                      onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                      className="px-2 py-1.5 border border-primary-300 rounded text-sm font-mono w-36 focus:outline-none focus:border-primary-500"
                      placeholder="fieldName"
                      autoFocus
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Type</label>
                    <select
                      value={newField.type}
                      onChange={(e) => setNewField({ ...newField, type: e.target.value })}
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm w-32 focus:outline-none focus:border-primary-500"
                    >
                      {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center gap-1.5 pb-1.5">
                    <input
                      type="checkbox"
                      id="new-required"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="rounded border-gray-300"
                    />
                    <label htmlFor="new-required" className="text-sm text-gray-600">Required</label>
                  </div>
                  <div className="flex-1 min-w-48">
                    <label className="block text-xs text-gray-500 mb-1">Description</label>
                    <input
                      type="text"
                      value={newField.description}
                      onChange={(e) => setNewField({ ...newField, description: e.target.value })}
                      className="px-2 py-1.5 border border-gray-300 rounded text-sm w-full focus:outline-none focus:border-primary-500"
                      placeholder="What this field configures..."
                      onKeyDown={(e) => { if (e.key === 'Enter') saveNew(); if (e.key === 'Escape') cancelAdd(); }}
                    />
                  </div>
                  <div className="flex gap-1 pb-1.5">
                    <button onClick={saveNew} disabled={!newField.name.trim()} className="p-1.5 bg-primary-600 text-white rounded hover:bg-primary-700 disabled:opacity-40" title="Save">
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button onClick={cancelAdd} className="p-1.5 text-gray-500 border border-gray-300 rounded hover:bg-gray-50" title="Cancel">
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {!isAddingNew && (
        <button
          onClick={startAdd}
          className="mt-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary-600 transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add field
        </button>
      )}
    </div>
  );
}
