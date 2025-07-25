import prisma from "./db";

import { v4 as uuidv4 } from "uuid";

export const saveVersion = async (
  documentId: string,
  content: string,
  version: number
) => {
  await prisma.documentVersion.create({
    data: {
      id: uuidv4(),
      content,
      version,
      document: {
        connect: { id: documentId }
      },
    },
  });
};

export const getVersion = async (documentId: string) => {
  return await prisma.documentVersion.findMany({
    where: { documentId },
    orderBy: { version: "desc" },
  });
};
