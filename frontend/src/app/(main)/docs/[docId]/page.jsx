// "use client";

// import { useEffect, useState, useRef, useCallback } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {
//   ArrowLeft,
//   Paperclip,
//   Trash2,
//   Download,
//   Loader2,
//   Check,
//   AlertCircle,
// } from "lucide-react";
// import { useDocs } from "@/lib/hooks/useDocs";
// import { useFiles } from "@/lib/hooks/useFiles";

// export default function DocEditorPage() {
//   const { docId } = useParams();
//   const router = useRouter();

//   const {
//     current,
//     uploading,
//     updating,
//     getDoc,
//     updateDocContent,
//     removeDoc,
//     removeDocFile,
//     clearCurrent,
//   } = useDocs();

//   const { getFilesByDoc, uploadFileToDoc, getDocFiles } = useFiles();

//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState("");
//   const [saveStatus, setSaveStatus] = useState("saved"); // 'saving', 'saved', 'error'
//   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
//   const [deleting, setDeleting] = useState(false);

//   const saveTimeoutRef = useRef(null);
//   const files = getFilesByDoc(docId);

//   /* ---------------- LOAD ---------------- */
//   useEffect(() => {
//     if (!docId) return;

//     // Clear previous state before loading new document
//     setTitle("");
//     setContent("");

//     getDoc(docId);

//     return () => {
//       clearCurrent();
//       setTitle("");
//       setContent("");
//     };
//   }, [docId]);

//   useEffect(() => {
//     if (!current?.project_id) return;
//     getDocFiles(docId, current?.project_id);
//   }, [current?.project_id]);

//   useEffect(() => {
//     if (current) {
//       setTitle(current.title || "");
//       // Handle content properly - convert object to string if needed
//       if (typeof current.content === "string") {
//         setContent(current.content);
//       } else if (current.content === null || current.content === undefined) {
//         setContent("");
//       } else {
//         // If it's an object, stringify it or set empty
//         setContent("");
//       }
//     }
//   }, [current]);

//   /* ---------------- AUTO-SAVE ---------------- */
//   const saveDocument = useCallback(
//     async (newTitle, newContent) => {
//       if (!current) return;

//       setSaveStatus("saving");

//       try {
//         await updateDocContent({
//           docId: current.id,
//           title: newTitle,
//           content: newContent,
//         });
//         setSaveStatus("saved");
//       } catch (error) {
//         console.error("Failed to save:", error);
//         setSaveStatus("error");
//       }
//     },
//     [current, updateDocContent]
//   );

//   const debouncedSave = useCallback(
//     (newTitle, newContent) => {
//       // Clear existing timeout
//       if (saveTimeoutRef.current) {
//         clearTimeout(saveTimeoutRef.current);
//       }

//       // Set new timeout
//       saveTimeoutRef.current = setTimeout(() => {
//         saveDocument(newTitle, newContent);
//       }, 1000); // Save after 1 second of inactivity
//     },
//     [saveDocument]
//   );

//   const handleTitleChange = (e) => {
//     const newTitle = e.target.value;
//     setTitle(newTitle);
//     debouncedSave(newTitle, content);
//   };

//   const handleContentChange = (e) => {
//     const newContent = e.target.value;
//     setContent(newContent);
//     debouncedSave(title, newContent);
//   };

//   /* ---------------- FILE UPLOAD ---------------- */
//   const handleUpload = (e) => {
//     const file = e.target.files?.[0];
//     if (!file || !current) return;

//     uploadFileToDoc(current?.project_id, current?.id, file);

//     e.target.value = "";
//   };

//   /* ---------------- FILE DELETE ---------------- */
//   const handleDeleteFile = (fileId) => {
//     removeDocFile({ docId: current.id, fileId });
//   };

//   /* ---------------- DOCUMENT DELETE ---------------- */
//   const handleDeleteDoc = async () => {
//     if (!current || deleting) return;

//     setDeleting(true);
//     try {
//       await removeDoc(current.id);
//       router.push("/docs");
//     } catch (error) {
//       console.error("Failed to delete document:", error);
//       setDeleting(false);
//     }
//   };

