'use client'
import FilesHeader from "./header"
export default function FilesPage() {
  return (
    <div className="flex flex-col gap-6">
      <FilesHeader />
      <div className="flex-1 bg-white p-6 text-gray-500">
        Placeholder for Files module. List, Board, and Calendar views will go here.
      </div>
    </div>
  )
}
