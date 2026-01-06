'use client'
import { useState, useEffect } from 'react'
import TasksHeader from "./header"
import TaskList from './taskList'
import TaskBoard from './taskBoard'
import TaskCalendar from './taskCalender'
import CreateTaskModal from './createTaskModal'
import { useTasks } from '@/lib/hooks/useTasks' 
import { useAuth } from '@/lib/hooks/useAuth' 
import EditTaskModal from './editTaskModal';
import { useProjects } from '@/lib/hooks/useProjects'


export default function TasksPage() {
  const [view, setView] = useState('list') // 'list', 'board', 'calendar'
  const [showCreateModal, setShowCreateModal] = useState(false)
    const [editingTask, setEditingTask] = useState(null) 
  const [filters, setFilters] = useState({
    status: '',
    assigneeId: '',
    search: ''
  })

    const { activeProject, fetchProjectMembers } = useProjects()

  
  // Use Redux hooks
  const { tasks, loading, getTasks, createNewTask, updateExistingTask, deleteExistingTask } = useTasks()
  const { user } = useAuth()

  // console.log("Taskss:", tasks);

  // Fetch tasks when filters change
 useEffect(() => {
  getTasks(filters)
}, [filters, activeProject?.id])

 // Fetch project members when opening edit modal
 useEffect(() => {
    if (editingTask && activeProject?.id) {
      fetchProjectMembers(activeProject.id)
    }
  }, [editingTask, activeProject?.id, fetchProjectMembers])


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
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
            <span>Loading tasks...</span>
          </div>
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