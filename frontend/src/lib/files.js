'use client'

import { apiFetch } from './apiClient'
const API_BASE = 'http://localhost:4000'

export async function listFiles({ token, taskId }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}/files`, { token })
}

export async function requestUpload({ token, taskId, file }) {
  const handshake = await apiFetch(`${API_BASE}/tasks/${taskId}/files/handshake`, {
    method: 'POST',
    token,
    body: { fileName: file.name, fileType: file.type, fileSize: file.size },
  })

  // Upload to signed URL
  const res = await fetch(handshake.data.url, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  })
  if (!res.ok) {
    throw new Error('Upload failed')
  }

  // Confirm
  return apiFetch(`${API_BASE}/tasks/${taskId}/files/confirm`, {
    method: 'POST',
    token,
    body: {
      path: handshake.data.path,
      fileName: file.name,
      mimeType: file.type,
      size: file.size,
    },
  })
}

export async function deleteFileApi({ token, taskId, fileId }) {
  return apiFetch(`${API_BASE}/tasks/${taskId}/files/${fileId}`, {
    method: 'DELETE',
    token,
  })
}

