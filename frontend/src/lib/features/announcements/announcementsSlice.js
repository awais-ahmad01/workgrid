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

  const data = await response.json()
  if (!response.ok) throw new Error(data?.message || 'Request failed')
  return data
}

/* -----------------------------------
   THUNKS
----------------------------------- */

/* List announcements for current user */
// export const listAnnouncements = createAsyncThunk(
//   'announcements/list',
//   async (filters = {}, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       const data = await apiFetch(`${API_BASE}/announcements`, {
//         method: 'GET',
//         token,
//       })
//       console.log("FETCHED ANNOUNCEMENTS DATA:", data)
//       return data.data.announcements
//     } catch (err) {
//       return rejectWithValue(err.message)
//     }
//   }
// )


export const listAnnouncements = createAsyncThunk(
  'announcements/list',
  async ({ projectIds = [] } = {}, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')

      const params = new URLSearchParams()
      projectIds.forEach(id => params.append('projectIds', id))

      const data = await apiFetch(
        `${API_BASE}/announcements?${params.toString()}`,
        { method: 'GET', token }
      )

      return data.data.announcements
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)





/* Create announcement */
export const createAnnouncement = createAsyncThunk(
  'announcements/create',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(`${API_BASE}/announcements`, {
        method: 'POST',
        token,
        body: payload,
      })
      return data.data.announcement
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/* Mark read */
export const markAnnouncementRead = createAsyncThunk(
  'announcements/read',
  async (announcementId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      await apiFetch(`${API_BASE}/announcements/${announcementId}/read`, {
        method: 'POST',
        token,
      })
      return announcementId
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/* Pin / unpin */
export const togglePinAnnouncement = createAsyncThunk(
  'announcements/pin',
  async ({ announcementId, pinned }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const data = await apiFetch(
        `${API_BASE}/announcements/${announcementId}/pin`,
        {
          method: 'PATCH',
          token,
          body: { pinned },
        }
      )
      return data.data.announcement
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

/* Delete */
export const deleteAnnouncement = createAsyncThunk(
  'announcements/delete',
  async (announcementId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      await apiFetch(`${API_BASE}/announcements/${announcementId}`, {
        method: 'DELETE',
        token,
      })
      return announcementId
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
  loading: false,
  error: null,
}

const announcementsSlice = createSlice({
  name: 'announcements',
  initialState,
  reducers: {
    addAnnouncementRealtime(state, action) {
      state.list.unshift(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(listAnnouncements.pending, (state) => {
        state.loading = true
      })
      .addCase(listAnnouncements.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(listAnnouncements.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createAnnouncement.fulfilled, (state, action) => {
        state.list.unshift(action.payload)
      })

      .addCase(markAnnouncementRead.fulfilled, (state, action) => {
        const ann = state.list.find(a => a.id === action.payload)
        if (ann) ann.is_read = true
      })

      .addCase(togglePinAnnouncement.fulfilled, (state, action) => {
        const idx = state.list.findIndex(a => a.id === action.payload.id)
        if (idx !== -1) state.list[idx] = action.payload
      })

      .addCase(deleteAnnouncement.fulfilled, (state, action) => {
        state.list = state.list.filter(a => a.id !== action.payload)
      })
  },
})

export const { addAnnouncementRealtime } = announcementsSlice.actions
export default announcementsSlice.reducer
