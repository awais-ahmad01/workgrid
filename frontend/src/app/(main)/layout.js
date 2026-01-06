// 'use client'

// import { useEffect, useMemo } from "react";
// import { useRouter } from "next/navigation";
// import Sidebar from "../components/Sidebar";
// import Topbar from "../components/Topbar";
// // import { useRole } from "../components/RoleProvider";
// import { useAuth } from "@/lib/hooks/useAuth";

// export default function RootLayout({ children }) {
//   const { user, loading } = useAuth();
//   console.log("userrrrrr:::::",user);
//   const router = useRouter();

//   // Check localStorage synchronously to determine if we have auth data
//   // This prevents showing loader during navigation
//   const hasAuthData = useMemo(() => {
//     if (typeof window === 'undefined') return false;
//     const storedUser = localStorage.getItem('user');
//     const token = localStorage.getItem('auth_token');
//     return !!(storedUser || token);
//   }, []); // Empty deps - only check once on mount

//   useEffect(() => {
//     if (!loading && !user) {
//       router.push("/login");
//     }
//   }, [loading, user, router]);

//   // Only show loader on true initial load:
//   // - No user in Redux state
//   // - No auth data in localStorage  
//   // - Currently loading
//   // This prevents showing loader during navigation when we already have auth data
//   // Even if loading is true (e.g., during session refresh), we don't show loader
//   // if we have auth data because the user will be restored from localStorage or session
//   const shouldShowLoader = !user && !hasAuthData && loading;

//   if (shouldShowLoader) {
//     return (
//       <div className="h-screen flex items-center justify-center bg-white">
//         <div className="text-gray-500">Preparing your workspace...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-screen flex flex-col overflow-hidden">
//       <Topbar />
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar />
//         <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
//       </div>
//     </div>
//   );
// }



'use client'

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
// import { useRole } from "../components/RoleProvider";
import { useAuth } from "@/lib/hooks/useAuth";

export default function RootLayout({ children }) {
  const { user, loading } = useAuth();
  console.log("userrrrrr:::::",user);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Preparing your workspace...</div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  );
}