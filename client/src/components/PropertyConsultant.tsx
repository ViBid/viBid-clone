import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type Message = {
  role: "system" | "assistant" | "user";
  content: string;
  timestamp?: string;
};

export function PropertyConsultant() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI property consultant. How can I help you with your property search today?",
      timestamp: new Date().toISOString()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages when they change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessageMutation = useMutation({
    mutationFn: async (chatMessages: Message[]) => {
      return apiRequest<{ response: string; timestamp: string }>(`/api/consultant-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          messages: chatMessages.filter(msg => msg.role !== "system"),
          language: "en"
        }),
      });
    },
    onSuccess: (data) => {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: data.response,
          timestamp: data.timestamp
        }
      ]);
    },
    onError: () => {
      setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: "I'm sorry, I'm having trouble connecting to my knowledge base. Please try again later.",
          timestamp: new Date().toISOString()
        }
      ]);
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    const newUserMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    // Send the updated messages to the API
    const messagesToSend = [...messages, newUserMessage];
    sendMessageMutation.mutate(messagesToSend);
  };

  // Format the timestamp for display
  const formatTime = (timestamp?: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Floating button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full h-14 w-14 shadow-lg z-50 flex items-center justify-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </Button>
      
      {/* Chat dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md h-[80vh] flex flex-col">
            <CardHeader className="border-b">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src="/agent-avatar.png" alt="Property Consultant" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Property Consultant</CardTitle>
                    <CardDescription>AI-powered assistant</CardDescription>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="flex-grow overflow-y-auto p-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
                      <div className="break-words whitespace-pre-wrap">{message.content}</div>
                      <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </CardContent>
            
            <CardFooter className="border-t p-3">
              <form onSubmit={handleSendMessage} className="flex gap-2 w-full">
                <Input
                  type="text"
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow"
                  disabled={sendMessageMutation.isPending}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  disabled={sendMessageMutation.isPending || !input.trim()}
                >
                  {sendMessageMutation.isPending ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                    </svg>
                  )}
                </Button>
              </form>
            </CardFooter>
          </Card>
        </div>
      )}
    </>
  );
}