"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function VideoUploadPage() {
  const params = useParams();
  const router = useRouter();
  const drillId = params.drillId as string;

  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [drill, setDrill] = useState<any>(null);

  useEffect(() => {
    fetchDrillDetails();
  }, []);

  const fetchDrillDetails = async () => {
    try {
      const res = await fetch(`/api/drills/${drillId}`);
      const data = await res.json();
      setDrill(data.drill);
    } catch (err) {
      setError("Failed to load drill details");
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        if (selectedFile.size <= 100 * 1024 * 1024) {
          setFile(selectedFile);
          setError("");
        } else {
          setError("File size must be less than 100MB");
          setFile(null);
        }
      } else {
        setError("Please select a valid video file");
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("drill_id", drillId);

      const res = await fetch("/api/media/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Upload failed");
        setLoading(false);
        return;
      }

      setSuccess(true);
      setFile(null);
      setUploadProgress(0);

      setTimeout(() => {
        router.push(`/player/drills/${data.player_id}`);
      }, 2000);
    } catch (err: any) {
      setError(err.message || "Upload failed");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-2">Submit Drill Video</h1>
          {drill && (
            <p className="text-gray-600">
              Drill: <strong>{drill.name}</strong>
            </p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-6">
              ✓ Video uploaded successfully! Redirecting...
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold mb-4">
              Select Video File
            </label>
            <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-blue-50">
              <input
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                disabled={loading}
                className="hidden"
                id="video-input"
              />
              <label htmlFor="video-input" className="cursor-pointer block">
                <p className="text-gray-700 font-medium mb-2">
                  {file ? file.name : "Click to select video or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">
                  MP4, WebM, or MOV (Max 100MB)
                </p>
              </label>
            </div>
          </div>

          {file && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm">
                <strong>File:</strong> {file.name}
              </p>
              <p className="text-sm text-gray-600">
                Size: {(file.size / 1024 / 1024).toFixed(2)}MB
              </p>
            </div>
          )}

          {uploadProgress > 0 && (
            <div className="mb-6">
              <p className="text-sm font-medium mb-2">Uploading... {uploadProgress}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-4 rounded transition"
            >
              {loading ? "Uploading..." : "Upload Video"}
            </button>
            <button
              onClick={() => router.back()}
              disabled={loading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Tips:</strong>
            </p>
            <ul className="text-sm text-gray-600 mt-2 space-y-1">
              <li>• Record in good lighting</li>
              <li>• Keep the video steady</li>
              <li>• Show the full drill</li>
              <li>• Follow the drill instructions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
