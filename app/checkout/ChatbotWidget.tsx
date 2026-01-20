"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { initMixpanelOnce } from "@/lib/analytics";
import { products } from "./products";

// @ts-ignore
declare global {
  interface Window {
    mixpanel: any;
  }
}

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  productRecommendations?: typeof products;
}

const botResponses = [
  {
    trigger: /hello|hi|hey/i,
    responses: [
      "Hey there, shopping superstar! 🛍️ Ready to find some amazing deals?",
      "Hi! I'm BuyBot, your personal shopping assistant! What treasures are we hunting for today?",
      "Hello, future owner of awesome stuff! 🎉 How can I help you shop smarter?"
    ]
  },
  {
    trigger: /help|what can you do/i,
    responses: [
      "I'm here to help you find the perfect products! Just tell me what you're looking for - electronics, fitness gear, kitchen gadgets, you name it! 🚀",
      "I can recommend products, find deals, and make your shopping experience legendary! What category interests you?",
      "Think of me as your shopping bestie! I know all the hottest items in electronics, fitness, kitchen, and more! 💫"
    ]
  },
  {
    trigger: /electronic|phone|laptop|gadget|tech/i,
    responses: [
      "Ah, a tech enthusiast! 🔌 Let me show you our hottest electronics...",
      "Great choice! Our electronics section is 🔥 right now. Check these out:",
      "Tech lover detected! 📱 I've got just the gadgets for you:"
    ],
    recommendCategory: "Electronics"
  },
  {
    trigger: /fitness|gym|workout|health|exercise/i,
    responses: [
      "Time to get those gains! 💪 Here are our top fitness products:",
      "Fitness goals? I got you! Check out these workout essentials:",
      "Let's get you equipped for beast mode! 🏋️ Here's what's trending:"
    ],
    recommendCategory: "Fitness"
  },
  {
    trigger: /kitchen|cook|food|chef/i,
    responses: [
      "Ready to become a kitchen wizard? 👨‍🍳 Check out these amazing tools:",
      "Cooking up something special? These kitchen gadgets are chef's kiss! 👌",
      "Your culinary journey starts here! 🍳 Take a look at these:"
    ],
    recommendCategory: "Kitchen"
  },
  {
    trigger: /home|garden|decor|furniture/i,
    responses: [
      "Let's make your space amazing! 🏡 Here are some home & garden favorites:",
      "Home sweet home deserves the best! Check out these items:",
      "Transform your space with these beauties! ✨"
    ],
    recommendCategory: "Home & Garden"
  },
  {
    trigger: /book|read|media|movie|music/i,
    responses: [
      "A person of culture! 📚 Here's what's popular in books & media:",
      "Feed your mind with these amazing picks! 🎬",
      "Entertainment awaits! Check out our books & media collection:"
    ],
    recommendCategory: "Books & Media"
  },
  {
    trigger: /deal|discount|sale|cheap|budget/i,
    responses: [
      "DEALS?! You came to the right bot! 🤑 Everything's on sale if you're brave enough! Check out today's steals:",
      "Budget-friendly? Say no more! 💰 These deals are practically stealing:",
      "Flash sale alert! ⚡ These prices won't last long:"
    ]
  },
  {
    trigger: /thank|thanks|thx/i,
    responses: [
      "You're welcome! Happy shopping! 🎉 Don't forget to check out with code CHATBOT10 for an extra surprise!",
      "My pleasure! May your cart be full and your wallet be happy! 💳✨",
      "Anytime! Remember, I'm here 24/7 for all your shopping needs! 🛒"
    ]
  }
];

const defaultResponses = [
  "Interesting! Let me find something perfect for you! What type of products do you usually love?",
  "I'm on it! 🔍 While I search, what's your budget range looking like?",
  "Great question! Browse our categories above or tell me more about what you're looking for!",
  "Hmm, let me think... 🤔 Are you shopping for yourself or looking for a gift?",
  "I love your enthusiasm! What brings you to weBuy today?"
];

