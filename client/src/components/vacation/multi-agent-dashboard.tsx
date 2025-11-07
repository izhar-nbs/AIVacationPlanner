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
import { Progress } from "@/components/ui/progress";
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
      <div className="space-y-4">
        {/* Compact Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className={`w-4 h-4 ${activeAgents > 0 ? "text-primary animate-pulse" : "text-muted-foreground"}`} />
            <h3 className="text-sm font-semibold text-foreground">
              AI Agents {activeAgents > 0 && `(${activeAgents}/5)`}
            </h3>
          </div>
        </div>

        {/* Compact Agent Rows */}
        <Card>
          <CardContent className="p-3 space-y-2">
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
                      <div className={`p-2 rounded-lg hover-elevate transition-all cursor-help ${
                        isComplete ? "bg-primary/5 border border-primary/20" : 
                        isWorking ? "bg-muted/50" : 
                        "bg-muted/20"
                      }`}>
                        {/* Agent Row */}
                        <div className="flex items-center gap-2 mb-1.5">
                          <AnimatePresence mode="wait">
                            {isComplete ? (
                              <motion.div
                                key="complete"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex-shrink-0"
                              >
                                <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                  <Check className="w-3 h-3 text-primary-foreground" />
                                </div>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="icon"
                                initial={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className={`flex-shrink-0 ${config.color}`}
                              >
                                <Icon className="w-5 h-5" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                          <span className={`flex-1 text-sm font-medium ${
                            isIdle ? "text-muted-foreground" : "text-foreground"
                          }`}>
                            {config.shortName}
                          </span>
                          <span className={`text-xs font-mono font-semibold tabular-nums ${
                            isComplete ? "text-primary" :
                            isWorking ? "text-foreground" :
                            "text-muted-foreground"
                          }`} data-testid={`text-progress-${config.id}`}>
                            {agent.progress}%
                          </span>
                        </div>

                        {/* Compact Progress Bar */}
                        <Progress 
                          value={agent.progress} 
                          className="h-1.5"
                          data-testid={`progress-${config.id}`}
                        />

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
