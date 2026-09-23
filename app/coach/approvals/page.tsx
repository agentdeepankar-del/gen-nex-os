"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CoachApprovalsPage() {
  const router = useRouter();
  const [coachId, setCoachId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvals, setApprovals] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    // For demo, get coach from localStorage or use a demo coach ID
    const storedCoachId = localStorage.getItem("coachId");
    if (storedCoachId) {
      setCoachId(storedCoachId);
      fetchApprovals(storedCoachId);
    } else {
      setError("Coach not logged in");
      setLoading(false);
    }
  }, []);

  const fetchApprovals = async (cId: string) => {
    try {
      const res = await fetch(`/api/coach/approvals?coach_id=${cId}`);
      const data = await res.json();
      setApprovals(data.pending_approvals || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load approvals");
      setLoading(false);
    }
  };

  const handleApprove = async (
    paymentDeclarationId: string,
    playerName: string
  ) => {
    setProcessingId(paymentDeclarationId);
    try {
      const res = await fetch("/api/coach/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_declaration_id: paymentDeclarationId,
          action: "APPROVE",
          coach_id: coachId,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Approval failed");
        setProcessingId(null);
        return;
      }

      // Refresh list
      if (coachId) {
        await fetchApprovals(coachId);
      }
    } catch (err) {
      setError("Network error");
      setProcessingId(null);
    }
  };

  const handleReject = async (
    paymentDeclarationId: string,
    playerName: string
  ) => {
    const reason = prompt(`Reason for rejecting ${playerName}'s payment?`);
    if (!reason) return;

    setProcessingId(paymentDeclarationId);
    try {
      const res = await fetch("/api/coach/approvals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_declaration_id: paymentDeclarationId,
          action: "REJECT",
          coach_id: coachId,
          rejection_reason: reason,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Rejection failed");
        setProcessingId(null);
        return;
      }

      // Refresh list
      if (coachId) {
        await fetchApprovals(coachId);
      }
    } catch (err) {
      setError("Network error");
      setProcessingId(null);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Coach Payment Approvals</h1>
          <p className="text-gray-600">
            Review and approve payments declared by players
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {approvals.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">✅ No pending approvals</p>
            <p className="text-sm text-gray-500">All payments have been reviewed</p>
          </div>
        ) : (
          <div className="space-y-4">
            {approvals.map((approval) => (
              <div
                key={approval.id}
                className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Player
                    </p>
                    <p className="text-lg font-bold">
                      {approval.players?.full_name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {approval.players?.phone}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Fee
                    </p>
                    <p className="text-lg font-bold">
                      ₹{approval.fee_obligations?.amount}
                    </p>
                    <p className="text-sm text-gray-600">
                      {approval.fee_obligations?.billing_period === "JOINING"
                        ? "Joining Fee"
                        : `Monthly (${approval.fee_obligations?.billing_period})`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 py-4 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Amount Declared
                    </p>
                    <p className="text-lg font-bold">
                      ₹{approval.declared_amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide">
                      Payment Method
                    </p>
                    <p className="text-lg font-bold">
                      {approval.payment_method}
                    </p>
                  </div>
                </div>

                {approval.reference && (
                  <div className="mb-4 p-3 bg-gray-50 rounded">
                    <p className="text-xs text-gray-500">Reference</p>
                    <p className="text-sm font-mono text-gray-700">
                      {approval.reference}
                    </p>
                  </div>
                )}

                <p className="text-xs text-gray-500 mb-4">
                  Declared on{" "}
                  {new Date(approval.created_at).toLocaleDateString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      handleApprove(
                        approval.id,
                        approval.players?.full_name || "Player"
                      )
                    }
                    disabled={processingId === approval.id}
                    className="btn btn-primary flex-1"
                  >
                    {processingId === approval.id ? "Processing..." : "✓ Approve"}
                  </button>
                  <button
                    onClick={() =>
                      handleReject(
                        approval.id,
                        approval.players?.full_name || "Player"
                      )
                    }
                    disabled={processingId === approval.id}
                    className="btn btn-secondary flex-1"
                  >
                    {processingId === approval.id ? "Processing..." : "✗ Reject"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
