'use client'

import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  listAnnouncements,
  createAnnouncement,
  markAnnouncementRead,
  togglePinAnnouncement,
  deleteAnnouncement,
  addAnnouncementRealtime,
} from '../features/announcements/announcementsSlice'

export function useAnnouncements() {
  const dispatch = useAppDispatch()

    const state = useAppSelector((state) => state)
console.log("REDUX STATE:", state)

  const { list, loading, error } = useAppSelector(s => s.announcements)

  

  return {
    announcements: list,
    loading,
    error,

    fetchAnnouncements: (projectIds) =>
          dispatch(listAnnouncements({ projectIds })),
    createAnnouncement: (payload) => dispatch(createAnnouncement(payload)),
    markRead: (id) => dispatch(markAnnouncementRead(id)),
    togglePin: (id, pinned) =>
      dispatch(togglePinAnnouncement({ announcementId: id, pinned })),
    removeAnnouncement: (id) => dispatch(deleteAnnouncement(id)),

    addAnnouncementRealtime: (data) =>
      dispatch(addAnnouncementRealtime(data)),
  }
}
