'use client'

import Link from 'next/link'
import { Building2, Users, ShieldCheck, Workflow } from 'lucide-react'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      
      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 py-28 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          One Workspace to Manage <span className="text-indigo-600">Teams, Projects & Roles</span>
        </h1>

        <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600">
          Create a secure workspace for your company. Invite your team, assign roles,
          and manage projects — all from one place.
        </p>

        <div className="mt-10 flex justify-center gap-4">
          <Link
            href="/create-workspace"
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
          >
            Create a Workspace
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
          >
            Login to Workspace          </Link>
        </div>

        
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-gray-50 py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">
            Built for modern teams
          </h2>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card icon={<Building2 />} title="Company Owners">
              Create and control your entire workspace
            </Card>
            <Card icon={<Users />} title="Team Leads">
              Assign tasks and manage projects
            </Card>
            <Card icon={<ShieldCheck />} title="HR Teams">
              Control roles and access
            </Card>
            <Card icon={<Workflow />} title="Employees & Interns">
              Focus on work without distractions
            </Card>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-center">
            How it works
          </h2>

          <div className="mt-12 grid md:grid-cols-4 gap-6 text-center">
            <Step number="1" title="Create Workspace" />
            <Step number="2" title="Invite Your Team" />
            <Step number="3" title="Assign Roles" />
            <Step number="4" title="Manage Projects" />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-indigo-600 text-white py-24 text-center">
        <h2 className="text-3xl font-semibold">
          Get started in under 2 minutes
        </h2>
        <p className="mt-4 text-indigo-100">
          No credit card required. Secure & role-based from day one.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/create-workspace"
            className="px-6 py-3 rounded-xl bg-white text-indigo-600 font-medium hover:bg-gray-100"
          >
            Create Workspace
          </Link>
          <Link
            href="/login"
            className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10"
          >
            Login to Workspace
          </Link>
        </div>
      </section>
    </main>
  )
}

/* Reusable components */
function Card({ icon, title, children }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm text-center">
      <div className="flex justify-center text-indigo-600 mb-4">
        {icon}
      </div>
      <h3 className="font-medium text-lg">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{children}</p>
    </div>
  )
}

function Step({ number, title }) {
  return (
    <div className="p-6">
      <div className="w-10 h-10 mx-auto rounded-full bg-indigo-600 text-white flex items-center justify-center">
        {number}
      </div>
      <p className="mt-4 font-medium">{title}</p>
    </div>
  )
}
