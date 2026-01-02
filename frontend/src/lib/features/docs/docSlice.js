
// 'use client'

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// const API_BASE = 'http://localhost:4000/api'

// /* -----------------------------------
//    Helper: API fetch (same as filesSlice)
// ----------------------------------- */
// const apiFetch = async (url, options = {}) => {
//   const { method = 'GET', body, token, headers = {}, ...rest } = options

//   const mergedHeaders = {
//     Accept: 'application/json',
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
//     throw new Error(data?.message || 'Request failed')
//   }

//   return data
// }

// /* -----------------------------------
//    DOC THUNKS
// ----------------------------------- */

// /** List all docs of a project */
// export const fetchDocs = createAsyncThunk(
//   'docs/list',
//   async ({ projectId }, { rejectWithValue }) => {
//     console.log("Fetching docs for projectId:", projectId);
//     try {
//       const token = localStorage.getItem('auth_token')
//       console.log("API::", `${API_BASE}/docs/${projectId}/docs`)
//       if(!projectId) throw new Error("No projectId provided");
//       const data = await apiFetch(
//         `${API_BASE}/docs/${projectId}/docs`,
//         { token }
//       )
//       console.log("Fetched docs data:", data.data.docs);
//       return data.data.docs
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )

// /** Fetch single doc */
// export const fetchDoc = createAsyncThunk(
//   'docs/get',
//   async ({ docId }, { rejectWithValue }) => {
//     try {
//         console.log("Fetching doc for docId:", docId);
//       const token = localStorage.getItem('auth_token')
//       const data = await apiFetch(
//         `${API_BASE}/docs/docs/${docId}`,
//         { token }
//       )
//       return data.data.doc
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )

// /** Create doc */
// export const createDoc = createAsyncThunk(
//   'docs/create',
//   async ({ projectId, title, content }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       const data = await apiFetch(
//         `${API_BASE}/docs/${projectId}/docs`,
//         {
//           method: 'POST',
//           token,
//           body: { title, content },
//         }
//       )
//       return data.data.doc
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )

// /** Delete doc */
// export const deleteDoc = createAsyncThunk(
//   'docs/delete',
//   async ({ docId }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       await apiFetch(
//         `${API_BASE}/docs/docs/${docId}`,
//         { method: 'DELETE', token }
//       )
//       return docId
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )


// /* -----------------------------------
//    DOC FILE THUNKS (same pattern as filesSlice)
// ----------------------------------- */

// /** List doc files */
// // export const listDocFiles = createAsyncThunk(
// //   'docs/listFiles',
// //   async ({ docId }, { rejectWithValue }) => {
// //     try {
// //       const token = localStorage.getItem('auth_token')
// //       const data = await apiFetch(
// //         `${API_BASE}/projects/docs/${docId}/files`,
// //         { token }
// //       )
// //       return { docId, files: data.data.files }
// //     } catch (err) {
// //       return rejectWithValue(err.message)
// //     }
// //   }
// // )

// /** Upload doc file */
// // export const uploadDocFile = createAsyncThunk(
// //   'docs/uploadFile',
// //   async ({ projectId, docId, file }, { rejectWithValue }) => {
// //     try {
// //       const token = localStorage.getItem('auth_token')

// //       // 1️⃣ handshake
// //       const handshake = await apiFetch(
// //         `${API_BASE}/projects/${projectId}/docs/${docId}/files/handshake`,
// //         {
// //           method: 'POST',
// //           token,
// //           body: { fileName: file.name, fileType: file.type },
// //         }
// //       )

// //       // 2️⃣ upload
// //       const uploadRes = await fetch(handshake.data.url, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': file.type },
// //         body: file,
// //       })

// //       if (!uploadRes.ok) throw new Error('Upload failed')

// //       // 3️⃣ confirm
// //       const confirm = await apiFetch(
// //         `${API_BASE}/projects/${projectId}/docs/${docId}/files/confirm`,
// //         {
// //           method: 'POST',
// //           token,
// //           body: {
// //             path: handshake.data.path,
// //             fileName: file.name,
// //             mimeType: file.type,
// //             size: file.size,
// //           },
// //         }
// //       )

// //       return { docId, file: confirm.data.file }
// //     } catch (err) {
// //       return rejectWithValue(err.message)
// //     }
// //   }
// // )

// /** Delete doc file */
// export const deleteDocFile = createAsyncThunk(
//   'docs/deleteFile',
//   async ({ docId, fileId }, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       await apiFetch(
//         `${API_BASE}/projects/docs/files/${fileId}`,
//         { method: 'DELETE', token }
//       )
//       return { docId, fileId }
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )

// /* -----------------------------------
//    SLICE
// ----------------------------------- */

// const initialState = {
//   list: [],
//   current: null,
//   filesByDoc: {},
//   loading: false,
//   uploading: false,
//   error: null,
// }

// const docsSlice = createSlice({
//   name: 'docs',
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder

//       /* DOC LIST */
//       .addCase(fetchDocs.pending, (s) => {
//         s.loading = true
//       })
//       .addCase(fetchDocs.fulfilled, (s, a) => {
//         s.loading = false
//         s.list = a.payload
//       })

//       /* DOC GET */
//       .addCase(fetchDoc.fulfilled, (s, a) => {
//         s.current = a.payload
//       })

