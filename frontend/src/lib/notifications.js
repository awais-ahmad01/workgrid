'use client'

import { apiFetch } from './apiClient'
const API_BASE = 'http://localhost:4000'

export async function fetchNotifications({ token, limit = 20, offset = 0 }) {
  return apiFetch(`${API_BASE}/notifications?limit=${limit}&offset=${offset}`, { token })
}

export async function markNotificationRead({ token, id }) {
  return apiFetch(`${API_BASE}/notifications/${id}/read`, { method: 'POST', token })
}

export async function markAllNotificationsRead({ token }) {
  return apiFetch(`${API_BASE}/notifications/read-all`, { method: 'POST', token })
}

