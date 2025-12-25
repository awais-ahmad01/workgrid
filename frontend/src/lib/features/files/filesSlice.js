'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:4000'

// Helper function (same as in tasksSlice)
const apiFetch = async (url, options = {}) => {
  const { method = 'GET', body, token, headers = {}, ...rest } = options
  
  const mergedHeaders = {
    'Accept': 'application/json',
    ...headers,
  }
  
  if (body && !mergedHeaders['Content-Type']) {
    mergedHeaders['Content-Type'] = 'application/json'
  }
  
  if (token) {
    mergedHeaders['Authorization'] = `Bearer ${token}`
  }
  
  const response = await fetch(url, {
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
    throw new Error(message)
  }
  
  return data
}

// Async Thunks for Files
export const listFiles = createAsyncThunk(
  'files/listFiles',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}/files`,
        { token }
      )
      
      return {
        taskId,
        files: data.data?.files || []
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const requestUpload = createAsyncThunk(
  'files/requestUpload',
  async ({ taskId, file }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      // Step 1: Get signed URL
      const handshake = await apiFetch(
        `${API_BASE}/tasks/${taskId}/files/handshake`,
        {
          method: 'POST',
          token,
          body: { 
            fileName: file.name, 
            fileType: file.type, 
            fileSize: file.size 
          },
        }
      )
      
      // Step 2: Upload to signed URL
      const uploadResponse = await fetch(handshake.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      
      // Step 3: Confirm upload
      const confirmData = await apiFetch(
        `${API_BASE}/tasks/${taskId}/files/confirm`,
        {
          method: 'POST',
          token,
          body: {
            path: handshake.data.path,
            fileName: file.name,
            mimeType: file.type,
            size: file.size,
          },
        }
      )
      
      return {
        taskId,
        file: confirmData.data?.file || confirmData.file
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async ({ taskId, fileId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      await apiFetch(
        `${API_BASE}/tasks/${taskId}/files/${fileId}`,
        {
          method: 'DELETE',
          token,
        }
      )
      
      return { taskId, fileId }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial State
const initialState = {
  filesByTaskId: {}, // { taskId: [files] }
  loading: false,
  error: null,
  uploading: false,
}

// Slice
const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    clearFilesError: (state) => {
      state.error = null
    },
    addFileLocal: (state, action) => {
      const { taskId, file } = action.payload
      if (!state.filesByTaskId[taskId]) {
        state.filesByTaskId[taskId] = []
      }
      // Check if file already exists
      if (!state.filesByTaskId[taskId].some(f => f.id === file.id)) {
        state.filesByTaskId[taskId].unshift(file)
      }
    },
    removeFileLocal: (state, action) => {
      const { taskId, fileId } = action.payload
      if (state.filesByTaskId[taskId]) {
        state.filesByTaskId[taskId] = state.filesByTaskId[taskId].filter(f => f.id !== fileId)
      }
    },
    clearTaskFiles: (state, action) => {
      const taskId = action.payload
      delete state.filesByTaskId[taskId]
    },
  },
  extraReducers: (builder) => {
    builder
      // List Files
      .addCase(listFiles.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(listFiles.fulfilled, (state, action) => {
        state.loading = false
        const { taskId, files } = action.payload
        state.filesByTaskId[taskId] = files
        state.error = null
      })
      .addCase(listFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Request Upload
      .addCase(requestUpload.pending, (state) => {
        state.uploading = true
        state.error = null
      })
      .addCase(requestUpload.fulfilled, (state, action) => {
        state.uploading = false
        const { taskId, file } = action.payload
        if (!state.filesByTaskId[taskId]) {
          state.filesByTaskId[taskId] = []
        }
        // Add file if not already present
        if (!state.filesByTaskId[taskId].some(f => f.id === file.id)) {
          state.filesByTaskId[taskId].unshift(file)
        }
        state.error = null
      })
      .addCase(requestUpload.rejected, (state, action) => {
        state.uploading = false
        state.error = action.payload
      })
      
      // Delete File
      .addCase(deleteFile.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.loading = false
        const { taskId, fileId } = action.payload
        if (state.filesByTaskId[taskId]) {
          state.filesByTaskId[taskId] = state.filesByTaskId[taskId].filter(f => f.id !== fileId)
        }
        state.error = null
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearFilesError,
  addFileLocal,
  removeFileLocal,
  clearTaskFiles,
} = filesSlice.actions

export default filesSlice.reducer