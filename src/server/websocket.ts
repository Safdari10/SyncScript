import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

// simple in-memory store for documents
const documents = new Map<string, string>();

wss.on("connection", (ws) => {
  console.log("New client connected");

  ws.on("message", (message) => {
    try {
      const { docId, content, senderId } = JSON.parse(message.toString());
      documents.set(docId, content);

      // Broadcast to all clients except the sender
      wss.clients.forEach((client) => {
        if (client !== ws && client.readyState === client.OPEN) {
          client.send(JSON.stringify({ content, senderId }));
        }
      });
    } catch (error) {
      console.error("Error processing message:", error);
    }
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
