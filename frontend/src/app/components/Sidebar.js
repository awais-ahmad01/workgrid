// 'use client'
// import { useState } from 'react'
// import { usePathname } from 'next/navigation'
// import { useRole } from './RoleProvider'
// import {
//   Home,
//   CheckSquare,
//   FolderKanban,
//   FileText,
//   FolderOpen,
//   Megaphone,
//   BarChart3,
//   Menu,
//   X,
//   ChevronLeft
// } from 'lucide-react'

// // Icon mapping
// const MODULE_ICONS = {
//   'MY_WORK': Home,
//   'TASKS': CheckSquare,
//   'PROJECTS': FolderKanban,
//   'DOCS': FileText,
//   'FILES': FolderOpen,
//   'ANNOUNCEMENTS': Megaphone,
//   'OVERVIEW': BarChart3
// }

// const MODULE_PATHS = {
//   'MY_WORK': '/home',
//   'TASKS': '/tasks',
//   'PROJECTS': '/projects',
//   'DOCS': '/docs',
//   'FILES': '/files',
//   'ANNOUNCEMENTS': '/announcements',
//   'OVERVIEW': '/overview'
// }

// const MODULE_LABELS = {
//   'MY_WORK': 'My Work',
//   'TASKS': 'Tasks',
//   'PROJECTS': 'Projects',
//   'DOCS': 'Docs',
//   'FILES': 'Files',
//   'ANNOUNCEMENTS': 'Announcements',
//   'OVERVIEW': 'Overview'
// }

// export default function Sidebar() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [isCollapsed, setIsCollapsed] = useState(false)
//   const { user, modules } = useRole();
//   console.log("user:", user);
//   console.log("modules:", modules);
//   const pathname = usePathname()

//   const formatRoleName = (role) => {
//     return role.replace('ROLE_', '').toLowerCase().replace('_', ' ')
//   }

//   const SidebarContent = () => (
//     <>
//       {/* Header */}
//       <div className={`px-5 py-6 border-b border-gray-100 ${isCollapsed ? 'px-3' : ''}`}>
//         <div className="flex items-center justify-between">
//           <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center w-full' : ''}`}>
//             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
//               <span className="text-white text-sm font-bold">W</span>
//             </div>
//             {!isCollapsed && (
//               <span className="text-lg font-semibold text-gray-900">WorkGrid</span>
//             )}
//           </div>

//           {/* Desktop collapse button */}
//           <button
//             onClick={() => setIsCollapsed(!isCollapsed)}
//             className="hidden lg:flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors"
//           >
//             <ChevronLeft className={`w-4 h-4 text-gray-500 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
//           </button>

//           {/* Mobile close button */}
//           <button
//             onClick={() => setIsOpen(false)}
//             className="lg:hidden flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
//           >
//             <X className="w-5 h-5 text-gray-500" />
//           </button>
//         </div>

//         {!isCollapsed && user && (
//           <div className="mt-4 px-3 py-2 bg-gray-50 rounded-lg">
//             <div className="text-xs font-medium text-gray-900">{user.name}</div>
//             <div className="text-xs text-gray-500 mt-0.5">
//               {formatRoleName(user.role)}
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 px-3 py-4 overflow-y-auto">
//         <div className="space-y-1">
//           {modules.map(module => {
//             const isActive = pathname === MODULE_PATHS[module]
//             const Icon = MODULE_ICONS[module]

//             return (
//               <a
//                 key={module}
//                 href={MODULE_PATHS[module]}
//                 className={`
//                   group flex items-center gap-3 px-3 py-2.5 rounded-lg
//                   transition-all duration-200 ease-in-out
//                   ${isActive
//                     ? 'bg-indigo-50 text-indigo-600'
//                     : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
//                   }
//                   ${isCollapsed ? 'justify-center' : ''}
//                 `}
//                 title={isCollapsed ? MODULE_LABELS[module] : ''}
//               >
//                 <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-600'}`} />
//                 {!isCollapsed && (
//                   <span className="text-sm font-medium flex-1">{MODULE_LABELS[module]}</span>
//                 )}
//                 {!isCollapsed && isActive && (
//                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
//                 )}
//               </a>
//             )
//           })}
//         </div>
//       </nav>

