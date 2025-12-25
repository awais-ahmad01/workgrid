'use client'

import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import notificationsReducer from '../features/notifications/notificationsSlice'
import tasksReducer from '../features/tasks/tasksSlice' // Add this
import commentsReducer from '../features/comments/commentsSlice' // Add this
import filesReducer from '../features/files/filesSlice' // Add this
import projectsReducer from '../features/projects/projectsSlice'
import organizationReducer from '../features/organization/organizationSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      projects: projectsReducer,
      organization: organizationReducer,
      notifications: notificationsReducer,
      tasks: tasksReducer, // Add this
      comments: commentsReducer, // Add this
      files: filesReducer, // Add this
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            'auth/login/fulfilled', 
            'auth/refreshSession/fulfilled',
            'notifications/addNotification/fulfilled',
            'comments/postComment/fulfilled', // Add this
            'files/requestUpload/fulfilled', // Add this
          ],
          ignoredPaths: [
            'auth.user', 
            'notifications.notifications',
            'tasks.tasks', // Add this
            'comments.commentsByTaskId', // Add this
            'files.filesByTaskId', // Add this
          ],
        },
      }),
  })
}

export const store = makeStore()