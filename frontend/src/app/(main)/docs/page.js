'use client'

import DocsHeader from "./header"

export default function DocsPage() {
  return (
    <div className="flex flex-col gap-6">
      <DocsHeader/>
      <div className="flex-1 bg-white p-6 text-gray-500">
        Placeholder for Docs module. List, Board, and Calendar views will go here.
      </div>
    </div>
  )
}
