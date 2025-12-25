"use client";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const API_BASE = "http://localhost:4000";

/**
 * API CALL HELPER FUNCTION
 * Centralized fetch wrapper for consistent error handling
 */
const apiFetch = async (url, options = {}) => {
  const { method = "GET", body, token, headers = {}, ...rest } = options;

  console.log("token in:", token);

  const mergedHeaders = {
    Accept: "application/json",
    ...headers,
  };

  if (body && !mergedHeaders["Content-Type"]) {
    mergedHeaders["Content-Type"] = "application/json";
  }

  if (token) {
    mergedHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method,
    credentials: "include",
    headers: mergedHeaders,
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  let data;
  try {
    data = await response.json();
    console.log("apiFetch data:", data);
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data;
};

/**
 * ASYNC THUNKS - Handle API operations
 */

// Login user
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`${API_BASE}/auth/login`, {
        method: "POST",
        body: { email, password },
      });

      console.log("Data token:", data?.token);

      // Store token and user in localStorage
      localStorage.setItem("auth_token", data?.token);
      // localStorage.setItem("user", JSON.stringify(data?.data?.user));

      console.log("Data after:", data);

      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const signupAdmin = createAsyncThunk(
  "auth/signupAdmin",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiFetch(`${API_BASE}/auth/signup-admin`, {
        method: "POST",
        body: payload,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const data = await apiFetch(`${API_BASE}/auth/verify-email/${token}`, {
        method: "GET",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



// Send invite to organization member
export const sendInvite = createAsyncThunk(
  "auth/sendInvite",
  async ({ email, role }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("auth_token");

      return await apiFetch(`${API_BASE}/auth/send-invite`, {
        method: "POST",
        body: { email, role },
        token,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);




export const signupViaInvite = createAsyncThunk(
  "auth/signupViaInvite",
  async (payload, { rejectWithValue }) => {
    try {
      return await apiFetch(`${API_BASE}/auth/signup-invite`, {
        method: "POST",
        body: payload,
      });
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Logout user
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("auth_token");

      if (token) {
        await apiFetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          token,
        });
      }

      // Clear localStorage
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");

      return null;
    } catch (error) {
      // Still clear storage even if API call fails
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return rejectWithValue(error.message);
    }
  }
);

// Refresh/validate user session
export const refreshSession = createAsyncThunk(
  "auth/refreshSession",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("auth_token");

      console.log("token:", token);

      // If no token but we have stored user, return it
      if (!token) {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          return { user: JSON.parse(storedUser), modules: [] };
        }
        throw new Error("No authentication found");
      }

      // Fetch user info and modules in parallel
      const [user, modules] = await Promise.all([
        apiFetch(`${API_BASE}/session/user`, { token }),
        apiFetch(`${API_BASE}/session/modules`, { token }),
      ]);

      console.log("Fetched user:", user);
      console.log("Fetched modules:", modules);

      // Update localStorage with fresh user data
      localStorage.setItem("user", JSON.stringify(user));

      return {
        user,
        modules: modules.allowedModules || [],
      };
    } catch (error) {
      // Clear invalid session data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      return rejectWithValue(error.message);
    }
  }
);

/**
 * INITIAL STATE
 */
const initialState = {
  user: null, // Current user object
  modules: [], // User's accessible modules
  loading: true, // Initial loading state
  error: null, // Error messages
};

/**
 * AUTH SLICE - Reducer and actions
 */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Clear any error messages
    clearError: (state) => {
      state.error = null;
    },
    // Manually set loading state
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.modules = action.payload.modules || [];
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // SIGNUP
      .addCase(signupAdmin.pending, (s) => {
        s.loading = true;
      })
      .addCase(signupAdmin.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(signupAdmin.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })



      // SEND INVITE
.addCase(sendInvite.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(sendInvite.fulfilled, (state) => {
  state.loading = false;
})
.addCase(sendInvite.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      .addCase(signupViaInvite.pending, (s) => {
        s.loading = true;
      })
      .addCase(signupViaInvite.fulfilled, (s) => {
        s.loading = false;
      })
      .addCase(signupViaInvite.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LOGOUT
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.modules = [];
        state.loading = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.user = null;
        state.modules = [];
        state.loading = false;
        state.error = action.payload;
      })

      // REFRESH SESSION
      .addCase(refreshSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refreshSession.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.modules = action.payload.modules;
        state.error = null;
      })
      .addCase(refreshSession.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.modules = [];
        state.error = action.payload;
      });
  },
});

// Export actions and reducer
export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
