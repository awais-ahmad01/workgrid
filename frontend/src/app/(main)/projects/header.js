'use client'

import { Search, Plus, UserPlus } from 'lucide-react'

/**
 * ProjectsHeader
 * - Matches the Tasks/Files/Docs header layout and styling
 * - Includes search bar and action buttons (Create Project, Invite Team Members)
 */
export default function ProjectsHeader({ 
  searchQuery, 
  onSearchChange, 
  onCreateClick,
  onInviteClick,
  canCreate = true,
  canInvite = true,
}) {
  const handleSearch = (e) => {
    onSearchChange?.(e.target.value)
  }

  return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        </div>

        {/* Right: Search + Actions – matches Tasks/Files/Docs header styling */}
        <div className="flex items-center gap-3">
          {/* Search – exactly like Tasks/Files/Docs header */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={handleSearch}
              className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Invite Team Members Button */}
          {canInvite && (
            <button
              onClick={onInviteClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              <UserPlus className="w-4 h-4" />
              <span>Invite Team Members</span>
            </button>
          )}

          {/* Create Project Button */}
          {canCreate && (
            <button
              onClick={onCreateClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
