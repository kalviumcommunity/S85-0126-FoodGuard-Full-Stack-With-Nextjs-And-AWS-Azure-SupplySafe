"use client";
import { useState } from "react";

export default function FileUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a file first.");

    setIsUploading(true);

    try {
      // 1. Get the Signed Upload URL from your API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          fileSize: file.size,
        }),
      });

      const result = await response.json();

      if (!result.success) throw new Error(result.message);

      // 2. Upload directly to Supabase using the Signed URL
      const uploadRes = await fetch(result.uploadUrl, {
        method: "PUT", // Supabase signed URLs require PUT
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (uploadRes.ok) {
        alert(`Success! File uploaded to: ${result.path}`);
      } else {
        throw new Error("Upload to storage failed.");
      }
    } catch {
      return Response.json(
        { success: false, message: "Signup failed" },
        { status: 500 }
      );
    }
  };

  return (
    <div className="p-10 flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Cloud Storage Upload</h1>
      <input type="file" onChange={handleFileChange} className="border p-2" />
      <button
        onClick={uploadFile}
        disabled={isUploading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isUploading ? "Uploading..." : "Upload to Supabase"}
      </button>
    </div>
  );
}
