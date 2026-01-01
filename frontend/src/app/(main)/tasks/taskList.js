// 'use client'
// import { useState, useRef, useEffect } from 'react'
// import { MoreVertical, Edit, Trash2, Clock, User, Flag, CheckCircle2, Eye } from 'lucide-react'
// import Link from 'next/link'

// const priorityColors = {
//   'High': 'bg-red-100 text-red-700 border-red-200',
//   'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
//   'Low': 'bg-green-100 text-green-700 border-green-200'
// }

// const statusColors = {
//   'Backlog': 'bg-gray-100 text-gray-700 border-gray-200',
//   'Todo': 'bg-blue-100 text-blue-700 border-blue-200',
//   'In Progress': 'bg-purple-100 text-purple-700 border-purple-200',
//   'Review': 'bg-orange-100 text-orange-700 border-orange-200',
//   'Done': 'bg-green-100 text-green-700 border-green-200'
// }

// export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onEditTask, filters, userId, role }) {
//   const [editingTaskId, setEditingTaskId] = useState(null)
//   const [dropdownPlacement, setDropdownPlacement] = useState('down')
//   const [deleteConfirmId, setDeleteConfirmId] = useState(null)
//   const dropdownRefs = useRef({})

//   const formatDate = (dateString) => {
//     if (!dateString) return { text: 'No due date', className: 'text-gray-500' }
    
//     const date = new Date(dateString)
//     const today = new Date()
//     today.setHours(0, 0, 0, 0)
//     const taskDate = new Date(date)
//     taskDate.setHours(0, 0, 0, 0)
    
//     const isOverdue = taskDate < today
//     const isToday = taskDate.getTime() === today.getTime()
    
//     const formatted = date.toLocaleDateString('en-US', {
//       month: 'short',
//       day: 'numeric',
//       year: 'numeric'
//     })
    
//     if (isToday) return { text: 'Today', className: 'text-blue-600 font-medium' }
//     if (isOverdue) return { text: formatted, className: 'text-red-600 font-medium' }
//     return { text: formatted, className: 'text-gray-700' }
//   }

//   const handleStatusChange = async (taskId, newStatus) => {
//     const result = await onUpdateTask(taskId, { status: newStatus })
//     if (result.success) {
//       setEditingTaskId(null)
//     }
//   }

//   const handleEdit = (taskId) => {
//     const task = tasks.find(t => t.id === taskId)
//     if (task && onEditTask) {
//       onEditTask(task)
//     }
//     setEditingTaskId(null)
//   }

//   const handleDeleteClick = (taskId) => {
//     setDeleteConfirmId(taskId)
//     setEditingTaskId(null)
//   }

//   const confirmDelete = async (taskId) => {
//     const result = await onDeleteTask(taskId)
//     if (result.success) {
//       setDeleteConfirmId(null)
//     } else {
//       alert(result.error || 'Failed to delete task')
//     }
//   }

//   const filteredTasks = tasks.filter(task => {
//     if (filters.status && task.status !== filters.status) return false
//     if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
//     return true
//   })

//   const canUpdateTask = (task) => {
//     if (!task) return false
//     const high = ["SUPER_ADMIN", "ADMIN", "HR", "TEAM_LEAD"].includes(role)
//     if (high) return true
//     if (role === "SENIOR_INTERN") {
//       return String(task.assignee_id) === String(userId)
//     }
//     if (role === "INTERN") {
//       return String(task.assignee_id) === String(userId)
//     }
//     return false
//   }

//   const canDeleteTask = (task) => {
//     if (!task) return false
//     const high = ["SUPER_ADMIN", "ADMIN", "HR", "TEAM_LEAD"].includes(role)
//     if (high) return true
//     if (role === "SENIOR_INTERN") {
//       return String(task.assignee_id) === String(userId) || String(task.created_by) === String(userId)
//     }
//     return false
//   }

