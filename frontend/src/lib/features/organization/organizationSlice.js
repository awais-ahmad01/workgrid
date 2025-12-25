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





export const fetchOrganizationMembers = createAsyncThunk(
  'organization/fetchOrganizationMembers',
  async ( _ ,{ rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) throw new Error('No authentication token found')
      
      const data = await apiFetch(
        `${API_BASE}/api/organization/members`,
        { token }
      )

      console.log("organization members data:", data);
      
      return data?.members || []
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)


const organizationSlice = createSlice({
  name: 'organization',
  initialState: {
    members: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizationMembers.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchOrganizationMembers.fulfilled, (state, action) => {
        state.members = action.payload
        state.loading = false
      })
      .addCase(fetchOrganizationMembers.rejected, (state, action) => {
        state.loading = false
      })
  }
})

export default organizationSlice.reducer
