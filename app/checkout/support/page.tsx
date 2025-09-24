"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageCircleIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  HelpCircleIcon,
  SearchIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  StarIcon,
  SendIcon,
  BotIcon,
  UserIcon
} from "lucide-react";

// Mock FAQ data
const faqs = [
  {
    id: 1,
    question: "Why isn't my coupon code working?",
    answer: "Our coupon system is currently experiencing some technical difficulties. Only about 10% of coupon attempts are successful. We're aware of this issue and working on a fix! Try refreshing the page and attempting again.",
    category: "Orders",
    helpful: 127,
    notHelpful: 23
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer: "Standard shipping takes 3-5 business days. Express shipping (additional fee) takes 1-2 business days. Free shipping on orders over $50!",
    category: "Shipping",
    helpful: 256,
    notHelpful: 12
  },
  {
    id: 3,
    question: "What's your return policy?",
    answer: "We offer a 30-day return policy for all items. Items must be unused and in original packaging. Return shipping is free for defective items.",
    category: "Returns",
    helpful: 189,
    notHelpful: 8
  },
  {
    id: 4,
    question: "Do you offer price matching?",
    answer: "Yes! We'll match any lower price from a major competitor. Just contact our support team with a link to the lower price.",
    category: "Pricing",
    helpful: 94,
    notHelpful: 15
  },
  {
    id: 5,
    question: "How do I track my order?",
    answer: "You'll receive a tracking email once your order ships. You can also check your order status in 'My Account' section.",
    category: "Orders",
    helpful: 178,
    notHelpful: 6
  }
];

// Mock chat messages
const initialChatMessages = [
  {
    id: 1,
    sender: "bot",
    message: "Hi! I'm CheapBot, your virtual assistant. How can I help you today?",
    timestamp: new Date()
  }
];

