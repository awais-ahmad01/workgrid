'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchNotifications, 
  markNotificationRead, 
  markAllNotificationsRead,
  addNotificationLocal,
  clearNotificationsError 
} from '../features/notifications/notificationsSlice'

export function useNotifications() {
  const dispatch = useAppDispatch()
  
  // Select notifications state
  const { 
    notifications, 
    loading, 
    error, 
    unreadCount 
  } = useAppSelector((state) => state.notifications)

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      await dispatch(fetchNotifications({ limit: 20, offset: 0 }))
    }
    loadNotifications()
  }, [dispatch])

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearNotificationsError())
      }
    }
  }, [error, dispatch])

  // Mark single notification as read
  const markAsRead = async (id) => {
    const result = await dispatch(markNotificationRead(id))
    return markNotificationRead.fulfilled.match(result)
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
    const result = await dispatch(markAllNotificationsRead())
    return markAllNotificationsRead.fulfilled.match(result)
  }

  // Add notification (for real-time updates)
  const addNewNotification = (notification) => {
    dispatch(addNotificationLocal(notification))
  }

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNewNotification,
    refreshNotifications: () => dispatch(fetchNotifications({ limit: 20, offset: 0 })),
    clearError: () => dispatch(clearNotificationsError()),
  }
}