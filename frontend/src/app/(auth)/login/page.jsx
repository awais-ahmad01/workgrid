// 'use client'
// import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
// import { useState } from 'react'
// import { useRouter } from 'next/navigation'
// import { useAuth } from '@/lib/hooks/useAuth'

// export default function LoginForm() {
//   const [showPassword, setShowPassword] = useState(false)
//   const [loginData, setLoginData] = useState({
//     email: '',
//     password: ''
//   })
  
//   const router = useRouter()
//   const { login, loading, error } = useAuth()

//   const handleLoginSubmit = async (e) => {
//     e.preventDefault()
    
//     const result = await login(loginData.email, loginData.password)
    
//     if (result.success) {
//       // Redirect to home page on successful login
//       window.location.href = "/home"
//         // console.log("Success::")
//     } else {
//       // Error is already handled in the useAuth hook and stored in Redux state
//       // You can show it using the error from useAuth
//     }
//   }

//   return (
//     <form onSubmit={handleLoginSubmit} className="space-y-5">
//       {error && (
//         <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
//           {error}
//         </div>
//       )}
      
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Email Address
//         </label>
//         <div className="relative">
//           <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="email"
//             required
//             value={loginData.email}
//             onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
//             placeholder="you@example.com"
//             className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//             disabled={loading}
//           />
//         </div>
//       </div>

//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Password
//         </label>
//         <div className="relative">
//           <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type={showPassword ? 'text' : 'password'}
//             required
//             value={loginData.password}
//             onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
//             placeholder="Enter your password"
//             className="w-full pl-11 pr-12 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
//             disabled={loading}
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
//             disabled={loading}
//           >
//             {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
//           </button>
//         </div>
//       </div>

//       <div className="flex items-center justify-between text-sm">
//         <button
//           type="button"
//           onClick={() => alert("Password reset feature coming soon")}
//           className="text-gray-600 hover:text-gray-900 font-medium disabled:opacity-50"
//           disabled={loading}
//         >
//           Forgot password?
//         </button>
//       </div>
      
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//       >
//         {loading ? (
//           <>
//             <Loader2 className="animate-spin w-4 h-4" />
//             Signing in...
//           </>
//         ) : (
//           <>
//             Sign In
//             <ArrowRight size={16} />
//           </>
//         )}
//       </button>
//     </form>
//   )
// }



'use client'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/lib/hooks/useAuth'

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  })

  const { login, loading, error } = useAuth()

 const handleLoginSubmit = async (e) => {
    e.preventDefault()
    
    const result = await login(loginData.email, loginData.password)
    
    if (result.success) {
      // Redirect to home page on successful login
       console.log("Success::", result)
      window.location.href = "/home"
       
    } else {
      // Error is already handled in the useAuth hook and stored in Redux state
      // You can show it using the error from useAuth
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to your account</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-5">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-12 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              
               
              <button
                type="button"
                onClick={() => alert("Password reset feature coming soon")}
                className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors disabled:opacity-50"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
            
            <button
              type="button"
              onClick={handleLoginSubmit}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
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