'use client'
import AnnouncementsHeader from "./header"
export default function AnnouncementsPage() {
  return (
    <div className="flex flex-col gap-6">
      <AnnouncementsHeader />
      <div className="flex-1 bg-white p-6 text-gray-500">
        Placeholder for Announcements module. List, Board, and Calendar views will go here.
      </div>
    </div>
  )
}