//   const handleBack = () => {
//     clearCurrent(); // Clear the current document state
//     setTitle(""); // Clear local title state
//     setContent(""); // Clear local content state
//     router.push("/docs");
//   };

//   if (!current) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Header */}
//         <div className="mb-6">
//           <div className="flex items-center justify-between mb-4">
//             <button
//               onClick={() => handleBack()}
//               className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Documents
//             </button>

//             <div className="flex items-center gap-4">
//               {/* Save Status Indicator */}
//               <div className="flex items-center gap-2 text-sm">
//                 {saveStatus === "saving" && (
//                   <>
//                     <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
//                     <span className="text-gray-500">Saving...</span>
//                   </>
//                 )}
//                 {saveStatus === "saved" && (
//                   <>
//                     <Check className="w-4 h-4 text-green-600" />
//                     <span className="text-green-600">Saved</span>
//                   </>
//                 )}
//                 {saveStatus === "error" && (
//                   <>
//                     <AlertCircle className="w-4 h-4 text-red-600" />
//                     <span className="text-red-600">Error saving</span>
//                   </>
//                 )}
//               </div>

//               {/* Delete Button */}
//               <button
//                 onClick={() => setShowDeleteConfirm(true)}
//                 className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//               >
//                 <Trash2 className="w-4 h-4" />
//                 Delete
//               </button>
//             </div>
//           </div>

//           {/* Title Input */}
//           <input
//             type="text"
//             value={title}
//             onChange={handleTitleChange}
//             placeholder="Untitled Document"
//             className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-300"
//           />
//         </div>

//         {/* Editor */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
//           <textarea
//             value={content}
//             onChange={handleContentChange}
//             placeholder="Start typing your document..."
//             className="w-full min-h-[500px] p-6 text-base text-gray-900 bg-transparent border-none focus:outline-none resize-none placeholder-gray-400"
//           />
//         </div>

//         {/* Attachments */}
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//           <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
//             <h3 className="font-semibold text-gray-900">Attachments</h3>

//             <label className="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
//               <Paperclip className="w-4 h-4" />
//               {uploading ? "Uploading..." : "Add File"}
//               <input
//                 type="file"
//                 hidden
//                 onChange={handleUpload}
//                 disabled={uploading}
//               />
//             </label>
//           </div>

//           <div className="p-6">
//             {files.length === 0 ? (
//               <div className="text-center py-8">
//                 <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <p className="text-sm text-gray-500">No files attached</p>
//               </div>
//             ) : (
//               <div className="space-y-3">
//                 {files.map((f) => (
//                   <div
//                     key={f.id}
//                     className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
//                   >
//                     <div className="flex items-center gap-3 flex-1 min-w-0">
//                       <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                         <Paperclip className="w-5 h-5 text-indigo-600" />
//                       </div>
//                       <div className="min-w-0">
//                         <div className="text-sm font-medium text-gray-900 truncate">
//                           {f.file_name}
//                         </div>
//                         <div className="text-xs text-gray-500">
//                           {(f.size / 1024).toFixed(1)} KB
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center gap-2 flex-shrink-0">
//                       <a
//                         href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
//                       >
//                         <Download className="w-4 h-4" />
//                         Open
//                       </a>

//                       <button
//                         onClick={() => handleDeleteFile(f.id)}
//                         className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {showDeleteConfirm && (
//         <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
//           {/* Backdrop with blur effect */}
//           <div
//             className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
//             onClick={() => setShowDeleteConfirm(false)}
//           />

//           {/* Modal content */}
//           <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
//                 <AlertCircle className="w-5 h-5 text-red-600" />
//               </div>
//               <h3 className="text-lg font-semibold text-gray-900">
//                 Delete Document
//               </h3>
//             </div>

//             <p className="text-gray-600 mb-6">
//               Are you sure you want to delete "{title || "Untitled Document"}"?
//               This action cannot be undone.
//             </p>

//             <div className="flex gap-3 justify-end">
//               <button
//                 onClick={() => setShowDeleteConfirm(false)}
//                 disabled={deleting}
//                 className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleDeleteDoc}
//                 disabled={deleting}
//                 className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
//               >
//                 {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
//                 {deleting ? "Deleting..." : "Delete Document"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Paperclip,
  Trash2,
  Download,
  Loader2,
  Check,
  AlertCircle,
} from "lucide-react";
import { useDocs } from "@/lib/hooks/useDocs";
import { useFiles } from "@/lib/hooks/useFiles";
import dynamic from "next/dynamic";