export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check feature flag
  useEffect(() => {
    initMixpanelOnce();

    // Check if feature flag is enabled
    if (window.mixpanel?.flags) {
      window.mixpanel.flags
        .is_enabled('we_buy_chatbot', false)
        .then((enabled: boolean) => {
          setShouldShow(enabled);
          if (enabled) {
            console.log('[MIXPANEL]: Chatbot feature flag enabled');
            window.mixpanel.track('Chatbot Loaded');
          }
        })
        .catch((error: any) => {
          console.error('[MIXPANEL]: Error checking chatbot flag:', error);
        });
    }
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome message when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage: Message = {
        id: Date.now(),
        text: "👋 Welcome to weBuy! I'm your AI shopping assistant. How can I help you find the perfect product today?",
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, messages.length]);

  const handleOpen = () => {
    setIsOpen(true);
    if (window.mixpanel) {
      window.mixpanel.track('Chatbot Opened');
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    if (window.mixpanel) {
      window.mixpanel.track('Chatbot Closed', {
        message_count: messages.length
      });
    }
  };

  const sendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Track message sent
    if (window.mixpanel) {
      window.mixpanel.track('Chatbot Message Sent', {
        message_text: inputValue.substring(0, 100), // Truncate for privacy
        message_length: inputValue.length
      });
    }

    // Simulate bot response with delay
    setTimeout(() => {
      generateBotResponse(inputValue);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // 1-2 seconds delay
  };

  const generateBotResponse = (userInput: string) => {
    let response = "";
    let recommendedProducts: typeof products | undefined;

    // Check for matching triggers
    const matchedResponse = botResponses.find(r => r.trigger.test(userInput));

    if (matchedResponse) {
      response = matchedResponse.responses[Math.floor(Math.random() * matchedResponse.responses.length)];

      // Add product recommendations if specified
      if ('recommendCategory' in matchedResponse) {
        recommendedProducts = products
          .filter(p => p.category === matchedResponse.recommendCategory)
          .slice(0, 3); // Show top 3 products
      } else if (userInput.toLowerCase().includes('deal') || userInput.toLowerCase().includes('sale')) {
        // Show random products for deals
        recommendedProducts = [...products]
          .sort(() => Math.random() - 0.5)
          .slice(0, 3);
      }
    } else {
      // Use default response
      response = defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    const botMessage: Message = {
      id: Date.now(),
      text: response,
      isBot: true,
      timestamp: new Date(),
      productRecommendations: recommendedProducts
    };

    setMessages(prev => [...prev, botMessage]);

    // Track bot response
    if (window.mixpanel) {
      window.mixpanel.track('Chatbot Response Generated', {
        has_recommendations: !!recommendedProducts,
        recommendation_count: recommendedProducts?.length || 0
      });
    }
  };

  const handleProductClick = (product: typeof products[0]) => {
    if (window.mixpanel) {
      window.mixpanel.track('Chatbot Product Clicked', {
        product_id: product.id,
        product_name: product.name,
        product_price: product.price,
        product_category: product.category
      });
    }
    // Could open product modal or navigate to product page
    window.location.href = `/checkout?product=${product.id}`;
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Chat Bubble */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleOpen}
            className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full p-5 shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Add wiggle animation to catch attention */}
            <motion.div
              animate={{
                rotate: [0, -15, 15, -15, 15, 0],
              }}
              transition={{
                duration: 0.6,
                delay: 1,
                repeat: Infinity,
                repeatDelay: 4,
              }}
            >
              <MessageCircle className="h-8 w-8" />
            </motion.div>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="h-8 w-8" />
                  <span className="absolute bottom-0 right-0 h-2 w-2 bg-green-400 rounded-full border-2 border-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold">BuyBot Assistant</h3>
                  <p className="text-xs opacity-90">Always here to help!</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="hover:bg-white/20 rounded-lg p-1 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`flex gap-2 max-w-[80%] ${message.isBot ? '' : 'flex-row-reverse'}`}>
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${
                      message.isBot ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {message.isBot ? <Bot className="h-5 w-5 text-purple-600" /> : <User className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div>
                      <div className={`rounded-lg px-4 py-2 ${
                        message.isBot
                          ? 'bg-white border border-gray-200'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                      }`}>
                        <p className="text-sm">{message.text}</p>
                      </div>

                      {/* Product Recommendations */}
                      {message.productRecommendations && (
                        <div className="mt-2 space-y-2">
                          {message.productRecommendations.map(product => (
                            <motion.div
                              key={product.id}
                              whileHover={{ scale: 1.02 }}
                              onClick={() => handleProductClick(product)}
                              className="bg-white border border-gray-200 rounded-lg p-2 cursor-pointer hover:shadow-md transition-shadow"
                            >
                              <div className="flex gap-2">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-12 w-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-gray-900">{product.name}</p>
                                  <p className="text-xs text-purple-600 font-bold">${product.price}</p>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex gap-1">
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: 0 }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: 0.2 }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                      <motion.span
                        animate={{ opacity: [0.4, 1, 0.4] }}
                        transition={{ duration: 1.4, repeat: Infinity, delay: 0.4 }}
                        className="h-2 w-2 bg-gray-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send className="h-4 w-4" />
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by weBuy AI • Not actually AI 😉
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}