//       {/* Footer */}
//       {!isCollapsed && (
//         <div className="px-5 py-4 border-t border-gray-100">
//           <div className="text-xs text-gray-400">
//             © 2024 WorkGrid
//           </div>
//         </div>
//       )}
//     </>
//   )

//   return (
//     <>
//       {/* Mobile Menu Button */}
//       <button
//         onClick={() => setIsOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
//       >
//         <Menu className="w-5 h-5 text-gray-700" />
//       </button>

//       {/* Mobile Overlay */}
//       {isOpen && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
//           onClick={() => setIsOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <aside className={`
//         ${isCollapsed ? 'w-20' : 'w-72'}
//         fixed lg:sticky top-0
//         bg-white border-r border-gray-100
//         flex flex-col  h-full
//         transition-all duration-300 ease-in-out
//         ${isOpen ? 'translate-x-0' : '-translate-x-full'}
//         lg:translate-x-0
//         z-50 lg:z-0
//         shadow-xl lg:shadow-none
//       `}>
//         <SidebarContent />
//       </aside>
//     </>
//   )
// }





"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth"; // Changed to useAuth
import {
  Home,
  CheckSquare,
  FolderKanban,
  FileText,
  FolderOpen,
  Megaphone,
  BarChart3,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";

// Icon mapping
const MODULE_ICONS = {
  MY_WORK: Home,
  TASKS: CheckSquare,
  PROJECTS: FolderKanban,
  DOCS: FileText,
  FILES: FolderOpen,
  ANNOUNCEMENTS: Megaphone,
  OVERVIEW: BarChart3,
};

const MODULE_PATHS = {
  MY_WORK: "/home",
  TASKS: "/tasks",
  PROJECTS: "/projects",
  DOCS: "/docs",
  FILES: "/files",
  ANNOUNCEMENTS: "/announcements",
  OVERVIEW: "/overview",
};

const MODULE_LABELS = {
  MY_WORK: "My Work",
  TASKS: "Tasks",
  PROJECTS: "Projects",
  DOCS: "Docs",
  FILES: "Files",
  ANNOUNCEMENTS: "Announcements",
  OVERVIEW: "Overview",
};

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Changed from useRole to useAuth
  const { user, modules } = useAuth();

  console.log("user:", user);
  console.log("modules:", modules);

  const pathname = usePathname();

  const formatRoleName = (role) => {
    if (!role) return "";
    return role.replace("ROLE_", "").toLowerCase().replace(/_/g, " ");
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div
        className={`px-5 py-6 border-b border-gray-100 ${
          isCollapsed ? "px-3" : ""
        }`}
      >
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 ${
              isCollapsed ? "justify-center w-full" : ""
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">W</span>
            </div>
            {!isCollapsed && (
              <span className="text-lg font-semibold text-gray-900">
                {user?.organization?.name || "WorkGrid"}
              </span>
            )}
          </div>

          {/* Desktop collapse button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft
              className={`w-4 h-4 text-gray-500 transition-transform ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {!isCollapsed && user && (
          <div className="mt-4 px-3 py-2 bg-gray-50 rounded-lg">
            <div className="text-xs font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatRoleName(user.role)}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {Array.isArray(modules) &&
            modules.map((module) => {
              const isActive = pathname === MODULE_PATHS[module];
              const Icon = MODULE_ICONS[module];

              return (
                <Link
                  key={module}
                  href={MODULE_PATHS[module]}
                  className={`
                  group flex items-center gap-3 px-3 py-2.5 rounded-lg
                  transition-all duration-200 ease-in-out
                  ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
                  title={isCollapsed ? MODULE_LABELS[module] : ""}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 ${
                      isActive
                        ? "text-indigo-600"
                        : "text-gray-400 group-hover:text-gray-600"
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="text-sm font-medium flex-1">
                      {MODULE_LABELS[module]}
                    </span>
                  )}
                  {!isCollapsed && isActive && (
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>
                  )}
                </Link>
              );
            })}
        </div>
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="px-5 py-4 border-t border-gray-100">
          <div className="text-xs text-gray-400">© 2026 WorkGrid</div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg border border-gray-200"
      >
        <Menu className="w-5 h-5 text-gray-700" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
        ${isCollapsed ? "w-20" : "w-72"}
        fixed lg:sticky top-0 
        bg-white border-r border-gray-100
        flex flex-col  h-full
        transition-all duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
        z-50 lg:z-0
        shadow-xl lg:shadow-none
      `}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
