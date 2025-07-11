import Editor from "@/components/Editor";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ documentId: string }>;
}) {
  const { documentId } = await params;
  
  return (
    <div className="h-screen flex flex-col">
      <header className="bg-gray-100 p-2 border-b">
        <h1 className="font-semibold">
          Editing Document ID:
          <span className="font-mono">{documentId}</span>
        </h1>
      </header>
      <Editor docId={documentId} />
    </div>
  );
}
