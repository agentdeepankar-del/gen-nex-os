"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const authToken = localStorage.getItem("auth_token");
    const userRole = localStorage.getItem("user_role");

    if (authToken) {
      // Redirect to dashboard based on role
      if (userRole === "owner") {
        router.push("/dashboard");
      } else if (userRole === "coach") {
        router.push("/coach");
      } else if (userRole === "player") {
        router.push("/player");
      } else if (userRole === "accounts") {
        router.push("/accounts");
      }
    } else {
      router.push("/login");
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-600 to-blue-800">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">GEN NEX OS</h1>
        <p className="text-lg mb-8">Sports Academy Operating System</p>
        <div className="animate-spin">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
