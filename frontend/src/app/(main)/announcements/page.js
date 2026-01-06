// 'use client'

// import { useEffect, useState } from 'react'
// import { Loader2, Pin, Trash2, Plus } from 'lucide-react'
// import { useAuth } from '@/lib/hooks/useAuth'
// import { useAnnouncements } from '@/lib/hooks/useAnnouncements'
// import { supabaseBrowser } from '@/lib/supabaseClient'
// import CreateAnnouncementModal from '../../components/modals/CreateAnnouncementModal'
// import { useProjects } from '@/lib/hooks/useProjects'

// export default function AnnouncementsPage() {
//   const { user } = useAuth()
//   const [open, setOpen] = useState(false)

//   const { list: projects } = useProjects()
//   const projectIds = projects.map(p => p.id)


//   const {
//     announcements,
//     loading,
//     fetchAnnouncements,
//     markRead,
//     togglePin,
//     removeAnnouncement,
//     addAnnouncementRealtime,
//   } = useAnnouncements()

// useEffect(() => {
//   if (projectIds.length) {
//     fetchAnnouncements(projectIds)
//   }
// }, [projectIds])


//   /* Realtime */
//   useEffect(() => {
//     if (!supabaseBrowser) return

//     const channel = supabaseBrowser
//       .channel('announcements')
//       .on(
//         'postgres_changes',
//         { event: 'INSERT', schema: 'public', table: 'announcements' },
//         (payload) => addAnnouncementRealtime(payload.new)
//       )
//       .subscribe()

//     return () => supabaseBrowser.removeChannel(channel)
//   }, [])

//   const canCreate =
//     ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role)

//   if (loading) {
//     return (
//       <div className="flex justify-center p-10">
//         <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
//       </div>
//     )
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6 space-y-4">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold">Announcements</h1>

//         {canCreate && (
//           <button
//             onClick={() => setOpen(true)}
//             className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
//           >
//             <Plus className="w-4 h-4" />
//             New Announcement
//           </button>
//         )}
//       </div>

//       {announcements.length === 0 && (
//         <p className="text-gray-500">No announcements yet.</p>
//       )}

//       {announcements.map(a => (
//         <div
//           key={a.id}
//           className={`border rounded-lg p-4 bg-white ${
//             !a.is_read ? 'border-indigo-400' : 'border-gray-200'
//           }`}
//           onClick={() => !a.is_read && markRead(a.id)}
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h3 className="font-semibold">{a.title}</h3>
//               <p className="text-xs text-gray-500">
//                 {a.category} • {new Date(a.created_at).toLocaleString()}
//               </p>
//             </div>

//             {canCreate && (
//               <div className="flex gap-2">
//                 <button onClick={() => togglePin(a.id, !a.is_pinned)}>
//                   <Pin
//                     className={`w-4 h-4 ${
//                       a.is_pinned ? 'text-indigo-600' : 'text-gray-400'
//                     }`}
//                   />
//                 </button>
//                 <button onClick={() => removeAnnouncement(a.id)}>
//                   <Trash2 className="w-4 h-4 text-red-500" />
//                 </button>
//               </div>
//             )}
//           </div>

//           <div
//             className="mt-2 text-sm text-gray-800 prose max-w-none"
//             dangerouslySetInnerHTML={{ __html: a.body }}
//           />
//         </div>
//       ))}

//       {open && <CreateAnnouncementModal onClose={() => setOpen(false)} />}
//     </div>
//   )
// }



'use client'

