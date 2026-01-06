'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { UserPlus, Trash2, ArrowLeft, Loader2, Users, CheckCircle, AlertCircle, X, Mail } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import { useAuth } from '@/lib/hooks/useAuth'
import { useOrganization } from '@/lib/hooks/useOrganization'

export default function ProjectDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { user } = useAuth()
  
  const {
    list: projects,
    members,
    fetchProjectMembers,
    removeProjectMember,
    addProjectMembers,
  } = useProjects()
  
  const { members: orgMembers, fetchMembers, loading: orgLoading } = useOrganization()
  
  const [addOpen, setAddOpen] = useState(false)
  const [selected, setSelected] = useState([])
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [removing, setRemoving] = useState(null)
  const [adding, setAdding] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Find project from list
  const project = projects.find(p => p.id === id)

  // Fetch data with local loading state
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        await Promise.all([
          fetchProjectMembers(id),
          fetchMembers()
        ])
      } catch (error) {
        console.error('Failed to load project data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    if (id) {
      loadData()
    }
  }, [id, fetchProjectMembers, fetchMembers])

  const availableMembers = orgMembers.filter(
    m => !members.some(pm => pm.id === m.id)
  )

  const handleRemoveMember = async (memberId) => {
    if (!deleteConfirm || deleteConfirm !== memberId) {
      setDeleteConfirm(memberId)
      return
    }

    setRemoving(memberId)
    try {
      await removeProjectMember({ projectId: id, memberId })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Failed to remove member:', error)
    } finally {
      setRemoving(null)
    }
  }

  const handleAddMembers = async () => {
    if (selected.length === 0) return

    setAdding(true)
    try {
      await addProjectMembers({ projectId: id, userIds: selected })
      setSelected([])
      setAddOpen(false)
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 3000)
      // Refresh members list
      await fetchProjectMembers(id)
    } catch (error) {
      console.error('Failed to add members:', error)
    } finally {
      setAdding(false)
    }
  }

  // Filter out current user from members list
  const displayMembers = members.filter(m => m.id !== user?.id)

  return (
    <div className="flex flex-col gap-6">
      {/* Header - matches Tasks/Files/Docs styling */}
      <div className="flex flex-col gap-4 sticky top-0 z-20 bg-gray-50">
        <div className="flex items-center justify-between bg-white border-b border-gray-200 px-6 md:px-10 lg:px-12 py-4 shadow-sm">
          {/* Left: Back button + Title */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/projects')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Projects"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {project?.name || 'Project Details'}
              </h1>
              {project?.description && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Right: Add Members Button */}
          <button
            onClick={() => setAddOpen(true)}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Members</span>
          </button>
        </div>
      </div>

      {/* Content Area - matches Tasks/Files/Docs spacing */}
      <div className="px-6 md:px-10 lg:px-12 pb-8 space-y-4">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <span className="text-green-800 font-medium text-sm">Members added successfully!</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Loading project members...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Members Table - matches Docs/Files table styling */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-indigo-600" />
                    <h2 className="text-lg font-semibold text-gray-900">Team Members</h2>
                  </div>
                  <span className="text-sm text-gray-500">
                    {displayMembers.length} {displayMembers.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </div>

              {displayMembers.length === 0 ? (
                <div className="p-8 text-center">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No members yet</h3>
                  <p className="text-gray-500 mb-4">Add team members to get started</p>
                  <button
                    onClick={() => setAddOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Members</span>
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {displayMembers.map(m => (
                        <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-semibold text-sm">
                                  {m.full_name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {m.full_name}
                                </p>
                                {m.email && (
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Mail className="w-3 h-3" />
                                    <span className="truncate">{m.email}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                              {m.role || 'Member'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button
                              onClick={() => handleRemoveMember(m.id)}
                              disabled={removing === m.id}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {removing === m.id ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Removing...
                                </>
                              ) : (
                                <>
                                  <Trash2 className="w-4 h-4" />
                                  Remove
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Modal - matches Files section style */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Remove Member</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to remove this member from the project?
            </p>
            {displayMembers.find(m => m.id === deleteConfirm) && (
              <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg mb-6">
                {displayMembers.find(m => m.id === deleteConfirm).full_name}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={removing === deleteConfirm}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleRemoveMember(deleteConfirm)}
                disabled={removing === deleteConfirm}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {removing === deleteConfirm && <Loader2 className="w-4 h-4 animate-spin" />}
                {removing === deleteConfirm ? 'Removing...' : 'Remove Member'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Members Modal - matches consistent modal styling */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add Team Members</h2>
                <p className="text-sm text-gray-500 mt-1">Select members to add to this project</p>
              </div>
              <button
                onClick={() => {
                  setAddOpen(false)
                  setSelected([])
                }}
                disabled={adding}
                className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              {orgLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                    <span>Loading members...</span>
                  </div>
                </div>
              ) : availableMembers.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium mb-1">No available members</p>
                  <p className="text-sm text-gray-500">All organization members are already in this project</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableMembers.map(m => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(m.id)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, m.id]
                              : selected.filter(id => id !== m.id)
                          )
                        }
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{m.full_name}</p>
                        {m.email && (
                          <p className="text-sm text-gray-500 truncate">{m.email}</p>
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
              <button
                onClick={handleAddMembers}
                disabled={selected.length === 0 || adding}
                className="w-full py-2.5 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
              >
                {adding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    Add {selected.length > 0 ? `${selected.length} ` : ''}Selected Member{selected.length !== 1 ? 's' : ''}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
