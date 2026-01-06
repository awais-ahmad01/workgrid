// 'use client'

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// const API_BASE = 'http://localhost:4000'

// // Helper function (same as in tasksSlice)
// const apiFetch = async (url, options = {}) => {
//   const { method = 'GET', body, token, headers = {}, ...rest } = options
  
//   const mergedHeaders = {
//     'Accept': 'application/json',
//     ...headers,
//   }
  
//   if (body && !mergedHeaders['Content-Type']) {
//     mergedHeaders['Content-Type'] = 'application/json'
//   }
  
//   if (token) {
//     mergedHeaders['Authorization'] = `Bearer ${token}`
//   }
  
//   const response = await fetch(url, {
//     method,
//     credentials: 'include',
//     headers: mergedHeaders,
//     body: body ? JSON.stringify(body) : undefined,
//     ...rest,
//   })
  
//   let data
//   try {
//     data = await response.json()
//   } catch {
//     data = null
//   }
  
//   if (!response.ok) {
//     const message = data?.message || 'Request failed'
//     throw new Error(message)
//   }
  
//   return data
// }

// // Async Thunks for Files
// export const listFiles = createAsyncThunk(
//   'files/listFiles',
//   async ({ taskId }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       if (!token) throw new Error('No authentication token found')
      
//       const data = await apiFetch(
//         `${API_BASE}/tasks/${taskId}/files`,
//         { token }
//       )

//       console.log("List files response:", data)
      
//       return {
//         taskId,
//         files: data.data?.files || []
//       }
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )

// export const requestUpload = createAsyncThunk(
//   'files/requestUpload',
//   async ({ taskId, file }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       if (!token) throw new Error('No authentication token found')
      
//       // Step 1: Get signed URL
//       const handshake = await apiFetch(
//         `${API_BASE}/tasks/${taskId}/files/handshake`,
//         {
//           method: 'POST',
//           token,
//           body: { 
//             fileName: file.name, 
//             fileType: file.type, 
//             fileSize: file.size 
//           },
//         }
//       )

//       console.log("Handshake response:", handshake)
      
//       // Step 2: Upload to signed URL
//       const uploadResponse = await fetch(handshake.data.url, {
//         method: 'PUT',
//         headers: { 'Content-Type': file.type },
//         body: file,
//       })
//       console.log("Upload response:", uploadResponse)
//       if (!uploadResponse.ok) {
//         throw new Error('Upload failed')
//       }
      
//       // Step 3: Confirm upload
//       const confirmData = await apiFetch(
//         `${API_BASE}/tasks/${taskId}/files/confirm`,
//         {
//           method: 'POST',
//           token,
//           body: {
//             path: handshake.data.path,
//             fileName: file.name,
//             mimeType: file.type,
//             size: file.size,
//           },
//         }
//       )
      
//       return {
//         taskId,
//         file: confirmData.data?.file || confirmData.file
//       }
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )

// export const deleteFile = createAsyncThunk(
//   'files/deleteFile',
//   async ({ taskId, fileId }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       if (!token) throw new Error('No authentication token found')
      
//       await apiFetch(
//         `${API_BASE}/tasks/${taskId}/files/${fileId}`,
//         {
//           method: 'DELETE',
//           token,
//         }
//       )
      
//       return { taskId, fileId }
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )

// // Initial State
// const initialState = {
//   filesByTaskId: {}, // { taskId: [files] }
//   loading: false,
//   error: null,
//   uploading: false,
// }

// // Slice
// const filesSlice = createSlice({
//   name: 'files',
//   initialState,
//   reducers: {
//     clearFilesError: (state) => {
//       state.error = null
//     },
//     addFileLocal: (state, action) => {
//       const { taskId, file } = action.payload
//       if (!state.filesByTaskId[taskId]) {
//         state.filesByTaskId[taskId] = []
//       }
//       // Check if file already exists
//       if (!state.filesByTaskId[taskId].some(f => f.id === file.id)) {
//         state.filesByTaskId[taskId].unshift(file)
//       }
//     },
//     removeFileLocal: (state, action) => {
//       const { taskId, fileId } = action.payload
//       if (state.filesByTaskId[taskId]) {
//         state.filesByTaskId[taskId] = state.filesByTaskId[taskId].filter(f => f.id !== fileId)
//       }
//     },
//     clearTaskFiles: (state, action) => {
//       const taskId = action.payload
//       delete state.filesByTaskId[taskId]
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // List Files
//       .addCase(listFiles.pending, (state) => {
//         state.loading = true
//         state.error = null
//       })
//       .addCase(listFiles.fulfilled, (state, action) => {
//         state.loading = false
//         const { taskId, files } = action.payload
//         state.filesByTaskId[taskId] = files
//         state.error = null
//       })
//       .addCase(listFiles.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
      
