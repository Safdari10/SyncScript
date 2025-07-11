import "@/styles/global.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SyncScript",
  description: "Real-time collaborative code editor",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">{children}</body>
    </html>
  );
}
