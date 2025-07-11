import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });
const clients = new Map<
  string,
  { ws: WebSocket; docId: string; clientId: string }
>(); // Map to store clients by clientId

wss.on("connection", (ws: WebSocket) => {
  let currentDocId: string;
  let currentClientId: string;

  ws.on("message", (message: string) => {
    const { type, docId, clientId, content } = JSON.parse(message.toString());

    if (type === "join") {
      currentDocId = docId;
      currentClientId = clientId;
      clients.set(currentClientId, { ws, docId, clientId }); // Store the client with all info
      console.log(`Client ${clientId} joined document ${docId}`);
    }

    if (type === "update") {
      // Broadcast the update to all clients in the same document, except sender
      clients.forEach((client, id) => {
        if (
          client.docId === currentDocId &&
          id !== currentClientId &&
          client.ws.readyState === WebSocket.OPEN
        ) {
          client.ws.send(
            JSON.stringify({
              type: "update",
              content,
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
