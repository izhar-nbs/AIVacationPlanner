import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChatInterface } from "@/components/vacation/chat-interface";
import { MultiAgentDashboard } from "@/components/vacation/multi-agent-dashboard";
import { BudgetTracker } from "@/components/vacation/budget-tracker";
import { ResultsPresentation } from "@/components/vacation/results-presentation";
import { RefinementControls } from "@/components/vacation/refinement-controls";
import { CheckoutModal } from "@/components/vacation/checkout-modal";
import { SuccessConfirmation } from "@/components/vacation/success-confirmation";
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
  const [showCheckout, setShowCheckout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [agents, setAgents] = useState<Record<string, Agent>>({});
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
      title: "AI Agents Activated",
      description: "5 specialized agents are now analyzing 500+ sources to plan your perfect vacation.",
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
          title: "Plan Complete!",
          description: `Your perfect ${plan.destination.name} vacation is ready for review.`,
        });
      }
    );
  };

  const handleRefinement = async (request: RefinementRequest) => {
    if (!tripPlan) return;
    
    setIsProcessing(true);
    setPhase("refinement");
    
    toast({
      title: "Recalculating...",
      description: "AI agents are updating your plan based on your preferences.",
    });

    const updatedPlan = await simulateRefinement(tripPlan, request.type);
    setTripPlan(updatedPlan);
    setPhase("results");
    setIsProcessing(false);
    
    toast({
      title: "Plan Updated!",
      description: "Your vacation has been optimized based on your request.",
    });
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const handlePaymentComplete = () => {
    setShowCheckout(false);
    setPhase("confirmation");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                AI Vacation Planner
              </h1>
              <p className="text-sm text-muted-foreground">
                Transform 15 hours of research into 5 minutes
              </p>
            </div>
            {phase !== "input" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-right"
              >
                <div className="text-sm font-medium text-primary">
                  {phase === "processing" && "Agents Working..."}
                  {phase === "results" && "Plan Ready"}
                  {phase === "refinement" && "Recalculating..."}
                  {phase === "confirmation" && "Booked!"}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {phase === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                onStartPlanning={handleStartPlanning}
                onAddMessage={handleAddMessage}
              />
            </motion.div>
          )}

          {(phase === "processing" || phase === "results" || phase === "refinement") && (
            <motion.div
              key="planning"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-8"
            >
              {/* Multi-Agent Dashboard - The WOW Factor */}
              {(phase === "processing" || isProcessing) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <MultiAgentDashboard agents={agents} messages={agentMessages} />
                </motion.div>
              )}

              {/* Budget Tracker - Sticky during processing */}
              {tripPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={phase === "processing" ? "sticky top-20 z-40" : ""}
                >
                  <BudgetTracker budget={tripPlan.budget} />
                </motion.div>
              )}

              {/* Results Presentation */}
              {phase === "results" && tripPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-8"
                >
                  <ResultsPresentation plan={tripPlan} />
                  
                  <RefinementControls
                    onRefine={handleRefinement}
                    onCheckout={handleCheckout}
                  />
                </motion.div>
              )}
            </motion.div>
          )}

          {phase === "confirmation" && (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <SuccessConfirmation tripPlan={tripPlan} />
            </motion.div>
          )}
        </AnimatePresence>
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
