


// 'use client'
// import { useState, useEffect } from 'react'
// import TasksHeader from "./header"
// import TaskList from './taskList'
// import TaskBoard from './taskBoard'
// import TaskCalendar from './taskCalender'
// import CreateTaskModal from './createTaskModal'

// export default function TasksPage() {
//   const [view, setView] = useState('list') // 'list', 'board', 'calendar'
//   const [tasks, setTasks] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [showCreateModal, setShowCreateModal] = useState(false)
//   const [filters, setFilters] = useState({
//     status: '',
//     assigneeId: '',
//     search: ''
//   })

//   const fetchTasks = async () => {
//     try {
//       setLoading(true)
//       const token = localStorage.getItem('auth_token');

//         console.log("Fetching user data with token:", token);
        
//         if (!token) {
          
//           const storedUser = localStorage.getItem('user');
//           if (storedUser) {
//             setUser(JSON.parse(storedUser));
//           }
//           setLoading(false);
//           return;
//         }

//       const queryParams = new URLSearchParams()
//       if (filters.status) queryParams.append('status', filters.status)
//       if (filters.assigneeId) queryParams.append('assigneeId', filters.assigneeId)
//       if (filters.search) queryParams.append('search', filters.search)

//       const response = await fetch(`http://localhost:4000/tasks?${queryParams}`, {
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': 'application/json'
//           },
//         credentials: 'include'
//       })
      
//       if (response.ok) {
//         const data = await response.json()
//         setTasks(data.tasks || [])
//       }
//     } catch (error) {
//       console.error('Error fetching tasks:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchTasks()
//   }, [filters])

//   const handleCreateTask = async (taskData) => {
//     try {
//        const token = localStorage.getItem('auth_token');

//         console.log("Fetching user data with token:", token);
        
//         if (!token) {
//           // Try to get user from localStorage as fallback
//           const storedUser = localStorage.getItem('user');
//           if (storedUser) {
//             setUser(JSON.parse(storedUser));
//           }
//           setLoading(false);
//           return;
//         }
//       const response = await fetch('http://localhost:4000/tasks', {
//         method: 'POST',
//         headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         credentials: 'include',
//         body: JSON.stringify(taskData)
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setTasks([data.task, ...tasks])
//         setShowCreateModal(false)
//         return { success: true }
//       } else {
//         const errorData = await response.json()
//         return { success: false, error: errorData.message }
//       }
//     } catch (error) {
//       console.error('Error creating task:', error)
//       return { success: false, error: 'Failed to create task' }
//     }
//   }

//   const handleUpdateTask = async (taskId, updates) => {
//     try {
//        const token = localStorage.getItem('auth_token');

//         console.log("Fetching user data with token:", token);
        
//         if (!token) {
//           // Try to get user from localStorage as fallback
//           const storedUser = localStorage.getItem('user');
//           if (storedUser) {
//             setUser(JSON.parse(storedUser));
//           }
//           setLoading(false);
//           return;
//         }
//       const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
//         method: 'PATCH',
//        headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         credentials: 'include',
//         body: JSON.stringify(updates)
//       })

//       if (response.ok) {
//         const data = await response.json()
//         setTasks(tasks.map(task => 
//           task.id === taskId ? data.task : task
//         ))
//         return { success: true }
//       } else {
//         const errorData = await response.json()
//         return { success: false, error: errorData.message }
//       }
//     } catch (error) {
//       console.error('Error updating task:', error)
//       return { success: false, error: 'Failed to update task' }
//     }
//   }

//   const handleDeleteTask = async (taskId) => {
//     try {
//         const token = localStorage.getItem('auth_token');
//       const response = await fetch(`http://localhost:4000/tasks/${taskId}`, {
//          headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           },
//         method: 'DELETE',
//         credentials: 'include'
//       })

