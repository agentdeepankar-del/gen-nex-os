"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PaymentDeclarationPage() {
  const router = useRouter();
  const params = useParams();
  const playerId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [playerInfo, setPlayerInfo] = useState<any>(null);
  const [fees, setFees] = useState<any[]>([]);
  const [collectors, setCollectors] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    collector_id: "",
    fee_obligation_id: "",
    amount: 5000,
    payment_method: "CASH",
    payment_date: new Date().toISOString().split("T")[0],
    reference: "",
    notes: "",
  });

  useEffect(() => {
    fetchPlayerData();
    fetchCollectors();
  }, []);

  const fetchPlayerData = async () => {
    try {
      const res = await fetch(`/api/players/${playerId}`);
      const data = await res.json();
      setPlayerInfo(data.player);
      setFees(data.fees || []);
      if (data.fees && data.fees.length > 0) {
        setFormData((prev) => ({
          ...prev,
          fee_obligation_id: data.fees[0].id,
          amount: data.fees[0].amount,
        }));
      }
    } catch (err) {
      setError("Failed to load player data");
    }
  };

  const fetchCollectors = async () => {
    try {
      const res = await fetch("/api/collectors");
      const data = await res.json();
      setCollectors(data.collectors || []);
    } catch (err) {
      console.error("Failed to fetch collectors");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "fee_obligation_id") {
        const selectedFee = fees.find((f) => f.id === value);
        if (selectedFee) {
          updated.amount = selectedFee.amount;
        }
      }
      return updated;
    });
  };

  const handleDeclare = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payments/declare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          player_id: playerId,
          ...formData,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Payment declaration failed");
        setLoading(false);
        return;
      }

      router.push(`/player/dashboard/${playerId}`);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  if (!playerInfo) return <div className="p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">GEN NEX OS</h1>
        <p className="text-gray-600 mb-8">Declare Your Payment</p>

        <div className="bg-blue-50 border border-blue-200 p-4 rounded mb-8">
          <p className="text-sm">
            <strong>Welcome {playerInfo.full_name}!</strong>
          </p>
          <p className="text-sm text-gray-700 mt-2">
            Please declare your payment. Select which coach or staff member
            collected the money from you.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleDeclare} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Outstanding Fees *
            </label>
            <select
              name="fee_obligation_id"
              value={formData.fee_obligation_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a fee...</option>
              {fees.map((fee) => (
                <option key={fee.id} value={fee.id}>
                  {fee.billing_period === "JOINING"
                    ? `Joining Fee: ₹${fee.amount}`
                    : `Monthly (${fee.billing_period}): ₹${fee.amount}`}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Who collected the payment? *
            </label>
            <select
              name="collector_id"
              value={formData.collector_id}
              onChange={handleChange}
              required
              disabled={loading}
            >
              <option value="">Select a coach or staff member...</option>
              {collectors.map((collector) => (
                <option key={collector.id} value={collector.id}>
                  {collector.name} ({collector.role})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Amount Paid (₹) *
              </label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Method *
              </label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="CASH">Cash</option>
                <option value="UPI">UPI</option>
                <option value="BANK_TRANSFER">Bank Transfer</option>
                <option value="CARD">Card</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Payment Date *
              </label>
              <input
                type="date"
                name="payment_date"
                value={formData.payment_date}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Reference (UPI Ref/Txn ID)
              </label>
              <input
                type="text"
                name="reference"
                value={formData.reference}
                onChange={handleChange}
                placeholder="Optional"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              placeholder="Additional details (optional)"
              disabled={loading}
            />
          </div>

          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-secondary"
              disabled={loading}
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? "Declaring..." : "Declare Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
