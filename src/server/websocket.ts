import { WebSocket, WebSocketServer } from "ws";
import { Operation, transform } from "@/lib/ot";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<
  string,
  { ws: WebSocket; docId: string; clientId: string }
>(); // Map to store clients by clientId

const docOps = new Map<string, Operation[]>(); // Store operations by document ID

wss.on("connection", (ws: WebSocket) => {
  let currentDocId: string;
  let currentClientId: string;

  ws.on("message", (message: string) => {
    const { type, docId, clientId, op } = JSON.parse(message.toString());

    if (type === "join") {
      currentDocId = docId;
      currentClientId = clientId;
      clients.set(currentClientId, { ws, docId, clientId }); // Store the client with all info
      if (!docOps.has(docId)) {
        docOps.set(docId, []); // Initialize operations for this document
      }
      console.log(`Client ${clientId} joined document ${docId}`);
    }

    if (type === "operation" && op) {
      let transformedOp = op;
      const ops = docOps.get(currentDocId) || [];
      for (const prevOp of ops) {
        transformedOp = transform(prevOp, transformedOp);
      }
      // Store the transformed operation
      docOps.set(currentDocId, [...ops, transformedOp]);

      // Broadcast the update to all clients in the same document, except sender
      clients.forEach((client, id) => {
        if (
          client.docId === currentDocId &&
          id !== currentClientId &&
          client.ws.readyState === WebSocket.OPEN
        ) {
          client.ws.send(
            JSON.stringify({
              type: "operation",
              op: transformedOp,
              senderId: currentClientId,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    // Remove the client from the map when they disconnect
    if (currentClientId) {
      clients.delete(currentClientId);
      console.log(`Client ${currentClientId} disconnected`);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
