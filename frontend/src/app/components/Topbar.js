

// 'use client'
// import { useState, useRef, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { Search, ChevronDown, Settings, User, LogOut, Bell, Check } from 'lucide-react'
// import { useAuth } from '@/lib/hooks/useAuth'
// import { useNotifications } from '@/lib/hooks/useNotifications' // New hook
// import { supabaseBrowser } from '@/lib/supabaseClient'

// export default function Topbar() {
//     const [searchQuery, setSearchQuery] = useState('')
//     const [isDropdownOpen, setIsDropdownOpen] = useState(false)
//     const [isNotifOpen, setIsNotifOpen] = useState(false)
    
//     const dropdownRef = useRef(null)
//     const notifRef = useRef(null)
    
//     // Use Redux hooks
//     const { user, logout } = useAuth();
//     const { 
//         notifications, 
//         loading: loadingNotif, 
//         unreadCount, 
//         markAsRead, 
//         markAllAsRead,
//         addNewNotification,
//         refreshNotifications 
//     } = useNotifications();
    
//     const router = useRouter()

//     // Close dropdown when clicking outside
//     useEffect(() => {
//         function handleClickOutside(event) {
//             if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//                 setIsDropdownOpen(false)
//             }
//         }
//         document.addEventListener('mousedown', handleClickOutside)
//         return () => document.removeEventListener('mousedown', handleClickOutside)
//     }, [])

    // // Close notification dropdown when clicking outside
    // useEffect(() => {
    //     const handleClickOutsideNotif = (event) => {
    //         if (notifRef.current && !notifRef.current.contains(event.target)) {
    //             setIsNotifOpen(false)
    //         }
    //     }
    //     document.addEventListener('mousedown', handleClickOutsideNotif)
    //     return () => document.removeEventListener('mousedown', handleClickOutsideNotif)
    // }, [])

    // // Load notifications when dropdown opens
    // useEffect(() => {
    //     if (isNotifOpen) {
    //         refreshNotifications()
    //     }
    // }, [isNotifOpen, refreshNotifications])

    // // Handle marking a single notification as read
    // const handleMarkRead = async (id) => {
    //     await markAsRead(id)
    // }

    // // Handle marking all notifications as read
    // const handleMarkAll = async () => {
    //     await markAllAsRead()
    // }

    // // Handle opening a notification
    // const handleOpenNotification = async (n) => {
    //     if (!n.read_at) {
    //         await handleMarkRead(n.id)
    //     }
    //     const destTask = n.task_id || n.meta?.taskId
    //     if (destTask) {
    //         router.push(`/tasks/${destTask}`)
    //     }
    //     setIsNotifOpen(false)
    // }

    // // Realtime notifications subscription
    // useEffect(() => {
    //     if (!supabaseBrowser || !user?.id) return
        
    //     const channel = supabaseBrowser.channel(`notifications-${user.id}`)
    //         .on('postgres_changes', {
    //             event: 'INSERT',
    //             schema: 'public',
    //             table: 'task_notifications',
    //             filter: `user_id=eq.${user.id}`
    //         }, (payload) => {
    //             // Add new notification to Redux store
    //             addNewNotification(payload.new)
    //         })
    //         .subscribe()

    //     return () => {
    //         supabaseBrowser.removeChannel(channel)
    //     }
    // }, [user?.id, addNewNotification])

    // // Handle logout using Redux
    // const handleLogout = async () => {
    //     await logout()
    // }

    // const handleProfile = () => {
    //     console.log('Profile clicked')
    //     router.push('/profile')
    // }

    // const handleSettings = () => {
    //     console.log('Settings clicked')
    //     router.push('/settings')
    // }

//     // Don't render if no user
//     if (!user) return null

//     // Format role name for display
    // const formatRoleName = (role) => {
    //     return role.replace('ROLE_', '').toLowerCase().replace('_', ' ')
    // }

//     return (
//         <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 h-11">
//             {/* Left: Workspace Name */}
//             <div className="flex items-center min-w-[200px] ">
//                 <h1 className="text-sm font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-lg">
//                     {user?.organization?.name || 'Workspace'}

