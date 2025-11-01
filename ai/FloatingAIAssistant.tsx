import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatMessage } from "./ChatMessage";
import { useLocation } from "react-router-dom";

// Context-aware greetings based on page
const getContextGreeting = (pathname: string): string => {
  switch (pathname) {
    case '/dashboard':
      return "Hey! Great to see you again 🌍 Want me to summarize your weekly progress?";
    case '/logs':
      return "I noticed you're viewing your logs. Want me to show your top activity this week?";
    case '/insights':
      return "Your energy-saving score improved! I can explain what that means if you'd like.";
    case '/leaderboard':
      return "You're just a few points away from the top 3 — want a challenge to boost your score?";
    case '/profile':
      return "Hi! Would you like to edit your bio or see your achievements?";
    case '/ai-assistant':
      return "Welcome! I'm your Eco AI assistant. How can I help you on your sustainability journey today? 🌱";
    default:
      return "Hello! I'm here to help you with your sustainability goals. What would you like to know? 🌿";
  }
};

export const FloatingAIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const { messages, isTyping, sendMessage, addContextMessage } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const hasGreeted = useRef(false);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Add context greeting when chat is opened or page changes
  useEffect(() => {
    if (isOpen && !hasGreeted.current) {
      addContextMessage(getContextGreeting(location.pathname));
      hasGreeted.current = true;
    }
  }, [isOpen, location.pathname, addContextMessage]);

  // Reset greeting flag when page changes
  useEffect(() => {
    hasGreeted.current = false;
  }, [location.pathname]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    await sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 animate-scale-in z-50 bg-gradient-to-br from-primary to-accent hover:from-primary/90 hover:to-accent/90"
        size="icon"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <div className="relative">
            <MessageCircle className="h-6 w-6" />
            <Sparkles className="h-3 w-3 absolute -top-1 -right-1 text-yellow-400 animate-pulse" />
          </div>
        )}
      </Button>

      {/* Chat Window Overlay */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-card border border-border rounded-2xl shadow-2xl z-50 flex flex-col animate-scale-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-accent p-4 rounded-t-2xl text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-background/20 flex items-center justify-center animate-pulse">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold">Eco AI Assistant</h3>
                <p className="text-xs opacity-90">Your sustainability coach</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            <div className="space-y-2">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isTyping && (
                <div className="flex gap-3 mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
                    <Sparkles className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything..."
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                disabled={!inputValue.trim() || isTyping}
                className="bg-primary hover:bg-primary/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
