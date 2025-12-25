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
