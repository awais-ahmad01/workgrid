'use client'

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:4000'

// Helper function to make API calls
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

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ limit = 20, offset = 0 }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      const data = await apiFetch(
        `${API_BASE}/notifications?limit=${limit}&offset=${offset}`,
        { token }
      )

      console.log("Fetched notifications data:", data);
      
      return data.data?.notifications || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      await apiFetch(
        `${API_BASE}/notifications/${id}/read`,
        { 
          method: 'POST',
          token 
        }
      )
      
      return id
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllNotificationsRead',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        throw new Error('No authentication token found')
      }
      
      await apiFetch(
        `${API_BASE}/notifications/read-all`,
        { 
          method: 'POST',
          token 
        }
      )
      
      return true
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Add a notification (for real-time updates)
export const addNotification = createAsyncThunk(
  'notifications/addNotification',
  async (notification, { rejectWithValue }) => {
    try {
      return notification
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

// Initial State
const initialState = {
  notifications: [],
  loading: false,
  error: null,
  unreadCount: 0,
}

// Slice
const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Clear notifications error
    clearNotificationsError: (state) => {
      state.error = null
    },
    // Set notifications (for real-time updates)
    setNotifications: (state, action) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter(n => !n.read_at).length
    },
    // Add a single notification (for real-time)
    addNotificationLocal: (state, action) => {
      const newNotification = action.payload
      // Check if notification already exists
      if (!state.notifications.some(n => n.id === newNotification.id)) {
        state.notifications = [newNotification, ...state.notifications].slice(0, 50)
        if (!newNotification.read_at) {
          state.unreadCount += 1
        }
      }
    },
    // Clear all notifications
    clearNotifications: (state) => {
      state.notifications = []
      state.unreadCount = 0
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false
        state.notifications = action.payload
        state.unreadCount = action.payload.filter(n => !n.read_at).length
        state.error = null
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Mark Notification Read
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false
        const id = action.payload
        const notification = state.notifications.find(n => n.id === id)
        if (notification && !notification.read_at) {
          notification.read_at = new Date().toISOString()
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Mark All Notifications Read
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading = false
        state.notifications = state.notifications.map(n => ({
          ...n,
          read_at: n.read_at || new Date().toISOString()
        }))
        state.unreadCount = 0
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      
      // Add Notification (for real-time)
      .addCase(addNotification.pending, (state) => {
        state.loading = true
      })
      .addCase(addNotification.fulfilled, (state, action) => {
        state.loading = false
        const newNotification = action.payload
        if (!state.notifications.some(n => n.id === newNotification.id)) {
          state.notifications = [newNotification, ...state.notifications].slice(0, 50)
          if (!newNotification.read_at) {
            state.unreadCount += 1
          }
        }
      })
  },
})

// Export actions and reducer
export const { 
  clearNotificationsError, 
  setNotifications, 
  addNotificationLocal,
  clearNotifications 
} = notificationsSlice.actions

export default notificationsSlice.reducer