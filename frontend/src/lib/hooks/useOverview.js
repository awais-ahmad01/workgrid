'use client'
import { useState } from "react";

const API = "http://localhost:4000";

export function useOverview() {
  const [loading, setLoading] = useState(false);

  const fetchSetupStatus = async () => {
    const res = await fetch(`${API}/api/overview/setup-status`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    return res.json();
  };

  const fetchProjectOverview = async (projectId) => {
    setLoading(true);
    const res = await fetch(`${API}/api/overview/projects/${projectId}/overview`, {
      credentials: "include",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });
    const data = await res.json();
    setLoading(false);
    return data;
  };

  return { fetchSetupStatus, fetchProjectOverview, loading };
}
