"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useRouter } from "next/navigation";
import { SendIcon, CheckCircleIcon, Loader2Icon } from "lucide-react";

export default function SubmitPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [duration, setDuration] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness Submit Page Viewed");
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness Case Submitted", {
        username: username,
        age: age,
        duration: duration,
        symptoms_length: symptoms.length,
      });
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => router.push("/wellness/vote"), 2000);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-teal-50 to-white">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-6 p-8">
            <div className="flex justify-center">
              <div className="p-6 bg-green-100 rounded-full">
                <CheckCircleIcon className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Case Submitted!</h2>
            <p className="text-slate-600 max-w-md">
              Your symptoms have been posted anonymously. The community is now voting on what they think it is!
            </p>
            <p className="text-sm text-slate-500">Redirecting to voting...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-teal-50 to-white">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 bg-white border-b border-slate-200">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold text-slate-900">Submit Your Symptoms</h1>
            <p className="text-slate-600 mt-1">Share anonymously and get community diagnoses</p>
          </div>
        </section>

        <section className="w-full py-12">
          <div className="container px-4 md:px-6 max-w-2xl">
            <form onSubmit={handleSubmit} className="bg-white rounded-lg border-2 border-teal-200 shadow-xl p-8 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Anonymous Username</label>
                <Input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g., SneezMaster3000"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">Pick a fun name - no one will know it's you!</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age</label>
                  <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 32" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Duration</label>
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g., 3 days"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Describe Your Symptoms</label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Be as detailed (and dramatic) as you like. The more descriptive, the better!"
                  className="min-h-[200px]"
                  required
                />
                <p className="text-xs text-slate-500 mt-1">
                  Tip: Include how you're feeling, when it started, and any quirky details!
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Disclaimer:</strong> This is for entertainment only. Always consult a real healthcare professional for actual medical advice.
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-teal-600 text-white hover:bg-teal-700"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <SendIcon className="h-4 w-4 mr-2" />
                    Submit Case
                  </>
                )}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