//                 </h1>
//             </div>

            // {/* Center: Search Bar */}
            // <div className="flex-1 max-w-sm mx-8">
            //     <div className="relative">
            //         <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            //         <input
            //             type="text"
            //             placeholder="Search tasks, projects, docs..."
            //             value={searchQuery}
            //             onChange={(e) => setSearchQuery(e.target.value)}
            //             className="w-full h-8 pl-10 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
            //         />
            //     </div>
            // </div>

            // {/* Right: Profile Dropdown and Notifications */}
            // <div className="flex items-center justify-end min-w-[200px] gap-2">
            //     {/* Notifications Dropdown */}
            //     <div className="relative" ref={notifRef}>
            //         <button
            //             onClick={() => setIsNotifOpen(!isNotifOpen)}
            //             className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            //             title="Notifications"
            //         >
            //             <Bell className="w-5 h-5 text-gray-600" />
            //             {unreadCount > 0 && (
            //                 <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
            //                     {unreadCount > 99 ? '99+' : unreadCount}
            //                 </span>
            //             )}
            //         </button>
                    
            //         {/* Notifications Dropdown Content */}
            //         {isNotifOpen && (
            //             <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
            //                 <div className="px-3 pb-2 flex items-center justify-between">
            //                     <span className="text-sm font-semibold text-gray-800">Notifications</span>
            //                     {unreadCount > 0 && (
            //                         <button
            //                             onClick={handleMarkAll}
            //                             className="text-xs text-indigo-600 hover:text-indigo-700"
            //                         >
            //                             Mark all as read
            //                         </button>
            //                     )}
            //                 </div>
            //                 <div className="max-h-96 overflow-auto divide-y divide-gray-100">
            //                     {loadingNotif && (
            //                         <div className="py-3 px-3 text-sm text-gray-500">Loading...</div>
            //                     )}
            //                     {!loadingNotif && notifications.length === 0 && (
            //                         <div className="py-3 px-3 text-sm text-gray-500">No notifications</div>
            //                     )}
            //                     {!loadingNotif && notifications.map(n => (
            //                         <button
            //                             key={n.id}
            //                             onClick={() => handleOpenNotification(n)}
            //                             className={`w-full text-left py-3 px-3 flex items-start gap-2 ${n.read_at ? 'bg-white' : 'bg-indigo-50/60 hover:bg-indigo-100'}`}
            //                         >
            //                             <div className="flex-1">
            //                                 <div className="text-sm text-gray-800">
            //                                     {n.type === 'MENTION' && `${n.meta?.author?.name || 'Someone'} mentioned you`}
            //                                     {n.type === 'COMMENT' && `${n.meta?.author?.name || 'Someone'} commented on a task`}
            //                                     {!['COMMENT','MENTION'].includes(n.type || '') && (n.type || 'Notification')}
            //                                 </div>
            //                                 {n.meta?.mentions && (
            //                                     <div className="text-xs text-gray-500">Mentions: {Array.isArray(n.meta.mentions) ? n.meta.mentions.join(', ') : ''}</div>
            //                                 )}
            //                                 {n.meta?.taskTitle && (
            //                                     <div className="text-xs text-gray-500 truncate">{n.meta.taskTitle}</div>
            //                                 )}
            //                                 <div className="text-xs text-gray-400 mt-1">
            //                                     {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
            //                                 </div>
            //                             </div>
            //                             {!n.read_at && (
            //                                 <div
            //                                     className="p-1 text-indigo-600 hover:text-indigo-800"
            //                                     title="Mark as read"
            //                                 >
            //                                     <Check className="w-4 h-4" />
            //                                 </div>
            //                             )}
            //                         </button>
            //                     ))}
            //                 </div>
            //             </div>
            //         )}
            //     </div>

            //     {/* Profile Dropdown */}
            //     <div className="relative" ref={dropdownRef}>
            //         <button
            //             onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            //             className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
            //         >
            //             {/* Avatar */}
            //             <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            //                 <span className="text-white text-xs font-semibold">
            //                     {user?.fullName?.charAt(0).toUpperCase()}
            //                 </span>
            //             </div>

            //             {/* Dropdown Arrow */}
            //             <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            //         </button>

            //         {/* Profile Dropdown Menu */}
            //         {isDropdownOpen && (
            //             <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
            //                 {/* User Info */}
            //                 <div className="px-4 py-3 border-b border-gray-100">
            //                     <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
            //                     <div className="text-xs text-gray-500 capitalize mt-0.5">
            //                         {formatRoleName(user.role)}
            //                     </div>
            //                 </div>

            //                 {/* Menu Items */}
            //                 <div className="py-1">
            //                     <button
            //                         onClick={handleProfile}
            //                         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            //                     >
            //                         <User className="w-4 h-4 text-gray-400" />
            //                         <span>Profile</span>
            //                     </button>

            //                     <button
            //                         onClick={handleSettings}
            //                         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            //                     >
            //                         <Settings className="w-4 h-4 text-gray-400" />
            //                         <span>Settings</span>
            //                     </button>

            //                     <div className="my-1 border-t border-gray-100"></div>

            //                     <button
            //                         onClick={handleLogout}
            //                         className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            //                     >
            //                         <LogOut className="w-4 h-4" />
            //                         <span>Logout</span>
            //                     </button>
            //                 </div>
            //             </div>
            //         )}
            //     </div>
            // </div>
