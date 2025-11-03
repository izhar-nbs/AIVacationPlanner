import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { SuggestionsSidebar } from "@/components/vacation/suggestions-sidebar";
import { ChatInterface } from "@/components/vacation/chat-interface";
import { MultiAgentDashboard } from "@/components/vacation/multi-agent-dashboard";
import { BudgetTracker } from "@/components/vacation/budget-tracker";
import { ResultsPresentation } from "@/components/vacation/results-presentation";
import { RefinementControls } from "@/components/vacation/refinement-controls";
import { CheckoutModal } from "@/components/vacation/checkout-modal";
import { SuccessConfirmation } from "@/components/vacation/success-confirmation";
import { ComparisonView } from "@/components/vacation/comparison-view";
import { AgentSimulation, simulateRefinement } from "@/lib/agent-simulation";
import { useToast } from "@/hooks/use-toast";
import type { 
  AppPhase, 
  ChatMessage, 
  VacationPreferences, 
  TripPlan,
  RefinementRequest,
  Agent,
  InterAgentMessage 
} from "@shared/schema";

export default function VacationPlanner() {
  const [phase, setPhase] = useState<AppPhase>("input");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [preferences, setPreferences] = useState<VacationPreferences>({
    description: "",
  });
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  const [previousPlan, setPreviousPlan] = useState<TripPlan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents, setAgents] = useState<Record<string, Agent>>({
    "destination-scout": {
      id: "destination-scout",
      name: "Destination Curator",
      description: "Curating exclusive destinations",
      icon: "Compass",
      progress: 0,
      status: "idle",
      currentTask: "Awaiting deployment...",
      updates: []
    },
    "flight-optimizer": {
      id: "flight-optimizer",
      name: "Flight Concierge",
      description: "Securing premium routes",
      icon: "Plane",
      progress: 0,
      status: "idle",
      currentTask: "Awaiting deployment...",
      updates: []
    },
    "accommodation-finder": {
      id: "accommodation-finder",
      name: "Hospitality Specialist",
      description: "Sourcing luxury accommodations",
      icon: "Hotel",
      progress: 0,
      status: "idle",
      currentTask: "Awaiting deployment...",
      updates: []
    },
    "itinerary-architect": {
      id: "itinerary-architect",
      name: "Experience Designer",
      description: "Crafting bespoke experiences",
      icon: "CalendarDays",
      progress: 0,
      status: "idle",
      currentTask: "Awaiting deployment...",
      updates: []
    },
    "budget-guardian": {
      id: "budget-guardian",
      name: "Travel Investment Advisor",
      description: "Optimizing travel value",
      icon: "DollarSign",
      progress: 0,
      status: "idle",
      currentTask: "Awaiting deployment...",
      updates: []
    }
  });
  const [agentMessages, setAgentMessages] = useState<InterAgentMessage[]>([]);
  const simulationRef = useRef<AgentSimulation | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    simulationRef.current = new AgentSimulation();
    return () => {
      simulationRef.current?.cleanup();
    };
  }, []);

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
  };

  const handleAddMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleStartPlanning = async (prefs: VacationPreferences) => {
    setPreferences(prefs);
    setPhase("processing");
    setIsProcessing(true);
    
    toast({
      title: "Travel Concierge Team Deployed",
      description: "Our 5 specialized AI agents are now analyzing 500+ luxury properties and experiences to curate your perfect getaway.",
    });

    // Run agent simulation
    await simulationRef.current?.runSimulation(
      (agentId, update) => {
        setAgents(prev => ({
          ...prev,
          [agentId]: { ...prev[agentId], ...update } as Agent,
        }));
      },
      (message) => {
        setAgentMessages(prev => [...prev, message]);
      },
      (plan) => {
        setTripPlan(plan);
        setPhase("results");
        setIsProcessing(false);
        toast({
          title: "Itinerary Curated!",
          description: `Your bespoke ${plan.destination.name} getaway is ready for review.`,
        });
      }
    );
  };

  const handleRefinement = async (request: RefinementRequest) => {
    if (!tripPlan) return;
    
    // Store current plan as previous for comparison
    setPreviousPlan(tripPlan);
    setIsProcessing(true);
    setPhase("refinement");
    
    // Reset agents to analyzing state for refinement
    setAgents(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(agentId => {
        updated[agentId] = {
          ...updated[agentId],
          status: "working",
          progress: 0,
          currentTask: "Recalibrating based on preferences..."
        };
      });
      return updated;
    });
    
    toast({
      title: "Recalibrating Journey...",
      description: "Our concierge team is refining your itinerary based on your preferences.",
    });

    // Run refinement simulation with agents
    await simulationRef.current?.runSimulation(
      (agentId, update) => {
        setAgents(prev => ({
          ...prev,
          [agentId]: { ...prev[agentId], ...update } as Agent,
        }));
      },
      (message) => {
        setAgentMessages(prev => [...prev, message]);
      },
      async (plan) => {
        // Apply refinement to the newly generated plan
        const refinedPlan = await simulateRefinement(plan, request.type);
        setTripPlan(refinedPlan);
        setPhase("results");
        setShowComparison(true);
        setIsProcessing(false);
        
        toast({
          title: "Itinerary Refined!",
          description: "Your journey has been optimized. Review the enhanced experience below.",
        });
      }
    );
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentComplete = () => {
    setShowCheckout(false);
    setPhase("confirmation");
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 flex-shrink-0">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="text-primary">NorthBay</span>
                  <span className="text-muted-foreground font-normal text-base">Solutions</span>
                </h1>
                <p className="text-xs text-muted-foreground">
                  AI Multi-Agent Travel Planner Demo
                </p>
              </div>
            </div>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm"
              >
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-medium text-primary">Agents Active</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* 3-Column Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Suggestions */}
        <div className="w-80 flex-shrink-0 hidden lg:block">
          <SuggestionsSidebar onSelectSuggestion={handleSuggestionClick} />
        </div>

        {/* Center Column - Chat & Results */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {phase === "confirmation" ? (
            <SuccessConfirmation tripPlan={tripPlan} />
          ) : (
            <>
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onStartPlanning={handleStartPlanning}
                onAddMessage={handleAddMessage}
              />

              {/* Comparison View (after refinement) */}
              {phase === "results" && showComparison && previousPlan && tripPlan && (
                <div className="space-y-6">
                  <ComparisonView oldPlan={previousPlan} newPlan={tripPlan} />
                  <div className="flex justify-center">
                    <button
                      onClick={() => setShowComparison(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      data-testid="button-hide-comparison"
                    >
                      View full plan details →
                    </button>
                  </div>
                </div>
              )}

              {/* Results Presentation */}
              {phase === "results" && tripPlan && !showComparison && (
                <div className="space-y-6">
                  <ResultsPresentation plan={tripPlan} />
                  <RefinementControls
                    onRefine={handleRefinement}
                    onCheckout={handleCheckout}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Agents (Always Visible) */}
        <div className="w-96 flex-shrink-0 hidden xl:flex flex-col border-l border-border bg-card/50">
          <div className="p-6 space-y-4 overflow-y-auto flex-1">
            {/* Budget Tracker */}
            {tripPlan && (
              <BudgetTracker budget={tripPlan.budget} />
            )}

            {/* Agent Dashboard - Always Visible */}
            <MultiAgentDashboard agents={agents} messages={agentMessages} />
          </div>
        </div>
      </main>

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        onComplete={handlePaymentComplete}
        tripPlan={tripPlan}
      />
    </div>
  );
}
