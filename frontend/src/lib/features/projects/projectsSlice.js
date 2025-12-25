// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// const API_BASE = 'http://localhost:4000'

// // Helper function for API calls
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
//     console.log("Res:", data);
//   } catch {
//     data = null
//   }
  
//   if (!response.ok) {
//     const message = data?.message || 'Request failed'
//     throw new Error(message)
//   }
  
//   return data
// }



// export const fetchProjects = createAsyncThunk(
//   'projects/fetchProjects',
//   async ( _ ,{ rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       if (!token) throw new Error('No authentication token found')
      
      
    
//       const data = await apiFetch(
//         `${API_BASE}/project`,
//         { token }
//       )

//       console.log("porjcts data:", data);
      
//       return data?.projects || []
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )


// export const createProject = createAsyncThunk(
//   'projects/createProject',
//   async (projectData, { rejectWithValue }) => {
//     try {
//       const token = localStorage.getItem('auth_token')
//       if (!token) throw new Error('No authentication token found')
      
//       const data = await apiFetch(
//         `${API_BASE}/api/project`,
//         {
//           method: 'POST',
//           token,
//           body: projectData,
//         }
//       )

//       return data?.data?.project || data?.project
//     } catch (error) {
//       return rejectWithValue(error.message)
//     }
//   }
// )






// const projectsSlice = createSlice({
//   name: 'projects',
//   initialState: {
//     list: [],
//     loading: false
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchProjects.pending, (state) => {
//         state.loading = true
//       })
//       .addCase(fetchProjects.fulfilled, (state, action) => {
//         state.list = action.payload
//         state.loading = false
//       })
//       .addCase(createProject.fulfilled, (state, action) => {
//         state.list.push(action.payload)
//       })
//   }
// })

// export default projectsSlice.reducer




import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE = 'http://localhost:4000'

// ------------------ THUNKS ------------------

export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      console.log("Token:", token)
      const res = await fetch(`${API_BASE}/api/project`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      console.log("Projects data:", data)
      return data.projects
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const createProject = createAsyncThunk(
  'projects/createProject',
  async (payload, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${API_BASE}/api/project`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      return data.project
    } catch (err) {
      return rejectWithValue(err.message)
    }
  }
)

export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ projectId, data }) => {
    const token = localStorage.getItem('auth_token')
    console.log("Updating project with ID:", projectId, "and data:", data)
    await fetch(`${API_BASE}/api/project/${projectId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    return { projectId, ...data }
  }
)

export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (projectId) => {
    const token = localStorage.getItem('auth_token')
    await fetch(`${API_BASE}/api/project/${projectId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    return projectId
  }
)

export const fetchProjectMembers = createAsyncThunk(
  'projects/fetchProjectMembers',
  async (projectId) => {
    const token = localStorage.getItem('auth_token')
    const res = await fetch(
      `${API_BASE}/api/project/${projectId}/members`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    return (await res.json()).members
  }
)

export const addProjectMembers = createAsyncThunk(
  'projects/addProjectMembers',
  async ({ projectId, userIds }) => {
    const token = localStorage.getItem('auth_token')
    await fetch(`${API_BASE}/api/project/${projectId}/members`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userIds })
    })
    return { projectId }
  }
)

export const removeProjectMember = createAsyncThunk(
  'projects/removeProjectMember',
  async ({ projectId, memberId }) => {
    const token = localStorage.getItem('auth_token')
    await fetch(
      `${API_BASE}/api/project/${projectId}/members/${memberId}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      }
    )
    return { projectId, memberId }
  }
)

// ------------------ SLICE ------------------

const projectsSlice = createSlice({
  name: 'projects',
  initialState: {
    list: [],
    members: [],
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.fulfilled, (s, a) => {
        s.list = a.payload
      })
      .addCase(createProject.fulfilled, (s, a) => {
        s.list.push(a.payload)
      })
      .addCase(deleteProject.fulfilled, (s, a) => {
        s.list = s.list.filter(p => p.id !== a.payload)
      })
      .addCase(fetchProjectMembers.fulfilled, (s, a) => {
        s.members = a.payload
      })
  }
})

export default projectsSlice.reducer
