"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("owner@demo.local");
  const [password, setPassword] = useState("demo123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const isEmail = identifier.includes("@");
      const isPhone = /^\d{10}$/.test(identifier);

      const payload: any = { password };
      if (isEmail) {
        payload.email = identifier;
      } else if (isPhone) {
        payload.phone = identifier;
      } else {
        setError("Enter valid email or 10-digit phone");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user_role", data.role);
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("academy_id", data.academy_id);

      router.push("/dashboard");
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2">GEN NEX OS</h1>
        <p className="text-center text-gray-600 mb-8">Sports Academy Operating System</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email or Phone</label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="owner@demo.local or 9009000100"
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="demo123456"
              disabled={loading}
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          {error && <div className="bg-red-50 text-red-600 p-3 rounded text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t">
          <p className="text-sm text-gray-600 mb-3">Demo Credentials:</p>
          <div className="bg-gray-50 p-4 rounded text-sm space-y-2">
            <div>
              <span className="font-medium">Owner:</span> owner@demo.local / demo123456
            </div>
            <div>
              <span className="font-medium">Coach:</span> 9001001001 / temppin123
            </div>
            <div>
              <span className="font-medium">Player:</span> 9009000100 / player123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
