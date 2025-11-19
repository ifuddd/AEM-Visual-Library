'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { componentApi } from '@/lib/api';
import { ComponentCard } from '@/components/catalog/ComponentCard';
import { FilterPanel } from '@/components/catalog/FilterPanel';
import { SearchBar } from '@/components/catalog/SearchBar';
import { Pagination } from '@/components/catalog/Pagination';
import type { ComponentFilters } from '@aem-portal/shared';

export default function CatalogPage() {
  const [filters, setFilters] = useState<ComponentFilters>({});
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading, error } = useQuery({
    queryKey: ['components', filters, page],
    queryFn: () => componentApi.getAll(filters, page, pageSize),
  });

  const handleFilterChange = (newFilters: ComponentFilters) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page when filters change
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Component Catalog</h1>
          <p className="text-gray-600">Browse and discover AEM components</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <SearchBar
            value={filters.search || ''}
            onChange={(search) => handleFilterChange({ ...filters, search })}
          />
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <FilterPanel filters={filters} onChange={handleFilterChange} />
          </aside>

          {/* Component Grid */}
          <main className="flex-1">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg shadow-sm h-64 animate-pulse"
                  />
                ))}
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                Failed to load components. Please try again.
              </div>
            ) : data && data.data.length > 0 ? (
              <>
                {/* Results count */}
                <div className="mb-4 text-sm text-gray-600">
                  Showing {(page - 1) * pageSize + 1}-
                  {Math.min(page * pageSize, data.total)} of {data.total} components
                </div>

                {/* Component grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.data.map((component) => (
                    <ComponentCard key={component.id} component={component} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={page}
                      totalPages={data.totalPages}
                      onPageChange={setPage}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <p className="text-gray-600 mb-4">No components found</p>
                <button
                  onClick={() => handleFilterChange({})}
                  className="text-primary-600 hover:text-primary-700 underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
