'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchTasks, 
  fetchTaskById, 
  createTask, 
  updateTask, 
  deleteTask,
  clearTasksError,
  setCurrentTask,
  updateTaskLocal,
  addTaskLocal,
  removeTaskLocal,
} from '../features/tasks/tasksSlice'

export function useTasks() {
  const dispatch = useAppDispatch()
  
  // Select tasks state
  const { 
    tasks, 
    currentTask, 
    loading, 
    error 
  } = useAppSelector((state) => state.tasks)

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearTasksError())
      }
    }
  }, [error, dispatch])

  // Fetch tasks with filters
  const getTasks = async (filters = {}) => {
    const result = await dispatch(fetchTasks(filters))
    console.log("Resulted tasks:", result);
    return fetchTasks.fulfilled.match(result)
  }

  // Get task by ID
  const getTask = async (taskId) => {
    const result = await dispatch(fetchTaskById(taskId))
    return fetchTaskById.fulfilled.match(result)
  }

  // Create new task
  const createNewTask = async (taskData) => {
    const result = await dispatch(createTask(taskData))
    return {
      success: createTask.fulfilled.match(result),
      task: result.payload,
      error: result.error?.message || result.payload,
    }
  }

  // Update existing task
  const updateExistingTask = async (taskId, data) => {
    const result = await dispatch(updateTask({ taskId, data }))
    return {
      success: updateTask.fulfilled.match(result),
      updatedTask: result.payload?.updatedTask,
      error: result.error?.message || result.payload,
    }
  }

  // Delete task
  const deleteExistingTask = async (taskId) => {
    const result = await dispatch(deleteTask(taskId))
    return {
      success: deleteTask.fulfilled.match(result),
      error: result.error?.message || result.payload,
    }
  }

  // Local updates (for real-time)
  const updateTaskOptimistically = (taskId, updates) => {
    dispatch(updateTaskLocal({ taskId, updates }))
  }

  const addTaskOptimistically = (task) => {
    dispatch(addTaskLocal(task))
  }

  const removeTaskOptimistically = (taskId) => {
    dispatch(removeTaskLocal(taskId))
  }

  return {
    tasks,
    currentTask,
    loading,
    error,
    getTasks,
    getTask,
    createNewTask,
    updateExistingTask,
    deleteExistingTask,
    setCurrentTask: (task) => dispatch(setCurrentTask(task)),
    clearError: () => dispatch(clearTasksError()),
    updateTaskOptimistically,
    addTaskOptimistically,
    removeTaskOptimistically,
  }
}