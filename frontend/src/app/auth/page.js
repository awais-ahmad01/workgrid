// 'use client'
// import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import SignupForm from './signup/page'
// import LoginForm from './login/page'

// export default function AuthPages() {
//   const [isLogin, setIsLogin] = useState(true)  
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem('auth_token');
//     if (token) {
//       router.push('/');
//     }
//   }, [router]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
//       <div className="w-full max-w-md">
        
//         {/* Logo */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
//             <span className="text-white text-xl font-bold">W</span>
//           </div>
//           <h1 className="text-2xl font-bold text-gray-900">WorkGrid</h1>
//           <p className="text-sm text-gray-500 mt-1">Manage your work efficiently</p>
//         </div>

//         {/* Card */}
//         <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
//           {/* Toggle Tabs */}
//           <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
//             <button
//               onClick={() => setIsLogin(true)}
//               className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
//                 isLogin 
//                   ? 'bg-white text-gray-900 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Login
//             </button>
//             <button
//               onClick={() => setIsLogin(false)}
//               className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
//                 !isLogin 
//                   ? 'bg-white text-gray-900 shadow-sm' 
//                   : 'text-gray-500 hover:text-gray-700'
//               }`}
//             >
//               Sign Up
//             </button>
//           </div>

//           {/* Form */}
//           {isLogin ? (
//             <LoginForm />
//           ) : (
//             <SignupForm />
//           )}

//           {/* Footer */}
//           <div className="mt-6 text-center">
//             <p className="text-sm text-gray-500">
//               {isLogin ? "Don't have an account? " : "Already have an account? "}
//               <button
//                 onClick={() => setIsLogin(!isLogin)}
//                 className="text-indigo-600 hover:text-indigo-800 font-medium"
//               >
//                 {isLogin ? 'Sign up' : 'Sign in'}
//               </button>
//             </p>
//           </div>
//         </div>

//         {/* Bottom Text */}
//         <p className="text-center text-xs text-gray-400 mt-6">
//           © 2024 WorkGrid. All rights reserved.
//         </p>
//       </div>
//     </div>
//   )
// }





'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import SignupForm from '../components/SignupForm'
import LoginForm from '../components/LoginForm'
import { useAuth } from '@/lib/hooks/useAuth'

export default function AuthPages() {
  const [isLogin, setIsLogin] = useState(true)  
  const router = useRouter()
  const { user } = useAuth()

  // Check if user is already logged in (using Redux state)
  useEffect(() => {
    if (user) {
      router.push('/home')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <span className="text-white text-xl font-bold">W</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">WorkGrid</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your work efficiently</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          
          {/* Toggle Tabs */}
          <div className="flex gap-2 mb-8 p-1 bg-gray-100 rounded-xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                !isLogin 
                  ? 'bg-white text-gray-900 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          {isLogin ? (
            <LoginForm />
          ) : (
            <SignupForm />
          )}

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-indigo-600 hover:text-indigo-800 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
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