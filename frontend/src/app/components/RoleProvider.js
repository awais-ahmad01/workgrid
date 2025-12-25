'use client'


import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { refreshSession, logout as apiLogout } from '@/lib/auth'

const RoleContext = createContext()

export function RoleProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modules, setModules] = useState([])

  const bootstrapSession = useCallback(async () => {
    const token = localStorage.getItem('auth_token')

    if (!token) {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setLoading(false)
      return
    }

    try {
      const { user: freshUser, modules: allowedModules } = await refreshSession(token)
      setUser(freshUser)
      setModules(allowedModules)
      localStorage.setItem('user', JSON.stringify(freshUser))
    } catch (err) {
      console.error('Session refresh failed:', err)
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      setUser(null)
      setModules([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    bootstrapSession()
  }, [bootstrapSession])

  const logout = useCallback(async () => {
    const token = localStorage.getItem('auth_token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user')

    try {
      if (token) {
        await apiLogout(token)
      }
    } catch (err) {
      console.error('Logout error:', err)
    }

    setUser(null)
    setModules([])
    if (typeof window !== 'undefined') {
      window.location.href = '/auth'
    }
  }, [])

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading dataaaa...</div>
      </div>
    )
  }

  return (
    <RoleContext.Provider value={{ user, modules, loading, logout, refresh: bootstrapSession }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRole() {
  const context = useContext(RoleContext)
  // if (!context) {
  //   throw new Error('useRole must be used within a RoleProvider')
  // }
  return context
}