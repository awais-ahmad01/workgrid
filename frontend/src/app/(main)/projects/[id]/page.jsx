// 'use client'
// import { useEffect, useState } from 'react'
// import { useParams } from 'next/navigation'
// import { UserPlus, Trash } from 'lucide-react'
// import { useProjects } from '@/lib/hooks/useProjects'
// import { useOrganization } from '@/lib/hooks/useOrganization'

// export default function ProjectDetails() {
//   const { id } = useParams()
//   const {
//     members,
//     fetchProjectMembers,
//     removeProjectMember,
//     addProjectMembers
//   } = useProjects()

//   const { members: orgMembers, fetchMembers } = useOrganization()
//   const [addOpen, setAddOpen] = useState(false)
//   const [selected, setSelected] = useState([])

//   useEffect(() => {
//     fetchProjectMembers(id)
//     fetchMembers()
//   }, [id])

//   const availableMembers = orgMembers.filter(
//     m => !members.some(pm => pm.id === m.id)
//   )

//   return (
//     <div className="max-w-3xl space-y-6">
//       <div className="flex justify-between items-center">
//         <h1 className="text-xl font-semibold">Project Members</h1>
//         <button
//           onClick={() => setAddOpen(true)}
//           className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white rounded-lg"
//         >
//           <UserPlus className="w-4 h-4" />
//           Add Members
//         </button>
//       </div>

//       <div className="space-y-3">
//         {members.map(m => (
//           <div
//             key={m.id}
//             className="flex justify-between items-center bg-white border rounded-lg p-4"
//           >
//             <div>
//               <p className="font-medium">{m.full_name}</p>
//               <span className="text-xs bg-gray-100 px-2 py-0.5 rounded">
//                 {m.role}
//               </span>
//             </div>

//             <button
//               onClick={() =>
//                 removeProjectMember({ projectId: id, memberId: m.id })
//               }
//               className="text-red-600 hover:bg-red-50 p-2 rounded"
//             >
//               <Trash className="w-4 h-4" />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Add Members Modal */}
//       {addOpen && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
//           <div className="bg-white w-full max-w-md p-6 rounded-xl space-y-4">
//             <h2 className="font-semibold">Add Members</h2>

//             <div className="max-h-40 overflow-y-auto space-y-2">
//               {availableMembers.map(m => (
//                 <label key={m.id} className="flex gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={selected.includes(m.id)}
//                     onChange={(e) =>
//                       setSelected(
//                         e.target.checked
//                           ? [...selected, m.id]
//                           : selected.filter(id => id !== m.id)
//                       )
//                     }
//                   />
//                   {m.full_name}
//                 </label>
//               ))}
//             </div>

//             <button
//               onClick={() => {
//                 addProjectMembers({ projectId: id, userIds: selected })
//                 setAddOpen(false)
//               }}
//               className="w-full py-2 bg-indigo-600 text-white rounded-lg"
//             >
//               Add Selected Members
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }





'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { UserPlus, Trash } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'
import { useAuth } from '@/lib/hooks/useAuth'
import { useOrganization } from '@/lib/hooks/useOrganization'
import {  X, Search, Users, CheckCircle, AlertCircle } from 'lucide-react';


export default function ProjectDetailsPage() {
 
 const { id } = useParams();
  const {
    list,
    members,
    fetchProjectMembers,
    removeProjectMember,
    addProjectMembers
  } = useProjects();
  const {user} = useAuth();

  const { members: orgMembers, fetchMembers } = useOrganization();
  const [addOpen, setAddOpen] = useState(false);
  const [selected, setSelected] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);



  
  useEffect(() => {
    fetchProjectMembers(id);
    fetchMembers();
  }, [id]);

  const availableMembers = orgMembers.filter(
    m => !members.some(pm => pm.id === m.id)
  );

  const handleRemoveMember = (memberId) => {
    if (confirm('Are you sure you want to remove this member?')) {
      removeProjectMember({ projectId: id, memberId: memberId });
    }
  };

  const handleAddMembers = () => {
    addProjectMembers({ projectId: id, userIds: selected });
    setSelected([]);
    setAddOpen(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">Members added successfully!</span>
          </div>
        )}

        {/* Project Header */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl font-bold">{members?.[0]?.project_name?.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{members?.[0]?.project_name}</h1>
              <p className="text-gray-600 leading-relaxed">{members?.[0]?.project_description}</p>
            </div>
          </div>
        </div>

        {/* Members Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  Team Members
                </h2>
                <p className="text-sm text-gray-500 mt-1">{members?.length - 1} members in this project</p>
              </div>
              <button
                onClick={() => setAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                Add Members
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="grid gap-4">
              {members.map(m => (
                user.id !== m.id && (
                    <div
                  key={m.id}
                  className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-xl p-5 hover:border-indigo-300 transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-lg">
                        {m.full_name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{m.full_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
                          {m.role}
                        </span>
                        {m.email && (
                          <span className="text-xs text-gray-500">{m.email}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemoveMember(m.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:bg-red-50 p-2.5 rounded-lg"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Members Modal */}
      {addOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold text-xl text-gray-900">Add Team Members</h2>
                  <p className="text-sm text-gray-500 mt-1">Select members to add to this project</p>
                </div>
                <button 
                  onClick={() => setAddOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {availableMembers.length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600">No available members to add</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableMembers.map(m => (
                    <label
                      key={m.id}
                      className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                    >
                      <input
                        type="checkbox"
                        checked={selected.includes(m.id)}
                        onChange={(e) =>
                          setSelected(
                            e.target.checked
                              ? [...selected, m.id]
                              : selected.filter(id => id !== m.id)
                          )
                        }
                        className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{m.full_name}</p>
                        <p className="text-sm text-gray-500">{m.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
              <button
                onClick={handleAddMembers}
                disabled={selected.length === 0}
                className="w-full py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add {selected.length > 0 ? `${selected.length} ` : ''}Selected Member{selected.length !== 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}