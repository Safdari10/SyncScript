"use client";

import { useState } from "react";
import { VersionHistoryProp, DocumentVersionSummary } from "@/types/types";

export const VersionHistory = ({ documentId }: VersionHistoryProp) => {
  const [versions, setVersions] = useState<DocumentVersionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadVersions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/documents/${documentId}/versions`);
      if (!res.ok) throw new Error("Failed to load versions");
      setVersions(await res.json());
    } catch (err) {
      console.error(err);
      setError("Could not load version history.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-l p-4">
      <button onClick={loadVersions} className="mb-4 p-2 bg-gray-100 rounded">
        {loading ? "loading..." : "View History"}
      </button>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <ul>
        {versions.map((v) => (
          <li key={v.version} className="py-2 border-b">
            <span className="font-mono">v{v.version}</span>
            <span className="text-sm text-gray-500 ml-4">
              {new Date(v.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};
