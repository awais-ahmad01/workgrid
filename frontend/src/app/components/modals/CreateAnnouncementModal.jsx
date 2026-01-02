// 'use client'

// import { useState } from 'react'
// import { useAnnouncements } from '@/lib/hooks/useAnnouncements'
// import { useProjects } from '@/lib/hooks/useProjects'
// import { X } from 'lucide-react'

// const CATEGORIES = [
//   'GENERAL',
//   'POLICY',
//   'HR',
//   'PROJECT_UPDATE',
//   'REMINDER',
// ]

// const ROLES = [
//   'SUPER_ADMIN',
//   'ADMIN',
//   'HR',
//   'TEAM_LEAD',
//   'EMPLOYEE',
//   'INTERN',
// ]

// export default function CreateAnnouncementModal({ onClose }) {
//   const { createAnnouncement } = useAnnouncements()
//   const { list: projects } = useProjects() // ✅ get projects

//   const [title, setTitle] = useState('')
//   const [body, setBody] = useState('')
//   const [category, setCategory] = useState('GENERAL')

//   const [targetType, setTargetType] = useState('COMPANY')
//   const [role, setRole] = useState('HR')
//   const [projectId, setProjectId] = useState('')

//   const handleSubmit = async () => {
//     let targets = []

//     if (targetType === 'COMPANY') {
//       targets = [{ type: 'COMPANY' }]
//     }

//     if (targetType === 'ROLE') {
//       targets = [{ type: 'ROLE', id: role }]
//     }

//     if (targetType === 'PROJECT' && projectId) {
//       targets = [{ type: 'PROJECT', id: projectId }]
//     }

//     await createAnnouncement({
//       title,
//       body,
//       category,
//       targets,
//     })

//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
//       <div className="bg-white p-6 rounded-lg w-full max-w-lg space-y-4">
//         {/* Header */}
//         <div className="flex justify-between items-center">
//           <h2 className="font-semibold">New Announcement</h2>
//           <button onClick={onClose}>
//             <X className="w-4 h-4" />
//           </button>
//         </div>

//         {/* Title */}
//         <input
//           className="w-full border p-2 rounded"
//           placeholder="Title"
//           value={title}
//           onChange={e => setTitle(e.target.value)}
//         />

//         {/* Body */}
//         <textarea
//           className="w-full border p-2 rounded h-32"
//           placeholder="Message (HTML allowed)"
//           value={body}
//           onChange={e => setBody(e.target.value)}
//         />

//         {/* Category */}
//         <select
//           className="w-full border p-2 rounded"
//           value={category}
//           onChange={e => setCategory(e.target.value)}
//         >
//           {CATEGORIES.map(c => (
//             <option key={c} value={c}>{c}</option>
//           ))}
//         </select>

//         {/* Target Type */}
//         <select
//           className="w-full border p-2 rounded"
//           value={targetType}
//           onChange={e => {
//             setTargetType(e.target.value)
//             setProjectId('')
//           }}
//         >
//           <option value="COMPANY">Entire Company</option>
//           <option value="ROLE">By Role</option>
//           <option value="PROJECT">By Project</option>
//         </select>

//         {/* Role selector */}
//         {targetType === 'ROLE' && (
//           <select
//             className="w-full border p-2 rounded"
//             value={role}
//             onChange={e => setRole(e.target.value)}
//           >
//             {ROLES.map(r => (
//               <option key={r} value={r}>{r}</option>
//             ))}
//           </select>
//         )}

//         {/* ✅ Project selector */}
//         {targetType === 'PROJECT' && (
//           <select
//             className="w-full border p-2 rounded"
//             value={projectId}
//             onChange={e => setProjectId(e.target.value)}
//           >
//             <option value="">Select project</option>
//             {projects.map(p => (
//               <option key={p.id} value={p.id}>
//                 {p.name}
//               </option>
//             ))}
//           </select>
//         )}

