import Link from "next/link";

export default function page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">SyncScript</h1>
      <Link
        href="/1"
        className="text-blue-600 underline hover:text-blue-800">
        Open Test Document
      </Link>
    </div>
  );
}
