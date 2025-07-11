"use client";

import { useRef, useEffect, useState } from "react";

export default function Editor({ docId }: { docId: string }) {
  const [content, setContent] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);

  // Generate clientId on client side only
  useEffect(() => {
    setClientId(Math.random().toString(36).substring(2, 10));
  }, []);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!clientId) return; // Wait for clientId to be set
    
    const socket = new WebSocket("ws://localhost:8080");
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("WebSocket connected");
      // Send initial join message
      socket.send(
        JSON.stringify({
          type: "join",
          docId,
          clientId,
        })
      );
    };

    socket.onmessage = (event) => {
      const { type, content: newContent, senderId } = JSON.parse(event.data);
      if (type === "update" && senderId !== clientId) {
        setContent(newContent);
      }
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      socket.close();
    };
  }, [docId, clientId]);

  // Handle content changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Only send if connection is ready
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "update",
          docId,
          content: newContent,
          senderId: clientId,
        })
      );
    }
  };

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
    </div>
  );
}
