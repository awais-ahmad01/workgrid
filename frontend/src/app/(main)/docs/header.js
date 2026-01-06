'use client'

import { Plus, Search } from 'lucide-react'

/**
 * DocsHeader
 * - Uses the same layout and search styling as Tasks header
 * - Exposes search and create controls via props
 */
export default function DocsHeader({
  searchQuery,
  onSearchChange,
  onCreateClick,
  creating,
  canCreate = true,
}) {
  const handleSearch = (e) => {
    onSearchChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Docs</h1>
        </div>

        {/* Right: Search + New Document */}
        <div className="flex items-center gap-3">
          {/* Search – exactly like Tasks header */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {canCreate && (
            <button
              onClick={onCreateClick}
              disabled={creating}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {creating ? (
                <span>Creating...</span>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>New Doc</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
