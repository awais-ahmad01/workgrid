'use client'
import { useState } from 'react'
import { MoreVertical, User, Clock, Flag, GripVertical } from 'lucide-react'

const statusColumns = [
  { id: 'Backlog', title: 'Backlog', color: 'bg-gray-50', borderColor: 'border-gray-200', headerColor: 'bg-gray-100 text-gray-700' },
  { id: 'Todo', title: 'To Do', color: 'bg-blue-50', borderColor: 'border-blue-200', headerColor: 'bg-blue-100 text-blue-700' },
  { id: 'In Progress', title: 'In Progress', color: 'bg-purple-50', borderColor: 'border-purple-200', headerColor: 'bg-purple-100 text-purple-700' },
  { id: 'Review', title: 'Review', color: 'bg-orange-50', borderColor: 'border-orange-200', headerColor: 'bg-orange-100 text-orange-700' },
  { id: 'Done', title: 'Done', color: 'bg-green-50', borderColor: 'border-green-200', headerColor: 'bg-green-100 text-green-700' }
]

const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
}

// export default function TaskBoard({ tasks, onUpdateTask, userId, role }) {
export default function TaskBoard({ 
  tasks, 
  onUpdateTask, 
  userId, // This should come from useAuth
  role // This should come from useAuth
}) {
const [draggedTask, setDraggedTask] = useState(null)
  const [draggedOverColumn, setDraggedOverColumn] = useState(null)

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

  const handleDragStart = (e, task) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', task.id)
    // Add visual feedback
    e.currentTarget.style.opacity = '0.5'
  }

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1'
    setDraggedTask(null)
    setDraggedOverColumn(null)
  }

  const handleDragOver = (e, columnId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDraggedOverColumn(columnId)
  }

  const handleDragLeave = () => {
    setDraggedOverColumn(null)
  }

  const handleDrop = async (e, columnId) => {
    e.preventDefault()
    setDraggedOverColumn(null)
    
    if (draggedTask && draggedTask.status !== columnId) {
      await onUpdateTask(draggedTask.id, { status: columnId })
    }
    
    setDraggedTask(null)
  }

  const getTasksByStatus = (status) => {
    return tasks.filter(task => task.status === status)
  }

  const formatDate = (dateString) => {
    if (!dateString) return null
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="flex-1 bg-gray-50 p-6 overflow-x-auto">
      <div className="flex gap-4 min-w-max pb-4">
        {statusColumns.map(column => {
          const columnTasks = getTasksByStatus(column.id)
          const isDraggedOver = draggedOverColumn === column.id
          
          return (
            <div 
              key={column.id}
              className="flex-shrink-0 w-80"
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`${column.headerColor} rounded-t-lg px-4 py-3 border-b-2 ${column.borderColor}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm">{column.title}</h3>
                    <span className="text-xs font-medium bg-white/60 px-2 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Column Body */}
              <div 
                className={`
                  ${column.color} rounded-b-lg p-3 min-h-[500px] transition-all
                  ${isDraggedOver ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                `}
              >
                <div className="space-y-3">
                  {columnTasks.map(task => {
                    const isDragging = draggedTask?.id === task.id
                    const dueDate = formatDate(task.due_date)
                    
                    return (
                      <div
                        key={task.id}
                        draggable={canUpdateTask(task)}
                        onDragStart={(e) => canUpdateTask(task) && handleDragStart(e, task)}
                        onDragEnd={handleDragEnd}
                        className={`
                          bg-white border-2 rounded-lg p-4 shadow-sm hover:shadow-md 
                          transition-all cursor-move group
                          ${isDragging ? 'opacity-50' : 'hover:border-indigo-300'}
                          ${column.borderColor.replace('border-', 'border-')}
                        `}
                      >
                        {/* Task Header */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start gap-2 flex-1 min-w-0">
                            <GripVertical className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <h4 className="font-semibold text-gray-900 text-sm leading-snug flex-1">{task.title}</h4>
                          </div>
                          <a href={`/tasks/${task.id}`} className="text-xs text-indigo-600 hover:underline flex-shrink-0">
                            View
                          </a>
                        </div>
                        
                        {/* Task Description */}
                        {task.description && (
                          <p className="text-xs text-gray-600 mb-3 line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}
                        
                        {/* Task Footer */}
                        <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            {task.assignee_id && (
                              <div className="flex items-center gap-1.5">
                                <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center border border-indigo-200 flex-shrink-0">
                                  <User className="w-3 h-3 text-indigo-600" />
                                </div>
                                <span className="text-xs text-gray-600 truncate">User {task.assignee_id}</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex items-center gap-2 flex-shrink-0">
                            {dueDate && (
                              <div className="flex items-center gap-1 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{dueDate}</span>
                              </div>
                            )}
                            
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium border ${priorityColors[task.priority] || 'bg-gray-100 text-gray-700'}`}>
                              <Flag className="w-2.5 h-2.5" />
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  
                  {columnTasks.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <div className="text-sm">Drop tasks here</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
