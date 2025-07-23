type Operation =
  | { type: "insert"; pos: number; text: string; version: number }
  | { type: "delete"; pos: number; length: number; version: number };

// Apply an operation to text
export const applyOperation = (text: string, op: Operation): string => {
  switch (op.type) {
    case "insert":
      return text.slice(0, op.pos) + op.text + text.slice(op.pos);
    case "delete":
      return text.slice(0, op.pos) + text.slice(op.pos + op.length);
    default:
      return text;
  }
};

// Transfomr two operations to resolve conflicts
export const transform = (opA: Operation, opB: Operation): Operation => {
  // Insert vs Insert
  if (opA.type === "insert" && opB.type === "insert") {
    if (opA.pos < opB.pos) return opB;
    return { ...opB, pos: opB.pos + opA.text.length };
  }

  // delete vs delete
  if (opA.type === "delete" && opB.type === "delete") {
    if (opA.pos < opB.pos) return { ...opB, pos: opB.pos - opA.length };
    return opB;
  }

  // insert vs delete
  if (opA.type === "insert" && opB.type === "delete") {
    if (opA.pos <= opB.pos) return { ...opB, pos: opB.pos + opA.text.length };
    return opB;
  }

  // default: no transformation needed
  return opB;
};