//       // Request Upload
//       .addCase(requestUpload.pending, (state) => {
//         state.uploading = true
//         state.error = null
//       })
//       .addCase(requestUpload.fulfilled, (state, action) => {
//         state.uploading = false
//         const { taskId, file } = action.payload
//         if (!state.filesByTaskId[taskId]) {
//           state.filesByTaskId[taskId] = []
//         }
//         // Add file if not already present
//         if (!state.filesByTaskId[taskId].some(f => f.id === file.id)) {
//           state.filesByTaskId[taskId].unshift(file)
//         }
//         state.error = null
//       })
//       .addCase(requestUpload.rejected, (state, action) => {
//         state.uploading = false
//         state.error = action.payload
//       })
      
//       // Delete File
//       .addCase(deleteFile.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(deleteFile.fulfilled, (state, action) => {
//         state.loading = false
//         const { taskId, fileId } = action.payload
//         if (state.filesByTaskId[taskId]) {
//           state.filesByTaskId[taskId] = state.filesByTaskId[taskId].filter(f => f.id !== fileId)
//         }
//         state.error = null
//       })
//       .addCase(deleteFile.rejected, (state, action) => {
//         state.loading = false
//         state.error = action.payload
//       })
//   },
// })

// export const {
//   clearFilesError,
//   addFileLocal,
//   removeFileLocal,
//   clearTaskFiles,
// } = filesSlice.actions

// export default filesSlice.reducer





'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:4000/api'

/* -----------------------------------
   Helper: API fetch
----------------------------------- */
const apiFetch = async (url, options = {}) => {
  const { method = 'GET', body, token, headers = {}, ...rest } = options

  const mergedHeaders = {
    Accept: 'application/json',
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
    throw new Error(data?.message || 'Request failed')
  }

  return data
}

/* -----------------------------------
   THUNKS
----------------------------------- */

/**
 * List all files of a PROJECT
 */
