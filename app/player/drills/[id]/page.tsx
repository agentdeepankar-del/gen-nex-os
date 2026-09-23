"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PlayerDrillsPage() {
  const params = useParams();
  const router = useRouter();
  const playerId = params.id as string;

  const [drills, setDrills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDrills();
  }, []);

  const fetchDrills = async () => {
    try {
      const url = "/api/drills?player_id=" + playerId;
      const res = await fetch(url);
      const data = await res.json();
      setDrills(data.drills || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load drills");
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-blue-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Assigned Drills</h1>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        {drills.length === 0 ? (
          <div className="text-gray-600">No drills assigned yet</div>
        ) : (
          <div className="space-y-4">
            {drills.map((drill) => (
              <div key={drill.id} className="bg-white p-6 rounded shadow">
                <h3 className="text-xl font-bold mb-2">{drill.name}</h3>
                <p className="text-gray-600 mb-4">{drill.description}</p>
                <button
                  onClick={() => router.push("/player/video-upload/" + drill.id)}
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                  Submit Video
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
