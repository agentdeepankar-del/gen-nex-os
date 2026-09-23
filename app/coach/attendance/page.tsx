"use client";

import { useState, useEffect } from "react";

export default function AttendancePage() {
  const [loading, setLoading] = useState(true);
  const [batchId] = useState("batch-1");
  const [attendance, setAttendance] = useState<any[]>([]);
  const [sessionId, setSessionId] = useState("");
  const [attendanceMap, setAttendanceMap] = useState<Record<string, string>>({});

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    fetchSession(today);
    fetchPlayers();
  }, []);

  const fetchSession = async (date: string) => {
    try {
      const res = await fetch(
        `/api/attendance?batch_id=${batchId}&date=${date}`
      );
      const data = await res.json();
      setSessionId(data.session?.id);
    } catch (err) {
      console.error("Session fetch error:", err);
    }
  };

  const fetchPlayers = async () => {
    try {
      const res = await fetch("/api/players");
      const data = await res.json();
      setAttendance(data.players?.slice(0, 10) || []);
      setLoading(false);
    } catch (err) {
      console.error("Players fetch error:", err);
      setLoading(false);
    }
  };

  const handleAttendanceChange = (playerId: string, status: string) => {
    setAttendanceMap((prev) => ({ ...prev, [playerId]: status }));
  };

  const handleSubmit = async () => {
    try {
      for (const [playerId, status] of Object.entries(attendanceMap)) {
        await fetch("/api/attendance", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            player_id: playerId,
            status,
            coach_id: "coach-1",
          }),
        });
      }
      alert("Attendance recorded successfully");
    } catch (err) {
      alert("Failed to record attendance");
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Mark Attendance</h1>
          <p className="text-gray-600">
            {new Date().toLocaleDateString()} - U-15 Evening Batch
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-4">Player</th>
                <th className="text-center py-4">Present</th>
                <th className="text-center py-4">Absent</th>
                <th className="text-center py-4">Late</th>
                <th className="text-center py-4">Excused</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((player) => (
                <tr key={player.id} className="border-b hover:bg-gray-50">
                  <td className="py-4">{player.full_name}</td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={player.id}
                      value="PRESENT"
                      onChange={(e) =>
                        handleAttendanceChange(player.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={player.id}
                      value="ABSENT"
                      onChange={(e) =>
                        handleAttendanceChange(player.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={player.id}
                      value="LATE"
                      onChange={(e) =>
                        handleAttendanceChange(player.id, e.target.value)
                      }
                    />
                  </td>
                  <td className="text-center">
                    <input
                      type="radio"
                      name={player.id}
                      value="EXCUSED"
                      onChange={(e) =>
                        handleAttendanceChange(player.id, e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6">
            <button
              onClick={handleSubmit}
              className="btn btn-primary w-full"
            >
              Submit Attendance
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