export const listProjectFiles = createAsyncThunk(
  'files/listProjectFiles',
  async ({ projectId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/projects/${projectId}/files`,
        { token }
      )

      return { projectId, files: data.data.files }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/**
 * List all files of a TASK
 */
export const listTaskFiles = createAsyncThunk(
  'files/listTaskFiles',
  async ({ taskId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}/files`,
        { token }
      )

      return { taskId, files: data.data.files }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/**
 * Upload PROJECT-LEVEL file
 */
export const uploadProjectFile = createAsyncThunk(
  'files/uploadProjectFile',
  async (
    { projectId, file },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('auth_token')

      // 1️⃣ handshake
      const handshake = await apiFetch(
        `${API_BASE}/projects/${projectId}/files/handshake`,
        {
          method: 'POST',
          token,
          body: { fileName: file.name, fileType: file.type },
        }
      )

      // 2️⃣ upload to signed URL
      const uploadRes = await fetch(handshake.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      // 3️⃣ confirm
      const confirm = await apiFetch(
        `${API_BASE}/projects/${projectId}/files/confirm`,
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

      return { projectId, file: confirm.data.file }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/**
 * Upload TASK-LEVEL file
 */
export const uploadTaskFile = createAsyncThunk(
  'files/uploadTaskFile',
  async (
    { taskId, file },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('auth_token')

      const handshake = await apiFetch(
        `${API_BASE}/tasks/${taskId}/files/handshake`,
        {
          method: 'POST',
          token,
          body: { fileName: file.name, fileType: file.type },
        }
      )

      const uploadRes = await fetch(handshake.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      const confirm = await apiFetch(
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
        projectId: confirm.data.file.project_id,
        file: confirm.data.file,
      }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)



/**
 * List all files of a DOC
 */
export const listDocFiles = createAsyncThunk(
  'files/listDocFiles',
  async ({ docId, projectId }, { rejectWithValue }) => {
    console.log("listDocFiles called with:", { docId, projectId });
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/docs/${projectId}/docs/${docId}/files`,
        { token }
      )

      return { docId, files: data.data.files }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/**
 * Upload DOC-LEVEL file
 */
export const uploadDocFile = createAsyncThunk(
  'files/uploadDocFile',
  async ({ projectId, docId, file }, { rejectWithValue }) => {
    console.log("uploadDocFile called with:", { projectId, docId, file });
    try {
      const token = localStorage.getItem('auth_token')

      // 1️⃣ handshake
      const handshake = await apiFetch(
        `${API_BASE}/docs/${projectId}/docs/${docId}/files/handshake`,
        {
          method: 'POST',
          token,
          body: { fileName: file.name, fileType: file.type },
        }
      )

      // 2️⃣ upload to signed URL
      const uploadRes = await fetch(handshake.data.url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Upload failed')

      // 3️⃣ confirm
      const confirm = await apiFetch(
        `${API_BASE}/docs/${projectId}/docs/${docId}/files/confirm`,
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

      return { docId, file: confirm.data.file }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/**
 * Delete DOC-LEVEL file
 */
export const deleteDocFile = createAsyncThunk(
  'files/deleteDocFile',
  async ({ projectId, docId, fileId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')

      const url = `${API_BASE}/docs/docs/files/${fileId}`

      await apiFetch(url, { method: 'DELETE', token })

      return { docId, fileId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)


/**
 * Delete file (project or task)
 */
export const deleteFile = createAsyncThunk(
  'files/deleteFile',
  async (
    { projectId, taskId, fileId },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('auth_token')

      const url = taskId
        ? `${API_BASE}/tasks/${taskId}/files/${fileId}`
        : `${API_BASE}/projects/${projectId}/files/${fileId}`

      await apiFetch(url, { method: 'DELETE', token })

      return { projectId, taskId, fileId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)






/* -----------------------------------
   SLICE
----------------------------------- */

const initialState = {
  projectFiles: {},
  taskFiles: {} ,
  docFiles: {},
  loading: false,
  uploading: false,
  error: null,
}

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* LIST PROJECT */
      .addCase(listProjectFiles.pending, (state) => {
        state.loading = true
      })
      .addCase(listProjectFiles.fulfilled, (state, action) => {
        state.loading = false
        state.projectFiles[action.payload.projectId] = action.payload.files
      })
      .addCase(listProjectFiles.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      /* LIST TASK */
      .addCase(listTaskFiles.fulfilled, (state, action) => {
        state.taskFiles[action.payload.taskId] = action.payload.files
      })

      /* UPLOAD PROJECT */
      .addCase(uploadProjectFile.pending, (state) => {
        state.uploading = true
      })
      .addCase(uploadProjectFile.fulfilled, (state, action) => {
        state.uploading = false
        state.projectFiles[action.payload.projectId]?.unshift(action.payload.file)
      })

      /* UPLOAD TASK */
      .addCase(uploadTaskFile.fulfilled, (state, action) => {
        state.taskFiles[action.payload.taskId]?.unshift(action.payload.file)
        state.projectFiles[action.payload.projectId]?.unshift(action.payload.file)
      })

      /* LIST DOC */
      .addCase(listDocFiles.fulfilled, (state, action) => {
        state.docFiles[action.payload.docId] = action.payload.files
      })

      /* UPLOAD DOC */
      .addCase(uploadDocFile.fulfilled, (state, action) => {
        if (!state.docFiles[action.payload.docId]) {
          state.docFiles[action.payload.docId] = []
        }
        state.docFiles[action.payload.docId].unshift(action.payload.file)
      })

      /* DELETE (project/task) */
      .addCase(deleteFile.fulfilled, (state, action) => {
        const { projectId, taskId, fileId } = action.payload

        if (projectId) {
          state.projectFiles[projectId] =
            state.projectFiles[projectId]?.filter(f => f.id !== fileId)
        }

        if (taskId) {
          state.taskFiles[taskId] =
            state.taskFiles[taskId]?.filter(f => f.id !== fileId)
        }
      })

      /* DELETE DOC FILE */
      .addCase(deleteDocFile.fulfilled, (state, action) => {
        const { docId, fileId } = action.payload
        if (state.docFiles[docId]) {
          state.docFiles[docId] =
            state.docFiles[docId].filter(f => f.id !== fileId)
        }
      })
  },
})

export default filesSlice.reducer
