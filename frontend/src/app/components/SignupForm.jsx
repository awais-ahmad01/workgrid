'use client';
import { UserCircle, Check, EyeOff, Eye, Lock, Mail, User, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/hooks/useAuth'

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [localError, setLocalError] = useState('')
  const [localSuccess, setLocalSuccess] = useState('')
  const router = useRouter()
  
  const { signup, loading, error } = useAuth()

  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'intern'
  })
  
  const roles = [
    { value: 'intern', label: 'Intern' },
    { value: 'senior_intern', label: 'Senior Intern' },
    { value: 'employee', label: 'Employee' },
    { value: 'team_lead', label: 'Team Lead' },
    { value: 'hr', label: 'HR' },
    { value: 'admin', label: 'Admin' },
    { value: 'super_admin', label: 'Super Admin' }
  ]

  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    setLocalSuccess('')

    // Validate passwords
    if (signupData.password !== signupData.confirmPassword) {
      setLocalError("Passwords do not match")
      return
    }

    // Validate password strength
    if (signupData.password.length < 6) {
      setLocalError("Password must be at least 6 characters long")
      return
    }

    const result = await signup(
      signupData.name,
      signupData.email,
      signupData.password,
      signupData.role
    )
    
    if (result.success) {
      setLocalSuccess("Signup successful! Please check your email to verify your account.")
      
      // Clear form
      setSignupData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'intern'
      })
      
      // Optionally redirect to login after delay
      // setTimeout(() => {
      //   router.push("/auth");
      // }, 3000);
    } else {
      // Show error from result
      setLocalError(result.error || "Signup failed")
    }
  }

  return (
    <form onSubmit={handleSignupSubmit} className="space-y-4">
      {/* Show both Redux errors and local validation errors */}
      {(error || localError) && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error || localError}
        </div>
      )}
      
      {localSuccess && (
        <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
          {localSuccess}
          <p className="mt-1 text-xs">You will be redirected to login page shortly...</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Full Name *
        </label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={signupData.name}
            onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full pl-11 pr-4 py-3 border text-black border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address *
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="email"
            required
            value={signupData.email}
            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            placeholder="you@example.com"
            className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            disabled={loading}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <div className="relative">
          <UserCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <select
            required
            value={signupData.role}
            onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
            className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none bg-white cursor-pointer disabled:opacity-50"
            disabled={loading}
          >
            {roles.map(role => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>
      </div>

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
            value={signupData.password}
            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirm Password *
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            minLength={6}
            value={signupData.confirmPassword}
            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
            placeholder="Confirm your password"
            className="w-full pl-11 pr-12 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
            disabled={loading}
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin w-4 h-4" />
            Creating Account...
          </>
        ) : (
          <>
            <Check className="w-4 h-4" />
            Create Account
          </>
        )}
      </button>
    </form>
  )
}