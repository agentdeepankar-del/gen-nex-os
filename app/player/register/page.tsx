"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PlayerRegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    full_name: "",
    date_of_birth: "",
    gender: "M",
    phone: "",
    email: "",
    parent_name: "",
    parent_phone: "",
    address: "",
    cricket_category: "U-15",
    batting_style: "Right-handed",
    bowling_style: "Right-arm fast",
    batch_id: "",
  });

  const [batches] = useState([
    { id: "batch-1", name: "U-15 Morning" },
    { id: "batch-2", name: "U-15 Evening" },
    { id: "batch-3", name: "U-17 Morning" },
    { id: "batch-4", name: "U-19 Evening" },
    { id: "batch-5", name: "Adult Evening" },
  ]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/players/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      const data = await res.json();
      router.push(`/player/payment-declaration/${data.player_id}`);
    } catch (err) {
      setError("Network error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-2">GEN NEX OS</h1>
        <p className="text-gray-600 mb-8">Player Registration</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-6">
          {/* Step 1: Personal Details */}
          {step === 1 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>
            </>
          )}

          {/* Step 2: Parent Details */}
          {step === 2 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent/Guardian Name
                </label>
                <input
                  type="text"
                  name="parent_name"
                  value={formData.parent_name}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  name="parent_phone"
                  value={formData.parent_phone}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </>
          )}

          {/* Step 3: Cricket Details */}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Select Batch *
                </label>
                <select
                  name="batch_id"
                  value={formData.batch_id}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="">Choose a batch...</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Batting Style
                  </label>
                  <select
                    name="batting_style"
                    value={formData.batting_style}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option>Right-handed</option>
                    <option>Left-handed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Bowling Style
                  </label>
                  <select
                    name="bowling_style"
                    value={formData.bowling_style}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option>Right-arm fast</option>
                    <option>Right-arm spin</option>
                    <option>Left-arm fast</option>
                    <option>Left-arm spin</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Cricket Category
                </label>
                <select
                  name="cricket_category"
                  value={formData.cricket_category}
                  onChange={handleChange}
                  disabled={loading}
                >
                  <option>U-15</option>
                  <option>U-17</option>
                  <option>U-19</option>
                  <option>Adult</option>
                </select>
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              className="btn btn-secondary"
              disabled={step === 1 || loading}
            >
              Back
            </button>

            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="btn btn-primary"
                disabled={loading}
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Registering..." : "Complete Registration"}
              </button>
            )}
          </div>

          <div className="text-center text-sm text-gray-600">
            Step {step} of 3
          </div>
        </form>
      </div>
    </div>
  );
}
