// 'use client'

// import { useState } from 'react'
// import { X } from 'lucide-react'
// import { useAuth } from '@/lib/hooks/useAuth'

// const ROLES = [
//   'SUPER_ADMIN',
//     'ADMIN',
//   'TEAM_LEAD',
//   'HR',
//   'SENIOR_INTERN',
//   'INTERN'
// ]

// export default function InviteMemberModal({ open, onClose }) {
//   const { sendInvite, loading } = useAuth()

//   const [email, setEmail] = useState('')
//   const [role, setRole] = useState('TEAM_LEAD')
//   const [error, setError] = useState(null)
//   const [success, setSuccess] = useState(false)

//   if (!open) return null

//   const handleSubmit = async (e) => {
//     e.preventDefault()
//     setError(null)

//     const res = await sendInvite(email, role)

//     if (res.success) {
//       setSuccess(true)
//       setEmail('')
//     } else {
//       setError(res.error)
//     }
//   }

//   return (
//     <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
//       <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
        
//         {/* Header */}
//         <div className="px-6 py-4 border-b flex justify-between items-center">
//           <h2 className="font-semibold text-gray-900">
//             Invite Team Member
//           </h2>
//           <button onClick={onClose}>
//             <X className="w-5 h-5 text-gray-400" />
//           </button>
//         </div>

//         {/* Body */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-4">
//           {success && (
//             <div className="text-sm text-green-600">
//               Invitation sent successfully.
//             </div>
//           )}

//           {error && (
//             <div className="text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           <div>
//             <label className="text-sm text-gray-600">Email</label>
//             <input
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1 w-full px-3 py-2 text-black border rounded-lg text-sm"
//             />
//           </div>

//           <div>
//             <label className="text-sm text-gray-600">Role</label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="mt-1 w-full px-3 py-2 text-black border rounded-lg text-sm"
//             >
//               {ROLES.map(r => (
//                 <option key={r} value={r}>
//                   {r.replace('_', ' ')}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="flex justify-end gap-2 pt-2">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-4 py-2 text-sm rounded-lg border"
//             >
//               Cancel
//             </button>

//             <button
//               type="submit"
//               disabled={loading}
//               className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
//             >
//               {loading ? 'Sending...' : 'Send Invite'}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   )
// }




'use client'

import { useState } from 'react'
import { X, Loader2, CheckCircle2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'TEAM_LEAD',
  'HR',
  'SENIOR_INTERN',
  'INTERN'
]

export default function InviteMemberModal({ open, onClose }) {
  const { sendInvite } = useAuth()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('TEAM_LEAD')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false) // Local loading state

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    try {
      const res = await sendInvite(email, role)

      if (res.success) {
        setSuccess(true)
        setEmail('')
        setRole('TEAM_LEAD')
        // Auto-close after 3 seconds on success
        setTimeout(() => {
          setSuccess(false)
          onClose()
        }, 3000)
      } else {
        // Extract user-friendly error message
        const errorMessage = res.error || 'Failed to send invitation. Please try again.'
        setError(errorMessage)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      console.error('Invite error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setError(null)
      setSuccess(false)
      setEmail('')
      setRole('TEAM_LEAD')
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1 hover:bg-gray-100 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">Invitation sent successfully!</p>
                <p className="text-xs text-green-700">
                  An invitation email has been sent to <strong>{email}</strong>. They will receive instructions to join your workspace.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
              <p className="font-medium text-sm mb-1">Unable to send invitation</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || success}
              className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Sent
                </>
              ) : (
                'Send Invite'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}