"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface DashboardMetrics {
  active_players: number;
  expected_revenue: number;
  reconciled_revenue: number;
  outstanding: number;
  mismatches: number;
  today_attendance: number;
  pending_approvals: number;
  pending_payments: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("user_role");

    if (!authToken || userRole !== "owner") {
      router.push("/login");
      return;
    }

    fetchMetrics();
  }, [router]);

  const fetchMetrics = async () => {
    try {
      const authToken = localStorage.getItem("auth_token");
      const academyId = localStorage.getItem("academy_id");
      
      const res = await fetch(`/api/admin/revenue?academy_id=${academyId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      
      if (!res.ok) throw new Error("Failed to fetch metrics");
      const data = await res.json();
      setMetrics(data.metrics);
    } catch (err) {
      setError("Failed to load dashboard");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (loading) return <div className="container py-12"><p>Loading...</p></div>;

  if (error) {
    return (
      <div className="container py-12">
        <div className="card">
          <p className="text-red-600">{error}</p>
          <button onClick={handleLogout} className="btn btn-secondary mt-4">
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">GEN NEX OS</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b shadow-sm">
        <div className="container py-3 flex gap-6">
          <a href="/dashboard" className="font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
            Dashboard
          </a>
          <a href="/players" className="text-gray-600 hover:text-gray-900">
            Players
          </a>
          <a href="/admin" className="text-gray-600 hover:text-gray-900">
            Admin
          </a>
        </div>
      </nav>

      <main className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Active Players</p>
            <p className="text-3xl font-bold">{metrics?.active_players || 0}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Expected Revenue</p>
            <p className="text-3xl font-bold">₹{(metrics?.expected_revenue || 0).toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm mb-2">Reconciled</p>
            <p className="text-3xl font-bold text-green-600">₹{(metrics?.reconciled_revenue || 0).toLocaleString("en-IN")}</p>
          </div>

          <div className="card">
            <p className="text-gray-600 text-sm mb-2">At Risk</p>
            <p className="text-3xl font-bold text-red-600">₹{(((metrics?.outstanding || 0) + (metrics?.mismatches || 0))).toLocaleString("en-IN")}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Revenue Status</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Reconciliation Rate</span>
                  <span className="text-sm font-bold">{Math.round(((metrics?.reconciled_revenue || 0) / (metrics?.expected_revenue || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${Math.round(((metrics?.reconciled_revenue || 0) / (metrics?.expected_revenue || 1)) * 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-bold mb-4">Attention Required</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm">Pending Approvals</span>
                <span className="badge badge-warning">{metrics?.pending_approvals || 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b">
                <span className="text-sm">Pending Payments</span>
                <span className="badge badge-danger">{metrics?.pending_payments || 0}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Payment Mismatches</span>
                <span className="badge badge-danger">{metrics?.mismatches || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
