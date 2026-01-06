'use client'

import { Plus, Search, Megaphone, Filter } from 'lucide-react'

const CATEGORY_OPTIONS = [
  { value: 'ALL', label: 'All categories' },
  { value: 'GENERAL', label: 'General' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'HR', label: 'HR' },
  { value: 'PROJECT_UPDATE', label: 'Project update' },
  { value: 'REMINDER', label: 'Reminder' },
]

/**
 * AnnouncementsHeader
 * - Matches Tasks header layout
 * - Adds search + filter toggle + create button
 */
export default function AnnouncementsHeader({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  showFilters,
  onToggleFilters,
  canCreate,
  onCreateClick,
}) {
  const handleSearch = (e) => {
    onSearchChange?.(e.target.value)
  }

  const handleCategoryChange = (e) => {
    onCategoryChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Announcements</h1>
        </div>

        {/* Right: Search + Category + New Announcement */}
        <div className="flex items-center gap-3">
          {/* Search – Tasks-style */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter toggle – matches Tasks header filter button */}
          <button
            type="button"
            onClick={onToggleFilters}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            title="Filter announcements"
          >
            <Filter className="w-4 h-4 text-gray-600" />
          </button>

          {canCreate && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Panel – category pills, similar to Tasks status filters */}
      {showFilters && (
        <div className="w-full px-6 md:px-10 lg:px-12 pb-2">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">Filters</span>
                  <span className="text-xs text-gray-500">Category</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCategoryChange({ target: { value: 'ALL' } })}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {CATEGORY_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => onCategoryChange?.(opt.value)}
                    className={`px-3 py-1.5 text-xs md:text-sm rounded-full border transition-all
                      ${opt.value === 'ALL' && category === 'ALL' ? 'bg-gray-50 border-gray-200 text-gray-700' : ''}
                      ${opt.value === 'GENERAL' && category === 'GENERAL' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                      ${opt.value === 'POLICY' && category === 'POLICY' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
                      ${opt.value === 'HR' && category === 'HR' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                      ${opt.value === 'PROJECT_UPDATE' && category === 'PROJECT_UPDATE' ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}
                      ${opt.value === 'REMINDER' && category === 'REMINDER' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' : ''}
                      hover:shadow-sm
                    `}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
