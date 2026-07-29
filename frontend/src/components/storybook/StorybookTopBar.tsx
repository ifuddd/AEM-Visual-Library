'use client';

import Link from 'next/link';

interface StorybookTopBarProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function StorybookTopBar({ sidebarOpen, onToggleSidebar }: StorybookTopBarProps) {
  return (
    <header className="flex items-center gap-3 h-11 px-3 bg-white border-b border-gray-200 flex-shrink-0 z-20">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        title={`${sidebarOpen ? 'Hide' : 'Show'} sidebar (S)`}
        className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-[#FF4785] flex items-center justify-center flex-shrink-0">
          <svg className="w-3.5 h-3.5 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v10l9 5 9-5V7L12 2z" />
          </svg>
        </div>
        <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">AEM Visual Library</span>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1" />

      {/* Back to catalog */}
      <Link
        href="/catalog"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Catalog
      </Link>

      <div className="flex-1" />

      {/* Keyboard shortcut hints */}
      <div className="hidden md:flex items-center gap-3 text-xs text-gray-400">
        <span><kbd className="font-mono bg-gray-100 px-1 rounded">S</kbd> sidebar</span>
        <span><kbd className="font-mono bg-gray-100 px-1 rounded">A</kbd> addons</span>
      </div>
    </header>
  );
}
