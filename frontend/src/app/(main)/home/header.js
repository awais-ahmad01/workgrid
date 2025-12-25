'use client'
import { Plus, Filter, Calendar, Settings } from 'lucide-react'

export default function HomeHeader() {
  return (
    <div className="flex flex-col ">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">My Work</h1>
          {/* Optional: small badge or status */}
          <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
            Active
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Plus className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Filter className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Calendar className="w-4 h-4 text-gray-600" />
          </button>
          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  )
}
