'use client'

import { apiFetch } from './apiClient'

const API_BASE = 'http://localhost:4000'

export async function login({ email, password }) {
  console.log("email:",email)
  console.log("password:",password)
  return apiFetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    body: { email, password },
  })
}

export async function signup({ name, email, password, role }) {
  return apiFetch(`${API_BASE}/auth/signup`, {
    method: 'POST',
    body: { name, email, password, role },
  })
}

export async function logout(token) {
  return apiFetch(`${API_BASE}/auth/logout`, {
    method: 'POST',
    token,
  })
}

export async function refreshSession(token) {
  // Use session endpoints as a lightweight "refresh" to validate token and fetch latest user/modules
  const [user, modules] = await Promise.all([
    apiFetch(`${API_BASE}/session/user`, { token }),
    apiFetch(`${API_BASE}/session/modules`, { token }),
  ])

  return { user, modules: modules.allowedModules || [] }
}

