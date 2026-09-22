"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("approvals");
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("user_role");

    if (!authToken || userRole !== "owner") {
      router.push("/login");
      return;
    }

    fetchApprovals();
  }, [router]);

  const fetchApprovals = async () => {
    try {
      const academyId = localStorage.getItem("academy_id");
      const res = await fetch(`/api/admin/approvals?academy_id=${academyId}`);
      if (!res.ok) throw new Error("Failed to fetch approvals");
      const data = await res.json();
      setApprovals(data.pending_approvals || []);
    } catch (err) {
      console.error("Failed to load approvals", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (playerId: string) => {
    try {
      const res = await fetch(`/api/admin/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId, status: "approved" }),
      });
      if (!res.ok) throw new Error("Failed to approve");
      fetchApprovals();
    } catch (err) {
      console.error("Approval failed", err);
    }
  };

  const handleReject = async (playerId: string) => {
    try {
      const res = await fetch(`/api/admin/approvals`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ player_id: playerId, status: "rejected" }),
      });
      if (!res.ok) throw new Error("Failed to reject");
      fetchApprovals();
    } catch (err) {
      console.error("Rejection failed", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GEN NEX OS - Admin</h1>
          <button onClick={handleLogout} className="btn btn-secondary">
            Logout
          </button>
        </div>
      </header>

      <nav className="bg-white border-b">
        <div className="container py-3 flex gap-6">
          <a href="/dashboard" className="text-gray-600 hover:text-gray-900">
            Dashboard
          </a>
          <a href="/admin" className="font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
            Admin
          </a>
        </div>
      </nav>

      <main className="container py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("approvals")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "approvals" ? "bg-blue-600 text-white" : "bg-white text-gray-900"
            }`}
          >
            Pending Approvals ({approvals.length})
          </button>
          <button
            onClick={() => setActiveTab("coaches")}
            className={`px-4 py-2 rounded font-medium ${
              activeTab === "coaches" ? "bg-blue-600 text-white" : "bg-white text-gray-900"
            }`}
          >
            Coaches
          </button>
        </div>

        {activeTab === "approvals" && (
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Pending Player Approvals</h2>
            {loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : approvals.length === 0 ? (
              <p className="text-gray-600">No pending approvals</p>
            ) : (
              <div className="overflow-x-auto">
                <table>
                  <thead>
                    <tr>
                      <th>Player Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {approvals.map((approval: any) => (
                      <tr key={approval.id}>
                        <td>{approval.full_name}</td>
                        <td>{approval.email || "-"}</td>
                        <td>{approval.phone}</td>
                        <td>
                          <span className="badge badge-warning">Pending</span>
                        </td>
                        <td className="space-x-2">
                          <button
                            onClick={() => handleApprove(approval.id)}
                            className="btn btn-primary text-xs py-1 px-3"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(approval.id)}
                            className="btn btn-danger text-xs py-1 px-3"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "coaches" && (
          <div className="card">
            <h2 className="text-lg font-bold mb-4">Coach Management</h2>
            <p className="text-gray-600">Coach management coming in Phase 2</p>
          </div>
        )}
      </main>
    </div>
  );
}
