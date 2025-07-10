"use client";
import { useDocumentStore } from "@/stores/document";
import { useEffect, useRef } from "react";

export default function Editor({ docId }: { docId: string }) {
  const { content, setContent, clientId } = useDocumentStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // WebSocket connect
  //! todo: enhance futher later
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const { content: newContent, senderId } = JSON.parse(event.data);
      if (senderId !== clientId) {
        setContent(newContent);
      }
    };
    return () => ws.close();
  }, [docId, clientId, setContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setContent(newContent);

    // Temporary broad - todo: replace with OT later
    const ws = new WebSocket("ws://localhost:8080");
    ws.send(
      JSON.stringify({
        docId,
        content: newContent,
        senderId: clientId,
      })
    );
  };

  return (
    <textarea
      ref={textareaRef}
      value={content}
      onChange={handleChange}
      className="w-full h-screen p-4 text-lg focus:outline-none resize-none"
      placeholder="Start typing collaboratively..."
    />
  );
}
