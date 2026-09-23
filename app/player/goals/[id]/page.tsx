"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function PlayerGoalsPage() {
  const params = useParams();
  const playerId = params.id as string;

  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await fetch(`/api/goals?player_id=${playerId}`);
      const data = await res.json();
      setGoals(data.goals || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load goals");
      setLoading(false);
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 75) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">My Goals</h1>
          <p className="text-gray-600">Track your cricket development goals</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {goals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">No goals assigned yet</p>
            <p className="text-sm text-gray-500">
              Your coach will assign goals to help you improve
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{goal.title}</h3>
                    {goal.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {goal.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      goal.status === "ACTIVE"
                        ? "bg-blue-100 text-blue-800"
                        : goal.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {goal.status}
                  </span>
                </div>

                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
                      style={{ width: `${goal.progress}%` }}
                    ></div>
                  </div>
                </div>

                {goal.target && (
                  <p className="text-sm text-gray-600 mb-2">
                    <strong>Target:</strong> {goal.target}
                  </p>
                )}

                {goal.due_date && (
                  <p className="text-sm text-gray-600">
                    <strong>Due:</strong>{" "}
                    {new Date(goal.due_date).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
