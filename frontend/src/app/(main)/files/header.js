'use client'

import { Search } from 'lucide-react'

/**
 * FilesHeader
 * - Mirrors the Tasks header layout and search styling
 * - Accepts a rightSlot for actions (e.g. Upload File button)
 */
export default function FilesHeader({ searchQuery, onSearchChange, rightSlot }) {
  const handleSearch = (e) => {
    onSearchChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
        </div>

        {/* Right: Search + Actions – matches Tasks header styling */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          {rightSlot}
        </div>
      </div>
    </div>
  )
}