//       /* DOC CREATE */
//       .addCase(createDoc.fulfilled, (s, a) => {
//         s.list.unshift(a.payload)
//       })

//       /* DOC DELETE */
//       .addCase(deleteDoc.fulfilled, (s, a) => {
//         s.list = s.list.filter((d) => d.id !== a.payload)
//       })

//       /* DOC FILES */
//     //   .addCase(listDocFiles.fulfilled, (s, a) => {
//     //     s.filesByDoc[a.payload.docId] = a.payload.files
//     //   })

//     //   .addCase(uploadDocFile.pending, (s) => {
//     //     s.uploading = true
//     //   })
//     //   .addCase(uploadDocFile.fulfilled, (s, a) => {
//     //     s.uploading = false
//     //     s.filesByDoc[a.payload.docId]?.unshift(a.payload.file)
//     //   })

//       .addCase(deleteDocFile.fulfilled, (s, a) => {
//         s.filesByDoc[a.payload.docId] =
//           s.filesByDoc[a.payload.docId]?.filter(
//             (f) => f.id !== a.payload.fileId
//           )
//       })
//   },
// })

// export default docsSlice.reducer





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
   DOC THUNKS
----------------------------------- */

/** List all docs of a project */
export const fetchDocs = createAsyncThunk(
  'docs/list',
  async ({ projectId }, { rejectWithValue }) => {
    console.log("Fetching docs for projectId:", projectId);
    try {
      const token = localStorage.getItem('auth_token')
      console.log("API::", `${API_BASE}/docs/${projectId}/docs`)
      if(!projectId) throw new Error("No projectId provided");
      const data = await apiFetch(
        `${API_BASE}/docs/${projectId}/docs`,
        { token }
      )
      console.log("Fetched docs data:", data.data.docs);
      return data.data.docs
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Fetch single doc */
export const fetchDoc = createAsyncThunk(
  'docs/get',
  async ({ docId }, { rejectWithValue }) => {
    try {
      console.log("Fetching doc for docId:", docId);
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/docs/docs/${docId}`,
        { token }
      )
      return data.data.doc
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Create doc */
export const createDoc = createAsyncThunk(
  'docs/create',
  async ({ projectId, title, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/docs/${projectId}/docs`,
        {
          method: 'POST',
          token,
          body: { title, content },
        }
      )
      return data.data.doc
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Update doc */
export const updateDoc = createAsyncThunk(
  'docs/update',
  async ({ docId, title, content }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/docs/docs/${docId}`,
        {
          method: 'PUT',
          token,
          body: { title, content },
        }
      )
      return data.data.doc
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Delete doc */
export const deleteDoc = createAsyncThunk(
  'docs/delete',
  async ({ docId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      await apiFetch(
        `${API_BASE}/docs/docs/${docId}`,
        { method: 'DELETE', token }
      )
      return docId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/** Delete doc file */
export const deleteDocFile = createAsyncThunk(
  'docs/deleteFile',
  async ({ docId, fileId }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      await apiFetch(
        `${API_BASE}/projects/docs/files/${fileId}`,
        { method: 'DELETE', token }
      )
      return { docId, fileId }
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/* -----------------------------------
   SLICE
----------------------------------- */

const initialState = {
  list: [],
  current: null,
  filesByDoc: {},
  loading: false,
  uploading: false,
  updating: false,
  error: null,
}

const docsSlice = createSlice({
  name: 'docs',
  initialState,
  reducers: {
    clearCurrentDoc: (state) => {
      state.current = null
    },
  },
  extraReducers: (builder) => {
    builder

      /* DOC LIST */
      .addCase(fetchDocs.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchDocs.fulfilled, (s, a) => {
        s.loading = false
        s.list = a.payload
      })
      .addCase(fetchDocs.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      /* DOC GET */
      .addCase(fetchDoc.pending, (s) => {
        s.loading = true
      })
      .addCase(fetchDoc.fulfilled, (s, a) => {
        s.loading = false
        s.current = a.payload
      })
      .addCase(fetchDoc.rejected, (s, a) => {
        s.loading = false
        s.error = a.payload
      })

      /* DOC CREATE */
      .addCase(createDoc.fulfilled, (s, a) => {
        s.list.unshift(a.payload)
      })

      /* DOC UPDATE */
      .addCase(updateDoc.pending, (s) => {
        s.updating = true
      })
      .addCase(updateDoc.fulfilled, (s, a) => {
        s.updating = false
        s.current = a.payload
        // Update in list as well
        const index = s.list.findIndex((d) => d.id === a.payload.id)
        if (index !== -1) {
          s.list[index] = a.payload
        }
      })
      .addCase(updateDoc.rejected, (s, a) => {
        s.updating = false
        s.error = a.payload
      })

      /* DOC DELETE */
      .addCase(deleteDoc.fulfilled, (s, a) => {
        s.list = s.list.filter((d) => d.id !== a.payload)
        if (s.current?.id === a.payload) {
          s.current = null
        }
      })

      /* DOC FILE DELETE */
      .addCase(deleteDocFile.fulfilled, (s, a) => {
        s.filesByDoc[a.payload.docId] =
          s.filesByDoc[a.payload.docId]?.filter(
            (f) => f.id !== a.payload.fileId
          )
      })
  },
})

export const { clearCurrentDoc } = docsSlice.actions
export default docsSlice.reducer