// Dynamically import ReactQuill to avoid SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";

export default function DocEditorPage() {
  const { docId } = useParams();
  const router = useRouter();

  const {
    current,
    uploading,
    updating,
    getDoc,
    updateDocContent,
    removeDoc,
    removeDocFile,
    clearCurrent,
  } = useDocs();

  const { getFilesByDoc, uploadFileToDoc, getDocFiles } = useFiles();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saveStatus, setSaveStatus] = useState("saved");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // NEW: Track if document is loaded

  const saveTimeoutRef = useRef(null);
  const quillRef = useRef(null);
  const files = getFilesByDoc(docId);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ align: [] }],
      ["blockquote", "code-block"],
      ["link"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "indent",
    "align",
    "blockquote",
    "code-block",
    "link",
  ];

  /* ---------------- LOAD ---------------- */
  useEffect(() => {
    if (!docId) return;

    // Mark as not loaded when switching documents
    setIsLoaded(false);
    
    // Clear previous state before loading new document
    setTitle("");
    setContent("");

    getDoc(docId);

    return () => {
      clearCurrent();
      setTitle("");
      setContent("");
      setIsLoaded(false);
    };
  }, [docId]);

  useEffect(() => {
    if (!current?.project_id) return;
    getDocFiles(docId, current?.project_id);
  }, [current?.project_id]);

  useEffect(() => {
    // Only update state if current document matches the docId
    if (current && current.id === docId) {
      setTitle(current.title || "");
      
      // Handle content properly - convert object to string if needed
      if (typeof current.content === "string") {
        setContent(current.content);
      } else if (current.content === null || current.content === undefined) {
        setContent("");
      } else {
        // If it's an object, stringify it or set empty
        setContent("");
      }
      
      // CRITICAL: Mark as loaded AFTER setting state
      // This prevents auto-save from triggering during initial load
      setIsLoaded(true);
    }
  }, [current, docId]);

  /* ---------------- AUTO-SAVE ---------------- */
  const saveDocument = useCallback(
    async (newTitle, newContent) => {
      if (!current) return;

      setSaveStatus("saving");

      try {
        await updateDocContent({
          docId: current.id,
          title: newTitle,
          content: newContent,
        });
        setSaveStatus("saved");
      } catch (error) {
        console.error("Failed to save:", error);
        setSaveStatus("error");
      }
    },
    [current, updateDocContent]
  );

  const debouncedSave = useCallback(
    (newTitle, newContent) => {
      // CRITICAL: Don't save if document hasn't been loaded yet
      // This prevents saving empty values during initial load
      if (!isLoaded) return;
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        saveDocument(newTitle, newContent);
      }, 1000);
    },
    [saveDocument, isLoaded]
  );

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    debouncedSave(newTitle, content);
  };

  const handleContentChange = (value) => {
    setContent(value);
    debouncedSave(title, value);
  };

  /* ---------------- FILE UPLOAD ---------------- */
  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !current) return;

    uploadFileToDoc(current?.project_id, current?.id, file);

    e.target.value = "";
  };

  /* ---------------- FILE DELETE ---------------- */
  const handleDeleteFile = (fileId) => {
    removeDocFile({ docId: current.id, fileId });
  };

  /* ---------------- DOCUMENT DELETE ---------------- */
  const handleDeleteDoc = async () => {
    if (!current || deleting) return;

    setDeleting(true);
    try {
      await removeDoc(current.id);
      router.push("/docs");
    } catch (error) {
      console.error("Failed to delete document:", error);
      setDeleting(false);
    }
  };

  const handleBack = () => {
    clearCurrent();
    setTitle("");
    setContent("");
    setIsLoaded(false);
    router.push("/docs");
  };

  if (!current) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <style jsx global>{`
        .quill-editor-container .ql-container {
          border: none;
          font-size: 16px;
          font-family: inherit;
        }
        
        .quill-editor-container .ql-editor {
          min-height: 500px;
          padding: 24px;
        }
        
        .quill-editor-container .ql-editor.ql-blank::before {
          color: #9ca3af;
          font-style: normal;
          left: 24px;
        }
        
        .quill-editor-container .ql-toolbar {
          border: none;
          border-bottom: 1px solid #e5e7eb;
          padding: 12px 24px;
          background-color: #fafafa;
          border-top-left-radius: 8px;
          border-top-right-radius: 8px;
        }
        
        .quill-editor-container .ql-toolbar button {
          width: 28px;
          height: 28px;
        }
        
        .quill-editor-container .ql-toolbar button:hover,
        .quill-editor-container .ql-toolbar button:focus,
        .quill-editor-container .ql-toolbar button.ql-active {
          color: #4f46e5;
        }
        
        .quill-editor-container .ql-toolbar .ql-stroke {
          stroke: #4b5563;
        }
        
        .quill-editor-container .ql-toolbar button:hover .ql-stroke,
        .quill-editor-container .ql-toolbar button:focus .ql-stroke,
        .quill-editor-container .ql-toolbar button.ql-active .ql-stroke {
          stroke: #4f46e5;
        }
        
        .quill-editor-container .ql-toolbar .ql-fill {
          fill: #4b5563;
        }
        
        .quill-editor-container .ql-toolbar button:hover .ql-fill,
        .quill-editor-container .ql-toolbar button:focus .ql-fill,
        .quill-editor-container .ql-toolbar button.ql-active .ql-fill {
          fill: #4f46e5;
        }
        
        .quill-editor-container .ql-toolbar .ql-picker-label {
          color: #4b5563;
        }
        
        .quill-editor-container .ql-toolbar .ql-picker-label:hover {
          color: #4f46e5;
        }
        
        .quill-editor-container .ql-editor h1 {
          font-size: 2em;
          font-weight: bold;
          margin-top: 0.67em;
          margin-bottom: 0.67em;
        }
        
        .quill-editor-container .ql-editor h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin-top: 0.83em;
          margin-bottom: 0.83em;
        }
        
        .quill-editor-container .ql-editor h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin-top: 1em;
          margin-bottom: 1em;
        }
      `}</style>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => handleBack()}
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Documents
            </button>

            <div className="flex items-center gap-4">
              {/* Save Status Indicator */}
              <div className="flex items-center gap-2 text-sm">
                {saveStatus === "saving" && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                    <span className="text-gray-500">Saving...</span>
                  </>
                )}
                {saveStatus === "saved" && (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Saved</span>
                  </>
                )}
                {saveStatus === "error" && (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span className="text-red-600">Error saving</span>
                  </>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="Untitled Document"
            className="w-full text-3xl font-bold text-gray-900 bg-transparent border-none focus:outline-none placeholder-gray-300"
          />
        </div>

        {/* Rich Text Editor */}
        <div className="bg-white rounded-lg shadow-sm border text-black border-gray-200 mb-6 quill-editor-container">
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={content}
            onChange={handleContentChange}
            modules={modules}
            formats={formats}
            placeholder="Start typing your document..."
          />
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Attachments</h3>

            <label className="inline-flex items-center gap-2 px-3 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg cursor-pointer transition-colors">
              <Paperclip className="w-4 h-4" />
              {uploading ? "Uploading..." : "Add File"}
              <input
                type="file"
                hidden
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>

          <div className="p-6">
            {files.length === 0 ? (
              <div className="text-center py-8">
                <Paperclip className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500">No files attached</p>
              </div>
            ) : (
              <div className="space-y-3">
                {files.map((f) => (
                  <div
                    key={f.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Paperclip className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {f.file_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {(f.size / 1024).toFixed(1)} KB
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={`https://ahxjpxkhkebnjreojakc.supabase.co/storage/v1/object/public/project-files/${f.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        Open
                      </a>

                      <button
                        onClick={() => handleDeleteFile(f.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          <div
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            onClick={() => setShowDeleteConfirm(false)}
          />

          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Document
              </h3>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{title || "Untitled Document"}"?
              This action cannot be undone.
            </p>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoc}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? "Deleting..." : "Delete Document"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}