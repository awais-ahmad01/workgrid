'use client';

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {useDocs} from "@/lib/hooks/useDocs";
import { useProjects } from "@/lib/hooks/useProjects";

export default function DocsPage() {
  // const { projectId } = useParams();
  const {activeProject} = useProjects();

  const projectId = activeProject?.id;

  console.log("projectId in DocsPage:", projectId);
  const router = useRouter();
  const { docs, getDocs, createNewDoc } = useDocs();

  useEffect(() => {
    getDocs(projectId);
  }, [projectId]);

  const handleCreate = async () => {
    const res = await createNewDoc({
      projectId: projectId,
      title: "Untitled document",
      content: { type: "doc", content: [] },
    });

    router.push(`/docs/${res.payload.id}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Docs</h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-black text-white rounded"
        >
          + New Doc
        </button>
      </div>

      <div className="space-y-2">
        {docs?.map((doc) => (
          <div
            key={doc.id}
            onClick={() =>
              router.push(`/projects/docs/${doc.id}`)
            }
            className="p-4 border rounded cursor-pointer hover:bg-gray-50"
          >
            <div className="font-medium">{doc.title}</div>
            <div className="text-xs text-gray-500">
              Last updated {new Date(doc.updated_at).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
