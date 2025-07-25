import { Operation } from "@/lib/ot";

export type DocumentVersionSummary = {
  version: number;
  createdAt: string;
};

export type SendOperationParams = {
  ws: WebSocket;
  docId: string;
  op: Operation;
  clientId: string;
};

export type DocumentVersionsRouteParams = {
  params: {
    id: string;
  };
};

export interface VersionHistoryProp {
  documentId: string;
}
