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

// Async Thunks for Comments
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async ({ taskId, limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}/comments?limit=${limit}&offset=${offset}`,
        { token }
      )

      // console.log("comeents data:", data)
      
      return {
        taskId,
        comments: data.data?.comments || []
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const postComment = createAsyncThunk(
  'comments/postComment',
  async ({ taskId, body }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}/comments`,
        {
          method: 'POST',
          token,
          body: { body },
        }
      )
      
      return {
        taskId,
        comment: data.data?.comment || data.comment
      }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial State
const initialState = {
  commentsByTaskId: {}, // { taskId: [comments] }
  loading: false,
  error: null,
  posting: false,
}

// Slice
const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearCommentsError: (state) => {
      state.error = null
    },
    addCommentLocal: (state, action) => {
      const { taskId, comment } = action.payload
      if (!state.commentsByTaskId[taskId]) {
        state.commentsByTaskId[taskId] = []
      }
      // Check if comment already exists
      if (!state.commentsByTaskId[taskId].some(c => c.id === comment.id)) {
        state.commentsByTaskId[taskId].push(comment)
      }
    },
    removeCommentLocal: (state, action) => {
      const { taskId, commentId } = action.payload
      if (state.commentsByTaskId[taskId]) {
        state.commentsByTaskId[taskId] = state.commentsByTaskId[taskId].filter(c => c.id !== commentId)
      }
    },
    clearTaskComments: (state, action) => {
      const taskId = action.payload
      delete state.commentsByTaskId[taskId]
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Comments
      .addCase(fetchComments.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false
        const { taskId, comments } = action.payload
        state.commentsByTaskId[taskId] = comments
        state.error = null
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Post Comment
      .addCase(postComment.pending, (state) => {
        state.posting = true
        state.error = null
      })
      .addCase(postComment.fulfilled, (state, action) => {
        state.posting = false
        const { taskId, comment } = action.payload
        if (!state.commentsByTaskId[taskId]) {
          state.commentsByTaskId[taskId] = []
        }
        // Add comment if not already present (from real-time update)
        if (!state.commentsByTaskId[taskId].some(c => c.id === comment.id)) {
          state.commentsByTaskId[taskId].push(comment)
        }
        state.error = null
      })
      .addCase(postComment.rejected, (state, action) => {
        state.posting = false
        state.error = action.payload
      })
  },
})

export const {
  clearCommentsError,
  addCommentLocal,
  removeCommentLocal,
  clearTaskComments,
} = commentsSlice.actions

export default commentsSlice.reducer