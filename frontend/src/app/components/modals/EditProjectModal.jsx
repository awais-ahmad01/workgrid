// 'use client'
// import { useState } from 'react'
// import { X } from 'lucide-react'
// import { useProjects } from '@/lib/hooks/useProjects'

// export default function EditProjectModal({ open, onClose, project }) {
//   const { updateProject } = useProjects()
//   const [form, setForm] = useState({
//     name: project?.name || '',
//     description: project?.description || ''
//   })

//   if (!open) return null

//   const submit = async () => {
//     console.log("Submitting project update with data:", form)
//     await updateProject({
//       projectId: project.id,
//       data: form
//     })
//     onClose()
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//       <div className="bg-white w-full max-w-md rounded-xl p-6 space-y-4">
//         <div className="flex justify-between items-center">
//           <h2 className="font-semibold text-lg">Edit Project</h2>
//           <button onClick={onClose}><X /></button>
//         </div>

//         <input
//           className="w-full border rounded-lg px-3 py-2"
//           placeholder="Project name"
//           value={form.name}
//           onChange={e => setForm({ ...form, name: e.target.value })}
//         />

//         <textarea
//           className="w-full border rounded-lg px-3 py-2"
//           placeholder="Description"
//           value={form.description}
//           onChange={e => setForm({ ...form, description: e.target.value })}
//         />

//         <button
//           onClick={submit}
//           className="w-full py-2 bg-indigo-600 text-white rounded-lg"
//         >
//           Save Changes
//         </button>
//       </div>
//     </div>
//   )
// }



'use client'
import { useState } from 'react'
import { X } from 'lucide-react'
import { useProjects } from '@/lib/hooks/useProjects'


export default function EditProjectModal({ open, onClose, project }) {
  const { updateProject } = useProjects();
  const [form, setForm] = useState({
    name: project?.name || '',
    description: project?.description || ''
  });
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const submit = async () => {
    console.log("Submitting project update with data:", form);
    setLoading(true);
    try {
      await updateProject({
        projectId: project.id,
        data: form
      });
      onClose();
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div>
            <h2 className="font-semibold text-xl text-gray-900">Edit Project</h2>
            <p className="text-sm text-gray-500 mt-1">Update your project details</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name
            </label>
            <input
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none"
              placeholder="Enter project name"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none resize-none"
              placeholder="Enter project description"
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading || !form.name.trim()}
            className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}