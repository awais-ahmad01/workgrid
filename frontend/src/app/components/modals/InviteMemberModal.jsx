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
import { X } from 'lucide-react'
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
  const { sendInvite, loading } = useAuth()

  const [email, setEmail] = useState('')
  const [role, setRole] = useState('TEAM_LEAD')
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  if (!open) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const res = await sendInvite(email, role)

    if (res.success) {
      setSuccess(true)
      setEmail('')
      setRole('TEAM_LEAD')
      // Auto-close after 2 seconds on success
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 2000)
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
              Invitation sent successfully!
            </div>
          )}

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
              {error}
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
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}