//         </header>
//     )
// }




'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronDown, Settings, User, LogOut, Bell, Check, FolderKanban, Plus } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useNotifications } from '@/lib/hooks/useNotifications'
import { useProjects } from '@/lib/hooks/useProjects'
import { supabaseBrowser } from '@/lib/supabaseClient'

export default function Topbar() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [isProjectOpen, setIsProjectOpen] = useState(false)

  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const projectRef = useRef(null)

  const { user, logout } = useAuth()


  const canCreateProject = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);
  const canViewAllProjects = ['SUPER_ADMIN', 'ADMIN'].includes(user?.role);

  const {
    list: projects,
    activeProject,
    setActiveProject,
    fetchProjects
  } = useProjects()

  const {
    notifications,
    loading: loadingNotif,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNewNotification,
    refreshNotifications
  } = useNotifications()

  console.log("notifications:", notifications); 

  const router = useRouter()

  useEffect(() => {
    fetchProjects()
  }, [])

  // Close project dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (projectRef.current && !projectRef.current.contains(e.target)) {
        setIsProjectOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSwitchProject = (id) => {
    setActiveProject(id)
    setIsProjectOpen(false)
    router.push('/tasks') // project-scoped landing
  }



  
    // Close notification dropdown when clicking outside
    useEffect(() => {
        const handleClickOutsideNotif = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target)) {
                setIsNotifOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutsideNotif)
        return () => document.removeEventListener('mousedown', handleClickOutsideNotif)
    }, [])

    // Load notifications when dropdown opens
    useEffect(() => {
        if (isNotifOpen) {
            refreshNotifications()
        }
    }, [isNotifOpen, refreshNotifications])

    // Handle marking a single notification as read
    const handleMarkRead = async (id) => {
        await markAsRead(id)
    }

    // Handle marking all notifications as read
    const handleMarkAll = async () => {
        await markAllAsRead()
    }

    // Handle opening a notification
    const handleOpenNotification = async (n) => {
        if (!n.read_at) {
            await handleMarkRead(n.id)
        }
        const destTask = n.task_id || n.meta?.taskId
        if (destTask) {
            router.push(`/tasks/${destTask}`)
        }
        setIsNotifOpen(false)
    }

    // Realtime notifications subscription
    useEffect(() => {
        if (!supabaseBrowser || !user?.id) return
        
        const channel = supabaseBrowser.channel(`notifications-${user.id}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'task_notifications',
                filter: `user_id=eq.${user.id}`
            }, (payload) => {
                // Add new notification to Redux store
                addNewNotification(payload.new)
            })
            .subscribe()

        return () => {
            supabaseBrowser.removeChannel(channel)
        }
    }, [user?.id, addNewNotification])






const formatRoleName = (role) => {
        return role.replace('ROLE_', '').toLowerCase().replace('_', ' ')
    }

      // Handle logout using Redux
    const handleLogout = async () => {
        await logout()
    }

    const handleProfile = () => {
        console.log('Profile clicked')
        router.push('/profile')
    }

    const handleSettings = () => {
        console.log('Settings clicked')
        router.push('/settings')
    }



  if (!user) return null

  return (
    <header className="w-full sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-gray-100 flex items-center justify-between px-6 h-11">

      {/* LEFT: Workspace + Project */}
      <div className="flex items-center gap-2 min-w-[240px]">

        {/* Workspace */}
        <span className="text-sm font-semibold text-black bg-gray-100 px-2.5 py-1 rounded-lg">
          {user.organization?.name || 'Workspace'}
        </span>

        {/* Project Dropdown */}
        <div className="relative" ref={projectRef}>
          <button
            onClick={() => setIsProjectOpen(!isProjectOpen)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FolderKanban className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-medium text-gray-900">
              {activeProject?.name || 'Select project'}
            </span>
            <ChevronDown className={`w-3 h-3 transition-transform ${isProjectOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProjectOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">

              {/* Project List */}
              <div className="max-h-56 overflow-auto">
                {projects.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleSwitchProject(p.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-gray-50 ${
                      activeProject?.id === p.id ? 'bg-indigo-50 text-indigo-700' : ''
                    }`}
                  >
                    <span className="truncate text-black">{p.name}</span>
                    {activeProject?.id === p.id && <Check className="w-4 h-4" />}
                  </button>
                ))}
              </div>

              <div className="border-t border-gray-100 mt-2 pt-2">
                {canCreateProject && (
                  <button
                  onClick={() => router.push('/projects/new')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4" />
                  Create project
                </button>
                )}


                {canViewAllProjects && (
                  <button
                  onClick={() => router.push('/projects')}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-gray-50"
                >
                  <FolderKanban className="w-4 h-4" />
                  View all projects
                </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

       {/* Center: Search Bar */}
            <div className="flex-1 max-w-sm mx-8">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search tasks, projects, docs..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-8 pl-10 pr-4 rounded-2xl bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 transition-all"
                    />
                </div>
            </div>

            {/* Right: Profile Dropdown and Notifications */}
            <div className="flex items-center justify-end min-w-[200px] gap-2">
                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                    <button
                        onClick={() => setIsNotifOpen(!isNotifOpen)}
                        className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
                        title="Notifications"
                    >
                        <Bell className="w-5 h-5 text-gray-600" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                                {unreadCount > 99 ? '99+' : unreadCount}
                            </span>
                        )}
                    </button>
                    
                    {/* Notifications Dropdown Content */}
                    {isNotifOpen && (
                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                            <div className="px-3 pb-2 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-800">Notifications</span>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAll}
                                        className="text-xs text-indigo-600 hover:text-indigo-700"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>
                            <div className="max-h-96 overflow-auto divide-y divide-gray-100">
                                {loadingNotif && (
                                    <div className="py-3 px-3 text-sm text-gray-500">Loading...</div>
                                )}
                                {!loadingNotif && notifications.length === 0 && (
                                    <div className="py-3 px-3 text-sm text-gray-500">No notifications</div>
                                )}
                                {!loadingNotif && notifications.map(n => (
                                    <button
                                        key={n.id}
                                        onClick={() => handleOpenNotification(n)}
                                        className={`w-full text-left py-3 px-3 flex items-start gap-2 ${n.read_at ? 'bg-white' : 'bg-indigo-50/60 hover:bg-indigo-100'}`}
                                    >
                                        <div className="flex-1">
                                            <div className="text-sm text-gray-800">
                                                {n.type === 'MENTION' && `${n.meta?.author?.name || 'Someone'} mentioned you`}
                                                {n.type === 'COMMENT' && `${n.meta?.author?.name || 'Someone'} commented on a task`}
                                                {!['COMMENT','MENTION'].includes(n.type || '') && (n.type || 'Notification')}
                                            </div>
                                            {n.meta?.mentions && (
                                                <div className="text-xs text-gray-500">Mentions: {Array.isArray(n.meta.mentions) ? n.meta.mentions.join(', ') : ''}</div>
                                            )}
                                            {n.meta?.taskTitle && (
                                                <div className="text-xs text-gray-500 truncate">{n.meta.taskTitle}</div>
                                            )}
                                            <div className="text-xs text-gray-400 mt-1">
                                                {n.created_at ? new Date(n.created_at).toLocaleString() : ''}
                                            </div>
                                        </div>
                                        {!n.read_at && (
                                            <div
                                                className="p-1 text-indigo-600 hover:text-indigo-800"
                                                title="Mark as read"
                                            >
                                                <Check className="w-4 h-4" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                    <button
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors group"
                    >
                        {/* Avatar */}
                        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                            <span className="text-white text-xs font-semibold">
                                {user?.fullName?.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* Dropdown Arrow */}
                        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* User Info */}
                            <div className="px-4 py-3 border-b border-gray-100">
                                <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                                <div className="text-xs text-gray-500 capitalize mt-0.5">
                                    {formatRoleName(user.role)}
                                </div>
                            </div>

                            {/* Menu Items */}
                            <div className="py-1">
                                <button
                                    onClick={handleProfile}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User className="w-4 h-4 text-gray-400" />
                                    <span>Profile</span>
                                </button>

                                <button
                                    onClick={handleSettings}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <Settings className="w-4 h-4 text-gray-400" />
                                    <span>Settings</span>
                                </button>

                                <div className="my-1 border-t border-gray-100"></div>

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
    </header>
  )
}
