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
import { useRouter } from "next/navigation";
import { useDocs } from "@/lib/hooks/useDocs";
import { useProjects } from "@/lib/hooks/useProjects";
import { useAuth } from "@/lib/hooks/useAuth";
import { FileText, Clock, Loader2 } from "lucide-react";
import DocsHeader from "./header";

export default function DocsPage() {
  const { activeProject } = useProjects();
  const projectId = activeProject?.id;
  const { user } = useAuth();

  const router = useRouter();
  const { list: docs, loading, getDocs, createNewDoc } = useDocs();
  const [searchQuery, setSearchQuery] = useState("");
  const [creating, setCreating] = useState(false);

  // Check if user can create docs (Interns cannot)
  const canCreateDoc = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD', 'SENIOR_INTERN'].includes(user?.role);

  useEffect(() => {
    if (projectId) {
      getDocs(projectId);
    }
  }, [projectId, getDocs]);

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

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading documents...</span>
          </div>
        </div>
      );
    }

    if (filteredDocs.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>Create Document</span>
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Updated
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocs.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-md">
                          {doc.title || "Untitled Document"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      <span>Updated {formatDate(doc.updated_at)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      onClick={() => router.push(`/docs/${doc.id}`)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <span>Open</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <DocsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateClick={handleCreate}
        creating={creating}
        canCreate={!!projectId && canCreateDoc}
      />

      <div className="px-6 md:px-10 lg:px-12 pb-8 space-y-4">
        <p className="text-sm text-gray-600">
          Create and manage your project documentation
        </p>
        {renderContent()}
      </div>
    </div>
  );
}
