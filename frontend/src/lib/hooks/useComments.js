'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { 
  fetchComments, 
  postComment,
  clearCommentsError,
  addCommentLocal,
  removeCommentLocal,
  clearTaskComments,
} from '../features/comments/commentsSlice'

export function useComments() {
  const dispatch = useAppDispatch()
  
  // Select comments state
  const { 
    commentsByTaskId, 
    loading, 
    error,
    posting 
  } = useAppSelector((state) => state.comments)

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      if (error) {
        dispatch(clearCommentsError())
      }
    }
  }, [error, dispatch])

  // Get comments for a specific task
  const getComments = async (taskId, limit = 20, offset = 0) => {
    // console.log("Get comments call:::")
    const result = await dispatch(fetchComments({ taskId, limit, offset }))
    // console.log("result:::", result)
    return {
      success: fetchComments.fulfilled.match(result),
      comments: result.payload?.comments || [],
      error: result.error?.message || result.payload,
    }
  }

  // Post a new comment
  const createComment = async (taskId, body) => {
    const result = await dispatch(postComment({ taskId, body }))
    return {
      success: postComment.fulfilled.match(result),
      comment: result.payload?.comment,
      error: result.error?.message || result.payload,
    }
  }

  // Get comments for current task
  const getTaskComments = (taskId) => {
    return commentsByTaskId[taskId] || []
  }

  // Local updates (for real-time)
  const addCommentOptimistically = (taskId, comment) => {
    dispatch(addCommentLocal({ taskId, comment }))
  }

  const removeCommentOptimistically = (taskId, commentId) => {
    dispatch(removeCommentLocal({ taskId, commentId }))
  }

  const clearCommentsForTask = (taskId) => {
    dispatch(clearTaskComments(taskId))
  }

  return {
    commentsByTaskId,
    getTaskComments,
    loading,
    posting,
    error,
    getComments,
    createComment,
    addCommentOptimistically,
    removeCommentOptimistically,
    clearCommentsForTask,
    clearError: () => dispatch(clearCommentsError()),
  }
}