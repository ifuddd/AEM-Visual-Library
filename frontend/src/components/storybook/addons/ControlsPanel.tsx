'use client';

import { ControlDefinition } from '@/lib/storybook/types';

interface ControlsPanelProps {
  controls: ControlDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onReset: () => void;
}

export function ControlsPanel({ controls, values, onChange, onReset }: ControlsPanelProps) {
  if (controls.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-gray-400">
        No controls for this story.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-2 text-gray-400 font-medium w-1/3">Name</th>
              <th className="text-left px-4 py-2 text-gray-400 font-medium">Control</th>
            </tr>
          </thead>
          <tbody>
            {controls.map((ctrl) => (
              <tr key={ctrl.key} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-4 py-2 text-gray-600 font-medium align-middle">{ctrl.label}</td>
                <td className="px-4 py-2 align-middle">
                  {ctrl.type === 'boolean' && (
                    <input
                      type="checkbox"
                      checked={Boolean(values[ctrl.key])}
                      onChange={(e) => onChange(ctrl.key, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                    />
                  )}
                  {ctrl.type === 'select' && (
                    <select
                      value={String(values[ctrl.key] ?? ctrl.defaultValue)}
                      onChange={(e) => onChange(ctrl.key, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 max-w-[180px]"
                    >
                      {ctrl.options?.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  )}
                  {ctrl.type === 'text' && (
                    <input
                      type="text"
                      value={String(values[ctrl.key] ?? ctrl.defaultValue)}
                      onChange={(e) => onChange(ctrl.key, e.target.value)}
                      className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 w-full max-w-[240px]"
                    />
                  )}
                  {ctrl.type === 'number' && (
                    <input
                      type="number"
                      value={Number(values[ctrl.key] ?? ctrl.defaultValue)}
                      onChange={(e) => onChange(ctrl.key, Number(e.target.value))}
                      className="border border-gray-200 rounded px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-primary-400 w-24"
                    />
                  )}
                  {ctrl.type === 'color' && (
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={String(values[ctrl.key] ?? ctrl.defaultValue)}
                        onChange={(e) => onChange(ctrl.key, e.target.value)}
                        className="w-7 h-7 rounded border border-gray-200 cursor-pointer p-0.5 bg-white"
                      />
                      <span className="text-gray-500 font-mono">{String(values[ctrl.key] ?? ctrl.defaultValue)}</span>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset button */}
      <div className="border-t border-gray-100 px-4 py-2 flex-shrink-0 bg-gray-50">
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-800 border border-gray-200 px-3 py-1 rounded hover:bg-white transition-colors"
        >
          Reset controls
        </button>
      </div>
    </div>
  );
}
