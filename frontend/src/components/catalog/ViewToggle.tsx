'use client';

type ViewType = 'grid' | 'list';

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-0.5 bg-gray-100 p-1 rounded-lg">
      <button
        onClick={() => onViewChange('grid')}
        aria-label="Grid view"
        className={`p-2 rounded transition-colors ${
          view === 'grid'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {/* Grid icon - 3x3 squares */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      </button>

      <button
        onClick={() => onViewChange('list')}
        aria-label="List view"
        className={`p-2 rounded transition-colors ${
          view === 'list'
            ? 'bg-white text-primary-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        {/* List icon - horizontal lines */}
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </div>
  );
}
