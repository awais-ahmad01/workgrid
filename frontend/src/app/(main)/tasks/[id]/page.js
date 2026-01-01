// 'use client'

// import { useEffect, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import { useAuth } from '@/lib/hooks/useAuth' // Updated
// import { useTasks } from '@/lib/hooks/useTasks' // New
// import { useComments } from '@/lib/hooks/useComments' // New
// import { useFiles } from '@/lib/hooks/useFiles' // New
// import { supabaseBrowser } from '@/lib/supabaseClient'
// import { ArrowLeft, Paperclip, Trash2, Download, Loader2 } from 'lucide-react'

// export default function TaskDetailPage() {
//   const params = useParams()
//   const router = useRouter()
//   const taskId = params?.id
  
//   // Use Redux hooks
//   const { user } = useAuth()
//   const { currentTask, loading: taskLoading, getTask, updateTaskOptimistically } = useTasks()
//   const { getComments,getTaskComments, loading: commentsLoading, posting: commentPosting, createComment, addCommentOptimistically } = useComments()
//   const { getFiles,getTaskFiles, uploading, uploadFile, deleteExistingFile, addFileOptimistically, removeFileOptimistically } = useFiles()
  
//   const [commentInput, setCommentInput] = useState('')
  
  
//   // Get comments and files for current task
//   const comments = getTaskComments(taskId)
//   console.log("cmments:::", comments);
//   const files = getTaskFiles(taskId);
//   console.log("Files:", files)
  
//   // Fetch task data on mount
//   useEffect(() => {
//     if (!taskId) return
    
//     const fetchData = async () => {
//       await getTask(taskId)

//       await getComments(taskId)  
//        await getFiles(taskId)     
//     }
    
//     fetchData()
//   }, [taskId, getTask])

//   // Realtime subscriptions
//   useEffect(() => {
//     if (!supabaseBrowser || !taskId) return

//     const channel = supabaseBrowser.channel(`task-${taskId}`)
//       .on('postgres_changes', { 
//         event: 'INSERT', 
//         schema: 'public', 
//         table: 'task_comments', 
//         filter: `task_id=eq.${taskId}` 
//       }, (payload) => {
//         // Add comment to Redux store
//         addCommentOptimistically(taskId, payload.new)
//       })
//       .on('postgres_changes', { 
//         event: 'INSERT', 
//         schema: 'public', 
//         table: 'task_files', 
//         filter: `task_id=eq.${taskId}` 
//       }, (payload) => {
//         // Add file to Redux store
//         addFileOptimistically(taskId, payload.new)
//       })
//       .on('postgres_changes', { 
//         event: 'UPDATE', 
//         schema: 'public', 
//         table: 'tasks', 
//         filter: `id=eq.${taskId}` 
//       }, (payload) => {
//         // Update task in Redux store
//         updateTaskOptimistically(taskId, payload.new)
//       })
//       .subscribe()

//     return () => {
//       supabaseBrowser.removeChannel(channel)
//     }
//   }, [taskId, addCommentOptimistically, addFileOptimistically, updateTaskOptimistically])

//   const handlePostComment = async () => {
//     if (!commentInput.trim()) return
    
//     const result = await createComment(taskId, commentInput)
//     if (result.success) {
//       setCommentInput('')
//     } else {
//       alert(result.error || 'Failed to post comment')
//     }
//   }

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return
    
//     const result = await uploadFile(taskId, file)
//     if (!result.success) {
//       alert(result.error || 'Upload failed')
//     }
    
//     e.target.value = ''
//   }

//   const handleDeleteFile = async (fileId) => {
//     if (!confirm('Are you sure you want to delete this file?')) return
    
//     const result = await deleteExistingFile(taskId, fileId)
//     if (!result.success) {
//       alert(result.error || 'Delete failed')
//     }
//   }

//   const loading = taskLoading || commentsLoading

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
//       </div>
//     )
//   }

