"use client";

import { useState, useEffect } from "react";

export default function CollectionsPage() {
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    total_amount: 0,
    total_declarations: 0,
  });
  const [error, setError] = useState("");
  const [expandedCollector, setExpandedCollector] = useState<string | null>(null);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    try {
      const res = await fetch("/api/collections");
      const data = await res.json();
      setCollections(data.collectors || []);
      setTotals({
        total_amount: data.total_amount || 0,
        total_declarations: data.total_declarations || 0,
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load collections");
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Payment Collections</h1>
          <p className="text-gray-600">
            Track cash and payment collections by coaches and staff
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide">
              Total Collected
            </p>
            <p className="text-3xl font-bold text-blue-600">
              ₹{totals.total_amount.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide">
              Total Declarations
            </p>
            <p className="text-3xl font-bold text-indigo-600">
              {totals.total_declarations}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm uppercase tracking-wide">
              Active Collectors
            </p>
            <p className="text-3xl font-bold text-purple-600">
              {collections.length}
            </p>
          </div>
        </div>

        {/* Collections Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Collector
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Total Collected
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Approved
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Pending
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">
                    Rejected
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {collections.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No collections yet
                    </td>
                  </tr>
                ) : (
                  collections.map((collector) => (
                    <tr key={collector.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">
                            {collector.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            {collector.role} • {collector.phone}
                          </p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-lg text-blue-600">
                          ₹{collector.total_collected.toLocaleString("en-IN")}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          ₹{collector.approved.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                          ₹{collector.pending_approval.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          ₹{collector.rejected.toLocaleString("en-IN")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() =>
                            setExpandedCollector(
                              expandedCollector === collector.id
                                ? null
                                : collector.id
                            )
                          }
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          {expandedCollector === collector.id
                            ? "▼ Hide"
                            : "▶ Details"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expanded Details */}
        {expandedCollector && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-bold mb-4">
              {collections.find((c) => c.id === expandedCollector)?.name} -
              Detailed View
            </h3>
            <p className="text-gray-600 mb-4">
              Click a collector row to see individual payment declarations.
            </p>
            <p className="text-sm text-gray-500">
              (Individual payment details would be loaded here with pagination)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
