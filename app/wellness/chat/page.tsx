"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrainIcon, SendIcon, Share2Icon, Loader2Icon, CheckCircleIcon } from "lucide-react";

const aiResponses = [
  "Based on your symptoms, I'm diagnosing you with a severe case of 'Being Human.' Treatment: 8 hours of sleep and maybe some vegetables.",
  "Interesting. After analyzing your symptoms with my advanced AI algorithms (and a magic 8-ball), I believe you have what medical professionals call 'Monday-itis.'",
  "My diagnosis: You've been consuming too much internet. Prescription: Touch grass immediately. Side effects may include fresh air and vitamin D.",
  "According to my extensive database (Wikipedia), you're experiencing a common condition known as 'Adulting.' Unfortunately, there's no cure.",
  "After careful analysis, I've determined you need one or more of the following: water, sleep, therapy, or a really good burrito.",
  "My AI sensors detect elevated levels of stress and coffee. Recommended treatment: A nap and reducing your caffeine intake from 'concerning' to 'moderate.'",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: "user" | "ai"; text: string }[]>([
    { role: "ai", text: "Hello! I'm Dr. AI, your friendly neighborhood artificial intelligence doctor. Tell me what's bothering you today! (Disclaimer: I'm not a real doctor and this is for entertainment only. Please consult actual medical professionals.)" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shared, setShared] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness AI Chat Viewed");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages([...messages, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness AI Message Sent", {
        message_length: userMessage.length,
        conversation_length: messages.length,
      });
    }

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      setMessages((prev) => [...prev, { role: "ai", text: aiResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleShare = () => {
    if (typeof window !== "undefined" && window.mixpanel) {
      window.mixpanel.track("Wellness AI Diagnosis Shared", {
        message_count: messages.length,
      });
    }
    setShared(true);
    setTimeout(() => setShared(false), 3000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Header />
      <main className="flex-1">
        <section className="w-full py-8 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-full">
                <BrainIcon className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">AI Medical Assistant</h1>
                <p className="text-purple-100">Powered by questionable training data</p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-8 flex-1">
          <div className="container px-4 md:px-6 max-w-4xl">
            {/* Chat Container */}
            <div className="bg-white rounded-lg border-2 border-purple-200 shadow-xl">
              {/* Messages */}
              <div className="h-[600px] overflow-y-auto p-6 space-y-4">
                {messages.map((message, idx) => (
                  <div
                    key={idx}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-purple-600 text-white"
                          : "bg-slate-100 text-slate-900 border border-slate-200"
                      }`}
                    >
                      {message.role === "ai" && (
                        <div className="flex items-center space-x-2 mb-2">
                          <BrainIcon className="h-4 w-4 text-purple-600" />
                          <span className="text-sm font-medium text-purple-600">Dr. AI</span>
                        </div>
                      )}
                      <p className="text-sm leading-relaxed">{message.text}</p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 max-w-[80%]">
                      <div className="flex items-center space-x-2">
                        <BrainIcon className="h-4 w-4 text-purple-600 animate-pulse" />
                        <span className="text-sm text-slate-600">Dr. AI is typing...</span>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="border-t-2 border-purple-200 p-4 bg-slate-50">
                <div className="flex space-x-2">
                  <Input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && !isTyping && handleSend()}
                    placeholder="Describe your symptoms..."
                    className="flex-1 bg-white"
                    disabled={isTyping}
                  />
                  <Button
                    onClick={handleSend}
                    className="bg-purple-600 text-white hover:bg-purple-700 hover:bg-opacity-90 active:scale-95 transition-all"
                    disabled={isTyping || !input.trim()}
                  >
                    {isTyping ? (
                      <Loader2Icon className="h-4 w-4 animate-spin" />
                    ) : (
                      <SendIcon className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Share Button */}
            {messages.length > 2 && (
              <div className="mt-6 text-center">
                <Button
                  onClick={handleShare}
                  variant="outline"
                  className={`border-purple-200 hover:bg-purple-50 active:scale-95 transition-all ${
                    shared ? "bg-green-50 border-green-400 text-green-700" : "text-purple-700"
                  }`}
                  disabled={shared}
                >
                  {shared ? (
                    <>
                      <CheckCircleIcon className="h-4 w-4 mr-2" />
                      Shared with Community!
                    </>
                  ) : (
                    <>
                      <Share2Icon className="h-4 w-4 mr-2" />
                      Share This Diagnosis with Community
                    </>
                  )}
                </Button>
                <p className="text-sm text-slate-500 mt-2">
                  {shared ? "Your conversation is now available for community voting!" : "Let others vote on how accurate the AI doctor was!"}
                </p>
              </div>
            )}

            {/* Quick Prompts */}
            <div className="mt-8">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Quick Symptoms</h3>
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  "I have a headache that won't go away",
                  "I'm always tired no matter how much I sleep",
                  "My back hurts from sitting all day",
                  "I think I'm allergic to mornings",
                ].map((prompt, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(prompt)}
                    className="p-3 text-left border-2 border-purple-200 rounded-lg hover:bg-purple-50 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm text-slate-700"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
