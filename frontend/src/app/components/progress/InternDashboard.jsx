'use client'

import { CheckCircle2, Clock, AlertCircle, TrendingUp, Calendar } from 'lucide-react'
import Link from 'next/link'

const statusColors = {
  'Backlog': 'bg-gray-100 text-gray-700',
  'Todo': 'bg-blue-100 text-blue-700',
  'In Progress': 'bg-purple-100 text-purple-700',
  'Review': 'bg-orange-100 text-orange-700',
  'Done': 'bg-green-100 text-green-700',
}

const priorityColors = {
  'High': 'text-red-600',
  'Medium': 'text-yellow-600',
  'Low': 'text-green-600',
}

export default function InternDashboard({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    )
  }

  const { tasksByStatus, upcomingDeadlines, recentlyCompleted, activityHighlights } = data

  return (
    <div className="space-y-6">
      {/* Tasks by Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Tasks by Status
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {tasksByStatus?.map((item) => (
            <div
              key={item.status}
              className={`p-4 rounded-lg ${statusColors[item.status] || 'bg-gray-100 text-gray-700'}`}
            >
              <div className="text-2xl font-bold">{item.count}</div>
              <div className="text-sm font-medium mt-1">{item.status}</div>
            </div>
          ))}
          {(!tasksByStatus || tasksByStatus.length === 0) && (
            <div className="col-span-5 text-center py-8 text-gray-500 text-sm">
              No tasks found
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-indigo-600" />
            Upcoming Deadlines
          </h2>
          <div className="space-y-3">
            {upcomingDeadlines?.length > 0 ? (
              upcomingDeadlines.map((task) => {
                const dueDate = new Date(task.due_date)
                const daysUntil = Math.ceil((dueDate - new Date()) / (1000 * 60 * 60 * 24))
                
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium ${priorityColors[task.priority] || 'text-gray-600'}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {daysUntil === 0 ? 'Due today' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''} left`}
                          </span>
                        </div>
                      </div>
                      <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No upcoming deadlines
              </div>
            )}
          </div>
        </div>

        {/* Recently Completed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Recently Completed
          </h2>
          <div className="space-y-3">
            {recentlyCompleted?.length > 0 ? (
              recentlyCompleted.map((task) => {
                const completedDate = new Date(task.completed_at)
                const daysAgo = Math.floor((new Date() - completedDate) / (1000 * 60 * 60 * 24))
                
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 text-sm truncate">
                          {task.title}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-medium ${priorityColors[task.priority] || 'text-gray-600'}`}>
                            {task.priority}
                          </span>
                          <span className="text-xs text-gray-500">
                            {daysAgo === 0 ? 'Completed today' : `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`}
                          </span>
                        </div>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                    </div>
                  </Link>
                )
              })
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">
                No completed tasks recently
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Highlights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-indigo-600" />
          Activity Highlights
        </h2>
        <div className="space-y-2">
          {activityHighlights?.length > 0 ? (
            activityHighlights.map((activity) => {
              const activityDate = new Date(activity.created_at)
              const timeAgo = getTimeAgo(activityDate)
              
              return (
                <div
                  key={activity.id}
                  className="p-3 rounded-lg border border-gray-100 bg-gray-50"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900">
                        <span className="font-medium">{activity.user_name || 'Someone'}</span>
                        {' '}
                        <span className="text-gray-600">{getActionText(activity.action, activity.field)}</span>
                        {' '}
                        <Link
                          href={`/tasks/${activity.task_id}`}
                          className="text-indigo-600 hover:underline font-medium"
                        >
                          {activity.task_title}
                        </Link>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {timeAgo}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No recent activity
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function getActionText(action, field) {
  if (action === 'created') return 'created'
  if (action === 'updated' && field) return `updated ${field} of`
  if (action === 'updated') return 'updated'
  if (action === 'status_changed') return 'changed status of'
  return 'modified'
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days !== 1 ? 's' : ''} ago`
}