//   const getInitials = (name) => {
//     if (!name) return '?'
//     return name
//       .split(' ')
//       .map(word => word[0])
//       .join('')
//       .toUpperCase()
//       .substring(0, 2)
//   }

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       Object.keys(dropdownRefs.current).forEach(taskId => {
//         const ref = dropdownRefs.current[taskId]
//         if (ref && !ref.contains(event.target)) {
//           if (editingTaskId === taskId) {
//             setEditingTaskId(null)
//           }
//         }
//       })
//     }
//     document.addEventListener('mousedown', handleClickOutside)
//     return () => document.removeEventListener('mousedown', handleClickOutside)
//   }, [editingTaskId])

//   return (
//     <>
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-6 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full relative">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Task
//                 </th>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
//                   Status
//                 </th>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
//                   Priority
//                 </th>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
//                   Assignee
//                 </th>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
//                   Due Date
//                 </th>
//                 <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredTasks.map((task, index) => {
//                 const dateInfo = formatDate(task.due_date)
//                 const isEditing = editingTaskId === task.id
                
//                 return (
//                   <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
//                     <td className="py-4 px-6">
//                       <div className="flex flex-col gap-1.5">
//                         <div className="font-medium text-gray-900 text-sm leading-tight">
//                           {task.title}
//                         </div>
//                         {task.description && (
//                           <div className="text-sm text-gray-500 leading-relaxed line-clamp-2">
//                             {task.description}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <select
//                         value={task.status}
//                         onChange={(e) => handleStatusChange(task.id, e.target.value)}
//                         disabled={!canUpdateTask(task)}
//                         className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
//                           canUpdateTask(task) 
//                             ? 'cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' 
//                             : 'opacity-60 cursor-not-allowed bg-gray-50'
//                         } ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}
//                       >
//                         {Object.keys(statusColors).map(status => (
//                           <option key={status} value={status}>{status}</option>
//                         ))}
//                       </select>
//                     </td>
//                     <td className="py-4 px-6">
//                       <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>
//                         <Flag className="w-3 h-3" />
//                         {task.priority}
//                       </span>
//                     </td>
//                     <td className="py-4 px-6">
//                       {task.assignee_id ? (
//                         <div className="flex items-center gap-2.5">
//                           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
//                             {task.assignee_name ? (
//                               <span className="text-xs font-semibold text-white">
//                                 {getInitials(task.assignee_name)}
//                               </span>
//                             ) : (
//                               <User className="w-4 h-4 text-white" />
//                             )}
//                           </div>
//                           <div className="flex flex-col min-w-0">
//                             <div className="text-sm font-medium text-gray-900 truncate">
//                               {task.assignee_name || `User ${task.assignee_id}`}
//                             </div>
//                             {task.assignee_email && (
//                               <div className="text-xs text-gray-500 truncate">
//                                 {task.assignee_email}
//                               </div>
//                             )}
//                           </div>
//                         </div>
//                       ) : (
//                         <span className="text-sm text-gray-400 italic">Unassigned</span>
//                       )}
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className={`flex items-center gap-2 text-sm ${dateInfo.className}`}>
//                         <Clock className="w-4 h-4" />
//                         {dateInfo.text}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 relative">
//                       <div className="flex items-center justify-center" ref={el => dropdownRefs.current[task.id] = el}>
//                         <button
//                           onClick={(e) => {
//                             const button = e.currentTarget
//                             const rect = button.getBoundingClientRect()
//                             const viewportHeight = window.innerHeight
                            
//                             // Calculate space below the button
//                             const spaceBelow = viewportHeight - rect.bottom
                            
//                             // Menu height is approximately 150px (3 items * ~50px each)
//                             const menuHeight = 150
                            
//                             // If not enough space below, show above
//                             const shouldOpenUp = spaceBelow < menuHeight
//                             setDropdownPlacement(shouldOpenUp ? 'up' : 'down')
//                             setEditingTaskId(isEditing ? null : task.id)
//                           }}
//                           className="p-2 rounded-lg transition-colors hover:bg-gray-100 group-hover:bg-gray-100"
//                         >
//                           <MoreVertical className="w-5 h-5 text-gray-500" />
//                         </button>
//                         {isEditing && (
//                           <div 
//                             className={`fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[180px] z-50`}
//                             style={{
//                               filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
//                               top: (() => {
//                                 const button = dropdownRefs.current[task.id]?.querySelector('button')
//                                 if (!button) return 'auto'
//                                 const rect = button.getBoundingClientRect()
//                                 const menuHeight = 150
                                
//                                 if (dropdownPlacement === 'up') {
//                                   return `${rect.top - menuHeight - 8}px`
//                                 }
//                                 return `${rect.bottom + 8}px`
//                               })(),
//                               right: (() => {
//                                 const button = dropdownRefs.current[task.id]?.querySelector('button')
//                                 if (!button) return 'auto'
//                                 const rect = button.getBoundingClientRect()
//                                 return `${window.innerWidth - rect.right}px`
//                               })()
//                             }}
//                           >
//                            <Link href={`/tasks/${task.id}`}>
//                              <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors">
//                               <Eye className="w-4 h-4" />
//                               View
//                             </button>
//                            </Link>
//                             {canUpdateTask(task) && (
//                               <button
//                                 onClick={() => handleEdit(task.id)}
//                                 className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
//                               >
//                                 <Edit className="w-4 h-4" />
//                                 Edit Task
//                               </button>
//                             )}
//                             {canDeleteTask(task) && (
//                               <button
//                                 onClick={() => handleDeleteClick(task.id)}
//                                 className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
//                               >
//                                 <Trash2 className="w-4 h-4" />
//                                 Delete Task
//                               </button>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 )
//               })}
//             </tbody>
//           </table>
          
//           {filteredTasks.length === 0 && (
//             <div className="flex items-center justify-center py-16">
//               <div className="text-center">
//                 <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <div className="text-lg font-medium text-gray-900 mb-1">No tasks found</div>
//                 <div className="text-sm text-gray-500">Try adjusting your filters or create a new task</div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteConfirmId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={() => setDeleteConfirmId(null)}>
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6">
//               <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
//                 <Trash2 className="w-6 h-6 text-red-600" />
//               </div>
//               <div className="text-xl font-semibold text-gray-900 mb-2">Delete Task</div>
//               <div className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to delete this task? This action cannot be undone.
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setDeleteConfirmId(null)}
//                   className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => confirmDelete(deleteConfirmId)}
//                   className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }




'use client'
import { useState, useRef, useEffect } from 'react'
import { MoreVertical,X, Edit, Trash2, Clock, User, Flag, CheckCircle2, Eye, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
}

const statusColors = {
  'Backlog': 'bg-gray-100 text-gray-700 border-gray-200',
  'Todo': 'bg-blue-100 text-blue-700 border-blue-200',
  'In Progress': 'bg-purple-100 text-purple-700 border-purple-200',
  'Review': 'bg-orange-100 text-orange-700 border-orange-200',
  'Done': 'bg-green-100 text-green-700 border-green-200'
}

export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onEditTask, filters, userId, role }) {
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [dropdownPlacement, setDropdownPlacement] = useState('down')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const dropdownRefs = useRef({})

  const formatDate = (dateString) => {
    if (!dateString) return { text: 'No due date', className: 'text-gray-500' }
    
    const date = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(date)
    taskDate.setHours(0, 0, 0, 0)
    
    const isOverdue = taskDate < today
    const isToday = taskDate.getTime() === today.getTime()
    
    const formatted = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
    
    if (isToday) return { text: 'Today', className: 'text-blue-600 font-medium' }
    if (isOverdue) return { text: formatted, className: 'text-red-600 font-medium' }
    return { text: formatted, className: 'text-gray-700' }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    const result = await onUpdateTask(taskId, { status: newStatus })
    if (result.success) {
      setEditingTaskId(null)
    }
  }

  const handleEdit = (taskId) => {
    const task = tasks.find(t => t.id === taskId)
    if (task && onEditTask) {
      onEditTask(task)
    }
    setEditingTaskId(null)
  }

  const handleDeleteClick = (taskId) => {
    setDeleteConfirmId(taskId)
    setEditingTaskId(null)
  }

  const confirmDelete = async (taskId) => {
    setDeleting(true)
    const result = await onDeleteTask(taskId)
    if (result.success) {
      setDeleteConfirmId(null)
    } else {
      alert(result.error || 'Failed to delete task')
    }
    setDeleting(false)
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })

  const canUpdateTask = (task) => {
    if (!task) return false
    const high = ["SUPER_ADMIN", "ADMIN", "HR", "TEAM_LEAD"].includes(role)
    if (high) return true
    if (role === "SENIOR_INTERN") {
      return String(task.assignee_id) === String(userId)
    }
    if (role === "INTERN") {
      return String(task.assignee_id) === String(userId)
    }
    return false
  }

  const canDeleteTask = (task) => {
    if (!task) return false
    const high = ["SUPER_ADMIN", "ADMIN", "HR", "TEAM_LEAD"].includes(role)
    if (high) return true
    if (role === "SENIOR_INTERN") {
      return String(task.assignee_id) === String(userId) || String(task.created_by) === String(userId)
    }
    return false
  }

  const getInitials = (name) => {
    if (!name) return '?'
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(taskId => {
        const ref = dropdownRefs.current[taskId]
        if (ref && !ref.contains(event.target)) {
          if (editingTaskId === taskId) {
            setEditingTaskId(null)
          }
        }
      })
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [editingTaskId])

  const deletingTask = tasks.find(t => t.id === deleteConfirmId)

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full relative">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Task
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-40">
                  Status
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                  Priority
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-48">
                  Assignee
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-36">
                  Due Date
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTasks.map((task, index) => {
                const dateInfo = formatDate(task.due_date)
                const isEditing = editingTaskId === task.id
                
                return (
                  <tr key={task.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex flex-col gap-1.5">
                        <div className="font-medium text-gray-900 text-sm leading-tight">
                          {task.title}
                        </div>
                        {task.description && (
                          <div className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={!canUpdateTask(task)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                          canUpdateTask(task) 
                            ? 'cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' 
                            : 'opacity-60 cursor-not-allowed bg-gray-50'
                        } ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {Object.keys(statusColors).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                        <Flag className="w-3 h-3" />
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {task.assignee_id ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                            {task.assignee_name ? (
                              <span className="text-xs font-semibold text-white">
                                {getInitials(task.assignee_name)}
                              </span>
                            ) : (
                              <User className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {task.assignee_name || `User ${task.assignee_id}`}
                            </div>
                            {task.assignee_email && (
                              <div className="text-xs text-gray-500 truncate">
                                {task.assignee_email}
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className={`flex items-center gap-2 text-sm ${dateInfo.className}`}>
                        <Clock className="w-4 h-4" />
                        {dateInfo.text}
                      </div>
                    </td>
                    <td className="py-4 px-6 relative">
                      <div className="flex items-center justify-center" ref={el => dropdownRefs.current[task.id] = el}>
                        <button
                          onClick={(e) => {
                            const button = e.currentTarget
                            const rect = button.getBoundingClientRect()
                            const viewportHeight = window.innerHeight
                            
                            const spaceBelow = viewportHeight - rect.bottom
                            const menuHeight = 150
                            
                            const shouldOpenUp = spaceBelow < menuHeight
                            setDropdownPlacement(shouldOpenUp ? 'up' : 'down')
                            setEditingTaskId(isEditing ? null : task.id)
                          }}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100 group-hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {isEditing && (
                          <div 
                            className={`fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[180px] z-50`}
                            style={{
                              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
                              top: (() => {
                                const button = dropdownRefs.current[task.id]?.querySelector('button')
                                if (!button) return 'auto'
                                const rect = button.getBoundingClientRect()
                                const menuHeight = 150
                                
                                if (dropdownPlacement === 'up') {
                                  return `${rect.top - menuHeight - 8}px`
                                }
                                return `${rect.bottom + 8}px`
                              })(),
                              right: (() => {
                                const button = dropdownRefs.current[task.id]?.querySelector('button')
                                if (!button) return 'auto'
                                const rect = button.getBoundingClientRect()
                                return `${window.innerWidth - rect.right}px`
                              })()
                            }}
                          >
                           <Link href={`/tasks/${task.id}`}>
                             <button className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors">
                              <Eye className="w-4 h-4" />
                              View
                            </button>
                           </Link>
                            {canUpdateTask(task) && (
                              <button
                                onClick={() => handleEdit(task.id)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
                              >
                                <Edit className="w-4 h-4" />
                                Edit Task
                              </button>
                            )}
                            {canDeleteTask(task) && (
                              <button
                                onClick={() => handleDeleteClick(task.id)}
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete Task
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          
          {filteredTasks.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-lg font-medium text-gray-900 mb-1">No tasks found</div>
                <div className="text-sm text-gray-500">Try adjusting your filters or create a new task</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal - Matching Create/Edit Modal Style */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Task</h2>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    Are you sure you want to delete this task? This action cannot be undone.
                  </p>
                  {deletingTask && (
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <p className="text-sm font-medium text-gray-900">{deletingTask.title}</p>
                      {deletingTask.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{deletingTask.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirmId)}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete Task'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}