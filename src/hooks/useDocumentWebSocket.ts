import { useEffect, useRef } from "react";
import { createDocumentWebSocket } from "@/lib/websocket";
import { applyOperation } from "@/lib/ot";

interface UseDocumentWebSocketProps {
  clientId: string;
  docId: string;
  setContent: React.Dispatch<React.SetStateAction<string>>;
  versionRef: React.RefObject<number>;
  prevContentRef: React.RefObject<string>;
}

const useDocumentWebSocket = ({
  clientId,
  docId,
  setContent,
  versionRef,
  prevContentRef,
}: UseDocumentWebSocketProps) => {
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // wait for client id to be set
    if (!clientId) return;

    const ws = createDocumentWebSocket(docId, clientId);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Handle Document load from Server
      if (data.type === "load") {
        setContent(data.content);
        versionRef.current = data.version;
        prevContentRef.current = data.content;
      }

      // Handle OT Operations from other clients
      if (data.type === "operation" && data.senderId !== clientId && data.op) {
        setContent((current) => {
          const updated = applyOperation(current, data.op);
          prevContentRef.current = updated;
          versionRef.current = data.op.version ?? versionRef.current;
          return updated;
        });
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected");
    };

    return () => {
      ws.close();
    };
  }, [clientId, docId, setContent, versionRef, prevContentRef]);

  return wsRef;
};

export default useDocumentWebSocket;