//         {/* Actions */}
//         <div className="flex justify-end gap-2 pt-2">
//           <button onClick={onClose} className="text-sm text-gray-600">
//             Cancel
//           </button>
//           <button
//             onClick={handleSubmit}
//             disabled={targetType === 'PROJECT' && !projectId}
//             className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-50"
//           >
//             Post
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { useAnnouncements } from '@/lib/hooks/useAnnouncements'
import { useProjects } from '@/lib/hooks/useProjects'
import { X, Loader2, Megaphone } from 'lucide-react'

const CATEGORIES = [
  { value: 'GENERAL', label: 'General' },
  { value: 'POLICY', label: 'Policy' },
  { value: 'HR', label: 'HR' },
  { value: 'PROJECT_UPDATE', label: 'Project Update' },
  { value: 'REMINDER', label: 'Reminder' },
]

const ROLES = [
  { value: 'SUPER_ADMIN', label: 'Super Admin' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'HR', label: 'HR' },
  { value: 'TEAM_LEAD', label: 'Team Lead' },
  { value: 'EMPLOYEE', label: 'Employee' },
  { value: 'INTERN', label: 'Intern' },
]

export default function CreateAnnouncementModal({ onClose }) {
  const { createAnnouncement } = useAnnouncements()
  const { list: projects } = useProjects()

  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [targetType, setTargetType] = useState('COMPANY')
  const [role, setRole] = useState('HR')
  const [projectId, setProjectId] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    // Validation
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    if (!body.trim()) {
      setError('Message is required')
      return
    }
    if (targetType === 'PROJECT' && !projectId) {
      setError('Please select a project')
      return
    }

    setError('')
    setIsSubmitting(true)

    try {
      let targets = []

      if (targetType === 'COMPANY') {
        targets = [{ type: 'COMPANY' }]
      }

      if (targetType === 'ROLE') {
        targets = [{ type: 'ROLE', id: role }]
      }

      if (targetType === 'PROJECT' && projectId) {
        targets = [{ type: 'PROJECT', id: projectId }]
      }

      await createAnnouncement({
        title,
        body,
        category,
        targets,
      })

      onClose()
    } catch (err) {
      setError(err.message || 'Failed to create announcement')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      {/* Backdrop with blur effect */}
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
        onClick={() => !isSubmitting && onClose()}
      />
      
      {/* Modal content */}
      <div className="bg-white rounded-lg max-w-2xl w-full relative z-10 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">New Announcement</h2>
          </div>
          <button 
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <div className="flex-shrink-0">
                <X className="w-5 h-5 text-red-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-red-800">{error}</p>
              </div>
              <button 
                onClick={() => setError('')}
                className="flex-shrink-0 text-red-400 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
              placeholder="Enter announcement title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
              value={category}
              onChange={e => setCategory(e.target.value)}
              disabled={isSubmitting}
            >
              {CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
              placeholder="Enter your message (HTML is supported)"
              value={body}
              onChange={e => setBody(e.target.value)}
              rows={6}
              disabled={isSubmitting}
            />
            <p className="mt-1.5 text-xs text-gray-500">
              You can use HTML tags for formatting
            </p>
          </div>

          {/* Target Audience */}
          <div className="border-t border-gray-200 pt-5">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Target Audience
            </label>
            
            <div className="space-y-4">
              {/* Target Type Selection */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('COMPANY')
                    setProjectId('')
                  }}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    targetType === 'COMPANY'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  Entire Company
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTargetType('ROLE')
                    setProjectId('')
                  }}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    targetType === 'ROLE'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  By Role
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('PROJECT')}
                  disabled={isSubmitting}
                  className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                    targetType === 'PROJECT'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  } disabled:opacity-50`}
                >
                  By Project
                </button>
              </div>

              {/* Role Selector */}
              {targetType === 'ROLE' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Select Role
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                    value={role}
                    onChange={e => setRole(e.target.value)}
                    disabled={isSubmitting}
                  >
                    {ROLES.map(r => (
                      <option key={r.value} value={r.value}>{r.label}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Project Selector */}
              {targetType === 'PROJECT' && (
                <div className="animate-fadeIn">
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Select Project
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors bg-white"
                    value={projectId}
                    onChange={e => setProjectId(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Choose a project...</option>
                    {projects.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || (targetType === 'PROJECT' && !projectId)}
            className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Megaphone className="w-4 h-4" />
                Post Announcement
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}