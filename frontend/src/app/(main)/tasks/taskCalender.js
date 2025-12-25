'use client'
import { useState } from 'react'
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon,
  Clock,
  User,
  Flag,
  X
} from 'lucide-react'

const priorityColors = {
  'High': 'bg-red-100 text-red-700 border-red-200',
  'Medium': 'bg-yellow-100 text-yellow-700 border-yellow-200',
  'Low': 'bg-green-100 text-green-700 border-green-200'
}

const statusColors = {
  'Backlog': 'bg-gray-100 text-gray-700',
  'Todo': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Review': 'bg-orange-100 text-orange-700',
  'Done': 'bg-green-100 text-green-700'
}

export default function TaskCalendar({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  const month = currentDate.getMonth()
  const year = currentDate.getFullYear()
  
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const startingDay = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const getTasksForDate = (day) => {
    const date = new Date(year, month, day)
    return tasks.filter(task => {
      if (!task.due_date) return false
      const taskDate = new Date(task.due_date)
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === month &&
        taskDate.getFullYear() === year
      )
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isToday = (day) => {
    const today = new Date()
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    )
  }

  const isPast = (day) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const taskDate = new Date(year, month, day)
    taskDate.setHours(0, 0, 0, 0)
    return taskDate < today && !isToday(day)
  }

  return (
    <div className="flex-1 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-gray-900">Calendar View</h2>
          </div>
          
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded hover:bg-white transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            
            <span className="text-sm font-semibold text-gray-700 px-4 min-w-[140px] text-center">
              {monthNames[month]} {year}
            </span>
            
            <button
              onClick={nextMonth}
              className="p-1.5 rounded hover:bg-white transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
        
        <button 
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 text-sm font-medium transition-colors"
        >
          Today
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Empty cells for days before the first day of month */}
        {Array.from({ length: startingDay }).map((_, index) => (
          <div key={`empty-${index}`} className="h-28 bg-gray-50 rounded-lg border border-gray-100"></div>
        ))}

        {/* Days of the month */}
        {days.map(day => {
          const dateTasks = getTasksForDate(day)
          const isSelected = selectedDate === day
          const today = isToday(day)
          const past = isPast(day)
          
          return (
            <div
              key={day}
              onClick={() => setSelectedDate(day)}
              className={`
                h-28 border-2 rounded-lg p-2 cursor-pointer transition-all
                ${isSelected 
                  ? 'border-indigo-500 bg-indigo-50 shadow-md' 
                  : today
                  ? 'border-blue-400 bg-blue-50'
                  : past
                  ? 'border-gray-200 bg-gray-50 opacity-60'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`
                  text-sm font-semibold
                  ${today ? 'text-blue-600' : isSelected ? 'text-indigo-700' : past ? 'text-gray-400' : 'text-gray-900'}
                `}>
                  {day}
                </span>
                
                {dateTasks.length > 0 && (
                  <span className={`
                    text-xs font-bold px-1.5 py-0.5 rounded-full
                    ${today 
                      ? 'bg-blue-200 text-blue-800' 
                      : isSelected 
                      ? 'bg-indigo-200 text-indigo-800' 
                      : 'bg-gray-200 text-gray-700'
                    }
                  `}>
                    {dateTasks.length}
                  </span>
                )}
              </div>

              {/* Tasks for this day */}
              <div className="space-y-1 max-h-16 overflow-y-auto">
                {dateTasks.slice(0, 2).map(task => (
                  <div
                    key={task.id}
                    className="p-1.5 rounded text-xs bg-white border border-gray-200 shadow-sm hover:shadow transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-1">
                      <span className="font-medium text-gray-900 truncate flex-1">
                        {task.title}
                      </span>
                      <span className={`px-1 py-0.5 rounded text-xs font-medium border flex-shrink-0 ${priorityColors[task.priority] || 'bg-gray-100'}`}>
                        {task.priority.charAt(0)}
                      </span>
                    </div>
                  </div>
                ))}
                
                {dateTasks.length > 2 && (
                  <div className="text-xs text-gray-500 text-center font-medium">
                    +{dateTasks.length - 2} more
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Selected Date Details Panel */}
      {selectedDate && (
        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Tasks for {formatDate(new Date(year, month, selectedDate))}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="space-y-3">
            {getTasksForDate(selectedDate).length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-gray-500 font-medium">No tasks scheduled for this day</p>
              </div>
            ) : (
              getTasksForDate(selectedDate).map(task => (
                <div
                  key={task.id}
                  className="bg-white border-2 border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900">{task.title}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority] || 'bg-gray-100'}`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[task.status] || 'bg-gray-100'}`}>
                          {task.status}
                        </span>
                      </div>
                      
                      {task.description && (
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        {task.assignee_id && (
                          <div className="flex items-center gap-1.5">
                            <User className="w-3.5 h-3.5" />
                            <span>User {task.assignee_id}</span>
                          </div>
                        )}
                        
                        {task.due_date && (
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{new Date(task.due_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Calendar Legend */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-700 mb-4">Legend</h4>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-blue-400 bg-blue-50"></div>
            <span className="text-xs text-gray-600 font-medium">Today</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border-2 border-indigo-500 bg-indigo-50"></div>
            <span className="text-xs text-gray-600 font-medium">Selected</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
              <span className="text-xs text-gray-600 font-medium">High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
              <span className="text-xs text-gray-600 font-medium">Medium</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
              <span className="text-xs text-gray-600 font-medium">Low</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
