'use client'

import { useState, useCallback } from 'react'
import { apiFetch } from '../apiClient'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

/**
 * useProgress Hook
 * Provides functions to fetch progress and workload data based on user role
 */
export function useProgress() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Fetch progress dashboard data
   * Role-based: Returns different data based on user role
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Dashboard data
   */
  const fetchProgressDashboard = useCallback(async (projectId) => {
    if (!projectId) {
      setError('Project ID is required')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const data = await apiFetch(
        `${API_BASE}/api/progress/dashboard?projectId=${projectId}`,
        { token }
      )

      return data?.data || data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch progress dashboard'
      setError(errorMessage)
      console.error('fetchProgressDashboard error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Fetch workload breakdown (Team Lead only)
   * @param {string} projectId - Project ID
   * @returns {Promise<Object>} Workload data
   */
  const fetchWorkloadBreakdown = useCallback(async (projectId) => {
    if (!projectId) {
      setError('Project ID is required')
      return null
    }

    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }

      const data = await apiFetch(
        `${API_BASE}/api/progress/workload?projectId=${projectId}`,
        { token }
      )

      return data?.data || data
    } catch (err) {
      const errorMessage = err.message || 'Failed to fetch workload breakdown'
      setError(errorMessage)
      console.error('fetchWorkloadBreakdown error:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchProgressDashboard,
    fetchWorkloadBreakdown,
    clearError: () => setError(null),
  }
}

