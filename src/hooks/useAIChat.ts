import { useState, useCallback } from 'react';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UseAIChatReturn {
  messages: Message[];
  isTyping: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  addContextMessage: (content: string) => void;
}

// Mock AI responses based on keywords
const getMockResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase();
  
  if (msg.includes('tip') || msg.includes('advice')) {
    return "Here's a great eco tip: Try using reusable shopping bags! It can reduce plastic waste significantly. 🌱";
  }
  if (msg.includes('progress') || msg.includes('performance') || msg.includes('summary')) {
    return "Your weekly performance looks great! You've logged 12 eco actions and earned 340 points. Keep up the amazing work! 💚";
  }
  if (msg.includes('challenge')) {
    return "Here's a challenge for you: Try going plastic-free for 3 days! Complete it to earn 100 bonus points. 🎯";
  }
  if (msg.includes('point') || msg.includes('score')) {
    return "You can earn more points by: logging daily eco actions, completing challenges, and maintaining streaks. Try the 7-day challenge! 🌟";
  }
  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "Hello! I'm your Eco AI assistant. How can I help you today? I can give you tips, analyze your progress, or suggest new challenges! 🌍";
  }
  
  return "That's a great question! I'm here to help you on your sustainability journey. Try asking me about eco tips, your progress, or new challenges you can take on! 🌿";
};

export const useAIChat = (): UseAIChatReturn => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback(async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Add AI response
    const aiMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: getMockResponse(content),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, aiMessage]);
    setIsTyping(false);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const addContextMessage = useCallback((content: string) => {
    const contextMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, contextMessage]);
  }, []);

  return {
    messages,
    isTyping,
    sendMessage,
    clearMessages,
    addContextMessage,
  };
};
