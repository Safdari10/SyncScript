import { WebSocket, WebSocketServer } from "ws";
import { applyOperation, Operation, transform } from "@/lib/ot";
import prisma from "@/lib/db";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<
  string,
  { ws: WebSocket; docId: string; clientId: string }
>(); // Map to store clients by clientId

const docOps = new Map<string, Operation[]>(); // Store operations by document ID
const docVersions = new Map<string, number>(); // Store versions by document ID

wss.on("connection", (ws: WebSocket) => {
  let currentDocId: string;
  let currentClientId: string;

  ws.on("message", async (message: string) => {
    try {
      const { type, docId, clientId, op, version } = JSON.parse(
        message.toString()
      );

      if (type === "join") {
        currentDocId = docId;
        currentClientId = clientId;
        clients.set(currentClientId, { ws, docId, clientId }); // Store the client with all info
        if (!docOps.has(docId)) {
          docOps.set(docId, []); // Initialize operations for this document
        }

        // Prisma: Load document content and version if it exists
        const doc = await prisma.document.findUnique({
          where: { id: docId },
        });
        if (doc) {
          ws.send(
            JSON.stringify({
              type: "load",
              content: doc.content,
              version: doc.version,
            })
          );
        }
        console.log(`Client ${clientId} joined document ${docId}`);
        return;
      }

      if (type === "operation" && op) {
        if (!op || !version) throw new Error("Missing operation data");

        // Version Check
        const currentVersion = docVersions.get(docId) || 0;
        if (version <= currentVersion) return;

        // OT transoformation
        const ops = docOps.get(docId) || [];
        const transformedOp = ops.reduce(
          (acc, prevOp) => transform(prevOp, acc),
          op
        );

        // update state
        docVersions.set(docId, version);
        const updatedOps = [...ops.slice(-49), transformedOp]; // Keep last 50 operations
        docOps.set(docId, updatedOps);

        // Prisma: Auto-save every 10 operations
        if (updatedOps.length % 10 === 0) {
          const currentContent = updatedOps.reduce(
            (text, op) => applyOperation(text, op),
            ""
          );
          await prisma.document.upsert({
            where: { id: docId },
            update: {
              content: currentContent,
              version: op.version,
            },
            create: {
              id: docId,
              content: currentContent,
              version: op.version,
            },
          });
        }

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
                version,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({ type: "error", message: "Invalid Operation" }));
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
