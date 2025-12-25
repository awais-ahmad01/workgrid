'use client'

import { apiFetch } from './apiClient'
const API_BASE = 'http://localhost:4000'

export async function fetchComments({ token, taskId, limit = 20, offset = 0 }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}/comments?limit=${limit}&offset=${offset}`, { token })
}

export async function postComment({ token, taskId, body }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}/comments`, {
    method: 'POST',
    token,
    body: { body },
  })
}

