// import { useDispatch, useSelector } from 'react-redux'
// import { fetchProjects, createProject } from '../features/projects/projectsSlice';

// export function useProjects() {
//   const dispatch = useDispatch();
//   const { list, loading } = useSelector((s) => s.projects)

//   return {
//     projects: list,
//     loading,
//     fetchProjects: () => dispatch(fetchProjects()),
//     createProject: (data) => dispatch(createProject(data))
//   }
// }


import { useDispatch, useSelector } from 'react-redux'
import * as actions from '../features/projects/projectsSlice'
import { setActiveProject } from '../features/projects/projectsSlice'

export function useProjects() {
  const dispatch = useDispatch()
  const state = useSelector(s => s.projects)

  const activeProject =
    state.list.find(p => p.id === state.activeProjectId) || null

  return {
    ...state,
    activeProject,
    setActiveProject: (id) => dispatch(setActiveProject(id)),
    fetchProjects: () => dispatch(actions.fetchProjects()),
    createProject: (d) => dispatch(actions.createProject(d)),
    updateProject: (d) => dispatch(actions.updateProject(d)),
    deleteProject: (id) => dispatch(actions.deleteProject(id)),
    fetchProjectMembers: (id) => dispatch(actions.fetchProjectMembers(id)),
    addProjectMembers: (d) => dispatch(actions.addProjectMembers(d)),
    removeProjectMember: (d) => dispatch(actions.removeProjectMember(d))
  }
}
