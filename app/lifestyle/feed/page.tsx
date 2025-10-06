"use client";

import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function FeedPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main lifestyle page which has the feed
    router.push("/lifestyle");
  }, [router]);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-zinc-400">Redirecting to feed...</p>
      </main>
      <Footer />
    </div>
  );
}
