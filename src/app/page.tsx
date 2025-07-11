import Link from "next/link";

export default function page() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Collaborative Editor</h1>
      <Link
        href="/(main)/1"
        className="text-blue-600 underline hover:text-blue-800">
        Open Test Document
      </Link>
    </div>
  );
}
