'use client';

import { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface DialogSchemaEditorProps {
  dialogSchema: Record<string, any>;
  setDialogSchema: (schema: Record<string, any>) => void;
}

interface FieldConfig {
  type: string;
  required?: boolean;
  maxlength?: number;
  options?: string[];
  rootPath?: string;
  [key: string]: any;
}

export function DialogSchemaEditor({ dialogSchema, setDialogSchema }: DialogSchemaEditorProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ name: string; config: FieldConfig }>({
    name: '',
    config: { type: 'textfield' }
  });

  const fieldTypes = [
    'textfield',
    'textarea',
    'select',
    'checkbox',
    'pathbrowser',
    'pathfield',
    'number'
  ];

  const handleAdd = () => {
    setEditingField('__new__');
    setEditForm({ name: '', config: { type: 'textfield' } });
  };

  const handleEdit = (fieldName: string) => {
    setEditingField(fieldName);
    setEditForm({ name: fieldName, config: { ...dialogSchema[fieldName] } });
  };

  const handleSave = () => {
    if (!editForm.name.trim()) {
      alert('Field name is required');
      return;
    }

    const newSchema = { ...dialogSchema };

    // If renaming, delete old field
    if (editingField && editingField !== '__new__' && editingField !== editForm.name) {
      delete newSchema[editingField];
    }

    newSchema[editForm.name] = editForm.config;
    setDialogSchema(newSchema);
    setEditingField(null);
  };

  const handleCancel = () => {
    setEditingField(null);
  };

  const handleDelete = (fieldName: string) => {
    if (confirm(`Delete field "${fieldName}"?`)) {
      const newSchema = { ...dialogSchema };
      delete newSchema[fieldName];
      setDialogSchema(newSchema);
    }
  };

  const updateConfig = (key: string, value: any) => {
    setEditForm({
      ...editForm,
      config: { ...editForm.config, [key]: value }
    });
  };

  const handleOptionsChange = (optionsString: string) => {
    const options = optionsString.split(',').map(o => o.trim()).filter(Boolean);
    updateConfig('options', options.length > 0 ? options : undefined);
  };

  return (
    <div className="space-y-3">
      {/* Existing Fields */}
      {Object.entries(dialogSchema).map(([fieldName, config]: [string, any]) => (
        <div key={fieldName}>
          {editingField === fieldName ? (
            // Edit Mode
            <div className="border border-primary-300 rounded-lg p-4 bg-primary-50">
              <div className="space-y-3">
                {/* Field Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="e.g., title, subtitle, image"
                  />
                </div>

                {/* Field Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={editForm.config.type}
                    onChange={(e) => updateConfig('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {fieldTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Required */}
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={editForm.config.required || false}
                    onChange={(e) => updateConfig('required', e.target.checked || undefined)}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm text-gray-700">Required field</span>
                </label>

                {/* Max Length (for text fields) */}
                {(editForm.config.type === 'textfield' || editForm.config.type === 'textarea') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Max Length (optional)
                    </label>
                    <input
                      type="number"
                      value={editForm.config.maxlength || ''}
                      onChange={(e) => updateConfig('maxlength', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Leave empty for no limit"
                    />
                  </div>
                )}

                {/* Options (for select) */}
                {editForm.config.type === 'select' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Options (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editForm.config.options?.join(', ') || ''}
                      onChange={(e) => handleOptionsChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., left, center, right"
                    />
                  </div>
                )}

                {/* Root Path (for pathbrowser) */}
                {editForm.config.type === 'pathbrowser' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Root Path
                    </label>
                    <input
                      type="text"
                      value={editForm.config.rootPath || ''}
                      onChange={(e) => updateConfig('rootPath', e.target.value || undefined)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="e.g., /content/dam"
                    />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // View Mode
            <div className="border-l-2 border-primary-500 pl-4 py-2 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-mono bg-gray-100 px-2 py-0.5 rounded">
                    {fieldName}
                  </code>
                  <span className="text-xs text-gray-500">({config.type})</span>
                  {config.required && (
                    <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      Required
                    </span>
                  )}
                </div>
                {config.maxlength && (
                  <p className="text-xs text-gray-500 mt-1">Max length: {config.maxlength}</p>
                )}
                {config.options && Array.isArray(config.options) && (
                  <p className="text-xs text-gray-500 mt-1">Options: {config.options.join(', ')}</p>
                )}
                {config.rootPath && (
                  <p className="text-xs text-gray-500 mt-1">Root path: {config.rootPath}</p>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button
                  onClick={() => handleEdit(fieldName)}
                  className="p-1 text-primary-600 hover:bg-primary-50 rounded"
                  title="Edit"
                  aria-label={`Edit ${fieldName} field`}
                >
                  <PencilIcon className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  onClick={() => handleDelete(fieldName)}
                  className="p-1 text-red-600 hover:bg-red-50 rounded"
                  title="Delete"
                  aria-label={`Delete ${fieldName} field`}
                >
                  <TrashIcon className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Add New Field Form */}
      {editingField === '__new__' && (
        <div className="border border-primary-300 rounded-lg p-4 bg-primary-50">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Add New Field</h4>

            {/* Field Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Field Name
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="e.g., title, subtitle, image"
                autoFocus
              />
            </div>

            {/* Field Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type
              </label>
              <select
                value={editForm.config.type}
                onChange={(e) => updateConfig('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                {fieldTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Required */}
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={editForm.config.required || false}
                onChange={(e) => updateConfig('required', e.target.checked || undefined)}
                className="rounded border-gray-300"
              />
              <span className="text-sm text-gray-700">Required field</span>
            </label>

            {/* Max Length (for text fields) */}
            {(editForm.config.type === 'textfield' || editForm.config.type === 'textarea') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Length (optional)
                </label>
                <input
                  type="number"
                  value={editForm.config.maxlength || ''}
                  onChange={(e) => updateConfig('maxlength', e.target.value ? parseInt(e.target.value) : undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Leave empty for no limit"
                />
              </div>
            )}

            {/* Options (for select) */}
            {editForm.config.type === 'select' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Options (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.config.options?.join(', ') || ''}
                  onChange={(e) => handleOptionsChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., left, center, right"
                />
              </div>
            )}

            {/* Root Path (for pathbrowser) */}
            {editForm.config.type === 'pathbrowser' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Root Path
                </label>
                <input
                  type="text"
                  value={editForm.config.rootPath || ''}
                  onChange={(e) => updateConfig('rootPath', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="e.g., /content/dam"
                />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-primary-600 text-white text-sm rounded hover:bg-primary-700"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Field Button */}
      {editingField !== '__new__' && (
        <button
          onClick={handleAdd}
          className="flex items-center gap-2 px-3 py-2 text-sm text-primary-600 hover:bg-primary-50 border border-primary-300 rounded-md transition-colors"
        >
          <PlusIcon className="w-4 h-4" />
          Add Dialog Field
        </button>
      )}
    </div>
  );
}
