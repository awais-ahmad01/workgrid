'use client'

import { Users, Activity, TrendingUp, CheckCircle2, AlertCircle, BarChart3, UserCheck, Crown, GraduationCap } from 'lucide-react'
import Link from 'next/link'

export default function AdminOverview({ data }) {
  if (!data) {
    return (
      <div className="text-center py-12 text-gray-500">
        No data available
      </div>
    )
  }

  const { 
    projectMembers, 
    projectStats, 
    activeInterns, 
    engagementMetrics, 
    completionRateByIntern 
  } = data

  return (
    <div className="space-y-6">
      {/* Project Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.membersCount || 0}
            </div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.totalTasks || 0}
            </div>
            <div className="text-xs text-gray-500">Tasks</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.docsCount || 0}
            </div>
            <div className="text-xs text-gray-500">Docs</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.filesCount || 0}
            </div>
            <div className="text-xs text-gray-500">Files</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.announcementsCount || 0}
            </div>
            <div className="text-xs text-gray-500">Announcements</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900">
              {projectStats?.overdueTasks || 0}
            </div>
            <div className="text-xs text-gray-500">Overdue</div>
          </div>
        </div>
      </div>

      {/* Task Summary */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="font-medium text-gray-900 mb-4">Task Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="p-4 rounded-lg text-center bg-gray-50 text-gray-700">
            <div className="text-lg font-semibold">{projectStats?.todoTasks || 0}</div>
            <div className="text-xs">Todo</div>
          </div>
          <div className="p-4 rounded-lg text-center bg-gray-50 text-gray-700">
            <div className="text-lg font-semibold">{projectStats?.inProgressTasks || 0}</div>
            <div className="text-xs">In Progress</div>
          </div>
          <div className="p-4 rounded-lg text-center bg-gray-50 text-gray-700">
            <div className="text-lg font-semibold">{projectStats?.doneTasks || 0}</div>
            <div className="text-xs">Done</div>
          </div>
          <div className="p-4 rounded-lg text-center bg-red-50 text-red-700">
            <div className="text-lg font-semibold">{projectStats?.overdueTasks || 0}</div>
            <div className="text-xs">Overdue</div>
          </div>
        </div>
      </div>

      {/* Project Members */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-indigo-600" />
          Project Members
        </h2>
        
        {/* Team Lead */}
        {projectMembers?.teamLead && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-yellow-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Team Lead</h3>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 bg-yellow-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-xs font-semibold text-white">
                    {getInitials(projectMembers.teamLead.full_name)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900">
                    {projectMembers.teamLead.full_name || 'Unknown'}
                  </div>
                  <div className="text-sm text-gray-600 truncate">
                    {projectMembers.teamLead.email}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Senior Interns */}
        {projectMembers?.seniorInterns && projectMembers.seniorInterns.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-purple-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Senior Interns ({projectMembers.seniorInterns.length})
              </h3>
            </div>
            <div className="space-y-2">
              {projectMembers.seniorInterns.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-lg border border-gray-200 bg-purple-50/30 hover:bg-purple-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xs font-semibold text-white">
                        {getInitials(member.full_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">
                        {member.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Interns */}
        {projectMembers?.interns && projectMembers.interns.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <UserCheck className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Interns ({projectMembers.interns.length})
              </h3>
            </div>
            <div className="space-y-2">
              {projectMembers.interns.map((member) => (
                <div
                  key={member.id}
                  className="p-3 rounded-lg border border-gray-200 bg-blue-50/30 hover:bg-blue-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-xs font-semibold text-white">
                        {getInitials(member.full_name)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 text-sm">
                        {member.full_name || 'Unknown'}
                      </div>
                      <div className="text-xs text-gray-600 truncate">
                        {member.email}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(!projectMembers?.teamLead && (!projectMembers?.interns || projectMembers.interns.length === 0) && (!projectMembers?.seniorInterns || projectMembers.seniorInterns.length === 0)) && (
          <div className="text-center py-8 text-gray-500 text-sm">
            No project members found
          </div>
        )}
      </div>

      {/* Active Interns */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-600" />
          Active Interns (Last 7 Days)
        </h2>
        <div className="space-y-3">
          {activeInterns?.length > 0 ? (
            activeInterns.map((intern) => {
              const lastActivity = intern.last_activity_at
                ? new Date(intern.last_activity_at)
                : null
              const timeAgo = lastActivity ? getTimeAgo(lastActivity) : 'No activity'
              
              return (
                <div
                  key={intern.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {intern.full_name || 'Unknown'}
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        {intern.email}
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          <span className="font-medium text-gray-700">{intern.task_count || 0}</span> tasks
                        </span>
                        <span>
                          <span className="font-medium text-gray-700">{intern.activity_count || 0}</span> activities
                        </span>
                        <span className="text-gray-400">•</span>
                        <span>Last active: {timeAgo}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {intern.activity_count > 0 && (
                        <div className="w-2 h-2 bg-green-500 rounded-full" title="Active" />
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No active interns found
            </div>
          )}
        </div>
      </div>

      {/* Completion Rate by Intern */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-600" />
          Task Completion Rate by Intern
        </h2>
        <div className="space-y-4">
          {completionRateByIntern?.length > 0 ? (
            completionRateByIntern.map((intern) => {
              const completionRate = parseFloat(intern.completion_rate) || 0
              
              return (
                <div
                  key={intern.id}
                  className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="font-medium text-gray-900">
                        {intern.full_name || 'Unknown'}
                      </div>
                      {intern.email && (
                        <div className="text-xs text-gray-500">{intern.email}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {completionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        {intern.completed} / {intern.total_assigned} tasks
                      </div>
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        completionRate >= 80 ? 'bg-green-500' :
                        completionRate >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(completionRate, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-8 text-gray-500 text-sm">
              No completion data available
            </div>
          )}
        </div>
      </div>

      {/* Engagement Metrics */}
      {/* <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-5 h-5 text-indigo-600" />
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Interns</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {engagementMetrics?.totalInterns || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div className="text-xs text-gray-500 uppercase tracking-wide">Completed Tasks</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {engagementMetrics?.completedTasks || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <div className="text-xs text-gray-500 uppercase tracking-wide">Overdue Tasks</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {engagementMetrics?.overdueTasks || 0}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-purple-600" />
            <div className="text-xs text-gray-500 uppercase tracking-wide">Active Interns</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {engagementMetrics?.internsWithTasks || 0}
          </div>
        </div>
      </div> */}
    </div>
  )
}

function getTimeAgo(date) {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} day${days !== 1 ? 's' : ''} ago`
  const weeks = Math.floor(days / 7)
  return `${weeks} week${weeks !== 1 ? 's' : ''} ago`
}

function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

