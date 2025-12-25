// 'use client'
// import { useEffect, useState } from 'react'
// import { MoreVertical, Eye, Pencil, Trash } from 'lucide-react'
// import { useProjects } from '@/lib/hooks/useProjects'
// import DropdownMenu from '../../components/ui/DropdownMenu'
// import CreateProjectModal from '../../components/modals/createProjectModal'
// import EditProjectModal from '../../components/modals/EditProjectModal'
// import Link from 'next/link'

// export default function ProjectsPage() {
//   const { list: projects, fetchProjects, deleteProject } = useProjects()
//   const [createOpen, setCreateOpen] = useState(false)
//   const [editProject, setEditProject] = useState(null)

//   useEffect(() => {
//     fetchProjects()
//   }, [])

//   return (
//     <div className="min-h-screen">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl font-semibold">Projects</h1>
//         <button
//           onClick={() => setCreateOpen(true)}
//           className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
//         >
//           + Create Project
//         </button>
//       </div>

//       <table className="w-full bg-white border rounded-lg overflow-hidden">
//         <thead className="bg-gray-50 text-sm text-gray-500">
//           <tr>
//             <th className="p-3 text-left">Name</th>
//             <th>Description</th>
//             <th className="w-16"></th>
//           </tr>
//         </thead>
//         <tbody>
//           {projects.map(p => (
//             <tr key={p.id} className="border-t">
//               <td className="p-3 font-medium">{p.name}</td>
//               <td className="text-sm text-gray-600">{p.description}</td>
//               <td className="text-right pr-3">
//                 <DropdownMenu
//                   trigger={<MoreVertical className="w-4 h-4" />}
//                 >
//                   <Link
//                     href={`/projects/${p.id}`}
//                     className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
//                   >
//                     <Eye className="w-4 h-4" /> View
//                   </Link>

//                   <button
//                     onClick={() => setEditProject(p)}
//                     className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-50"
//                   >
//                     <Pencil className="w-4 h-4" /> Edit
//                   </button>

//                   <button
//                     onClick={() => deleteProject(p.id)}
//                     className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50"
//                   >
//                     <Trash className="w-4 h-4" /> Delete
//                   </button>
//                 </DropdownMenu>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <CreateProjectModal open={createOpen} onClose={() => setCreateOpen(false)} />
//       {editProject && (
//         <EditProjectModal
//           open={true}
//           project={editProject}
//           onClose={() => setEditProject(null)}
//         />
//       )}
//     </div>
//   )
// }



'use client'
import { useEffect, useState } from 'react'
import { MoreVertical, Eye, Pencil, Trash } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import DropdownMenu from '../../components/ui/DropdownMenu'
import CreateProjectModal from '../../components/modals/createProjectModal'
import EditProjectModal from '../../components/modals/EditProjectModal'
import Link from 'next/link'
import { UserPlus, X, Search, Users, CheckCircle, AlertCircle } from 'lucide-react';


export default function ProjectsPage() {
  const { list: projects, fetchProjects, deleteProject } = useProjects();
  console.log("Projects Page - projects list:", projects);
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-500 mt-1">Manage and organize your team projects</p>
            </div>
            <button
              onClick={() => setCreateOpen(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
            >
              <span className="text-lg">+</span>
              Create Project
            </button>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
            />
          </div>
        </div>

        {/* Projects Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col" style={{ minHeight: '500px' }}>
          {filteredProjects.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider w-20">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProjects.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{p.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-2">{p.description}</div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu trigger={<MoreVertical className="w-5 h-5 text-gray-500" />}>
                          <a
                            href={`/projects/${p.id}`}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left text-sm text-gray-700"
                          >
                            <Eye className="w-4 h-4" />
                            View Details
                          </a>
                          <button
                            onClick={() => setEditProject(p)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left text-sm text-gray-700"
                          >
                            <Pencil className="w-4 h-4" />
                            Edit Project
                          </button>
                          <button
                            onClick={() => handleDelete(p.id)}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-left text-sm text-red-600"
                          >
                            <Trash className="w-4 h-4" />
                            Delete
                          </button>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <CreateProjectModal 
        open={createOpen} 
        onClose={() => setCreateOpen(false)}
      />
      {editProject && (
        <EditProjectModal
          open={true}
          project={editProject}
          onClose={() => setEditProject(null)}
        />
      )}
    </div>
  );
}