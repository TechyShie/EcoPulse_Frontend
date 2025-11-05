import { useState, useRef, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Leaf, ArrowLeft } from "lucide-react";
import { useAIChat } from "@/hooks/useAIChat";
import { ChatMessage } from "@/components/ai/ChatMessage";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const quickPrompts = [
  "How can I reduce my carbon footprint?",
  "Give me eco tips for today",
  "What are easy ways to save energy at home?",
  "How can I reduce plastic waste?",
];

const AIAssistant = () => {
  const [inputValue, setInputValue] = useState("");
  const { messages, isTyping, sendMessage, addContextMessage } = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [messages, isTyping]);

  // Add welcome message on mount
  useEffect(() => {
    if (messages.length === 0) {
      addContextMessage(
        "Hello! I'm your EcoPulse AI assistant 🌱\n\nI'm here to help you with:\n• Reducing your carbon footprint\n• Sustainable living tips\n• Eco-friendly product recommendations\n• Energy conservation strategies\n• Waste reduction techniques\n\nWhat would you like to know about sustainable living?"
      );
    }
  }, [addContextMessage, messages.length]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    try {
      await sendMessage(inputValue);
      setInputValue("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleQuickPrompt = async (prompt: string) => {
    await sendMessage(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-16 items-center justify-between px-6">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Dashboard
                </Button>
              </div>
              <Avatar className="h-10 w-10 bg-primary text-primary-foreground">
                <AvatarFallback>AX</AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-5xl mx-auto w-full">
            {/* Header Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-accent mb-4">
                <Sparkles className="h-10 w-10 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Eco AI Assistant
              </h1>
              <p className="text-muted-foreground text-lg">
                Your personal sustainability guide 🌍
              </p>
            </div>

            {/* Quick Prompts */}
            {messages.length <= 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-muted-foreground mb-3 text-center">
                  Quick questions to get started:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {quickPrompts.map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="h-auto py-4 px-6 text-left justify-start hover:bg-secondary/50 hover:border-primary transition-all"
                      onClick={() => handleQuickPrompt(prompt)}
                      disabled={isTyping}
                    >
                      <Leaf className="h-5 w-5 text-primary mr-3 flex-shrink-0" />
                      <span className="text-sm">{prompt}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Panel */}
            <Card className="shadow-lg border-primary/20">
              <CardContent className="p-0">
                {/* Messages */}
                <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <ChatMessage key={message.id} message={message} />
                    ))}
                    
                    {isTyping && (
                      <div className="flex gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <div className="bg-muted rounded-2xl px-5 py-4">
                          <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-2.5 h-2.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-6 border-t border-border bg-muted/30">
                  <div className="flex gap-3">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask me anything about sustainability, eco-tips, or your carbon footprint..."
                      className="flex-1 h-12"
                      disabled={isTyping}
                    />
                    <Button 
                      onClick={handleSend} 
                      size="lg"
                      disabled={!inputValue.trim() || isTyping}
                      className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 px-8"
                    >
                      <Send className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AIAssistant;