"use client";

import { useRef, useEffect, useState } from "react";
import { applyOperation, Operation } from "@/lib/ot";

export default function Editor({ docId }: { docId: string }) {
  const [content, setContent] = useState("");
  const [clientId, setClientId] = useState<string>("");
  const wsRef = useRef<WebSocket | null>(null);
  const versionRef = useRef(0);
  const prevContentRef = useRef("");

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
      const { type, op, senderId } = JSON.parse(event.data);
      if (type === "operation" && senderId !== clientId && op) {
        setContent((current) => {
          const updated = applyOperation(current, op);
          prevContentRef.current = updated;
          versionRef.current += 1;
          return updated;
        });
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
    const oldContent = prevContentRef.current;

    // Simple diff: detect insert or delete at one position
    let op: Operation | null = null;
    if (newContent.length > oldContent.length) {
      // Insert
      const pos =
        e.target.selectionStart - (newContent.length - oldContent.length);
      const text = newContent.slice(
        pos,
        pos + (newContent.length - oldContent.length)
      );
      op = { type: "insert", pos, text, version: versionRef.current };
    } else if (newContent.length < oldContent.length) {
      // Delete
      const pos = e.target.selectionStart;
      const length = oldContent.length - newContent.length;
      op = { type: "delete", pos, length, version: versionRef.current };
    }

    setContent(newContent);
    prevContentRef.current = newContent;
    versionRef.current += 1;

    if (op && wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: "operation",
          docId,
          op,
          senderId: clientId,
        })
      );
    }
  };

  useEffect(() => {
    prevContentRef.current = content;
  }, [content]);

  return (
    <div className="flex flex-col h-full">
      <div className="p-2 bg-gray-100 text-sm">
        Connected as:{" "}
        <span className="font-mono">{clientId || "Connecting..."}</span>
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
