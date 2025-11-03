import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, User, Bot, Users, Zap, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChatMessage, VacationPreferences } from "@shared/schema";

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (content: string) => void;
  onStartPlanning: (preferences: VacationPreferences) => void;
  onAddMessage: (message: ChatMessage) => void;
}

export function ChatInterface({ messages, onSendMessage, onStartPlanning, onAddMessage }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const [conversationStep, setConversationStep] = useState(0);
  const [preferences, setPreferences] = useState<Partial<VacationPreferences>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSendMessage(input);
    
    // Parse user input and extract preferences (mock logic for demo)
    if (conversationStep === 0) {
      // Initial input - extract basic info
      const hasBeach = input.toLowerCase().includes("beach");
      const hasBudget = input.match(/\$?([\d,]+)/);
      const hasDays = input.match(/(\d+)\s*days?/);
      
      if (hasBeach && hasBudget && hasDays) {
        // User provided comprehensive info, ask for details
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "Wonderful! I'll help you curate an extraordinary beach getaway. What month were you envisioning for your journey? And which city will you be departing from?",
            timestamp: new Date(),
          };
          onAddMessage(aiMessage);
        }, 800);
        setConversationStep(1);
      } else {
        // Vague input - ask for more details
        setTimeout(() => {
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: "ai",
            content: "I'd be delighted to assist with your travel planning! To curate the perfect getaway, I'll need a few details: What's your travel investment range? Duration of your stay? Any preferences for experiences (coastal retreat, cultural immersion, adventure)?",
            timestamp: new Date(),
          };
          onAddMessage(aiMessage);
        }, 800);
      }
    } else if (conversationStep === 1) {
      // Second input - ready to start
      setTimeout(() => {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "ai",
          content: "Excellent! I'm deploying our specialized AI travel concierge team. They'll analyze over 500 luxury properties, premium routes, and curated experiences to orchestrate your perfect getaway. Your bespoke itinerary will be ready in approximately 90 seconds.",
          timestamp: new Date(),
        };
        onAddMessage(aiMessage);
        
        // Trigger planning
        setTimeout(() => {
          onStartPlanning({
            description: "Coastal retreat for discerning travelers",
            budget: 5000,
            duration: 7,
            travelers: 2,
            departureCity: "NYC",
            month: "June",
            interests: ["gastronomy", "wellness"],
          });
        }, 1500);
      }, 800);
    }
    
    setInput("");
  };

  const handleQuickStart = () => {
    const quickPrefs: VacationPreferences = {
      description: "Luxury coastal retreat with focus on wellness and fine dining, 7-day journey for discerning couple",
      budget: 5000,
      duration: 7,
      travelers: 2,
      departureCity: "New York",
      month: "June",
      interests: ["gastronomy", "wellness", "beachfront"],
    };
    
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: "Coastal retreat, $5,000 investment, 7-day journey for two",
      timestamp: new Date(),
    };
    onAddMessage(userMsg);
    onSendMessage(userMsg.content);
    
    setTimeout(() => {
      const userMsg2: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "user",
        content: "June departure from New York, focus on wellness and exceptional gastronomy",
        timestamp: new Date(),
      };
      onAddMessage(userMsg2);
      onSendMessage(userMsg2.content);
      
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          role: "ai",
          content: "Wonderful! Deploying our travel concierge team now. Watch as five specialized AI agents orchestrate your luxury getaway in real-time!",
          timestamp: new Date(),
        };
        onAddMessage(aiMsg);
        
        setTimeout(() => {
          onStartPlanning(quickPrefs);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-12"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">
            NorthBay AI Travel Concierge
          </span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-foreground">
          Your Perfect Getaway, Orchestrated by AI
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Describe your ideal journey, and watch our AI concierge team curate every detail -
          from exclusive destinations to bespoke experiences.
        </p>
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>15 hours of research → 90 seconds</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-accent" />
            <span>500+ luxury properties vetted</span>
          </div>
        </div>
      </motion.div>

      {/* Chat Messages */}
      {messages.length > 0 && (
        <Card className="p-6 max-h-96 overflow-y-auto space-y-4">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-3 ${
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === "user"
                      ? "bg-primary/10"
                      : "bg-accent/50"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-accent-foreground" />
                  )}
                </div>
                <div
                  className={`flex-1 px-4 py-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                  data-testid={`message-content-${message.role}-${index}`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </Card>
      )}

      {/* Input Area */}
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Example: Coastal retreat, $5,000 travel investment, 7-day journey for two discerning travelers..."
              className="min-h-[120px] pr-12 resize-none text-base"
              data-testid="input-vacation-description"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute bottom-3 right-3"
              disabled={!input.trim()}
              data-testid="button-send-message"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Try:</span>
              <Badge
                variant="secondary"
                className="cursor-pointer hover-elevate"
                onClick={() => setInput("Luxury Caribbean coastal retreat")}
                data-testid="badge-example-beach"
              >
                Caribbean escape
              </Badge>
              <Badge
                variant="secondary"
                className="cursor-pointer hover-elevate"
                onClick={() => setInput("European cultural journey with gastronomy focus")}
                data-testid="badge-example-europe"
              >
                European expedition
              </Badge>
            </div>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleQuickStart}
              data-testid="button-quick-demo"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Quick Demo
            </Button>
          </div>
        </form>
      </Card>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            icon: Users,
            title: "5 Travel Specialists",
            description: "Parallel AI concierge team orchestrating your perfect journey",
          },
          {
            icon: Zap,
            title: "Live Orchestration",
            description: "Witness real-time collaboration and route optimization",
          },
          {
            icon: Lightbulb,
            title: "Transparent Curation",
            description: "Every selection backed by expert reasoning and insights",
          },
        ].map((feature, index) => {
          const IconComponent = feature.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <Card className="p-4 hover-elevate">
                <div className="mb-3">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
