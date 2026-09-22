"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Player {
  id: string;
  full_name: string;
  player_code: string;
  phone: string;
  status: string;
  cricket_category: string;
  batch_name?: string;
}

export default function PlayersPage() {
  const router = useRouter();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const authToken = localStorage.getItem("auth_token");
    if (!authToken) {
      router.push("/login");
      return;
    }
    fetchPlayers();
  }, [router]);

  const fetchPlayers = async () => {
    try {
      const academyId = localStorage.getItem("academy_id");
      const res = await fetch(`/api/players?academy_id=${academyId}`);
      if (!res.ok) throw new Error("Failed to fetch players");
      const data = await res.json();
      setPlayers(data.players || []);
    } catch (err) {
      console.error("Failed to load players", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  const filteredPlayers = players.filter((p) => {
    const matchesSearch =
      p.full_name.toLowerCase().includes(search.toLowerCase()) ||
      p.player_code.toLowerCase().includes(search.toLowerCase()) ||
      p.phone.includes(search);
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-white shadow border-b">
        <div className="container py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">GEN NEX OS - Players</h1>
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
          <a href="/players" className="font-medium text-blue-600 border-b-2 border-blue-600 pb-3">
            Players
          </a>
        </div>
      </nav>

      <main className="container py-8">
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search by name, code, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />

          <div className="flex gap-2">
            {["all", "active", "pending_approval", "pending_payment", "registered"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded font-medium ${
                  statusFilter === status ? "bg-blue-600 text-white" : "bg-white text-gray-900"
                }`}
              >
                {status.replace(/_/g, " ").toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="card">
          {loading ? (
            <p className="text-gray-600">Loading players...</p>
          ) : filteredPlayers.length === 0 ? (
            <p className="text-gray-600">No players found</p>
          ) : (
            <div className="overflow-x-auto">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Category</th>
                    <th>Batch</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPlayers.map((player) => (
                    <tr key={player.id}>
                      <td className="font-medium">{player.full_name}</td>
                      <td>{player.player_code}</td>
                      <td>{player.cricket_category}</td>
                      <td>{player.batch_name || "-"}</td>
                      <td>{player.phone}</td>
                      <td>
                        <span
                          className={`badge ${
                            player.status === "active"
                              ? "badge-success"
                              : player.status === "pending_approval"
                              ? "badge-warning"
                              : player.status === "pending_payment"
                              ? "badge-warning"
                              : "badge-info"
                          }`}
                        >
                          {player.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => router.push(`/player/${player.id}`)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
