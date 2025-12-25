'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'

const ROLES = [
  'SUPER_ADMIN',
    'ADMIN',
  'TEAM_LEAD',
  'HR',
  'SENIOR_INTERNEE',
  'INTERNEE'
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

    const res = await sendInvite(email, role)

    if (res.success) {
      setSuccess(true)
      setEmail('')
    } else {
      setError(res.error)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/30 flex items-center justify-center">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">
        
        {/* Header */}
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">
            Invite Team Member
          </h2>
          <button onClick={onClose}>
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {success && (
            <div className="text-sm text-green-600">
              Invitation sent successfully.
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-black border rounded-lg text-sm"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="mt-1 w-full px-3 py-2 text-black border rounded-lg text-sm"
            >
              {ROLES.map(r => (
                <option key={r} value={r}>
                  {r.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