//       if (response.ok) {
//         setTasks(tasks.filter(task => task.id !== taskId))
//         return { success: true }
//       } else {
//         const errorData = await response.json()
//         return { success: false, error: errorData.message }
//       }
//     } catch (error) {
//       console.error('Error deleting task:', error)
//       return { success: false, error: 'Failed to delete task' }
//     }
//   }

//   return (
//     <div className="flex flex-col gap-6">
//       <TasksHeader 
//         onViewChange={setView}
//         onFilterChange={setFilters}
//         onCreateClick={() => setShowCreateModal(true)}
//       />
      
//       {loading ? (
//         <div className="flex-1 bg-white p-6 flex items-center justify-center">
//           <div className="text-gray-500">Loading tasks...</div>
//         </div>
//       ) : view === 'list' ? (
//         <TaskList 
//           tasks={tasks}
//           onUpdateTask={handleUpdateTask}
//           onDeleteTask={handleDeleteTask}
//           filters={filters}
//         />
//       ) : view === 'board' ? (
//         <TaskBoard 
//           tasks={tasks}
//           onUpdateTask={handleUpdateTask}
//         />
//       ) : (
//         <TaskCalendar tasks={tasks} />
//       )}

//       {showCreateModal && (
//         <CreateTaskModal
//           onSubmit={handleCreateTask}
//           onClose={() => setShowCreateModal(false)}
//         />
//       )}
//     </div>
//   )
// }










'use client'
import { useState, useEffect } from 'react'
import TasksHeader from "./header"
import TaskList from './taskList'
import TaskBoard from './taskBoard'
import TaskCalendar from './taskCalender'
import CreateTaskModal from './createTaskModal'
import { useTasks } from '@/lib/hooks/useTasks' 
import { useAuth } from '@/lib/hooks/useAuth' 
import EditTaskModal from './editTaskModal'


export default function TasksPage() {
  const [view, setView] = useState('list') // 'list', 'board', 'calendar'
  const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingTask, setEditingTask] = useState(null) 
  const [filters, setFilters] = useState({
    status: '',
    assigneeId: '',
    search: ''
  })
  
  // Use Redux hooks
  const { tasks, loading, getTasks, createNewTask, updateExistingTask, deleteExistingTask } = useTasks()
  const { user } = useAuth()

  // console.log("Taskss:", tasks);

  // Fetch tasks when filters change
  useEffect(() => {
    getTasks(filters)
  }, [filters, getTasks])

  const handleCreateTask = async (taskData) => {
    const result = await createNewTask(taskData)
    if (result.success) {
      setShowCreateModal(false)
    }
    return result
  }

  const handleUpdateTask = async (taskId, updates) => {
    return await updateExistingTask(taskId, updates)
  }

  const handleDeleteTask = async (taskId) => {
    return await deleteExistingTask(taskId)
  }

  return (
    <div className="flex flex-col gap-6">
      <TasksHeader 
        onViewChange={setView}
        onFilterChange={setFilters}
        onCreateClick={() => setShowCreateModal(true)}
      />
      
      {loading ? (
        <div className="flex-1 bg-white p-6 flex items-center justify-center">
          <div className="text-gray-500">Loading tasks...</div>
        </div>
      ) : view === 'list' ? (
        <TaskList 
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          onDeleteTask={handleDeleteTask}
           onEditTask={setEditingTask} 
          filters={filters}
          userId={user?.id}
          role={user?.role}
        />
      ) : view === 'board' ? (
        <TaskBoard 
          tasks={tasks}
          onUpdateTask={handleUpdateTask}
          userId={user?.id}
          role={user?.role}
        />
      ) : (
        <TaskCalendar tasks={tasks} />
      )}

      {showCreateModal && (
        <CreateTaskModal
          onSubmit={handleCreateTask}
          onClose={() => setShowCreateModal(false)}
        />
      )}

       {editingTask && (
        <EditTaskModal
          task={editingTask}
          onSubmit={handleUpdateTask}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  )
}