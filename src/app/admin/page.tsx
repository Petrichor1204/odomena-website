"use client";

import { useEffect, useState } from "react";
import { AdminDashboard } from "@/components/AdminDashboard";
import { AdminLogin } from "@/components/AdminLogin";
import { Header } from "@/components/Header";

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((res) => res.json())
      .then((data) => setAuthenticated(data.authenticated))
      .catch(() => setAuthenticated(false));
  }, []);

  return (
    <>
      <Header />
      <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
        {authenticated === null ? (
          <p className="text-sm text-brown/60">Loading…</p>
        ) : authenticated ? (
          <AdminDashboard onLogout={() => setAuthenticated(false)} />
        ) : (
          <AdminLogin onSuccess={() => setAuthenticated(true)} />
        )}
      </main>
    </>
  );
}
