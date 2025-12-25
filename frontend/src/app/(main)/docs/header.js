'use client'
import { Plus, Search, Users, FileText, Settings } from 'lucide-react'

export default function DocsHeader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Docs</h1>
          {/* Optional: docs count badge */}
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
            24
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="New Document">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Search Docs">
            <Search className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Collaborators">
            <Users className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="View Options">
            <FileText className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
