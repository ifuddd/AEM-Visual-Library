'use client';

import { useQuery } from '@tanstack/react-query';
import { componentApi } from '@/lib/api';
import type { ComponentFilters } from '@aem-portal/shared';
import { ComponentStatus } from '@aem-portal/shared';

interface FilterPanelProps {
  filters: ComponentFilters;
  onChange: (filters: ComponentFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const { data: tags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: componentApi.getTags,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ['teams'],
    queryFn: componentApi.getTeams,
  });

  const toggleStatus = (status: ComponentStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    onChange({ ...filters, status: updated });
  };

  const toggleTag = (tag: string) => {
    const current = filters.tags || [];
    const updated = current.includes(tag)
      ? current.filter((t) => t !== tag)
      : [...current, tag];
    onChange({ ...filters, tags: updated });
  };

  const setTeam = (team: string) => {
    onChange({ ...filters, ownerTeam: team === filters.ownerTeam ? undefined : team });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 sticky top-4">
      <h2 className="font-semibold text-gray-900 mb-4">Filters</h2>

      {/* Status filter */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Status</h3>
        <div className="space-y-2">
          {Object.values(ComponentStatus).map((status) => (
            <label key={status} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.status?.includes(status) || false}
                onChange={() => toggleStatus(status)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-700 capitalize">
                {status.replace('_', ' ')}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Tags filter */}
      {tags.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tags</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {tags.map((tag) => (
              <label key={tag} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.tags?.includes(tag) || false}
                  onChange={() => toggleTag(tag)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{tag}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Owner team filter */}
      {teams.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Owner Team</h3>
          <select
            value={filters.ownerTeam || ''}
            onChange={(e) => setTeam(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Clear filters */}
      <button
        onClick={() => onChange({})}
        className="w-full px-4 py-2 text-sm text-primary-600 hover:text-primary-700 border border-primary-600 hover:bg-primary-50 rounded-md transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}
