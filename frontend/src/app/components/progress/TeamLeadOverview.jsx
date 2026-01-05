'use client'

import { Users, AlertTriangle, BarChart3, Calendar, TrendingUp, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

export default function TeamLeadOverview({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    )
  }

  const {
    teamMembers,
    outstandingByMember,
    overdueItems,
    workloadPerPerson,
    weeklySummary,
  } = data

  return (
    <div className="space-y-6">
      {/* Outstanding Tasks by Member */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Outstanding Tasks by Member
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Member</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Total</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Todo</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">In Progress</th>
                <th className="text-center py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {outstandingByMember?.length > 0 ? (
                outstandingByMember.map((member) => (
                  <tr key={member.assignee_id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 text-sm">
                          {member.assignee_name || 'Unassigned'}
                        </span>
                        {member.assignee_email && (
                          <span className="text-xs text-gray-500">{member.assignee_email}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-semibold text-gray-900">{member.task_count}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-blue-600 font-medium">{member.todo_count || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-purple-600 font-medium">{member.in_progress_count || 0}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-sm text-orange-600 font-medium">{member.review_count || 0}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                    No outstanding tasks
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Overdue Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          Overdue Items
        </h2>
        <div className="space-y-3">
          {overdueItems?.length > 0 ? (
            overdueItems.map((task) => {
              const dueDate = new Date(task.due_date)
              const daysOverdue = Math.floor((new Date() - dueDate) / (1000 * 60 * 60 * 24))
              
              return (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="block p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm truncate">
                        {task.title}
                      </div>
                      <div className="flex items-center gap-3 mt-2">
                        {task.assignee_name && (
                          <span className="text-xs text-gray-600">
                            Assigned to: <span className="font-medium">{task.assignee_name}</span>
                          </span>
                        )}
                        <span className="text-xs text-red-600 font-medium">
                          {daysOverdue} day{daysOverdue !== 1 ? 's' : ''} overdue
                        </span>
                        <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                          task.priority === 'High' ? 'bg-red-100 text-red-700' :
                          task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  </div>
                </Link>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No overdue items 🎉
            </div>
          )}
        </div>
      </div>

      {/* Workload per Person */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Workload per Person
        </h2>
        <div className="space-y-4">
          {workloadPerPerson?.length > 0 ? (
            workloadPerPerson.map((person) => {
              const completionRate = person.total_tasks > 0
                ? Math.round((person.completed_tasks / person.total_tasks) * 100)
                : 0
              
              return (
                <div
                  key={person.assignee_id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {person.assignee_name || 'Unassigned'}
                      </div>
                      {person.assignee_email && (
                        <div className="text-xs text-gray-500">{person.assignee_email}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">
                        {completionRate}% Complete
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-3 text-sm">
                    <div>
                      <div className="text-gray-500 text-xs">Total</div>
                      <div className="font-semibold text-gray-900">{person.total_tasks}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Active</div>
                      <div className="font-semibold text-purple-600">{person.active_tasks}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Completed</div>
                      <div className="font-semibold text-green-600">{person.completed_tasks}</div>
                    </div>
                    <div>
                      <div className="text-gray-500 text-xs">Overdue</div>
                      <div className="font-semibold text-red-600">{person.overdue_tasks || 0}</div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-3 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No workload data available
            </div>
          )}
        </div>
      </div>

      {/* Weekly Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-600" />
          Weekly Summary (Tasks Created vs Completed)
        </h2>
        <div className="space-y-3">
          {weeklySummary?.length > 0 ? (
            weeklySummary.map((day, index) => {
              const date = new Date(day.date)
              const dateStr = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
              
              return (
                <div
                  key={index}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-900 text-sm">{dateStr}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Created</div>
                        <div className="font-semibold text-gray-900">{day.created_count || 0}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500">Completed</div>
                        <div className="font-semibold text-gray-900">{day.completed_count || 0}</div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No weekly data available
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

