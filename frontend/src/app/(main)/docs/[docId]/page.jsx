// 'use client';

// import { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import { useDocs } from "@/hooks/useDocs";
// import {
//   docFileHandshake,
//   confirmDocFileUpload,
//   getDocFiles,
//   deleteDocFile,
// } from "@/lib/api/docFiles";

// import dynamic from "next/dynamic";

// const RichTextEditor = dynamic(
//   () => import("@/components/RichTextEditor"),
//   { ssr: false }
// );

// export default function DocEditorPage() {
//   const { docId } = useParams();
//   const { currentDoc, getDoc } = useDocs();

//   const [files, setFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   useEffect(() => {
//     getDoc(docId);
//   }, [docId]);

//   useEffect(() => {
//     if (currentDoc) {
//       loadFiles();
//     }
//   }, [currentDoc]);

//   async function loadFiles() {
//     const data = await getDocFiles(
//       currentDoc.project_id,
//       currentDoc.id
//     );
//     setFiles(data);
//   }

//   async function handleFileUpload(e) {
//     const file = e.target.files?.[0];
//     if (!file || !currentDoc) return;

//     setUploading(true);

//     // 1️⃣ handshake
//     const { url, path } = await docFileHandshake(
//       currentDoc.project_id,
//       currentDoc.id,
//       file.name
//     );

//     // 2️⃣ upload to signed URL
//     await fetch(url, {
//       method: "PUT",
//       body: file,
//       headers: {
//         "Content-Type": file.type,
//       },
//     });

//     // 3️⃣ confirm
//     await confirmDocFileUpload(
//       currentDoc.project_id,
//       currentDoc.id,
//       {
//         path,
//         fileName: file.name,
//         mimeType: file.type,
//         size: file.size,
//       }
//     );

//     await loadFiles();
//     setUploading(false);
//   }

//   async function handleDeleteFile(fileId) {
//     await deleteDocFile(fileId);
//     setFiles(files.filter((f) => f.id !== fileId));
//   }

//   if (!currentDoc) return null;

//   return (
//     <div className="p-6 max-w-4xl mx-auto space-y-6">
//       <h1 className="text-2xl font-semibold">
//         {currentDoc.title}
//       </h1>

//       {/* Editor */}
//       <RichTextEditor
//         docId={currentDoc.id}
//         initialContent={currentDoc.content}
//       />

//       {/* Attachments */}
//       <div>
//         <div className="flex items-center justify-between mb-2">
//           <h3 className="font-medium">Attachments</h3>
//           <label className="cursor-pointer text-sm text-blue-600">
//             {uploading ? "Uploading..." : "+ Add file"}
//             <input
//               type="file"
//               hidden
//               onChange={handleFileUpload}
//             />
//           </label>
//         </div>

//         <div className="space-y-2">
//           {files.map((file) => (
//             <div
//               key={file.id}
//               className="flex justify-between items-center border p-2 rounded"
//             >
//               <a
//                 href={file.public_url}
//                 target="_blank"
//                 className="text-sm underline"
//               >
//                 {file.file_name}
//               </a>

//               <button
//                 onClick={() => handleDeleteFile(file.id)}
//                 className="text-xs text-red-600"
//               >
//                 Delete
//               </button>
//             </div>
//           ))}

//           {!files.length && (
//             <div className="text-sm text-gray-500">
//               No files attached
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Paperclip, Trash2, Download } from 'lucide-react'
import { useDocs } from '@/lib/hooks/useDocs'
import { useFiles } from '@/lib/hooks/useFiles'


export default function DocEditorPage() {
  const { docId } = useParams()


  const router = useRouter()

  const {
    current,
    uploading,
    getDoc,
    removeDocFile,
  } = useDocs()
  console.log("current doc in DocEditorPage:", current);
  const { getFilesByDoc, uploadFileToDoc,getDocFiles, removeFile } = useFiles()

  const [content, setContent] = useState('')

  const files = getFilesByDoc(docId)

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (!docId) return
    getDoc(docId)
    
  }, [docId])

  useEffect(() => {
    if (!current?.project_id) return
    getDocFiles(docId, current?.project_id);
  }, [current?.project_id]);

  useEffect(() => {
    if (current?.content) {
      setContent(current.content)
    }
  }, [current])

  /* ---------------- FILE UPLOAD ---------------- */
  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file || !current) return

    console.log("handleUpload called with file:", file);

    uploadFileToDoc(
      current?.project_id,
      current?.id,
      file,
    )

    e.target.value = ''
  }

  /* ---------------- FILE DELETE ---------------- */
  const handleDeleteFile = (fileId) => {
    removeDocFile({ docId: current.id, fileId })
  }

  if (!current) return null

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-indigo-600"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <h1 className="text-2xl font-bold">{current.title}</h1>

      {/* Editor (plain for now) */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full min-h-[300px] border rounded-lg p-4 text-sm"
      />

      {/* Files */}
      <div className="bg-white border rounded-lg">
        <div className="flex justify-between items-center px-4 py-2 border-b">
          <h3 className="font-semibold text-sm">Attachments</h3>

          <label className="flex items-center gap-2 text-indigo-600 cursor-pointer text-sm">
            <Paperclip className="w-4 h-4" />
            {uploading ? 'Uploading...' : 'Upload'}
            <input
              type="file"
              hidden
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>

        <div className="p-4 space-y-2">
          {files.length === 0 && (
            <div className="text-sm text-gray-500">
              No files attached
            </div>
          )}

          {files.map((f) => (
            <div
              key={f.id}
              className="flex justify-between items-center border rounded px-3 py-2"
            >
              <div>
                <div className="text-sm">{f.file_name}</div>
                <div className="text-xs text-gray-500">
                  {(f.size / 1024).toFixed(1)} KB
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-600 text-sm flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  Open
                </a>

                <button
                  onClick={() => handleDeleteFile(f.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
