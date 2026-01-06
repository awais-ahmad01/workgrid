// 'use client'

// import { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '../store/hooks'
// import { 
//   listFiles, 
//   requestUpload, 
//   deleteFile,
//   clearFilesError,
//   addFileLocal,
//   removeFileLocal,
//   clearTaskFiles,
// } from '../features/files/filesSlice'

// export function useFiles() {
//   const dispatch = useAppDispatch()
  
//   // Select files state
//   const { 
//     filesByTaskId, 
//     loading, 
//     error,
//     uploading 
//   } = useAppSelector((state) => state.files)

//   // Clear error when component unmounts
//   useEffect(() => {
//     return () => {
//       if (error) {
//         dispatch(clearFilesError())
//       }
//     }
//   }, [error, dispatch])

//   // Get files for a specific task
//   const getFiles = async (taskId) => {
//     const result = await dispatch(listFiles({ taskId }))
//     return {
//       success: listFiles.fulfilled.match(result),
//       files: result.payload?.files || [],
//       error: result.error?.message || result.payload,
//     }
//   }

//   // Upload a file
//   const uploadFile = async (taskId, file) => {
//     const result = await dispatch(requestUpload({ taskId, file }))
//     return {
//       success: requestUpload.fulfilled.match(result),
//       file: result.payload?.file,
//       error: result.error?.message || result.payload,
//     }
//   }

//   // Delete a file
//   const deleteExistingFile = async (taskId, fileId) => {
//     const result = await dispatch(deleteFile({ taskId, fileId }))
//     return {
//       success: deleteFile.fulfilled.match(result),
//       error: result.error?.message || result.payload,
//     }
//   }

//   // Get files for current task
//   const getTaskFiles = (taskId) => {
//     return filesByTaskId[taskId] || []
//   }

//   // Local updates (for real-time)
//   const addFileOptimistically = (taskId, file) => {
//     dispatch(addFileLocal({ taskId, file }))
//   }

//   const removeFileOptimistically = (taskId, fileId) => {
//     dispatch(removeFileLocal({ taskId, fileId }))
//   }

//   const clearFilesForTask = (taskId) => {
//     dispatch(clearTaskFiles(taskId))
//   }

//   return {
//     filesByTaskId,
//     getTaskFiles,
//     loading,
//     uploading,
//     error,
//     getFiles,
//     uploadFile,
//     deleteExistingFile,
//     addFileOptimistically,
//     removeFileOptimistically,
//     clearFilesForTask,
//     clearError: () => dispatch(clearFilesError()),
//   }
// }





'use client'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  listProjectFiles,
  listTaskFiles,
  uploadProjectFile,
  uploadTaskFile,
  deleteFile,
  listDocFiles,
  uploadDocFile,
  deleteDocFile,
} from '../features/files/filesSlice'

export function useFiles() {
  const dispatch = useAppDispatch()

  const {
    projectFiles,
    taskFiles,
     docFiles,
    loading,
    uploading,
    error,
  } = useAppSelector((state) => state.files)

  /* -------- LIST -------- */
  const getProjectFiles = (projectId) =>
    dispatch(listProjectFiles({ projectId }))

  const getTaskFiles = (taskId) =>
    dispatch(listTaskFiles({ taskId }))

  /* -------- UPLOAD -------- */
  const uploadFileToProject = (projectId, file) =>
    dispatch(uploadProjectFile({ projectId, file }))

  const uploadFileToTask = (taskId, file) =>
    dispatch(uploadTaskFile({ taskId, file }))

  const getDocFiles = (docId, projectId) =>
    console.log("getDocFiles called with:", {docId, projectId})  ||
  dispatch(listDocFiles({ docId, projectId }))

  const uploadFileToDoc = (projectId, docId, file) =>
    dispatch(uploadDocFile({ projectId, docId, file }))

  const getFilesByDoc = (docId) =>
    docFiles[docId] || []


  /* -------- DELETE -------- */
  const removeFile = ({ projectId, taskId, fileId }) =>
    dispatch(deleteFile({ projectId, taskId, fileId }))

  const removeDocFile = ({ projectId, docId, fileId }) =>
    dispatch(deleteDocFile({ projectId, docId, fileId }))
  /* -------- SELECTORS -------- */
  const getFilesByProject = (projectId) =>
    projectFiles[projectId] || []

  const getFilesByTask = (taskId) =>
    taskFiles[taskId] || []

  return {
    // state
    loading,
    uploading,
    error,

    // selectors
    getFilesByProject,
    getFilesByTask,
    getFilesByDoc, 

    // actions
    getProjectFiles,
    getTaskFiles,
    getDocFiles,
    uploadFileToProject,
    uploadFileToTask,
    uploadFileToDoc, 
    removeFile,
    removeDocFile,
    
  }
}
