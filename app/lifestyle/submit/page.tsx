"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { SendIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";

export default function SubmitPostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Submit Page Viewed");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Lifestyle Post Submitted", {
        title: title,
        content_length: content.length,
        tags: tags,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => router.push("/lifestyle"), 2000);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-900">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="flex justify-center">
              <div className="p-6 bg-amber-600 rounded-full">
                <CheckCircleIcon className="h-16 w-16 text-zinc-900" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-amber-400">Post Published!</h2>
            <p className="text-zinc-300 max-w-md">
              Your philosophical musings are now live. The community awaits your wisdom.
            </p>
            <p className="text-sm text-zinc-500">Redirecting to feed...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-900">
      <Header />
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6 max-w-3xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-amber-400">Create a Post</h1>
            <p className="text-zinc-400 mt-2">Share your existential musings with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-zinc-800 border border-zinc-700 rounded-lg p-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Title</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., On the Absurdity of Daily Routines"
                className="bg-zinc-900 border-zinc-700 text-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Content</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Pour out your philosophical thoughts..."
                className="min-h-[300px] bg-zinc-900 border-zinc-700 text-zinc-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Tags (comma-separated)</label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., existentialism, camus, absurdism"
                className="bg-zinc-900 border-zinc-700 text-zinc-100"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-amber-600 text-zinc-900 hover:bg-amber-500"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <SendIcon className="h-4 w-4 mr-2" />
                  Post to Community
                </>
              )}
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
