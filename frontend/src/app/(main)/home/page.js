'use client'
import HomeHeader from "./header"
export default function HomePage() {
    
  return (
    <div className="flex flex-col gap-6">
      <HomeHeader />
     
      <div className="flex-1 bg-white p-6 text-gray-500">
        This is the placeholder for the My Work module.
      </div>
    </div>
  )
}
