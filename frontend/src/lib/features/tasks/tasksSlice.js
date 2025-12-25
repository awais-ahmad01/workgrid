'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:4000'

// Helper function for API calls
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
    console.log("Res:", data);
  } catch {
    data = null
  }
  
  if (!response.ok) {
    const message = data?.message || 'Request failed'
    throw new Error(message)
  }
  
  return data
}

// Async Thunks for Tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const queryParams = new URLSearchParams()
      if (filters.status) queryParams.append('status', filters.status)
      if (filters.assigneeId) queryParams.append('assigneeId', filters.assigneeId)
      if (filters.search) queryParams.append('search', filters.search)
      if (filters.projectId) queryParams.append('projectId', filters.projectId)
      
      const data = await apiFetch(
        `${API_BASE}/tasks?${queryParams.toString()}`,
        { token }
      )

      console.log("Taks data:", data);
      
      return data?.tasks || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const fetchTaskById = createAsyncThunk(
  'tasks/fetchTaskById',
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}`,
        { token }
      )
      
      return data.task
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (taskData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks`,
        {
          method: 'POST',
          token,
          body: taskData,
        }
      )
      
      return data.data?.task || data.task
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ taskId, data: updateData }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/tasks/${taskId}`,
        {
          method: 'PATCH',
          token,
          body: updateData,
        }
      )
      
      return { taskId, updatedTask: data.data?.task || data.task }
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (taskId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      await apiFetch(
        `${API_BASE}/tasks/${taskId}`,
        {
          method: 'DELETE',
          token,
        }
      )
      
      return taskId
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial State
const initialState = {
  tasks: [],
  currentTask: null,
  loading: false,
  error: null,
}

// Slice
const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    clearTasksError: (state) => {
      state.error = null
    },
    setCurrentTask: (state, action) => {
      state.currentTask = action.payload
    },
    updateTaskLocal: (state, action) => {
      const { taskId, updates } = action.payload
      const index = state.tasks.findIndex(task => task.id === taskId)
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates }
      }
      if (state.currentTask?.id === taskId) {
        state.currentTask = { ...state.currentTask, ...updates }
      }
    },
    addTaskLocal: (state, action) => {
      state.tasks.unshift(action.payload)
    },
    removeTaskLocal: (state, action) => {
      const taskId = action.payload
      state.tasks = state.tasks.filter(task => task.id !== taskId)
      if (state.currentTask?.id === taskId) {
        state.currentTask = null
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Tasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false
        state.tasks = action.payload
        state.error = null
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Fetch Task by ID
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false
        state.currentTask = action.payload
        state.error = null
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false
        state.currentTask = null
        state.error = action.payload
      })
      
      // Create Task
      .addCase(createTask.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false
        state.tasks.unshift(action.payload)
        state.error = null
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Update Task
      .addCase(updateTask.pending, (state) => {
        state.loading = true
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false
        const { taskId, updatedTask } = action.payload
        
        // Update in tasks list
        const index = state.tasks.findIndex(task => task.id === taskId)
        if (index !== -1) {
          state.tasks[index] = updatedTask
        }
        
        // Update current task if it's the one being updated
        if (state.currentTask?.id === taskId) {
          state.currentTask = updatedTask
        }
        
        state.error = null
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Delete Task
      .addCase(deleteTask.pending, (state) => {
        state.loading = true
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false
        const taskId = action.payload
        state.tasks = state.tasks.filter(task => task.id !== taskId)
        if (state.currentTask?.id === taskId) {
          state.currentTask = null
        }
        state.error = null
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const {
  clearTasksError,
  setCurrentTask,
  updateTaskLocal,
  addTaskLocal,
  removeTaskLocal,
} = tasksSlice.actions

export default tasksSlice.reducer