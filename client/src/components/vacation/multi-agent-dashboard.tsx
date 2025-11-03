import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, 
  Plane, 
  Hotel, 
  CalendarDays, 
  DollarSign, 
  Check,
  ArrowRight,
  Activity
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { Agent, InterAgentMessage } from "@shared/schema";

const agentConfigs = [
  {
    id: "destination-scout",
    name: "Destination Scout",
    description: "Finding perfect locations",
    icon: Compass,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    id: "flight-optimizer",
    name: "Flight Optimizer",
    description: "Finding best routes",
    icon: Plane,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
  },
  {
    id: "accommodation-finder",
    name: "Accommodation Finder",
    description: "Scanning hotels & resorts",
    icon: Hotel,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
  },
  {
    id: "itinerary-architect",
    name: "Itinerary Architect",
    description: "Planning daily activities",
    icon: CalendarDays,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    id: "budget-guardian",
    name: "Budget Guardian",
    description: "Optimizing costs",
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

interface MultiAgentDashboardProps {
  agents: Record<string, Agent>;
  messages: InterAgentMessage[];
}

export function MultiAgentDashboard({ agents, messages }: MultiAgentDashboardProps) {

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          <span className="text-sm font-medium text-primary">
            AI Agents Active
          </span>
        </div>
        <h2 className="text-3xl font-bold text-foreground">
          Multi-Agent Orchestration
        </h2>
        <p className="text-muted-foreground">
          Watch 5 specialized AI agents work in parallel to plan your perfect vacation
        </p>
      </motion.div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agentConfigs.map((config, index) => {
          const agent = agents[config.id];
          if (!agent) return null;

          const Icon = config.icon;
          const isComplete = agent.status === "completed";
          const isWorking = agent.status === "working";

          return (
            <motion.div
              key={config.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              data-testid={`card-agent-${config.id}`}
            >
              <Card className={`overflow-hidden hover-elevate transition-all ${
                isComplete ? "border-primary/50" : ""
              }`}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className={`p-3 rounded-lg ${config.bgColor}`}>
                      <Icon className={`w-6 h-6 ${config.color}`} />
                    </div>
                    <AnimatePresence>
                      {isComplete && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="flex-shrink-0"
                        >
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <div className="mt-3">
                    <h3 className="font-semibold text-foreground text-base">
                      {config.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {config.description}
                    </p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-mono font-semibold text-foreground" data-testid={`text-progress-${config.id}`}>
                        {agent.progress}%
                      </span>
                    </div>
                    <Progress 
                      value={agent.progress} 
                      className="h-2"
                      data-testid={`progress-${config.id}`}
                    />
                  </div>

                  {/* Current Status */}
                  <div className="min-h-[40px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={agent.currentTask}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="text-sm text-foreground"
                        data-testid={`text-status-${config.id}`}
                      >
                        {isWorking && (
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                            <span>{agent.currentTask}</span>
                          </div>
                        )}
                        {isComplete && (
                          <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-primary" />
                            <span className="font-medium">{agent.currentTask}</span>
                          </div>
                        )}
                        {agent.status === "idle" && (
                          <span className="text-muted-foreground">{agent.currentTask}</span>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Result Badge (when complete) */}
                  {isComplete && agent.result && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Badge variant="secondary" className="w-full justify-center py-1.5">
                        <Check className="w-3 h-3 mr-1" />
                        {agent.result}
                      </Badge>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Inter-Agent Messages */}
      <AnimatePresence>
        {messages.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6"
          >
            <Card className="p-4 bg-accent/20 border-accent">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-accent-foreground">
                  <ArrowRight className="w-4 h-4" />
                  Agent Communication
                </div>
                <div className="space-y-1.5">
                  {messages.slice(-3).map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-sm text-muted-foreground flex items-center gap-2"
                      data-testid={`message-${msg.from}-to-${msg.to}`}
                    >
                      <span className="font-medium text-foreground">{msg.from}</span>
                      <ArrowRight className="w-3 h-3" />
                      <span className="font-medium text-foreground">{msg.to}:</span>
                      <span>{msg.message}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