export default function SupportPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [helpfulVotes, setHelpfulVotes] = useState<{[key: number]: boolean | null}>({});
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [chatMessages, setChatMessages] = useState(initialChatMessages);
  const [chatInput, setChatInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const categories = ["All", "Orders", "Shipping", "Returns", "Pricing"];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleHelpfulVote = (faqId: number, isHelpful: boolean) => {
    setHelpfulVotes(prev => ({
      ...prev,
      [faqId]: isHelpful
    }));

    // Track helpful votes
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('FAQ Helpful Vote', {
        faq_id: faqId,
        faq_question: faqs.find(f => f.id === faqId)?.question,
        is_helpful: isHelpful
      });
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Track contact form submission
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Support Contact Form Submit', {
        subject: contactForm.subject,
        has_email: !!contactForm.email,
        message_length: contactForm.message.length
      });
    }

    // Reset form
    setContactForm({ name: "", email: "", subject: "", message: "" });

    // Show confirmation (in real app, this would submit to backend)
    alert("Thank you for contacting us! We'll get back to you within 24 hours.");
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = {
      id: chatMessages.length + 1,
      sender: "user" as const,
      message: chatInput,
      timestamp: new Date()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);

    // Track chat interaction
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('Support Chat Message', {
        message_length: chatInput.length,
        message_number: chatMessages.length
      });
    }

    // Simulate bot response
    setTimeout(() => {
      const responses = [
        "I understand your concern! Let me help you with that.",
        "That's a great question! Here's what I recommend:",
        "I can definitely assist you with this issue.",
        "Thanks for reaching out! Let me provide some guidance:",
        "I see what you're asking about. Here's the information you need:"
      ];

      const botResponse = {
        id: chatMessages.length + 2,
        sender: "bot" as const,
        message: responses[Math.floor(Math.random() * responses.length)] + " For complex issues, please use our contact form below and our human support team will get back to you!",
        timestamp: new Date()
      };

      setChatMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  // Track page view
  useEffect(() => {
    if (typeof window !== 'undefined' && window.mixpanel) {
      window.mixpanel.track('View Support Page');
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 bg-gradient-to-r from-blue-600 to-green-600">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center text-white">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  How Can We Help?
                </h1>
                <p className="mx-auto max-w-[700px] text-xl">
                  We're here to support you every step of the way
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Support Options */}
        <section className="w-full py-8 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <MessageCircleIcon className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-gray-600 text-sm mb-4">Chat with our AI assistant</p>
                <Button
                  onClick={() => setIsChatOpen(!isChatOpen)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Start Chat
                </Button>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <PhoneIcon className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="font-semibold mb-2">Phone Support</h3>
                <p className="text-gray-600 text-sm mb-4">Mon-Fri 9AM-6PM EST</p>
                <div className="font-mono text-lg">1-800-CHEAP-SF</div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <MailIcon className="h-12 w-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-gray-600 text-sm mb-4">Response within 24 hours</p>
                <div className="text-sm">support@cheapstuff.com</div>
              </div>
            </div>
          </div>
        </section>

        {/* Chat Widget */}
        {isChatOpen && (
          <section className="w-full py-4 bg-blue-50 border-t-2 border-blue-200">
            <div className="container px-4 md:px-6">
              <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
                <div className="p-4 bg-blue-600 text-white rounded-t-lg flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <BotIcon className="h-5 w-5" />
                    <span className="font-semibold">CheapBot Support</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsChatOpen(false)}
                    className="text-white hover:bg-blue-700"
                  >
                    ✕
                  </Button>
                </div>

                <div className="h-64 overflow-y-auto p-4 space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`flex items-start gap-2 max-w-xs ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-300'
                        }`}>
                          {msg.sender === 'user' ? <UserIcon className="h-3 w-3" /> : <BotIcon className="h-3 w-3" />}
                        </div>
                        <div className={`p-3 rounded-lg ${
                          msg.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {msg.message}
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <BotIcon className="h-3 w-3" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleChatSubmit} className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="sm">
                      <SendIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* FAQ Section */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="flex-1 relative">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search FAQs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* FAQ List */}
            <div className="space-y-4">
              {filteredFAQs.map(faq => (
                <div key={faq.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-lg pr-4">{faq.question}</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {faq.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-4">{faq.answer}</p>

                  {/* Helpful Buttons */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Was this helpful?</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleHelpfulVote(faq.id, true)}
                        className={`flex items-center gap-1 ${
                          helpfulVotes[faq.id] === true ? 'bg-green-100 border-green-300' : ''
                        }`}
                      >
                        <ThumbsUpIcon className="h-3 w-3" />
                        Yes ({faq.helpful + (helpfulVotes[faq.id] === true ? 1 : 0)})
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleHelpfulVote(faq.id, false)}
                        className={`flex items-center gap-1 ${
                          helpfulVotes[faq.id] === false ? 'bg-red-100 border-red-300' : ''
                        }`}
                      >
                        <ThumbsDownIcon className="h-3 w-3" />
                        No ({faq.notHelpful + (helpfulVotes[faq.id] === false ? 1 : 0)})
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredFAQs.length === 0 && (
              <div className="text-center py-12">
                <HelpCircleIcon className="h-24 w-24 mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No FAQs found</h3>
                <p className="text-gray-600">Try adjusting your search terms or category filter.</p>
              </div>
            )}
          </div>
        </section>

        {/* Contact Form */}
        <section className="w-full py-8 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-8">Still Need Help?</h2>
              <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Your Name"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                    <Input
                      type="email"
                      placeholder="Your Email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <Input
                    placeholder="Subject"
                    value={contactForm.subject}
                    onChange={(e) => setContactForm(prev => ({ ...prev, subject: e.target.value }))}
                    required
                  />
                  <Textarea
                    placeholder="Describe your issue in detail..."
                    value={contactForm.message}
                    onChange={(e) => setContactForm(prev => ({ ...prev, message: e.target.value }))}
                    rows={6}
                    required
                  />
                  <Button type="submit" className="w-full bg-[#07B096] hover:bg-[#07B096]/90">
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </section>

        {/* Support Stats Widget */}
        <section className="w-full py-8 bg-white">
          <div className="container px-4 md:px-6">
            <div className="bg-gradient-to-r from-green-100 to-blue-100 rounded-lg p-6">
              <h3 className="text-xl font-bold text-center mb-6">📊 Support Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-green-600">2.3 min</div>
                  <div className="text-sm text-gray-600">Avg. Response Time</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-blue-600">98.5%</div>
                  <div className="text-sm text-gray-600">Customer Satisfaction</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-purple-600">{faqs.length}</div>
                  <div className="text-sm text-gray-600">FAQ Articles</div>
                </div>
                <div className="bg-white p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-orange-600">24/7</div>
                  <div className="text-sm text-gray-600">AI Chat Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}