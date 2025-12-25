'use client'
import { Filter, Calendar, RefreshCw, Settings } from 'lucide-react'

export default function OverviewHeader() {
  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          {/* Optional: badge for last updated */}
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            Updated
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Filter Overview">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Select Date">
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Refresh Data">
            <RefreshCw className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
