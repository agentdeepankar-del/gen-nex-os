"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PlayerDashboardPage() {
  const params = useParams();
  const playerId = params.id as string;

  const [player, setPlayer] = useState<any>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPlayerData();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const res = await fetch(`/api/players/${playerId}`);
      const data = await res.json();
      setPlayer(data.player);
      setFees(data.fees || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load player data");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  if (!player) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <p className="text-red-600">Player not found</p>
        </div>
      </div>
    );
  }

  const getPaymentStatusBadge = (status: string) => {
    const statusMap: any = {
      DUE: { color: "bg-red-100 text-red-800", label: "🔴 Due" },
      PAYMENT_DECLARED: {
        color: "bg-yellow-100 text-yellow-800",
        label: "🟡 Awaiting Approval",
      },
      RECONCILED: {
        color: "bg-green-100 text-green-800",
        label: "✅ Paid & Confirmed",
      },
      MISMATCH: {
        color: "bg-orange-100 text-orange-800",
        label: "⚠️ Mismatch",
      },
      OVERDUE: { color: "bg-red-100 text-red-800", label: "🔴 Overdue" },
    };
    return statusMap[status] || { color: "bg-gray-100 text-gray-800", label: status };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Welcome, {player.full_name}!</h1>
              <p className="text-gray-600">
                Player ID: {player.player_code}
              </p>
              <p className="text-gray-600">Batch: {player.cricket_category}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                  player.status === "ACTIVE"
                    ? "bg-green-100 text-green-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {player.status}
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Fees & Payments */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">💳 Your Fees & Payments</h2>

          {fees.length === 0 ? (
            <p className="text-gray-600">No outstanding fees</p>
          ) : (
            <div className="space-y-4">
              {fees.map((fee) => {
                const badge = getPaymentStatusBadge(fee.status);
                return (
                  <div
                    key={fee.id}
                    className="border rounded-lg p-6 hover:shadow-md transition"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Fee Type
                        </p>
                        <p className="text-lg font-bold">
                          {fee.billing_period === "JOINING"
                            ? "Joining Fee"
                            : `Monthly (${fee.billing_period})`}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Amount
                        </p>
                        <p className="text-lg font-bold text-blue-600">
                          ₹{fee.amount}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                          Status
                        </p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badge.color}`}>
                          {badge.label}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500">
                      Due: {new Date(fee.due_date).toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          )}

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-sm text-blue-900">
              ℹ️ Need to declare a payment? Click the button below to mark your
              payment.
            </p>
          </div>
        </div>

        {/* Player Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Personal Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">👤 Personal Info</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-600">Date of Birth</p>
                <p className="font-semibold">
                  {new Date(player.date_of_birth).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Gender</p>
                <p className="font-semibold">
                  {player.gender === "M"
                    ? "Male"
                    : player.gender === "F"
                    ? "Female"
                    : "Other"}
                </p>
              </div>
              <div>
                <p className="text-gray-600">Phone</p>
                <p className="font-semibold">{player.phone}</p>
              </div>
              <div>
                <p className="text-gray-600">Email</p>
                <p className="font-semibold">{player.email || "Not provided"}</p>
              </div>
            </div>
          </div>

          {/* Cricket Info */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">🏏 Cricket Profile</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-gray-600">Category</p>
                <p className="font-semibold">{player.cricket_category}</p>
              </div>
              <div>
                <p className="text-gray-600">Batting Style</p>
                <p className="font-semibold">{player.batting_style}</p>
              </div>
              <div>
                <p className="text-gray-600">Bowling Style</p>
                <p className="font-semibold">{player.bowling_style}</p>
              </div>
              <div>
                <p className="text-gray-600">Joined</p>
                <p className="font-semibold">
                  {new Date(player.joining_date).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Features */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-bold mb-4">🎯 Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded p-4">
              <p className="font-semibold mb-2">Goals & Targets</p>
              <p className="text-sm text-gray-600">
                View your assigned goals and track progress
              </p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="font-semibold mb-2">Drills & Practice</p>
              <p className="text-sm text-gray-600">
                Complete assigned drills and submit videos
              </p>
            </div>
            <div className="bg-white rounded p-4">
              <p className="font-semibold mb-2">Coach Feedback</p>
              <p className="text-sm text-gray-600">
                Receive feedback and performance reviews
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
