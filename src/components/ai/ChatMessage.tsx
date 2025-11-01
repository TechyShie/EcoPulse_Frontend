import { Message } from "@/hooks/useAIChat";
import { Leaf } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-3 mb-4 animate-fade-in ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      {isAssistant && (
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center animate-pulse">
            <Leaf className="h-4 w-4 text-primary-foreground" />
          </div>
        </div>
      )}
      
      <div className={`max-w-[80%] ${isAssistant ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-2xl px-4 py-3 ${
          isAssistant 
            ? 'bg-muted text-foreground' 
            : 'bg-primary text-primary-foreground'
        }`}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-1 px-2">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>

      {!isAssistant && (
        <Avatar className="flex-shrink-0 h-8 w-8 bg-primary text-primary-foreground">
          <AvatarFallback>AX</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};
