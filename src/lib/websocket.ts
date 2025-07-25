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
export const createDocumentWebSocket = (
  docId: string,
  clientId: string
): WebSocket => {
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
