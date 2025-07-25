import { SendOperationParams } from "@/types/types";

/**
 * Creates and returns a WebSocket connection for a specific document and client.
 *
 * This function establishes a WebSocket connection to the server at "ws://localhost:8080".
 * Once the connection is open, it sends a "join" message containing the document ID and client ID,
 * indicating that the client wishes to join the specified document session.
 *
 * @param docId - The unique identifier of the document to join.
 * @param clientId - The unique identifier of the client joining the document.
 * @returns A WebSocket instance connected to the server.
 */
export const createDocumentWebSocket = (docId: string, clientId: string): WebSocket => {
  const ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    console.log("WebSocket connected");
    ws.send(
      JSON.stringify({
        type: "join",
        docId,
        clientId,
      })
    );
  };
  return ws;
};



/**
 * Sends an operation message over the provided WebSocket connection.
 *
 * This function serializes the operation details (including document ID, operation data,
 * and sender/client ID) into a JSON string and sends it through the given WebSocket.
 * The message is used to communicate document operations (such as edits) to other clients or a server.
 *
 * @param ws - The WebSocket instance to send the message through.
 * @param docId - The unique identifier of the document the operation applies to.
 * @param op - The operation data to be sent (e.g., changes made to the document).
 * @param clientId - The unique identifier of the client sending the operation.
 */
export const sendOperation = ({ ws, docId, op, clientId }: SendOperationParams) => {
  ws.send(
    JSON.stringify({
      type: "operation",
      docId,
      op,
      senderId: clientId,
    })
  );
};
