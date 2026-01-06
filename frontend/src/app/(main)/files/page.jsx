// 'use client'

// import { useEffect } from 'react'
// import { useParams } from 'next/navigation'
// import { Paperclip, Trash2, Download, Loader2 } from 'lucide-react'
// import { useFiles } from '@/lib/hooks/useFiles'
// import { useProjects } from '@/lib/hooks/useProjects'

// export default function ProjectFilesPage() {
//     const { activeProject } = useProjects()
//   // const { id: projectId } = useParams()
//   const {
//     getProjectFiles,
//     getFilesByProject,
//     uploadFileToProject,
//     removeFile,
//     loading,
//     uploading,
//   } = useFiles()

//   useEffect(() => {
//     if (activeProject?.id) getProjectFiles(activeProject.id)
//   }, [activeProject?.id])

//   const files = getFilesByProject(activeProject?.id)

//   const handleUpload = async (e) => {
//     const file = e.target.files?.[0]
//     if (!file) return
//     await uploadFileToProject(activeProject?.id, file)
//     e.target.value = ''
//   }

//   const handleDelete = async (fileId) => {
//     if (!confirm('Delete this file?')) return
//     await removeFile({ projectId: activeProject?.id, fileId })
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-full">
//         <Loader2 className="animate-spin" />
//       </div>
//     )
//   }

//   return (
//     <div className="p-6 space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Project Files</h1>

//         <label className="flex gap-2 text-indigo-600 cursor-pointer">
//           <Paperclip className="w-4 h-4" />
//           Upload File
//           <input type="file" hidden onChange={handleUpload} disabled={uploading} />
//         </label>
//       </div>

//       <div className="bg-white border rounded-lg divide-y">
//         {files.length === 0 && (
//           <p className="p-4 text-sm text-gray-500">
//             No files uploaded for this project.
//           </p>
//         )}

//         {files.map((f) => (
//           <div
//             key={f.id}
//             className="flex justify-between items-center p-4"
//           >
//             <div>
//               <p className="text-sm font-medium">{f.file_name}</p>
//               <p className="text-xs text-gray-500">
//                 Uploaded • {(f.size / 1024).toFixed(1)} KB
//               </p>
//             </div>

//             <div className="flex gap-3">
//               <a
//                 href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
//                 target="_blank"
//                 className="text-indigo-600 flex gap-1 text-sm"
//               >
//                 <Download className="w-4 h-4" />
//                 Open
//               </a>

//               <button
//                 onClick={() => handleDelete(f.id)}
//                 className="text-red-600"
//               >
//                 <Trash2 className="w-4 h-4" />
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }





'use client'

import { useEffect, useState } from 'react'
import { Paperclip, Trash2, Download, Loader2, FileText, Upload, AlertCircle } from 'lucide-react'
import { useFiles } from '@/lib/hooks/useFiles'
import { useProjects } from '@/lib/hooks/useProjects'
import { useAuth } from '@/lib/hooks/useAuth'
import FilesHeader from './header'

export default function ProjectFilesPage() {
  const { user } = useAuth()
  const { activeProject } = useProjects()
  const {
    getProjectFiles,
    getFilesByProject,
    uploadFileToProject,
    removeFile,
    loading,
    uploading,
  } = useFiles()

  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (activeProject?.id) {
      getProjectFiles(activeProject.id)
    }
  }, [activeProject?.id])

  const files = getFilesByProject(activeProject?.id)

  const filteredFiles = files.filter((file) =>
    file.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeProject?.id) return
    
    setUploadProgress(true)
    try {
      await uploadFileToProject(activeProject.id, file)
    } catch (error) {
      console.error('Upload failed:', error)
    } finally {
      setUploadProgress(false)
      e.target.value = ''
    }
  }

  const handleDelete = async (fileId) => {
    if (!activeProject?.id || deleting) return
    
    setDeleting(true)
    try {
      await removeFile({ projectId: activeProject.id, fileId })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (fileName) => {
    const ext = fileName.split('.').pop()?.toLowerCase()
    const iconClass = 'w-5 h-5'
    
    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) {
      return <FileText className={`${iconClass} text-blue-600`} />
    }
    if (['pdf'].includes(ext)) {
      return <FileText className={`${iconClass} text-red-600`} />
    }
    if (['doc', 'docx'].includes(ext)) {
      return <FileText className={`${iconClass} text-blue-700`} />
    }
    if (['xls', 'xlsx'].includes(ext)) {
      return <FileText className={`${iconClass} text-green-600`} />
    }
    return <FileText className={`${iconClass} text-gray-600`} />
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading files...</span>
          </div>
        </div>
      )
    }

    if (filteredFiles.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Paperclip className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery ? 'No files match your search' : 'No files uploaded yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery
              ? 'Try adjusting your search'
              : 'Upload your first file to get started'}
          </p>
          {!searchQuery && (
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer">
              <Upload className="w-4 h-4" />
              Upload File
              <input 
                type="file" 
                hidden 
                onChange={handleUpload} 
                disabled={uploading || uploadProgress || !activeProject?.id}
              />
            </label>
          )}
        </div>
      )
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file) => (
                <tr key={file.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        {getFileIcon(file.file_name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                          {file.file_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {file.mime_type || 'Unknown type'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">
                      {formatFileSize(file.size)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-500">
                      {formatDate(file.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <a
                        href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${file.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      {/* Only high roles, HR, or file owner (Senior Intern) can delete */}
                      {(['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role) || 
                        (user?.role === 'SENIOR_INTERN' && String(file.user_id) === String(user?.id))) && (
                        <button
                          onClick={() => setDeleteConfirm(file)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Check if user can upload files (Interns cannot upload)
  const canUploadFile = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD', 'SENIOR_INTERN'].includes(user?.role);

  const uploadButton = canUploadFile ? (
    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors cursor-pointer shadow-sm disabled:opacity-50 disabled:cursor-not-allowed">
      {uploadProgress ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Uploading...
        </>
      ) : (
        <>
          <Upload className="w-4 h-4" />
          Upload File
        </>
      )}
      <input 
        type="file" 
        hidden 
        onChange={handleUpload} 
        disabled={uploading || uploadProgress || !activeProject?.id}
      />
    </label>
  ) : null

  return (
    <div className="flex flex-col gap-6">
      <FilesHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        rightSlot={uploadButton}
      />

      <div className="px-6 md:px-10 lg:px-12 pb-8 space-y-4">
        <p className="text-sm text-gray-600">
          Upload and manage files for {activeProject?.name || 'your project'}
        </p>

        {renderContent()}
      </div>

      {/* Upload Progress Indicator */}
      {uploadProgress && (
        <div className="fixed bottom-6 right-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 flex items-center gap-3 z-50">
          <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
          <div>
            <p className="text-sm font-medium text-gray-900">Uploading file...</p>
            <p className="text-xs text-gray-500">Please wait</p>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteConfirm(null)}
          />
          
          {/* Modal content */}
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete File</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this file?
            </p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg mb-6 truncate">
              {deleteConfirm.file_name}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}