'use client'
import { Plus, Filter, FolderKanban, Calendar, Settings } from 'lucide-react'

export default function ProjectsHeader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
          {/* Optional: project status badge */}
          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Add Project">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Filter Projects">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Project Views">
            <FolderKanban className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Calendar">
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
