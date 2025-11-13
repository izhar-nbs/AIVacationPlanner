import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Plane, 
  Hotel, 
  CalendarDays, 
  DollarSign, 
  Check,
  Activity,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CircularProgress } from "@/components/ui/circular-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Agent, InterAgentMessage } from "@shared/schema";

const agentConfigs = [
  {
    id: "destination-scout",
    name: "Destination Curator",
    shortName: "Destinations",
    description: "Curating exclusive destinations",
    icon: Compass,
    color: "text-blue-600",
  },
  {
    id: "flight-optimizer",
    name: "Flight Concierge",
    shortName: "Flights",
    description: "Securing premium routes",
    icon: Plane,
    color: "text-purple-600",
  },
  {
    id: "accommodation-finder",
    name: "Hospitality Specialist",
    shortName: "Hotels",
    description: "Sourcing luxury accommodations",
    icon: Hotel,
    color: "text-green-600",
  },
  {
    id: "itinerary-architect",
    name: "Experience Designer",
    shortName: "Itinerary",
    description: "Crafting bespoke experiences",
    icon: CalendarDays,
    color: "text-orange-600",
  },
  {
    id: "budget-guardian",
    name: "Travel Investment Advisor",
    shortName: "Budget",
    description: "Optimizing travel value",
    icon: DollarSign,
    color: "text-emerald-600",
  },
];

interface MultiAgentDashboardProps {
  agents: Record<string, Agent>;
  messages: InterAgentMessage[];
  onViewResults?: () => void;
  onCheckout?: () => void;
  showResultsButton?: boolean;
}

