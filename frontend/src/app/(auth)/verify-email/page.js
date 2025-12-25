"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const token = searchParams.get("token");
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link");
      return;
    }

    const runVerification = async () => {
      const result = await verifyEmail(token);

      if (result.success) {
        setStatus("success");
        setMessage(
          result.message || "Your email has been successfully verified!"
        );

        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setStatus("error");
        setMessage(result.error || "Verification failed");
      }
    };

    runVerification();
  }, [token, router, verifyEmail]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">

        <div className="flex justify-center mb-6">
          {status === "verifying" ? (
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          ) : status === "success" ? (
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === "verifying"
            ? "Verifying Email"
            : status === "success"
            ? "Email Verified"
            : "Verification Failed"}
        </h1>

        <p className="text-gray-600 mb-8">
          {message}
        </p>

        {status === "success" && (
          <p className="text-sm text-gray-500 mb-6">
            You will be redirected to login page shortly...
          </p>
        )}

        {status === "error" && (
          <div className="space-y-4">
            <button
              onClick={() => router.push("/auth/login")}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium text-sm transition-all"
            >
              Go to Login
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full py-3 px-4 border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-xl font-medium text-sm transition-all"
            >
              Return to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
