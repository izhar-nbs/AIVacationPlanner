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
  const messageIdCounter = useRef(0);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userInput = input.toLowerCase();
    onSendMessage(input);
    setInput("");
    
    // Parse user input for preferences
    const budgetMatch = input.match(/\$?([\d,]+)/);
    const daysMatch = input.match(/(\d+)\s*days?/);
    
    // Check what information we have so far
    const hasDestinationType = userInput.includes("beach") || userInput.includes("mountain") || 
                               userInput.includes("city") || userInput.includes("tropical");
    const hasBudget = budgetMatch || preferences.budget;
    const hasDuration = daysMatch || preferences.duration;
    const hasMonth = preferences.month || /\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i.test(userInput);
    const hasDepartureCity = preferences.departureCity || userInput.includes("from ");
    
    // Update preferences based on current input
    if (budgetMatch && !preferences.budget) {
      setPreferences(prev => ({ ...prev, budget: parseInt(budgetMatch[1].replace(/,/g, '')) }));
    }
    if (daysMatch && !preferences.duration) {
      setPreferences(prev => ({ ...prev, duration: parseInt(daysMatch[1]) }));
    }
    
    // Extract and persist month
    const monthMatch = userInput.match(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/i);
    if (monthMatch && !preferences.month) {
      const month = monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1);
      setPreferences(prev => ({ ...prev, month }));
    }
    
    // Extract and persist departure city
    const departureCityMatch = input.match(/from\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/i);
    if (departureCityMatch && !preferences.departureCity) {
      setPreferences(prev => ({ ...prev, departureCity: departureCityMatch[1] }));
    }
    
    // Detect user preferences for interests
    const likesAdventure = /\b(adventure|hiking|diving|explore|active)\b/i.test(userInput);
    const likesRelaxation = /\b(relax|spa|beach|wellness|peaceful|tranquil)\b/i.test(userInput);
    
    // Persist interests based on detected preferences
    if ((likesAdventure || likesRelaxation) && !preferences.interests) {
      const interests = likesAdventure ? ["adventure", "exploration"] : ["wellness", "gastronomy"];
      setPreferences(prev => ({ ...prev, interests }));
    }
    
    // Always respond with intelligent, context-aware AI message
    setTimeout(() => {
      let aiResponse = "";
      
      // Use freshly parsed values instead of async state
      const currentBudget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : preferences.budget;
      const currentDuration = daysMatch ? parseInt(daysMatch[1]) : preferences.duration;
      const currentMonth = monthMatch ? monthMatch[1].charAt(0).toUpperCase() + monthMatch[1].slice(1) : preferences.month;
      
      // Check for contextual cues in current message (not async state)
      const currentMonthDetected = /\b(june|july|august|september)\b/i.test(userInput);
      const isJuneSeptember = monthMatch && currentMonthDetected;
      const isBudgetLuxury = budgetMatch && currentBudget && currentBudget > 4000;
      const isBudgetValue = budgetMatch && currentBudget && currentBudget < 3000;
      const currentHasSpecialOccasion = /\b(anniversary|honeymoon|birthday|celebration|wedding)\b/i.test(userInput);
      
      if (conversationStep === 0) {
        // First message - intelligent contextual response
        if (hasDestinationType && hasBudget && hasDuration) {
          // Smart follow-up based on what we know
          if (isBudgetLuxury) {
            aiResponse = `Excellent! A ${currentDuration}-day ${hasDestinationType ? 'retreat' : 'journey'} with a ${formatBudget(currentBudget)} budget opens up premium possibilities. ${isJuneSeptember ? 'June-September is perfect for tropical destinations - would you prefer Caribbean or Mediterranean?' : 'What month are you planning to travel?'} Also, which city will you be departing from?`;
          } else if (isBudgetValue) {
            aiResponse = `Smart planning! A ${currentDuration}-day trip with a ${formatBudget(currentBudget)} budget means I'll focus on maximizing value. ${isJuneSeptember ? 'Traveling in summer? Great timing for deals!' : 'What month works best for you?'} And your departure city?`;
          } else {
            aiResponse = "Wonderful! To perfect your itinerary, what month are you planning to travel? And which city will you be departing from?";
          }
          setConversationStep(1);
        } else if (hasDestinationType || hasBudget || hasDuration) {
          if (hasBudget && isBudgetLuxury) {
            aiResponse = `I love your ${formatBudget(currentBudget)} budget - that opens up some extraordinary experiences! To curate the perfect journey, how many days are you planning? And what type of destination excites you most - beachfront paradise, cultural immersion, or mountain retreat?`;
          } else if (hasDestinationType) {
            aiResponse = "Great start! To craft your ideal itinerary, I'll need your budget range and trip duration. Also, are you celebrating anything special, or is this pure relaxation?";
          } else {
            aiResponse = "Great start! To create your perfect journey, I'll need a few more details. Could you share your budget range, trip duration (in days), and what type of destination appeals to you (beach, mountains, city, etc.)?";
          }
        } else {
          aiResponse = "I'm excited to help plan your journey! Tell me about your ideal trip: What's your budget? How many days? What kind of destination interests you?";
        }
      } else if (conversationStep === 1) {
        // Second message - intelligent context-based questions
        if (hasBudget && hasDuration && (hasMonth || hasDepartureCity)) {
          // Final smart question before deploying agents
          let insights = [];
          if (currentHasSpecialOccasion) insights.push("I'll prioritize romantic experiences");
          if (likesAdventure) insights.push("including adventure activities");
          if (likesRelaxation) insights.push("with wellness and spa options");
          
          aiResponse = `Perfect! ${insights.length > 0 ? insights.join(' ') + '. ' : ''}I'm now deploying our multi-agent AI team. Watch in real-time as 5 specialized agents collaborate to curate your ideal itinerary in approximately 12 seconds.`;
          setConversationStep(2);
          
          // Start planning after a short delay
          setTimeout(() => {
            onStartPlanning({
              description: `${hasDestinationType ? 'Coastal retreat' : 'Curated journey'} for discerning travelers`,
              budget: currentBudget || 5000,
              duration: currentDuration || 7,
              travelers: 2,
              departureCity: preferences.departureCity || "New York",
              month: currentMonth || "June",
              interests: likesAdventure ? ["adventure", "exploration"] : likesRelaxation ? ["wellness", "gastronomy"] : ["gastronomy", "wellness"],
            });
          }, 1500);
        } else if (hasBudget && hasDuration) {
          // Smart contextual question
          if (isJuneSeptember) {
            aiResponse = `Great! Traveling in ${currentMonth || 'summer'} - I recommend avoiding hurricane-prone Caribbean islands. Would you prefer Mediterranean coastlines or Pacific destinations? Also, your departure city?`;
          } else {
            aiResponse = "Excellent details! Just need the departure month and your home city. Also, quick question - do you prefer direct flights or are you open to connections if it means better rates?";
          }
        } else {
          aiResponse = "Excellent details! Just need the departure month and your home city, then we can start orchestrating your perfect getaway.";
        }
      } else {
        // Conversation step 2+ - always be helpful
        aiResponse = "I'm still working on your itinerary. Our AI agents are analyzing hundreds of options. Your personalized travel plan will be ready shortly!";
      }
      
      const aiMessage: ChatMessage = {
        id: `${Date.now()}-${++messageIdCounter.current}`,
        role: "ai",
        content: aiResponse,
        timestamp: new Date(),
      };
      onAddMessage(aiMessage);
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
    
    const userMsg: ChatMessage = {
      id: `${Date.now()}-${++messageIdCounter.current}`,
      role: "user",
      content: "Coastal retreat, $5,000 investment, 7-day journey for two",
      timestamp: new Date(),
    };
    onAddMessage(userMsg);
    onSendMessage(userMsg.content);
    
    setTimeout(() => {
      const userMsg2: ChatMessage = {
        id: `${Date.now()}-${++messageIdCounter.current}`,
        role: "user",
        content: "June departure from New York, focus on wellness and exceptional gastronomy",
        timestamp: new Date(),
      };
      onAddMessage(userMsg2);
      onSendMessage(userMsg2.content);
      
      setTimeout(() => {
        const aiMsg: ChatMessage = {
          id: `${Date.now()}-${++messageIdCounter.current}`,
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
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
                data-testid={`message-${message.role}-${index}`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/80"
                      : "bg-gradient-to-br from-accent to-accent/80"
                  }`}
                >
                  {message.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 px-5 py-4 rounded-2xl shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-primary to-primary/90 text-white"
                      : "bg-white border border-border/50"
                  }`}
                  data-testid={`message-content-${message.role}-${index}`}
                >
                  <p className={`text-sm leading-relaxed ${message.role === "ai" ? "text-foreground" : ""}`}>
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
