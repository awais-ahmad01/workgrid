// 'use client';

// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import {useDocs} from "@/lib/hooks/useDocs";
// import { useProjects } from "@/lib/hooks/useProjects";

// export default function DocsPage() {
//   // const { projectId } = useParams();
//   const {activeProject} = useProjects();

//   const projectId = activeProject?.id;

//   console.log("projectId in DocsPage:", projectId);
//   const router = useRouter();
//   const { list: docs, getDocs, createNewDoc } = useDocs();

//   console.log("docs in DocsPage:", docs);

//   useEffect(() => {
//     getDocs(projectId);
//   }, [projectId]);

//   const handleCreate = async () => {
//     const res = await createNewDoc({
//       projectId: projectId,
//       title: "Untitled document",
//       content: { type: "doc", content: [] },
//     });

//     router.push(`/docs/${res.payload.id}`);
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       <div className="flex justify-between mb-6">
//         <h1 className="text-xl font-semibold">Docs</h1>
//         <button
//           onClick={handleCreate}
//           className="px-4 py-2 bg-black text-white rounded"
//         >
//           + New Doc
//         </button>
//       </div>

//       <div className="space-y-2">
//         {docs?.map((doc) => (
//           <div
//             key={doc.id}
//             onClick={() =>
//               router.push(`/docs/${doc.id}`)
//             }
//             className="p-4 border rounded cursor-pointer hover:bg-gray-50"
//           >
//             <div className="font-medium">{doc.title}</div>
//             <div className="text-xs text-gray-500">
//               Last updated {new Date(doc.updated_at).toLocaleString()}
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDocs } from "@/lib/hooks/useDocs";
import { useProjects } from "@/lib/hooks/useProjects";
import { FileText, Plus, Search, Clock, Loader2 } from "lucide-react";

export default function DocsPage() {
  const { activeProject } = useProjects();
  const projectId = activeProject?.id;

  const router = useRouter();
  const { list: docs, loading, getDocs, createNewDoc } = useDocs();
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (projectId) {
      getDocs(projectId);
    }
  }, [projectId]);

  const handleCreate = async () => {
    if (!projectId || creating) return;

    setCreating(true);
    try {
      const res = await createNewDoc({
        projectId: projectId,
        title: "Untitled Document",
        content: "",
      });

      if (res.payload?.id) {
        router.push(`/docs/${res.payload.id}`);
      }
    } catch (error) {
      console.error("Failed to create doc:", error);
    } finally {
      setCreating(false);
    }
  };

  const filteredDocs =
    docs?.filter((doc) =>
      doc.title?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  const getContentPreview = (content) => {
    if (!content) return "No content";
    if (typeof content === "string") {
      const trimmed = content.trim();
      if (!trimmed) return "Empty document";
      // Truncate to 100 characters and add ellipsis if longer
      return trimmed.length > 100 ? trimmed.slice(0, 100) + "..." : trimmed;
    }
    return "Empty document";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Documents</h1>
              <p className="mt-2 text-sm text-gray-600">
                Create and manage your project documentation
              </p>
            </div>
            <button
              onClick={handleCreate}
              disabled={creating || !projectId}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {creating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  New Document
                </>
              )}
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Documents Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No documents found" : "No documents yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? "Try adjusting your search query"
                : "Create your first document to get started"}
            </p>
            {!searchQuery && (
              <button
                onClick={handleCreate}
                disabled={creating || !projectId}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Create Document
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDocs.map((doc) => (
              <div
                key={doc.id}
                onClick={() => router.push(`/docs/${doc.id}`)}
                className="group bg-white rounded-lg border border-gray-200 p-6 cursor-pointer hover:shadow-lg hover:border-indigo-300 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                      <FileText className="w-5 h-5 text-indigo-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate mb-2 group-hover:text-indigo-600 transition-colors">
                      {doc.title || "Untitled Document"}
                    </h3>
                    {/* <p
                      className="text-sm text-gray-500 mb-3 overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.5rem",
                        maxHeight: "3rem",
                      }}
                    >
                      {getContentPreview(doc.content)}
                    </p> */}
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Updated {formatDate(doc.updated_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