import { useEffect, useState, useMemo } from 'react'
import { Loader2, Pin, Trash2, Megaphone, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { useAnnouncements } from '@/lib/hooks/useAnnouncements'
import { supabaseBrowser } from '@/lib/supabaseClient'
import CreateAnnouncementModal from '../../components/modals/CreateAnnouncementModal'
import { useProjects } from '@/lib/hooks/useProjects'
import AnnouncementsHeader from './header'

export default function AnnouncementsPage() {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState('ALL')
  const [showFilters, setShowFilters] = useState(false)

  const { list: projects, loading: projectsLoading } = useProjects()
  
  // Memoize projectIds to prevent recreating array on every render
  const projectIds = useMemo(() => projects.map(p => p.id), [projects])

  const {
    announcements,
    loading,
    error,
    fetchAnnouncements,
    markRead,
    togglePin,
    removeAnnouncement,
    addAnnouncementRealtime,
  } = useAnnouncements()

  // Fetch announcements only once when projectIds are available
  useEffect(() => {
    if (projectIds.length > 0 && initialLoad) {
      fetchAnnouncements(projectIds)
      setInitialLoad(false)
    }
  }, [projectIds.length, initialLoad, fetchAnnouncements])

  /* Realtime */
  useEffect(() => {
    if (!supabaseBrowser) return

    const channel = supabaseBrowser
      .channel('announcements')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'announcements' },
        (payload) => addAnnouncementRealtime(payload.new)
      )
      .subscribe()

    return () => supabaseBrowser.removeChannel(channel)
  }, [addAnnouncementRealtime])

  const canCreate =
    ['SUPER_ADMIN', 'ADMIN', 'HR', 'TEAM_LEAD'].includes(user?.role)

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation()
    markRead(id)
  }

  const handleTogglePin = (e, id, isPinned) => {
    e.stopPropagation()
    togglePin(id, !isPinned)
  }

  const handleDeleteClick = (e, announcement) => {
    e.stopPropagation()
    setDeleteConfirm(announcement)
  }

  const handleDelete = async () => {
    if (!deleteConfirm || deleting) return
    
    setDeleting(true)
    try {
      await removeAnnouncement(deleteConfirm.id)
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete failed:', error)
    } finally {
      setDeleting(false)
    }
  }

  const getCategoryColor = (category) => {
    const colors = {
      GENERAL: 'bg-blue-100 text-blue-800',
      POLICY: 'bg-purple-100 text-purple-800',
      HR: 'bg-green-100 text-green-800',
      PROJECT_UPDATE: 'bg-orange-100 text-orange-800',
      REMINDER: 'bg-yellow-100 text-yellow-800',
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now - date) / (1000 * 60 * 60)

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${Math.floor(diffInHours)} hours ago`
    if (diffInHours < 48) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  }

  // Filter announcements by category and search
  const filteredAnnouncements = announcements.filter((a) => {
    const matchesCategory =
      category === 'ALL' ? true : a.category === category

    const matchesSearch =
      !searchQuery ||
      a.title?.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  // Separate pinned and unpinned announcements
  const pinnedAnnouncements = filteredAnnouncements.filter(a => a.is_pinned)
  const unpinnedAnnouncements = filteredAnnouncements.filter(a => !a.is_pinned)

  const renderContent = () => {
    // Loading state – independent, consistent with other sections
    if (loading || projectsLoading) {
      return (
        <div className="flex items-center justify-center py-10">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
            <span>Loading announcements...</span>
          </div>
        </div>
      )
    }

    if (error) {
      return (
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6 max-w-md">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Error Loading Announcements</h3>
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => {
              setInitialLoad(true)
              if (projectIds.length > 0) {
                fetchAnnouncements(projectIds)
                setInitialLoad(false)
              }
            }}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      )
    }

    if (filteredAnnouncements.length === 0) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Megaphone className="w-8 h-8 text-indigo-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchQuery || category !== 'ALL'
              ? 'No announcements match your filters'
              : 'No announcements yet'}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchQuery || category !== 'ALL'
              ? 'Try adjusting your search or category'
              : canCreate
                ? 'Create your first announcement to get started'
                : 'Check back later for updates'}
          </p>
          {canCreate && !searchQuery && category === 'ALL' && (
            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Create Announcement
            </button>
          )}
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Pin className="w-4 h-4 text-indigo-600" />
              Pinned Announcements
            </div>
            {pinnedAnnouncements.map(announcement => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                canCreate={canCreate}
                user={user}
                onMarkAsRead={handleMarkAsRead}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteClick}
                getCategoryColor={getCategoryColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}

        {/* Regular Announcements */}
        {unpinnedAnnouncements.length > 0 && (
          <div className="space-y-4">
            {pinnedAnnouncements.length > 0 && (
              <div className="text-sm font-medium text-gray-700">
                Recent Announcements
              </div>
            )}
            {unpinnedAnnouncements.map(announcement => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                canCreate={canCreate}
                user={user}
                onMarkAsRead={handleMarkAsRead}
                onTogglePin={handleTogglePin}
                onDelete={handleDeleteClick}
                getCategoryColor={getCategoryColor}
                formatDate={formatDate}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <AnnouncementsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters((prev) => !prev)}
        canCreate={canCreate}
        onCreateClick={() => setOpen(true)}
      />

      <div className="px-6 md:px-10 lg:px-12 pb-8">
        {renderContent()}
      </div>

      {/* Create Modal */}
      {open && <CreateAnnouncementModal onClose={() => setOpen(false)} />}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
          {/* Backdrop with blur effect */}
          <div 
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteConfirm(null)}
          />
          
          {/* Modal content */}
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative z-10 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Delete Announcement</h3>
            </div>
            
            <p className="text-gray-600 mb-2">
              Are you sure you want to delete this announcement?
            </p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded-lg mb-6 line-clamp-2">
              {deleteConfirm.title}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              This action cannot be undone.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                {deleting ? 'Deleting...' : 'Delete Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Announcement Card Component
function AnnouncementCard({ 
  announcement, 
  canCreate, 
  user,
  onMarkAsRead, 
  onTogglePin, 
  onDelete, 
  getCategoryColor, 
  formatDate 
}) {
  return (
    <div
      className={`group bg-white rounded-lg border-2 p-6 transition-all duration-200 hover:shadow-md ${
        announcement.is_read 
          ? 'border-gray-200' 
          : 'border-indigo-400 shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {announcement.is_pinned && (
              <Pin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {announcement.title}
            </h3>
            {!announcement.is_read && (
              <span className="flex-shrink-0 w-2 h-2 bg-indigo-600 rounded-full"></span>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCategoryColor(announcement.category)}`}>
              {announcement.category.replace('_', ' ')}
            </span>
            <span className="text-xs text-gray-500">
              {formatDate(announcement.created_at)}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mark as Read Button */}
          {!announcement.is_read && (
            <button
              onClick={(e) => onMarkAsRead(e, announcement.id)}
              className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Mark as read"
            >
              <CheckCircle className="w-5 h-5" />
            </button>
          )}

          {/* Admin Actions - Only creator or high roles can pin/delete */}
          {(() => {
            if (!user) return null;
            const canModify = canCreate || String(announcement.created_by) === String(user.id);
            return canModify && (
              <>
                <button
                  onClick={(e) => onTogglePin(e, announcement.id, announcement.is_pinned)}
                  className={`p-2 rounded-lg transition-colors ${
                    announcement.is_pinned
                      ? 'text-indigo-600 hover:bg-indigo-50'
                      : 'text-gray-400 hover:text-indigo-600 hover:bg-indigo-50'
                  }`}
                  title={announcement.is_pinned ? 'Unpin' : 'Pin'}
                >
                  <Pin className="w-5 h-5" />
                </button>
                <button
                  onClick={(e) => onDelete(e, announcement)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </>
            );
          })()}
        </div>
      </div>

      {/* Body Content */}
      <div
        className="text-sm text-gray-700 prose prose-sm max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: announcement.body }}
      />
    </div>
  )
}