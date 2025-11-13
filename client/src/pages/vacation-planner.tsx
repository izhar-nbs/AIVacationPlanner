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
import { AgentSimulation, simulateRefinement, type SimulationContext } from "@/lib/agent-simulation";
import { calculateBudgetFromSelections } from "@/lib/budget-calculator";
import { resolveDestination, getConfidenceMessage } from "@/lib/destination-resolver";
import { useToast } from "@/hooks/use-toast";
import type { 
  AppPhase, 
  ChatMessage, 
  VacationPreferences, 
  TripPlan,
  RefinementRequest,
  Agent,
  InterAgentMessage,
  BudgetStatus
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
  const [selectedFlightId, setSelectedFlightId] = useState<string>("");
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");
  const [dynamicBudget, setDynamicBudget] = useState<BudgetStatus | null>(null);
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
  const messageIdCounter = useRef(0);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      simulationRef.current?.cleanup();
    };
  }, []);

  // Note: Budget initialization happens synchronously in handleStartPlanning and handleRefinement
  // Selection changes are handled by handleFlightSelection and handleHotelSelection

  const handleSendMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `${Date.now()}-${++messageIdCounter.current}`,
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
    // Extract destination from user's description
    const resolved = resolveDestination(prefs.description);
    const enrichedPrefs = {
      ...prefs,
      destination: resolved.destination,
    };
    
    setPreferences(enrichedPrefs);
    setPhase("processing");
    setIsProcessing(true);
    
    const confidenceMsg = getConfidenceMessage(resolved.confidence, resolved.destination.name);
    
    toast({
      title: "Travel Concierge Team Deployed",
      description: `${confidenceMsg}. Our 5 specialized AI agents are now curating your perfect getaway.`,
    });

    // Create simulation context with resolved destination
    const context: SimulationContext = {
      destination: resolved.destination,
      preferences: enrichedPrefs,
    };

    // Initialize simulation with context
    simulationRef.current = new AgentSimulation(context);

    // Run agent simulation
    await simulationRef.current.runSimulation(
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
        // Initialize selections and budget immediately for new plan
        const initialFlightId = plan.flights[0]?.id || "";
        const initialHotelId = plan.hotels[0]?.id || "";
        setSelectedFlightId(initialFlightId);
        setSelectedHotelId(initialHotelId);
        // Calculate initial budget synchronously
        if (initialFlightId && initialHotelId) {
          const initialBudget = calculateBudgetFromSelections(plan, initialFlightId, initialHotelId);
          setDynamicBudget(initialBudget);
        }
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

    // Create new simulation context for refinement (destination might have changed)
    const context: SimulationContext = {
      destination: tripPlan.destination,
      preferences: preferences,
    };
    simulationRef.current = new AgentSimulation(context);

    // Run refinement simulation with agents
    await simulationRef.current.runSimulation(
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
        // Reset selections and budget for refined plan
        const refinedFlightId = refinedPlan.flights[0]?.id || "";
        const refinedHotelId = refinedPlan.hotels[0]?.id || "";
        setSelectedFlightId(refinedFlightId);
        setSelectedHotelId(refinedHotelId);
        // Calculate initial budget synchronously
        if (refinedFlightId && refinedHotelId) {
          const refinedBudget = calculateBudgetFromSelections(refinedPlan, refinedFlightId, refinedHotelId);
          setDynamicBudget(refinedBudget);
        }
        
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

  const handleFlightSelection = (flightId: string) => {
    setSelectedFlightId(flightId);
    // Immediately recalculate budget with new selection
    if (tripPlan && selectedHotelId) {
      const updatedBudget = calculateBudgetFromSelections(tripPlan, flightId, selectedHotelId);
      setDynamicBudget(updatedBudget);
    }
  };

  const handleHotelSelection = (hotelId: string) => {
    setSelectedHotelId(hotelId);
    // Immediately recalculate budget with new selection
    if (tripPlan && selectedFlightId) {
      const updatedBudget = calculateBudgetFromSelections(tripPlan, selectedFlightId, hotelId);
      setDynamicBudget(updatedBudget);
    }
  };

  const handleSuggestionClick = (prompt: string) => {
    handleSendMessage(prompt);
  };

  const handleViewResults = () => {
    // Scroll the center column to show results
    const resultsElement = document.querySelector('[data-results-section]');
    if (resultsElement) {
      resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Modern Premium Header */}
      <header className="border-b border-border bg-white/80 backdrop-blur-md sticky top-0 z-50 flex-shrink-0 shadow-sm">
        <div className="max-w-[2000px] mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">NorthBay</span>
                  <span className="text-muted-foreground font-medium text-lg">AI Travel</span>
                </h1>
                <p className="text-sm text-muted-foreground font-medium">
                  Multi-Agent Vacation Planning
                </p>
              </div>
            </div>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
              >
                <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-lg shadow-primary/50" />
                <span className="font-semibold text-primary text-sm">AI Agents Working</span>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Modern 3-Column Layout with Better Spacing */}
      <main className="flex-1 flex overflow-hidden max-w-[2000px] mx-auto w-full">
        {/* Left Sidebar - Suggestions */}
        <div className="w-80 flex-shrink-0 hidden lg:block border-r border-border bg-sidebar/30">
          <SuggestionsSidebar onSelectSuggestion={handleSuggestionClick} />
        </div>

        {/* Center Column - Chat & Results */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-background to-muted/20">
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
                <div className="space-y-6" data-results-section>
                  <ResultsPresentation 
                    plan={tripPlan} 
                    selectedFlightId={selectedFlightId}
                    selectedHotelId={selectedHotelId}
                    onFlightChange={handleFlightSelection}
                    onHotelChange={handleHotelSelection}
                    dynamicBudget={dynamicBudget}
                  />
                  <RefinementControls
                    onRefine={handleRefinement}
                    onCheckout={handleCheckout}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {/* Right Sidebar - Premium Agent Dashboard */}
        <div className="w-96 flex-shrink-0 hidden xl:flex flex-col border-l border-border bg-white/60 backdrop-blur-lg">
          <div className="p-8 space-y-6 overflow-y-auto flex-1">
            {/* Budget Tracker - Dynamic */}
            {dynamicBudget && (
              <BudgetTracker budget={dynamicBudget} />
            )}

            {/* Agent Dashboard - Always Visible */}
            <MultiAgentDashboard 
              agents={agents} 
              messages={agentMessages}
              onViewResults={handleViewResults}
              onCheckout={handleCheckout}
              showResultsButton={phase === "results"}
            />
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