export function MultiAgentDashboard({ 
  agents, 
  messages, 
  onViewResults,
  onCheckout,
  showResultsButton = false 
}: MultiAgentDashboardProps) {
  const [showMessages, setShowMessages] = useState(false);
  
  const activeAgents = Object.values(agents).filter(a => a.status !== "idle").length;
  const allAgentsComplete = Object.values(agents).every(a => a.status === "completed");

  return (
    <TooltipProvider delayDuration={300}>
      <div className="space-y-6">
        {/* Premium Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              activeAgents > 0 ? "bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/20" : "bg-muted"
            }`}>
              <Activity className={`w-5 h-5 ${activeAgents > 0 ? "text-white" : "text-muted-foreground"}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                AI Agents
              </h3>
              {activeAgents > 0 && (
                <p className="text-sm text-muted-foreground font-medium">
                  {activeAgents} of 5 active
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Premium Agent Cards */}
        <Card className="shadow-lg border-border/50">
          <CardContent className="p-4 space-y-3">
            {agentConfigs.map((config, index) => {
              const agent = agents[config.id];
              if (!agent) return null;

              const Icon = config.icon;
              const isComplete = agent.status === "completed";
              const isWorking = agent.status === "working";
              const isIdle = agent.status === "idle";

              return (
                <motion.div
                  key={config.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  data-testid={`card-agent-${config.id}`}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={`p-3.5 rounded-xl transition-all cursor-help shadow-sm ${
                        isComplete ? "bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/30 shadow-primary/10" : 
                        isWorking ? "bg-white border border-border/40" : 
                        "bg-muted/40 border border-muted-foreground/20"
                      }`}>
                        {/* Premium Agent Row with Circular Progress */}
                        <div className="flex items-center gap-3">
                          <AnimatePresence mode="wait">
                            {isComplete ? (
                              <motion.div
                                key="complete"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex-shrink-0"
                              >
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30">
                                  <Check className="w-7 h-7 text-white" />
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="icon"
                                initial={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex-shrink-0 relative"
                              >
                                {/* Circular Progress Ring */}
                                <CircularProgress 
                                  value={agent.progress} 
                                  size={56} 
                                  strokeWidth={5}
                                  gradientId={`agent-progress-${config.id}`}
                                />
                                {/* Icon in Center */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                                    isWorking ? "bg-gradient-to-br from-secondary/20 to-secondary/10" : "bg-muted"
                                  }`}>
                                    <Icon className={`w-5 h-5 ${isWorking ? config.color : "text-muted-foreground"}`} />
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <div className="flex-1 min-w-0">
                            <span className={`block text-base font-semibold leading-tight ${
                              isIdle ? "text-muted-foreground" : "text-foreground"
                            }`}>
                              {config.shortName}
                            </span>
                            {isWorking && (
                              <span className="block text-xs text-muted-foreground mt-1 truncate">
                                {agent.currentTask}
                              </span>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <span className={`block text-lg font-bold tabular-nums ${
                              isComplete ? "text-primary" :
                              isWorking ? "text-foreground" :
                              "text-muted-foreground"
                            }`} data-testid={`text-progress-${config.id}`}>
                              {agent.progress}%
                            </span>
                            {isIdle ? (
                              <Badge variant="secondary" className="text-[10px] px-2 py-0 h-4 mt-1">
                                Idle
                              </Badge>
                            ) : (
                              <span className="block text-[10px] text-muted-foreground uppercase tracking-wide mt-1">
                                {isComplete ? "Complete" : "Active"}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Indicator (only when working) */}
                        {isWorking && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex items-center gap-1.5 mt-1.5"
                          >
                            <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                            <span className="text-xs text-muted-foreground truncate" data-testid={`text-status-${config.id}`}>
                              {agent.currentTask}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-xs">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className="font-semibold">{config.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {config.description}
                        </p>
                        <div className="pt-2 border-t space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Status:</span>
                            <Badge variant="secondary" className="h-5 text-xs capitalize">
                              {agent.status}
                            </Badge>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress:</span>
                            <span className="font-mono font-semibold">{agent.progress}%</span>
                          </div>
                          {agent.currentTask && (
                            <div className="text-xs mt-2">
                              <span className="text-muted-foreground">Current task:</span>
                              <p className="mt-1 text-foreground">{agent.currentTask}</p>
                            </div>
                          )}
                          {isComplete && agent.result && (
                            <div className="text-xs mt-2">
                              <span className="text-muted-foreground">Result:</span>
                              <p className="mt-1 text-primary font-medium">{agent.result}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </motion.div>
              );
            })}
          </CardContent>
        </Card>

        {/* Action Buttons - Show when all agents complete */}
        {allAgentsComplete && showResultsButton && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="space-y-2"
          >
            {onViewResults && (
              <Button
                onClick={onViewResults}
                className="w-full"
                size="lg"
                data-testid="button-view-results"
              >
                <Check className="w-5 h-5 mr-2" />
                View Your Trip
              </Button>
            )}
            {onCheckout && (
              <Button
                onClick={onCheckout}
                variant="outline"
                className="w-full"
                size="lg"
                data-testid="button-book-from-sidebar"
              >
                Book This Trip
              </Button>
            )}
          </motion.div>
        )}

        {/* Compact Inter-Agent Messages */}
        {messages.length > 0 && (
          <Card>
            <CardHeader className="p-3 pb-2 cursor-pointer" onClick={() => setShowMessages(!showMessages)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-muted-foreground">
                    Communications
                  </span>
                  <Badge variant="secondary" className="h-5 text-xs">
                    {messages.length}
                  </Badge>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMessages(!showMessages);
                  }}
                  data-testid="button-toggle-messages"
                  className="h-6 px-2 text-xs"
                  aria-expanded={showMessages}
                  aria-label={showMessages ? "Collapse communications" : "Expand communications"}
                >
                  {showMessages ? (
                    <ChevronUp className="w-3 h-3" />
                  ) : (
                    <ChevronDown className="w-3 h-3" />
                  )}
                </Button>
              </div>
            </CardHeader>
            {showMessages && (
              <CardContent className="p-3 pt-0 space-y-2 max-h-60 overflow-y-auto">
                {messages.slice(-5).map((msg) => (
                  <div
                    key={msg.id}
                    className="text-xs p-2 rounded bg-muted/50 space-y-1"
                    data-testid={`message-${msg.from}-to-${msg.to}`}
                  >
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Badge variant="outline" className="h-4 px-1 text-[10px]">
                        {msg.from}
                      </Badge>
                      <span>→</span>
                      <Badge variant="outline" className="h-4 px-1 text-[10px]">
                        {msg.to}
                      </Badge>
                    </div>
                    <p className="text-foreground leading-snug">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </TooltipProvider>
  );
}
