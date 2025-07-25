export type DocumentVersionSummary = {
  version: number;
  createdAt: string;
};

export interface VersionHistoryProp {
  documentId: string;
}