//   if (!currentTask) {
//     return (
//       <div className="p-6">
//         <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline flex items-center gap-2 mb-4">
//           <ArrowLeft className="w-4 h-4" /> Back
//         </button>
//         <div className="text-gray-600">Task not found</div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col gap-6 h-full px-6 md:px-10 lg:px-12 py-6">
//       <div className="flex items-start justify-between gap-4">
//         <div>
//           <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline flex items-center gap-2 mb-2">
//             <ArrowLeft className="w-4 h-4" /> Back
//           </button>
//           <h1 className="text-2xl font-bold text-gray-900">{currentTask.title}</h1>
//           {currentTask.description && (
//             <p className="text-gray-600 mt-2 max-w-3xl whitespace-pre-wrap">{currentTask.description}</p>
//           )}
//           <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-700">
//             <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
//               Status: {currentTask.status}
//             </span>
//             <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
//               Priority: {currentTask.priority}
//             </span>
//             {currentTask.due_date && (
//               <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
//                 Due: {new Date(currentTask.due_date).toLocaleDateString()}
//               </span>
//             )}
//           </div>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
//         {/* Comments Section */}
//         <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
//           <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-800">Comments</h2>
//             <div className="flex items-center gap-2">
//               <div className="relative">
//                 <input
//                   type="text"
//                   value={commentInput}
//                   onChange={(e) => setCommentInput(e.target.value)}
//                   placeholder="Write a comment... Use @name to mention"
//                   className="w-72 md:w-96 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
//                 />
//               </div>
//               <button
//                 onClick={handlePostComment}
//                 disabled={commentPosting || !commentInput.trim()}
//                 className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
//               >
//                 {commentPosting ? 'Posting...' : 'Post'}
//               </button>
//             </div>
//           </div>
//           <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
//             {comments.length === 0 && (
//               <div className="text-sm text-gray-500">No comments yet.</div>
//             )}
//             {comments.map((c) => (
//               <div key={c.id} className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
//                 <div className="text-xs text-gray-500 mb-1">
//                   {c.user_name || 'Unknown'} • {new Date(c.created_at).toLocaleString()}
//                 </div>
//                 <div className="text-sm text-gray-800 whitespace-pre-wrap">{c.body}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Files Section */}
//         <div className="bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
//           <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
//             <h2 className="text-sm font-semibold text-gray-800">Files</h2>
//             <label className="flex items-center gap-2 text-sm text-indigo-600 cursor-pointer">
//               <Paperclip className="w-4 h-4" />
//               <span>{uploading ? 'Uploading...' : 'Upload'}</span>
//               <input 
//                 type="file" 
//                 className="hidden" 
//                 onChange={handleUpload} 
//                 disabled={uploading} 
//               />
//             </label>
//           </div>
//           <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
//             {files.length === 0 && (
//               <div className="text-sm text-gray-500">No files yet.</div>
//             )}
//             {files.map((f) => (
//               <div key={f.id} className="flex items-center justify-between border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
//                 <div className="flex flex-col">
//                   <span className="text-sm text-gray-800">{f.file_name}</span>
//                   <span className="text-xs text-gray-500">{(f.size / 1024).toFixed(1)} KB</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <a
//                   href={`https://YOUR_PROJECT.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
//                     rel="noreferrer"
//                     className="text-sm text-indigo-600 hover:underline flex items-center gap-1"
//                   >
//                     <Download className="w-4 h-4" />
//                     Open
//                   </a>
//                   <button
//                     onClick={() => handleDeleteFile(f.id)}
//                     className="p-2 hover:bg-gray-100 rounded-lg text-red-600"
//                     title="Delete"
//                   >
//                     <Trash2 className="w-4 h-4" />
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Paperclip, Trash2, Download, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useTasks } from '@/lib/hooks/useTasks'
import { useComments } from '@/lib/hooks/useComments'
import { useFiles } from '@/lib/hooks/useFiles'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function TaskDetailPage() {
  const { id: taskId } = useParams()
  const router = useRouter()

  const { user } = useAuth()
 const { currentTask, loading: taskLoading, getTask, updateTaskOptimistically } = useTasks()
const { getComments,getTaskComments, loading: commentsLoading, posting: commentPosting, createComment, addCommentOptimistically } = useComments()

  const {
    getFilesByTask,
    getTaskFiles,
    uploadFileToTask,
    removeFile,
    uploading,
  } = useFiles()

  const [commentInput, setCommentInput] = useState('')



  /* ---------------- LOAD DATA ---------------- */
  useEffect(() => {
    if (!taskId) return
    getTask(taskId)
    getComments(taskId)
    getTaskFiles(taskId)
  }, [taskId])

  //    Get comments and files for current task
  const comments = getTaskComments(taskId)
//   console.log("cmments:::", comments);
  const files = getFilesByTask(taskId)


//   // Realtime subscriptions
  useEffect(() => {
    if (!supabaseBrowser || !taskId) return

    const channel = supabaseBrowser.channel(`task-${taskId}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'task_comments', 
        filter: `task_id=eq.${taskId}` 
      }, (payload) => {
        // Add comment to Redux store
        addCommentOptimistically(taskId, payload.new)
      })
      // .on('postgres_changes', { 
      //   event: 'INSERT', 
      //   schema: 'public', 
      //   table: 'task_files', 
      //   filter: `task_id=eq.${taskId}` 
      // }, (payload) => {
      //   // Add file to Redux store
      //   addFileOptimistically(taskId, payload.new)
      // })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'tasks', 
        filter: `id=eq.${taskId}` 
      }, (payload) => {
        // Update task in Redux store
        updateTaskOptimistically(taskId, payload.new)
      })
      .subscribe()

          return () => {
      supabaseBrowser.removeChannel(channel)
    }
  }, [taskId, addCommentOptimistically, updateTaskOptimistically])




  /* ---------------- HANDLERS ---------------- */
  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const result = await uploadFileToTask(taskId, file)
        if (!result.success) {
      alert(result.error || 'Upload failed')
    }
    e.target.value = ''
  }

  const handleDelete = async (fileId) => {
    if (!confirm('Delete this file?')) return
    const result = await removeFile({
      taskId: taskId,
      projectId: currentTask.project_id,
      fileId,
    })
        if (!result.success) {
      alert(result.error || 'Delete failed')
    }
  }

   const handlePostComment = async () => {
    if (!commentInput.trim()) return
    
    const result = await createComment(taskId, commentInput)
    if (result.success) {
      setCommentInput('')
    } else {
      alert(result.error || 'Failed to post comment')
    }
  }

   const loading = taskLoading || commentsLoading

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      </div>
    )
  }


    if (!currentTask) {
    return (
      <div className="p-6">
        <button onClick={() => router.back()} className="text-sm text-indigo-600 hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="text-gray-600">Task not found</div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <button
        onClick={() => router.back()}
        className="text-sm text-indigo-600 flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold">{currentTask.title}</h1>
      <p className="text-gray-600">{currentTask.description}</p>

      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
        Status: {currentTask.status}             </span>
            <span className="px-3 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
              Priority: {currentTask.priority}             </span>
          {currentTask.due_date && (
              <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Due: {new Date(currentTask.due_date).toLocaleDateString()}
              </span>
            )}

      {/* ---------------- FILES ---------------- */}
      <div className="bg-white border rounded-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="font-semibold">Task Files</h2>
          <label className="flex items-center gap-2 cursor-pointer text-indigo-600">
            <Paperclip className="w-4 h-4" />
            Upload
            <input type="file" hidden onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        <div className="p-4 space-y-3">
          {files.length === 0 && (
            <p className="text-sm text-gray-500">No files attached.</p>
          )}

          {files.map((f) => (
            <div
              key={f.id}
              className="flex justify-between items-center border rounded p-3"
            >
              <div>
                <p className="text-sm">{f.file_name}</p>
                <p className="text-xs text-gray-500">
                  {(f.size / 1024).toFixed(1)} KB
                </p>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
                  target="_blank"
                  className="text-indigo-600 text-sm flex gap-1"
                >
                  <Download className="w-4 h-4" />
                  Open
                </a>

                <button
                  onClick={() => handleDelete(f.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>


          {/* Comments Section */}
               <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 shadow-sm flex flex-col">
           <div className="border-b border-gray-100 px-4 py-3 flex items-center justify-between">
             <h2 className="text-sm font-semibold text-gray-800">Comments</h2>
             <div className="flex items-center gap-2">
               <div className="relative">
             <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder="Write a comment... Use @name to mention"
                  className="w-72 md:w-96 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <button
                onClick={handlePostComment}
                disabled={commentPosting || !commentInput.trim()}
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {commentPosting ? 'Posting...' : 'Post'}
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto px-4 py-3 space-y-3">
            {comments.length === 0 && (
              <div className="text-sm text-gray-500">No comments yet.</div>
            )}
            {comments.map((c) => (
              <div key={c.id} className="border border-gray-100 rounded-lg px-3 py-2 bg-gray-50">
                <div className="text-xs text-gray-500 mb-1">
                  {c.user_name || 'Unknown'} • {new Date(c.created_at).toLocaleString()}
                </div>
                <div className="text-sm text-gray-800 whitespace-pre-wrap">{c.body}</div>
              </div>
            ))}
          </div>
        </div>

      
    </div>
  )
}
