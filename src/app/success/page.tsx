"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Send, Plus, Globe, Mic, X } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { usePostHog } from 'posthog-js/react';
import PostHog from "posthog-js";

// Initialize PostHog
{/*if (typeof window !== "undefined") {
  const posthogApiKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!posthogApiKey) {
    console.error("❌ Missing PostHog API Key! Check your .env.local file.");
  } else {
    console.log("✅ Initializing PostHog with API Key:", posthogApiKey);
    PostHog.init(posthogApiKey, { api_host: posthogHost });
  }
}
  */}

// Initialize Meta Pixel
export function FacebookPixel() {
  useEffect(() => {
    import("react-facebook-pixel")
      .then((x) => x.default)
      .then((ReactPixel) => {
        ReactPixel.init("your-pixel-id");
        ReactPixel.pageView();
      });
  }, []);

  return null;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

console.log("✅ PostHog API Key:", process.env.NEXT_PUBLIC_POSTHOG_API_KEY);

const suggestedPrompts = [
  {
    title: "Sleep Schedule",
    description: "Help me create a sleep schedule for my 6-month-old baby",
  },
  {
    title: "Feeding Guide",
    description: "What's the recommended feeding schedule for a newborn?",
  },
  {
    title: "Development Milestones",
    description: "What milestones should my 1-year-old be reaching?",
  },
  {
    title: "Safety Tips",
    description: "Essential baby-proofing tips for my home",
  },
];

export default function SuccessPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const posthog = usePostHog();

  const handleSubmit = async (content: string) => {
    if (!content.trim()) return;
    
    // Track the event in PostHog
    posthog?.capture("chat_message_sent", {
      message_content: content,
    });

    // Add user message
    const newMessages = [
      ...messages,
      { role: "user", content },
      // Placeholder response - replace with actual API call
      {
        role: "assistant",
        content: "I'm BabyGPT, a helpful assistant for parents. I aim to provide evidence-based guidance for your parenting journey.",
      },
    ];
    setMessages(newMessages);
    setInput("");
    setShowTraffic(true); // Show high traffic message after submitting
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would implement the Gmail OAuth integration
    console.log("Contact form submitted:", { contactEmail, contactMessage });
    
    // Show success message
    toast.success("Message sent successfully!");
    
    // Reset form and close
    setContactEmail("");
    setContactMessage("");
    setShowContactForm(false);
  };

  return (
    <div className="flex h-screen flex-col bg-white">
      <FacebookPixel />
      
      {/* Welcome Popup */}
      {showWelcome && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowWelcome(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Welcome to BabyGPT!</h2>
              <button 
                onClick={() => setShowWelcome(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="mb-4">Thanks for subscribing.</p>
            <Button 
              className="w-full" 
              onClick={() => setShowWelcome(false)}
            >
              Get Started
            </Button>
          </div>
        </div>
      )}

      {/* High Traffic Popup */}
      {showTraffic && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-2">High Traffic Notice</h2>
            <p>We're experiencing higher than normal traffic. Please check back in a few minutes.</p>
          </div>
        </div>
      )}

      {/* Contact Form */}
      {showContactForm && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowContactForm(false)} />
          <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold">Contact Us</h2>
              <button 
                onClick={() => setShowContactForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea
                  className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>
        </div>
      )}

      {/* Main Chat Interface */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
        <ScrollArea className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="space-y-4 max-w-md mx-auto mt-12">
              <h1 className="text-4xl font-bold text-center mb-8">BabyGPT</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    className="text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                    onClick={() => handleSubmit(prompt.description)}
                  >
                    <h3 className="font-medium">{prompt.title}</h3>
                    <p className="text-sm text-gray-500">{prompt.description}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="border-t p-4">
          <div className="max-w-3xl mx-auto flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMessages([])}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <div className="flex-1 flex items-center gap-2 border rounded-lg px-3 py-2">
              <Input
                className="flex-1 border-0 focus:ring-0"
                placeholder="Message BabyGPT..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(input);
                  }
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-transparent"
              >
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleSubmit(input)}
                className="hover:bg-transparent"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Button */}
        <button
          onClick={() => setShowContactForm(true)}
          className="fixed left-4 bottom-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Contact Us
        </button>
      </main>
    </div>
  );
}