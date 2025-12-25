"use client";
import { useState } from "react";

import {
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  FolderOpen,
  Megaphone,
  Plus,
  UserPlus,
} from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import InviteMemberModal from "../../components/modals/InviteMemberModal";
import CreateProjectModal from "../../components/modals/createProjectModal";

export default function OverviewPage() {
  const { user } = useAuth();
  const [inviteOpen, setInviteOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);

  /* -----------------------------
     DUMMY DATA (replace via API)
  ------------------------------*/
  const stats = {
    members: 1,
    projects: 0,
    tasks: 0,
    docs: 0,
    files: 0,
    announcements: 0,
  };

  const recentActivity = [];

  const isFirstTime = stats.members === 1 && stats.projects === 0;

  /* -----------------------------
     FIRST TIME VIEW
  ------------------------------*/
  if (isFirstTime) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome to {user?.organizationName || "your workspace"} 👋
        </h1>
        <p className="text-gray-600 mt-1">Let’s get your workspace ready.</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Checklist */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-medium text-gray-900 mb-4">Getting Started</h2>

            <ul className="space-y-3 text-sm text-gray-700">
              <li>✅ Workspace created</li>
              <li>⬜ Invite team members</li>
              <li>⬜ Create your first project</li>
              <li>⬜ Assign tasks</li>
              <li>⬜ Post an announcement</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-gray-100 rounded-xl p-6">
            <h2 className="font-medium text-gray-900 mb-4">Quick Actions</h2>

            <div className="space-y-3">
              <button
                onClick={() => setInviteOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                <UserPlus className="w-4 h-4" />
                Invite Team Members
              </button>

              <button
                onClick={() => setProjectOpen(true)}
                className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border hover:bg-gray-50"
              >
                <Plus className="w-4 h-4" />
                Create Project
              </button>
            </div>
          </div>
        </div>

        <InviteMemberModal
          open={inviteOpen}
          onClose={() => setInviteOpen(false)}
        />

        <CreateProjectModal
          open={projectOpen}
          onClose={() => setProjectOpen(false)}
        />
      </div>
    );
  }

  /* -----------------------------
     NORMAL OVERVIEW
  ------------------------------*/
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Overview</h1>
        <p className="text-gray-600 text-sm">Workspace health & activity</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Users} label="Members" value={stats.members} />
        <StatCard icon={FolderKanban} label="Projects" value={stats.projects} />
        <StatCard icon={CheckSquare} label="Tasks" value={stats.tasks} />
        <StatCard icon={FileText} label="Docs" value={stats.docs} />
        <StatCard icon={FolderOpen} label="Files" value={stats.files} />
        <StatCard
          icon={Megaphone}
          label="Announcements"
          value={stats.announcements}
        />
      </div>

      {/* Activity */}
      <div className="bg-white border border-gray-100 rounded-xl">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-medium text-gray-900">Recent Activity</h2>
        </div>

        <div className="p-6">
          {recentActivity.length === 0 ? (
            <p className="text-sm text-gray-500">No activity yet.</p>
          ) : (
            <ul>{/* activity items */}</ul>
          )}
        </div>
      </div>
    </div>
  );
}

/* -----------------------------
   Small Reusable Card
------------------------------*/
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
      <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
        <Icon className="w-5 h-5 text-indigo-600" />
      </div>
      <div>
        <div className="text-lg font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
}
