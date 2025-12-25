'use client'
import { Plus, Search, Filter, FolderOpen, Settings } from 'lucide-react'

export default function FilesHeader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Files</h1>
          {/* Optional: files count badge */}
          <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">
            48
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Upload File">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Search Files">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Filter Files">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="View Options">
            <FolderOpen className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
