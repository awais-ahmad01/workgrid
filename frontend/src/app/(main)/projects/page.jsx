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
import { MoreVertical, Eye, Pencil, Trash, CheckCircle2, X, AlertCircle, Loader2 } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import { useAuth } from '@/lib/hooks/useAuth'
import CreateProjectModal from '../../components/modals/createProjectModal'
import EditProjectModal from '../../components/modals/EditProjectModal'
import InviteMemberModal from '../../components/modals/InviteMemberModal'
import ProjectsHeader from './header'

export default function ProjectsPage() {
  const { list: projects, fetchProjects, deleteProject, loading } = useProjects();
  const { user } = useAuth();
  const [createOpen, setCreateOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [dropdownPlacement, setDropdownPlacement] = useState('down');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const dropdownRefs = useRef({});

  // Check if user can invite (typically admins, team leads, HR)
  const canInvite = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role);
  const canCreate = ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role);

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
      {/* Header - matches Tasks/Files/Docs styling */}
      <ProjectsHeader
        searchQuery={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateClick={() => setCreateOpen(true)}
        onInviteClick={() => setInviteOpen(true)}
        canCreate={canCreate}
        canInvite={canInvite}
      />

      {/* Content Area - matches Tasks/Files/Docs spacing */}
      <div className="px-6 md:px-10 lg:px-12 pb-8 space-y-4">
        {/* Projects Table - matches Docs/Files table styling */}
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Loading projects...</span>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No projects found" : "No projects yet"}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search query"
                : "Create your first project to get started"}
            </p>
            {!searchTerm && canCreate && (
              <button
                onClick={() => setCreateOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span>Create Project</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProjects.map((project) => {
                    const isEditing = editingProjectId === project.id;
                    
                    return (
                      <tr key={project.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {project.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-500 line-clamp-2 max-w-md">
                            {project.description || 'No description'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right relative">
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
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal - Matching Files section style */}
      {deleteConfirmId && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteConfirmId(null)}
          />
          
          {/* Modal content */}
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Project</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this project?
            </p>
            {deletingProject && (
              <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg mb-6 truncate">
                {deletingProject.name}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Team Members Modal */}
      <InviteMemberModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
      />

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