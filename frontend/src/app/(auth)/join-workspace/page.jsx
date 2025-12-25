"use client";

import { useState } from "react";
import { Lock, User, Check, Loader2, UserPlus } from "lucide-react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useSearchParams } from "next/navigation";
import Input from "@/app/components/ui/Input";

export default function JoinWorkspaceForm() {
  const { signupViaInvite, loading, error } = useAuth();
  const params = useSearchParams();
  const token = params.get("token");

  const [form, setForm] = useState({ fullName: "", password: "" });
  const [success, setSuccess] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!token) return;

    const res = await signupViaInvite({ ...form, token });
    if (res.success) {
      setSuccess("Account created successfully. You can now login.");
    }
  };

  return (
    <form className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 mb-4">
            <UserPlus className="text-white w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Join Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Complete your account setup</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">
                {success}
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full pl-11 pr-4 py-3 border text-black border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password * (min. 6 characters)
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Create a secure password"
                  className="w-full pl-11 pr-4 py-3 text-black border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all disabled:opacity-50"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <button
              type="button"
              onClick={submit}
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Complete Signup
                </>
              )}
            </button>

            {/* Info Box */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mt-6">
              <p className="text-sm text-indigo-900 font-medium mb-1">
                You've been invited!
              </p>
              <p className="text-xs text-indigo-700">
                Complete the form above to join your team's workspace and start collaborating.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="text-center text-xs text-gray-400 mt-6">
          © 2024 WorkGrid. All rights reserved.
        </p>
      </div>
    </form>
  );
}
