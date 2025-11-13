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
  onAppendMessage: (role: "user" | "assistant", content: string) => void;
}

export function ChatInterface({ messages, onSendMessage, onStartPlanning, onAppendMessage }: ChatInterfaceProps) {
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

    // Save input before clearing
    const userMessage = input;
    const userInput = input.toLowerCase();
    onSendMessage(userMessage);
    setInput("");
    
    // Parse user input with robust extraction (prioritized patterns)
    
    // Budget: Try explicit patterns first, then fallback strategies
    let extractedBudget: number | null = null;
    
    // Priority 1: Explicit budget mentions with context
    const explicitBudgetMatch = userMessage.match(/(?:budget|spend|cost|price)\s*(?:of|around|about|is)?\s*\$?\s*([\d,]+)/i);
    if (explicitBudgetMatch) {
      extractedBudget = parseInt(explicitBudgetMatch[1].replace(/,/g, ''));
    }
    
    // Priority 2: Dollar sign followed by numbers
    if (!extractedBudget) {
      const dollarMatch = userMessage.match(/\$\s*([\d,]+)/);
      if (dollarMatch) {
        extractedBudget = parseInt(dollarMatch[1].replace(/,/g, ''));
      }
    }
    
    // Priority 3: Find largest reasonable number (≥500)
    if (!extractedBudget) {
      const allNumbers = userMessage.match(/\b(\d{3,})\b/g);
      if (allNumbers) {
        const nums = allNumbers.map(n => parseInt(n)).filter(n => n >= 500 && n <= 100000);
        if (nums.length > 0) {
          extractedBudget = Math.max(...nums);
        }
      }
    }
    
    // Validate and constrain budget (500-100000)
    const currentBudget = extractedBudget && extractedBudget >= 500 && extractedBudget <= 100000 
      ? extractedBudget 
      : 5000;
    
    // Duration extraction (avoid matching budget numbers)
    const daysMatch = userMessage.match(/(\d+)\s*(?:day|night)s?/i);
    const currentDuration = daysMatch ? Math.min(Math.max(parseInt(daysMatch[1]), 1), 30) : 7;
    
    // Month and city extraction
    const monthMatch = userInput.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
    const currentMonth = monthMatch ? monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1) : undefined;
    
    const departureCityMatch = userMessage.match(/from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    const currentDepartureCity = departureCityMatch ? departureCityMatch[1] : "New York";
    
    // Detect interests from input
    const likesAdventure = /\b(adventure|hiking|diving|explore|active)\b/i.test(userInput);
    const likesRelaxation = /\b(relax|spa|beach|wellness|peaceful|tranquil)\b/i.test(userInput);
    const hasSpecialOccasion = /\b(anniversary|honeymoon|birthday|celebration|wedding)\b/i.test(userInput);
    
    
    // Immediate AI response with transparency about assumptions
    setTimeout(() => {
      const isBudgetLuxury = currentBudget >= 8000;
      const isBudgetMid = currentBudget >= 3000 && currentBudget < 8000;
      const isBudgetEconomy = currentBudget < 3000;
      const assumptions = [];
      
      // Show what we extracted vs defaulted
      if (!extractedBudget) assumptions.push(`$${currentBudget.toLocaleString()} executive budget`);
      if (!daysMatch) assumptions.push(`${currentDuration}-day journey`);
      if (!monthMatch && currentMonth) assumptions.push(`${currentMonth} departure`);
      if (!departureCityMatch) assumptions.push(`from ${currentDepartureCity}`);
      
      // Budget-aware response
      let budgetMessage = '';
      if (extractedBudget) {
        if (isBudgetLuxury) budgetMessage = `Perfect! With your $${currentBudget.toLocaleString()} luxury budget, I'll curate premium experiences.`;
        else if (isBudgetMid) budgetMessage = `Excellent! Your $${currentBudget.toLocaleString()} budget opens up wonderful possibilities.`;
        else budgetMessage = `Smart planning! With $${currentBudget.toLocaleString()}, I'll focus on maximizing value.`;
      } else {
        budgetMessage = `Perfect! ${isBudgetLuxury ? 'Your premium budget opens up extraordinary possibilities.' : 'Great planning!'}`;
      }
      
      let aiResponse = `${budgetMessage} ${assumptions.length > 0 ? `Assuming ${assumptions.join(', ')}` : 'I have all the details'}—adjust anytime after results. `;
      
      if (hasSpecialOccasion) aiResponse += "I'll prioritize romantic experiences. ";
      if (likesAdventure) aiResponse += "Including adventure activities. ";
      if (likesRelaxation) aiResponse += "With wellness and spa options. ";
      
      aiResponse += "Deploying our multi-agent AI team now. Watch 5 specialized agents collaborate in real-time to curate your ideal itinerary in approximately 12 seconds.";
      
      // Use centralized message creation from parent
      onAppendMessage("assistant", aiResponse);
      
      // Start planning immediately after a short delay
      setTimeout(() => {
        onStartPlanning({
          description: userMessage,
          budget: currentBudget,
          duration: currentDuration,
          travelers: 2,
          departureCity: currentDepartureCity,
          month: currentMonth,
          interests: likesAdventure ? ["adventure", "exploration"] : likesRelaxation ? ["wellness", "gastronomy"] : ["gastronomy", "wellness"],
        });
      }, 1500);
    }, 800);
  };

  // Helper to format budget nicely
  const formatBudget = (amount?: number) => {
    if (!amount) return "";
    return `$${amount.toLocaleString()}`;
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
    
    // Use onSendMessage for user messages (which internally calls appendMessage)
    // Use onAppendMessage only for assistant messages
    const msg1 = "Coastal retreat, $5,000 investment, 7-day journey for two";
    onSendMessage(msg1);
    
    setTimeout(() => {
      const msg2 = "June departure from New York, focus on wellness and exceptional gastronomy";
      onSendMessage(msg2);
      
      setTimeout(() => {
        const aiResponse = "Wonderful! Deploying our travel concierge team now. Watch as five specialized AI agents orchestrate your luxury getaway in real-time!";
        onAppendMessage("assistant", aiResponse);
        
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

      {/* Modern Chat Messages */}
      {messages.length > 0 && (
        <Card className="p-8 max-h-96 overflow-y-auto space-y-6 shadow-lg border-border/50">
          <AnimatePresence>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.1 }}
                className={`flex gap-4 ${
                  message.role === "user" ? "flex-row-reverse" : message.role === "assistant" ? "flex-row" : "flex-row"
                }`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80"
                      : message.role === "assistant"
                      ? "bg-gradient-to-br from-accent to-accent/80"
                      : "bg-gradient-to-br from-accent to-accent/80"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : message.role === "assistant" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 px-5 py-4 rounded-2xl shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white"
                      : message.role === "assistant"
                      ? "bg-white border border-border/50"
                      : "bg-white border border-border/50"
                  }`}
                  data-testid={`message-content-${message.role}-${index}`}
                >
                  <p className={`text-sm leading-relaxed ${message.role === "user" ? "text-white" : message.role === "assistant" ? "text-foreground" : "text-foreground"}`}>
                    {message.content}
                  </p>
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
