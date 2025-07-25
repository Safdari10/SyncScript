"use client";

import { useRef, useEffect, useState } from "react";
import useDocumentWebSocket from "@/hooks/useDocumentWebSocket";
import { useDocumentChangeHandler } from "@/hooks/useDocumentChangeHandler";
import { VersionHistory } from "./VersionHistory";

export default function Editor({ docId }: { docId: string }) {
  const [content, setContent] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const versionRef = useRef(0);
  const prevContentRef = useRef("");

  // Generate clientId on client side only
  useEffect(() => {
    setClientId(Math.random().toString(36).substring(2, 10));
  }, []);

  // Initialize WebSocket connection
  const wsRef = useDocumentWebSocket({
    clientId,
    docId,
    setContent,
    versionRef,
    prevContentRef,
  });

  // Handle content changes
  const handleChange = useDocumentChangeHandler({
    prevContentRef,
    versionRef,
    setContent,
    wsRef,
    docId,
    clientId,
  });

  useEffect(() => {
    prevContentRef.current = content;
  }, [content]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-gray-100 text-sm">
        Connected as: <span className="font-mono">{clientId || "Connecting..."}</span>
      </div>
      <textarea
        value={content}
        onChange={handleChange}
        className="flex-1 p-4 text-lg border-none focus:outline-none resize-none"
        placeholder="Start typing..."
      />
      <VersionHistory documentId={docId} />
    </div>
  );
}
