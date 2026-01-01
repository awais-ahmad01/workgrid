// 'use client'
// import { useEffect, useState, useRef } from 'react'
// import { MoreVertical, Eye, Pencil, Trash, Search, CheckCircle2 } from 'lucide-react'
// import { useProjects } from '@/lib/hooks/useProjects'
// import CreateProjectModal from '../../components/modals/createProjectModal'
// import EditProjectModal from '../../components/modals/EditProjectModal'

// export default function ProjectsPage() {
//   const { list: projects, fetchProjects, deleteProject } = useProjects();
//   const [createOpen, setCreateOpen] = useState(false);
//   const [editProject, setEditProject] = useState(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [editingProjectId, setEditingProjectId] = useState(null);
//   const [dropdownPlacement, setDropdownPlacement] = useState('down');
//   const [deleteConfirmId, setDeleteConfirmId] = useState(null);
//   const dropdownRefs = useRef({});

//   useEffect(() => {
//     fetchProjects();
//   }, []);

//   const handleDelete = async (id) => {
//     const result = await deleteProject(id);
//     if (result) {
//       setDeleteConfirmId(null);
//     }
//   };

//   const filteredProjects = projects.filter(p => 
//     p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
//   );

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       Object.keys(dropdownRefs.current).forEach(projectId => {
//         const ref = dropdownRefs.current[projectId];
//         if (ref && !ref.contains(event.target)) {
//           if (editingProjectId === projectId) {
//             setEditingProjectId(null);
//           }
//         }
//       });
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, [editingProjectId]);

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Header */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mx-6">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
//             <p className="text-gray-500 mt-1">Manage and organize your team projects</p>
//           </div>
//           <button
//             onClick={() => setCreateOpen(true)}
//             className="flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium shadow-sm"
//           >
//             <span className="text-lg">+</span>
//             Create Project
//           </button>
//         </div>

//         {/* Search Bar */}
//         <div className="mt-6 relative">
//           <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search projects..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
//           />
//         </div>
//       </div>

//       {/* Projects Table */}
//       <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-6 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full relative">
//             <thead className="bg-gray-50 border-b border-gray-200">
//               <tr>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Project Name
//                 </th>
//                 <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {filteredProjects.map((project) => {
//                 const isEditing = editingProjectId === project.id;
                
//                 return (
//                   <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
//                     <td className="py-4 px-6">
//                       <div className="font-medium text-gray-900 text-sm leading-tight">
//                         {project.name}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6">
//                       <div className="text-sm text-gray-500 leading-relaxed line-clamp-2">
//                         {project.description || 'No description'}
//                       </div>
//                     </td>
//                     <td className="py-4 px-6 relative">
//                       <div className="flex items-center justify-center" ref={el => dropdownRefs.current[project.id] = el}>
//                         <button
//                           onClick={(e) => {
//                             const button = e.currentTarget;
//                             const rect = button.getBoundingClientRect();
//                             const viewportHeight = window.innerHeight;
                            
//                             const spaceBelow = viewportHeight - rect.bottom;
//                             const menuHeight = 150;
                            
//                             const shouldOpenUp = spaceBelow < menuHeight;
//                             setDropdownPlacement(shouldOpenUp ? 'up' : 'down');
//                             setEditingProjectId(isEditing ? null : project.id);
//                           }}
//                           className="p-2 rounded-lg transition-colors hover:bg-gray-100 group-hover:bg-gray-100"
//                         >
//                           <MoreVertical className="w-5 h-5 text-gray-500" />
//                         </button>
//                         {isEditing && (
//                           <div 
//                             className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[180px] z-50"
//                             style={{
//                               filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
//                               top: (() => {
//                                 const button = dropdownRefs.current[project.id]?.querySelector('button');
//                                 if (!button) return 'auto';
//                                 const rect = button.getBoundingClientRect();
//                                 const menuHeight = 150;
                                
//                                 if (dropdownPlacement === 'up') {
//                                   return `${rect.top - menuHeight - 8}px`;
//                                 }
//                                 return `${rect.bottom + 8}px`;
//                               })(),
//                               right: (() => {
//                                 const button = dropdownRefs.current[project.id]?.querySelector('button');
//                                 if (!button) return 'auto';
//                                 const rect = button.getBoundingClientRect();
//                                 return `${window.innerWidth - rect.right}px`;
//                               })()
//                             }}
//                           >
//                             <a
//                               href={`/projects/${project.id}`}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
//                             >
//                               <Eye className="w-4 h-4" />
//                               View Details
//                             </a>
//                             <button
//                               onClick={() => {
//                                 setEditProject(project);
//                                 setEditingProjectId(null);
//                               }}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
//                             >
//                               <Pencil className="w-4 h-4" />
//                               Edit Project
//                             </button>
//                             <button
//                               onClick={() => {
//                                 setDeleteConfirmId(project.id);
//                                 setEditingProjectId(null);
//                               }}
//                               className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
//                             >
//                               <Trash className="w-4 h-4" />
//                               Delete
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     </td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
          
//           {filteredProjects.length === 0 && (
//             <div className="flex items-center justify-center py-16">
//               <div className="text-center">
//                 <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
//                 <div className="text-lg font-medium text-gray-900 mb-1">No projects found</div>
//                 <div className="text-sm text-gray-500">
//                   {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       {deleteConfirmId && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4" onClick={() => setDeleteConfirmId(null)}>
//           <div className="bg-white rounded-xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
//             <div className="p-6">
//               <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
//                 <Trash className="w-6 h-6 text-red-600" />
//               </div>
//               <div className="text-xl font-semibold text-gray-900 mb-2">Delete Project</div>
//               <div className="text-sm text-gray-600 mb-6">
//                 Are you sure you want to delete this project? This action cannot be undone.
//               </div>
//               <div className="flex gap-3">
//                 <button
//                   onClick={() => setDeleteConfirmId(null)}
//                   className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium border border-gray-300"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={() => handleDelete(deleteConfirmId)}
//                   className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}

//       <CreateProjectModal 
//         open={createOpen} 
//         onClose={() => setCreateOpen(false)}
//       />
//       {editProject && (
//         <EditProjectModal
//           open={true}
//           project={editProject}
//           onClose={() => setEditProject(null)}
//         />
//       )}
//     </div>
//   );
// }




'use client'
import { useEffect, useState, useRef } from 'react'
import { MoreVertical, Eye, Pencil, Trash, Search, CheckCircle2, X, AlertTriangle } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import CreateProjectModal from '../../components/modals/createProjectModal'
import EditProjectModal from '../../components/modals/EditProjectModal'

export default function ProjectsPage() {
  const { list: projects, fetchProjects, deleteProject } = useProjects();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [dropdownPlacement, setDropdownPlacement] = useState('down');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const dropdownRefs = useRef({});

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    setDeleting(true);
    const result = await deleteProject(id);
    if (result) {
      setDeleteConfirmId(null);
    }
    setDeleting(false);
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description && p.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(projectId => {
        const ref = dropdownRefs.current[projectId];
        if (ref && !ref.contains(event.target)) {
          if (editingProjectId === projectId) {
            setEditingProjectId(null);
          }
        }
      });
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [editingProjectId]);

  const deletingProject = projects.find(p => p.id === deleteConfirmId);

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mx-6">
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mx-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full relative">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Project Name
                </th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Description
                </th>
                <th className="text-center py-4 px-6 text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProjects.map((project) => {
                const isEditing = editingProjectId === project.id;
                
                return (
                  <tr key={project.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 text-sm leading-tight">
                        {project.name}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        {project.description || 'No description'}
                      </div>
                    </td>
                    <td className="py-4 px-6 relative">
                      <div className="flex items-center justify-center" ref={el => dropdownRefs.current[project.id] = el}>
                        <button
                          onClick={(e) => {
                            const button = e.currentTarget;
                            const rect = button.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;
                            
                            const spaceBelow = viewportHeight - rect.bottom;
                            const menuHeight = 150;
                            
                            const shouldOpenUp = spaceBelow < menuHeight;
                            setDropdownPlacement(shouldOpenUp ? 'up' : 'down');
                            setEditingProjectId(isEditing ? null : project.id);
                          }}
                          className="p-2 rounded-lg transition-colors hover:bg-gray-100 group-hover:bg-gray-100"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                        {isEditing && (
                          <div 
                            className="fixed bg-white rounded-lg shadow-xl border border-gray-200 py-1.5 min-w-[180px] z-50"
                            style={{
                              filter: 'drop-shadow(0 10px 15px rgba(0, 0, 0, 0.1))',
                              top: (() => {
                                const button = dropdownRefs.current[project.id]?.querySelector('button');
                                if (!button) return 'auto';
                                const rect = button.getBoundingClientRect();
                                const menuHeight = 150;
                                
                                if (dropdownPlacement === 'up') {
                                  return `${rect.top - menuHeight - 8}px`;
                                }
                                return `${rect.bottom + 8}px`;
                              })(),
                              right: (() => {
                                const button = dropdownRefs.current[project.id]?.querySelector('button');
                                if (!button) return 'auto';
                                const rect = button.getBoundingClientRect();
                                return `${window.innerWidth - rect.right}px`;
                              })()
                            }}
                          >
                            <a
                              href={`/projects/${project.id}`}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                              View Details
                            </a>
                            <button
                              onClick={() => {
                                setEditProject(project);
                                setEditingProjectId(null);
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 w-full transition-colors"
                            >
                              <Pencil className="w-4 h-4" />
                              Edit Project
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmId(project.id);
                                setEditingProjectId(null);
                              }}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredProjects.length === 0 && (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <CheckCircle2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <div className="text-lg font-medium text-gray-900 mb-1">No projects found</div>
                <div className="text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms' : 'Create your first project to get started'}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal - Matching Create/Edit Modal Style */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Delete Project</h2>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700 mb-2">
                    Are you sure you want to delete this project? This action cannot be undone.
                  </p>
                  {deletingProject && (
                    <div className="bg-gray-50 p-3 rounded-lg mt-3">
                      <p className="text-sm font-medium text-gray-900">{deletingProject.name}</p>
                      {deletingProject.description && (
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{deletingProject.description}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  disabled={deleting}
                  className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  disabled={deleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {deleting ? 'Deleting...' : 'Delete Project'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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