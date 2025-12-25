'use client'

import { apiFetch } from './apiClient'

const API_BASE = 'http://localhost:4000'

export async function fetchTasks({ token, filters = {} }) {
  const queryParams = new URLSearchParams()
  if (filters.status) queryParams.append('status', filters.status)
  if (filters.assigneeId) queryParams.append('assigneeId', filters.assigneeId)
  if (filters.search) queryParams.append('search', filters.search)
  if (filters.projectId) queryParams.append('projectId', filters.projectId)

  return apiFetch(`${API_BASE}/tasks?${queryParams.toString()}`, { token })
}

export async function createTask({ token, data }) {
  return apiFetch(`${API_BASE}/tasks`, {
    method: 'POST',
    token,
    body: data,
  })
}

export async function updateTask({ token, taskId, data }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'PATCH',
    token,
    body: data,
  })
}

export async function deleteTask({ token, taskId }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}`, {
    method: 'DELETE',
    token,
  })
}

