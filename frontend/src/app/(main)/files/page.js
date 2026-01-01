'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { Paperclip, Trash2, Download, Loader2 } from 'lucide-react'
import { useFiles } from '@/lib/hooks/useFiles'
import { useProjects } from '@/lib/hooks/useProjects'

export default function ProjectFilesPage() {
    const { activeProject } = useProjects()
  // const { id: projectId } = useParams()
  const {
    getProjectFiles,
    getFilesByProject,
    uploadFileToProject,
    removeFile,
    loading,
    uploading,
  } = useFiles()

  useEffect(() => {
    if (activeProject?.id) getProjectFiles(activeProject.id)
  }, [activeProject?.id])

  const files = getFilesByProject(activeProject?.id)

  const handleUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFileToProject(activeProject?.id, file)
    e.target.value = ''
  }

  const handleDelete = async (fileId) => {
    if (!confirm('Delete this file?')) return
    await removeFile({ projectId: activeProject?.id, fileId })
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Project Files</h1>

        <label className="flex gap-2 text-indigo-600 cursor-pointer">
          <Paperclip className="w-4 h-4" />
          Upload File
          <input type="file" hidden onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="bg-white border rounded-lg divide-y">
        {files.length === 0 && (
          <p className="p-4 text-sm text-gray-500">
            No files uploaded for this project.
          </p>
        )}

        {files.map((f) => (
          <div
            key={f.id}
            className="flex justify-between items-center p-4"
          >
            <div>
              <p className="text-sm font-medium">{f.file_name}</p>
              <p className="text-xs text-gray-500">
                Uploaded • {(f.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <div className="flex gap-3">
              <a
                href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
                target="_blank"
                className="text-indigo-600 flex gap-1 text-sm"
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
  )
}
