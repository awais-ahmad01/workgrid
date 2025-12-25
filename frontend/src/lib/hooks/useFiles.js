'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  listFiles, 
  requestUpload, 
  deleteFile,
  clearFilesError,
  addFileLocal,
  removeFileLocal,
  clearTaskFiles,
} from '../features/files/filesSlice'

export function useFiles() {
  const dispatch = useAppDispatch()
  
  // Select files state
  const { 
    filesByTaskId, 
    loading, 
    error,
    uploading 
  } = useAppSelector((state) => state.files)

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearFilesError())
      }
    }
  }, [error, dispatch])

  // Get files for a specific task
  const getFiles = async (taskId) => {
    const result = await dispatch(listFiles({ taskId }))
    return {
      success: listFiles.fulfilled.match(result),
      files: result.payload?.files || [],
      error: result.error?.message || result.payload,
    }
  }

  // Upload a file
  const uploadFile = async (taskId, file) => {
    const result = await dispatch(requestUpload({ taskId, file }))
    return {
      success: requestUpload.fulfilled.match(result),
      file: result.payload?.file,
      error: result.error?.message || result.payload,
    }
  }

  // Delete a file
  const deleteExistingFile = async (taskId, fileId) => {
    const result = await dispatch(deleteFile({ taskId, fileId }))
    return {
      success: deleteFile.fulfilled.match(result),
      error: result.error?.message || result.payload,
    }
  }

  // Get files for current task
  const getTaskFiles = (taskId) => {
    return filesByTaskId[taskId] || []
  }

  // Local updates (for real-time)
  const addFileOptimistically = (taskId, file) => {
    dispatch(addFileLocal({ taskId, file }))
  }

  const removeFileOptimistically = (taskId, fileId) => {
    dispatch(removeFileLocal({ taskId, fileId }))
  }

  const clearFilesForTask = (taskId) => {
    dispatch(clearTaskFiles(taskId))
  }

  return {
    filesByTaskId,
    getTaskFiles,
    loading,
    uploading,
    error,
    getFiles,
    uploadFile,
    deleteExistingFile,
    addFileOptimistically,
    removeFileOptimistically,
    clearFilesForTask,
    clearError: () => dispatch(clearFilesError()),
  }
}