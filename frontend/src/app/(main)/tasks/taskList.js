'use client'
import { useState, useRef, useEffect } from 'react'
import { MoreVertical, Edit, Trash2, Clock, User, Flag, CheckCircle2, Eye } from 'lucide-react'

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

// export default function TaskList({ tasks, onUpdateTask, onDeleteTask, onEditTask, filters, userId, role }) {
export default function TaskList({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onEditTask, 
  filters, 
  userId, // This should come from useAuth
  role // This should come from useAuth
}) {


  console.log("Tasks::", tasks);
  const [editingTaskId, setEditingTaskId] = useState(null)
  const [dropdownPlacement, setDropdownPlacement] = useState('down')
  const [deleteConfirmId, setDeleteConfirmId] = useState(null)
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
    console.log("editing")
    const task = tasks.find(t => t.id === taskId)
    if (task && onEditTask) {
      onEditTask(task)
    }
    setEditingTaskId(null) // Close dropdown
  }

  const handleDeleteClick = (taskId) => {
    setDeleteConfirmId(taskId)
    setEditingTaskId(null) // Close dropdown
  }

  const confirmDelete = async (taskId) => {
    const result = await onDeleteTask(taskId)
    if (result.success) {
      setDeleteConfirmId(null)
    } else {
      alert(result.error || 'Failed to delete task')
    }
  }

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false
    if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) return false
    return true
  })


  console.log("filtered:", tasks);

  const canUpdateTask = (task) => {
    if (!task) return false
    const high = ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_HR", "ROLE_TEAM_LEAD"].includes(role)
    if (high) return true
    if (role === "ROLE_SENIOR_INTERN") {
      return String(task.assignee_id) === String(userId)
    }
    if (role === "ROLE_INTERN") {
      return String(task.assignee_id) === String(userId)
    }
    return false
  }

  const canDeleteTask = (task) => {
    if (!task) return false
    const high = ["ROLE_SUPER_ADMIN", "ROLE_ADMIN", "ROLE_HR", "ROLE_TEAM_LEAD"].includes(role)
    if (high) return true
    if (role === "ROLE_SENIOR_INTERN") {
      return String(task.assignee_id) === String(userId) || String(task.created_by) === String(userId)
    }
    return false
  }

  // Close dropdowns when clicking outside
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

  return (
    <>
      <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 overflow-visible p-4 md:p-6 min-h-[60vh]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Task</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Priority</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Assignee</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Due Date</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredTasks.map(task => {
                const dateInfo = formatDate(task.due_date)
                const isEditing = editingTaskId === task.id
                
                return (
                  <tr 
                    key={task.id} 
                    className="hover:bg-gray-50 transition-colors group"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 mb-1">{task.title}</div>
                          {task.description && (
                            <div className="text-sm text-gray-500 line-clamp-2">
                              {task.description}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                        disabled={!canUpdateTask(task)}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${canUpdateTask(task) ? 'cursor-pointer hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500' : 'opacity-60 cursor-not-allowed bg-gray-50'} ${statusColors[task.status] || 'bg-gray-100 text-gray-700'}`}
                      >
                        {Object.keys(statusColors).map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                        <Flag className="w-3 h-3" />
                        {task.priority}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {task.assignee_id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-200">
                            <User className="w-4 h-4 text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-700">User {task.assignee_id}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400 italic">Unassigned</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Clock className={`w-4 h-4 ${dateInfo.className.includes('red') ? 'text-red-600' : dateInfo.className.includes('blue') ? 'text-blue-600' : 'text-gray-400'}`} />
                        <span className={`text-sm ${dateInfo.className}`}>
                          {dateInfo.text}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-6 relative">
                      <div className="relative inline-block" ref={el => dropdownRefs.current[task.id] = el}>
                        <button
                          onClick={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect()
                            const viewportHeight = window.innerHeight
                            const spaceBelow = viewportHeight - rect.bottom
                            const spaceAbove = rect.top
                            const preferred = spaceBelow < 200 && spaceAbove > spaceBelow ? 'up' : 'down'
                            setDropdownPlacement(preferred)
                            setEditingTaskId(isEditing ? null : task.id)
                          }}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100 group-hover:bg-gray-100"
                        >
                          <MoreVertical className="w-4 h-4 text-gray-500" />
                        </button>
                        {isEditing && (
                          <div className={`absolute right-0 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-50 ${dropdownPlacement === 'up' ? 'bottom-full mb-2' : 'top-full mt-2'}`}>
                            <a
                              href={`/tasks/${task.id}`}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View
                            </a>
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
            <div className="text-center py-16">
              <div className="text-gray-400 mb-2 text-lg">No tasks found</div>
              <div className="text-sm text-gray-500">Try adjusting your filters or create a new task</div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setDeleteConfirmId(null)}>
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Task</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this task? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() => confirmDelete(deleteConfirmId)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
