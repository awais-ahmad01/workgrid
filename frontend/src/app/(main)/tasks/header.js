// // 'use client'
// // import { Plus, Filter, ListChecks, Calendar, Settings } from 'lucide-react'

// // export default function TasksHeader() {
// //   return (
// //     <div className="flex flex-col gap-6">
// //       {/* Page Header */}
// //       <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
// //         {/* Left: Title */}
// //         <div className="flex items-center gap-2">
// //           <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
// //           {/* Optional: task status badge */}
// //           <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
// //             Pending
// //           </span>
// //         </div>

// //         {/* Right: Action icons */}
// //         <div className="flex items-center gap-3">
// //           <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Add Task">
// //             <Plus className="w-4 h-4 text-gray-600" />
// //           </button>
// //           <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Filter Tasks">
// //             <Filter className="w-4 h-4 text-gray-600" />
// //           </button>
// //           <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Task Views">
// //             <ListChecks className="w-4 h-4 text-gray-600" />
// //           </button>
// //           <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Calendar">
// //             <Calendar className="w-4 h-4 text-gray-600" />
// //           </button>
// //           <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
// //             <Settings className="w-4 h-4 text-gray-600" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }





// 'use client'
// import { useState } from 'react'
// import { Plus, Filter, ListChecks, Calendar, Settings, Grid3X3, Search } from 'lucide-react'
// import { useRole } from '@/app/components/RoleProvider'

// export default function TasksHeader({ onViewChange, onFilterChange, onCreateClick }) {
//   const [activeView, setActiveView] = useState('list')
//   const [showFilters, setShowFilters] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')
//   const { user } = useRole()

//   const canCreateTask = ['ROLE_SUPER_ADMIN', 'ROLE_ADMIN', 'ROLE_HR', 'ROLE_TEAM_LEAD'].includes(user?.role)

//   const handleViewChange = (view) => {
//     setActiveView(view)
//     onViewChange(view)
//   }

//   const handleSearch = (e) => {
//     const value = e.target.value
//     setSearchTerm(value)
//     onFilterChange(prev => ({ ...prev, search: value }))
//   }

//   const handleStatusFilter = (status) => {
//     onFilterChange(prev => ({ 
//       ...prev, 
//       status: prev.status === status ? '' : status 
//     }))
//   }

//   const clearFilters = () => {
//     onFilterChange(prev => ({ ...prev, status: '', search: '' }))
//     setSearchTerm('')
//   }

//   const isStatusActive = (status) => {
//     return false
//   }

  // return (
  //   <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
  //     {/* Page Header */}
  //     <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
  //       {/* Left: Title */}
  //       <div className="flex items-center gap-2">
  //         <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
  //         <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
  //           {canCreateTask ? 'Manager' : 'Contributor'}
  //         </span>
  //       </div>

  //       {/* Right: Action icons */}
  //       <div className="flex items-center gap-3">
  //         {/* Search */}
  //         <div className="relative">
  //           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
  //           <input
  //             type="text"
  //             placeholder="Search tasks..."
  //             value={searchTerm}
  //             onChange={handleSearch}
  //             className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
  //           />
  //         </div>

  //         {/* Create Task Button (conditionally shown) */}
  //         {canCreateTask && (
  //           <button 
  //             onClick={onCreateClick}
  //             className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
  //           >
  //             <Plus className="w-4 h-4" />
  //             <span className="text-sm">New Task</span>
  //           </button>
  //         )}

  //         <button 
  //           onClick={() => setShowFilters(!showFilters)}
  //           className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
  //           title="Filter Tasks"
  //         >
  //           <Filter className="w-4 h-4 text-gray-600" />
  //         </button>

  //         {/* View Toggle */}
  //         <div className="flex items-center bg-gray-100 rounded-lg p-1">
  //           <button
  //             onClick={() => handleViewChange('list')}
  //             className={`p-1.5 rounded transition-colors ${activeView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
  //             title="List View"
  //           >
  //             <ListChecks className="w-4 h-4 text-gray-600" />
  //           </button>
  //           <button
  //             onClick={() => handleViewChange('board')}
  //             className={`p-1.5 rounded transition-colors ${activeView === 'board' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
  //             title="Board View"
  //           >
  //             <Grid3X3 className="w-4 h-4 text-gray-600" />
  //           </button>
  //           <button
  //             onClick={() => handleViewChange('calendar')}
  //             className={`p-1.5 rounded transition-colors ${activeView === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
  //             title="Calendar View"
  //           >
  //             <Calendar className="w-4 h-4 text-gray-600" />
  //           </button>
  //         </div>

  //         <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
  //           <Settings className="w-4 h-4 text-gray-600" />
  //         </button>
  //       </div>
  //     </div>

  //     {/* Filter Panel */}
  //     {showFilters && (
  //       <div className="w-full px-6 md:px-10 lg:px-12">
  //         <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm w-full">
  //           <div className="flex flex-col gap-3">
  //             <div className="flex items-center justify-between">
  //               <div className="flex items-center gap-3">
  //                 <span className="text-sm font-semibold text-gray-800">Filters</span>
  //                 <span className="text-xs text-gray-500">Status</span>
  //               </div>
  //               <button
  //                 onClick={clearFilters}
  //                 className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
  //               >
  //                 Clear
  //               </button>
  //             </div>

  //             <div className="flex flex-wrap gap-2">
  //               {['Backlog', 'Todo', 'In Progress', 'Review', 'Done'].map(status => (
  //                 <button
  //                   key={status}
  //                   onClick={() => handleStatusFilter(status)}
  //                   className={`
  //                     px-3 py-1.5 text-xs md:text-sm rounded-full border transition-all
  //                     ${status === 'Backlog' ? 'bg-gray-50 border-gray-200 text-gray-700' : ''}
  //                     ${status === 'Todo' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
  //                     ${status === 'In Progress' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
  //                     ${status === 'Review' ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}
  //                     ${status === 'Done' ? 'bg-green-50 border-green-200 text-green-700' : ''}
  //                     hover:shadow-sm
  //                   `}
  //                 >
  //                   {status}
  //                 </button>
  //               ))}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     )}
  //   </div>
  // )
