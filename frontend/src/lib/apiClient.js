'use client'

/**
 * Thin wrapper around fetch that injects the auth token (if present) and
 * standardizes error handling. This keeps page components free of repetitive
 * boilerplate.
 */
export async function apiFetch(path, { method = 'GET', body, token, headers = {}, ...rest } = {}) {
  const mergedHeaders = {
    Accept: 'application/json',
    ...headers,
  }

  if (body && !mergedHeaders['Content-Type']) {
    mergedHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    mergedHeaders.Authorization = `Bearer ${token}`
  }

  const response = await fetch(path, {
    method,
    credentials: 'include',
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  })

  let data
  try {
    data = await response.json()
  } catch {
    data = null
  }

  if (!response.ok) {
    const message = data?.message || 'Request failed'
    const code = data?.code || 'REQUEST_FAILED'
    const error = new Error(message)
    error.status = response.status
    error.code = code
    throw error
  }

  return data
}

