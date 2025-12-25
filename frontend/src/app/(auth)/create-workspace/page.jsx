// 'use client'

// import { useState } from 'react'
// import { Check, Eye, EyeOff, Loader2, Lock, Mail, User, Building } from 'lucide-react'
// import { useAuth } from '@/lib/hooks/useAuth'

// export default function AdminSignupForm() {
//   const { signupAdmin, loading, error } = useAuth()

//   const [showPassword, setShowPassword] = useState(false)
//   const [success, setSuccess] = useState('')
//   const [form, setForm] = useState({
//     companyName: '',
//     fullName: '',
//     email: '',
//     password: '',
//   })

//   const submit = async (e) => {
//     e.preventDefault()
//     setSuccess('')

//     const res = await signupAdmin(form)
//     if (res.success) {
//       setSuccess('Account created. Please verify your email to activate your workspace.')
//       setForm({ companyName: '', fullName: '', email: '', password: '' })
//     }
//   }

//   return (
//     <form onSubmit={submit} className="space-y-4">
    //   {(error || success) && (
    //     <div className={`p-3 rounded-lg text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
    //       {error || success}
    //     </div>
    //   )}

//       {/* Company Name */}
//       <Input
//         icon={<Building />}
//         label="Company Name"
//         value={form.companyName}
//         onChange={(v) => setForm({ ...form, companyName: v })}
//       />

//       {/* Full Name */}
//       <Input
//         icon={<User />}
//         label="Full Name"
//         value={form.fullName}
//         onChange={(v) => setForm({ ...form, fullName: v })}
//       />

//       {/* Email */}
//       <Input
//         icon={<Mail />}
//         label="Email"
//         type="email"
//         value={form.email}
//         onChange={(v) => setForm({ ...form, email: v })}
//       />

//       {/* Password */}
//       <div>
//         <label className="text-sm font-medium mb-2 block">Password</label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type={showPassword ? 'text' : 'password'}
//             value={form.password}
//             required
//             minLength={6}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             className="w-full pl-11 pr-12 py-3 text-black border rounded-xl"
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2"
//           >
//             {showPassword ? <EyeOff /> : <Eye />}
//           </button>
//         </div>
//       </div>

//       <button
//         disabled={loading}
//         className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex justify-center gap-2"
//       >
//         {loading ? <Loader2 className="animate-spin" /> : <Check />}
//         Create Workspace
//       </button>
//     </form>
//   )
// }

// /* Small reusable input */
// function Input({ icon, label, value, onChange, type = 'text' }) {
//   return (
//     <div>
//       <label className="text-sm font-medium mb-2 block">{label}</label>
//       <div className="relative">
//         {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</span>}
//         <input
//           type={type}
//           required
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="w-full pl-11 pr-4 py-3 text-black border rounded-xl"
//         />
//       </div>
//     </div>
//   )
// }



'use client'

import { useState } from 'react'
import { Check, Eye, EyeOff, Loader2, Lock, Mail, User, Building } from 'lucide-react'

import { useAuth } from '@/lib/hooks/useAuth'

export default function AdminSignupForm() {
  const { signupAdmin, loading, error } = useAuth()
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    companyName: '',
    fullName: '',
    email: '',
    password: '',
  })

    const submit = async (e) => {
    e.preventDefault()
    setSuccess('')

    const res = await signupAdmin(form)
    if (res.success) {
      setSuccess('Account created. Please verify your email to activate your workspace.')
      setForm({ companyName: '', fullName: '', email: '', password: '' })
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <span className="text-white text-xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Your Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Set up your company account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  placeholder="Your company name"
                  className="w-full pl-11 pr-4 py-3 border text-black border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border text-black border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@company.com"
                  className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password * (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="w-full pl-11 pr-12 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating Workspace...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Workspace
                </>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 WorkGrid. All rights reserved.
        </p>
      </div>
    </div>
  )
}