// }






'use client'
import { useState } from 'react'
import { Plus, Filter, ListChecks, Calendar, Settings, Grid3X3, Search } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth' // Changed from useRole

export default function TasksHeader({ onViewChange, onFilterChange, onCreateClick }) {
  const [activeView, setActiveView] = useState('list')
  const [showFilters, setShowFilters] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const { user } = useAuth() // Changed from useRole

  const canCreateTask = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role)

  const handleViewChange = (view) => {
    setActiveView(view)
    onViewChange(view)
  }

  const handleSearch = (e) => {
    const value = e.target.value
    setSearchTerm(value)
    onFilterChange(prev => ({ ...prev, search: value }))
  }

  const handleStatusFilter = (status) => {
    onFilterChange(prev => ({ 
      ...prev, 
      status: prev.status === status ? '' : status 
    }))
  }

  const clearFilters = () => {
    onFilterChange(prev => ({ ...prev, status: '', search: '' }))
    setSearchTerm('')
  }

  const isStatusActive = (status) => {
    return false
  }

    return (
    <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
      {/* Page Header */}
      <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
        {/* Left: Title */}
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
            {canCreateTask ? 'Manager' : 'Contributor'}
          </span>
        </div>

        {/* Right: Action icons */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="h-8 pl-10 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Create Task Button (conditionally shown) */}
          {canCreateTask && (
            <button 
              onClick={onCreateClick}
              className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">New Task</span>
            </button>
          )}

          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2 rounded-lg transition-colors ${showFilters ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
            title="Filter Tasks"
          >
            <Filter className="w-4 h-4 text-gray-600" />
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => handleViewChange('list')}
              className={`p-1.5 rounded transition-colors ${activeView === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="List View"
            >
              <ListChecks className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleViewChange('board')}
              className={`p-1.5 rounded transition-colors ${activeView === 'board' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Board View"
            >
              <Grid3X3 className="w-4 h-4 text-gray-600" />
            </button>
            <button
              onClick={() => handleViewChange('calendar')}
              className={`p-1.5 rounded transition-colors ${activeView === 'calendar' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'}`}
              title="Calendar View"
            >
              <Calendar className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors" title="Settings">
            <Settings className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="w-full px-6 md:px-10 lg:px-12">
          <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-5 shadow-sm w-full">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-800">Filters</span>
                  <span className="text-xs text-gray-500">Status</span>
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs font-medium text-indigo-600 hover:text-indigo-700"
                >
                  Clear
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Backlog', 'Todo', 'In Progress', 'Review', 'Done'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilter(status)}
                    className={`
                      px-3 py-1.5 text-xs md:text-sm rounded-full border transition-all
                      ${status === 'Backlog' ? 'bg-gray-50 border-gray-200 text-gray-700' : ''}
                      ${status === 'Todo' ? 'bg-blue-50 border-blue-200 text-blue-700' : ''}
                      ${status === 'In Progress' ? 'bg-purple-50 border-purple-200 text-purple-700' : ''}
                      ${status === 'Review' ? 'bg-orange-50 border-orange-200 text-orange-700' : ''}
                      ${status === 'Done' ? 'bg-green-50 border-green-200 text-green-700' : ''}
                      hover:shadow-sm
                    `}
                  >
                    {status}
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