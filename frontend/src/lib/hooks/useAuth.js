'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  refreshSession, 
  login as loginAction, 
  signupAdmin as signupAdminAction,
  signupViaInvite as signupViaInviteAction, 
  verifyEmail as verifyEmailAction,
  sendInvite as sendInviteAction,
  logout as logoutAction, 
  clearError,
  setLoading 
} from '../features/auth/authSlice'

/**
 * useAuth Hook
 * - Provides authentication state and actions
 * - Auto-refreshes session on mount (only once)
 * - Handles redirects for unauthenticated users
 */
export function useAuth() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  // Select auth state from Redux store
  const { user, modules, loading, error } = useAppSelector((state) => state.auth)
  
  // Use ref to track if auth has been initialized
  const initializedRef = useRef(false)
  
  // Auto-refresh session on component mount (only once)
  useEffect(() => {
    // Prevent multiple calls
    if (initializedRef.current) return
    initializedRef.current = true
    
    const initAuth = async () => {
      // Check if we already have user in Redux state
      if (user) return
      
      const token = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user')
      
      if (!token) {
        // No token found, check if we have stored user
        if (storedUser) {
          // User exists in localStorage but no token
          // This might happen on page refresh when token is expired
          // We'll just use the stored user and mark as loaded
          dispatch(setLoading(false))
        } else {
          // No user data at all
          dispatch(setLoading(false))
        }
        return
      }
      
      // We have a token, refresh the session
      try {
        await dispatch(refreshSession())
      } catch (error) {
        console.error('Session refresh failed:', error)
        // Even if refresh fails, mark as loaded
        dispatch(setLoading(false))
      }
    }
    
    initAuth()
  }, [dispatch, user]) // Add user as dependency to prevent calls when user exists
  
  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearError())
      }
    }
  }, [error, dispatch])
  
  /**
   * Login function
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<Object>} - Success/failure result
   */
  const login = async (email, password) => {
    dispatch(clearError())
    const result = await dispatch(loginAction({ email, password }))
    
    if (loginAction.fulfilled.match(result)) {
      return { success: true }
    } else {
      return {
        success: false,
        error: result.payload?.message || 'Login failed'
      }
    }
  }
  
  /**
   * Signup function
   * @param {string} name - User name
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} role - User role
   * @returns {Promise<Object>} - Success/failure result
   */
 const signupAdmin = async (data) => {
  const res = await dispatch(signupAdminAction(data))
  return signupAdminAction.fulfilled.match(res)    // dispatch(signupAdminAction(data) - return an action object , like {type: 'auth/signupAdmin/fulfilled', payload: ...}, so redux toolkit provide .match() to match the result is fulfilled or rejected, 
    ? { success: true }      // this success true or false is used to make it simple for compnents to know that the api call is successful or not and hide the complexity of redux.
    : { success: false, error: res.payload }
}

const signupViaInvite = async (data) => {
  const res = await dispatch(signupViaInviteAction(data))
  return signupViaInviteAction.fulfilled.match(res)
    ? { success: true }
    : { success: false, error: res.payload }
}



const verifyEmail = async (token) => {
  dispatch(clearError())
  const result = await dispatch(verifyEmailAction(token))

  if (verifyEmailAction.fulfilled.match(result)) {
    return { success: true, message: result.payload?.message }
  }

  return {
    success: false,
    error: result.payload || 'Verification failed',
  }
}



const sendInvite = async (email, role) => {
  dispatch(clearError())
  const res = await dispatch(sendInviteAction({ email, role }))

  return sendInviteAction.fulfilled.match(res)
    ? { success: true }
    : { success: false, error: res.payload }
}


  
  /**
   * Logout function
   * - Clears Redux state and localStorage
   * - Redirects to auth page
   */
  const logout = async () => {
    await dispatch(logoutAction())
    router.push('/auth')
  }
  
  /**
   * Refresh session manually
   */
  const refresh = async () => {
    await dispatch(refreshSession())
  }
  
  // Return auth state and actions
  return {
    user,
    modules,
    loading,
    error,
    login,
    signupAdmin,
    signupViaInvite,
    sendInvite,
    verifyEmail,
    logout,
    refresh,
    clearError: () => dispatch(clearError())
  }
}