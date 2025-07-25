import { Operation } from "@/lib/ot";
import { sendOperation } from "@/lib/websocket";

/**
 * React hook that returns a change handler for a collaborative text document.
 *
 * This handler detects simple insert or delete operations in a textarea,
 * updates local content and version references, and sends the detected operation
 * to a WebSocket server for real-time collaboration.
 *
 * @param prevContentRef - React ref holding the previous content of the document.
 * @param versionRef - React ref holding the current version number of the document.
 * @param setContent - State setter function to update the document content.
 * @param wsRef - React ref to the active WebSocket connection.
 * @param docId - Identifier for the current document.
 * @param clientId - Unique identifier for the current client.
 * @returns A change event handler for a textarea element.
 */
// Returns a textarea change handler for collaborative editing.

export const useDocumentChangeHandler = ({
  prevContentRef,
  versionRef,
  setContent,
  wsRef,
  docId,
  clientId,
}) => {
  return (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    const oldContent = prevContentRef.current;

    //Simple diff; detect insert or delete at one position
    let op: Operation | null = null;
    if (newContent.length > oldContent.length) {
      // insert
      const pos = e.target.selectionStart - (newContent.length - oldContent.length);
      const text = newContent.slice(pos, pos + (newContent.length - oldContent.length));
      op = { type: "insert", pos, text, version: versionRef.current };
    } else if (newContent.length < oldContent.length) {
      // delete
      const pos = e.target.selectionStart;
      const length = oldContent.length - newContent.length;
      op = { type: "delete", pos, length, version: versionRef.current };
    }

    setContent(newContent);
    prevContentRef.current = newContent;
    versionRef.current += 1;

    if (op && wsRef.current?.readyState === WebSocket.OPEN) {
      sendOperation({
        ws: wsRef.current,
        docId,
        op,
        clientId,
      });
    }
  };
};
