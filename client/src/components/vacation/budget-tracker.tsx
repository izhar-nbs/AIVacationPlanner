import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DollarSign, TrendingDown, TrendingUp, AlertCircle } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import type { BudgetStatus } from "@shared/schema";

interface BudgetTrackerProps {
  budget: BudgetStatus;
}

export function BudgetTracker({ budget }: BudgetTrackerProps) {
  const [animatedAllocated, setAnimatedAllocated] = useState(0);
  const percentage = (budget.allocated / budget.budget) * 100;
  
  // Animate the counter
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = budget.allocated / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= budget.allocated) {
        setAnimatedAllocated(budget.allocated);
        clearInterval(timer);
      } else {
        setAnimatedAllocated(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [budget.allocated]);

  const getStatusColor = () => {
    if (budget.status === "under") return "text-green-600";
    if (budget.status === "near") return "text-yellow-600";
    return "text-red-600";
  };

  const getStatusBg = () => {
    if (budget.status === "under") return "bg-green-50 dark:bg-green-950/30";
    if (budget.status === "near") return "bg-yellow-50 dark:bg-yellow-950/30";
    return "bg-red-50 dark:bg-red-950/30";
  };

  const getProgressColor = () => {
    if (budget.status === "under") return "bg-green-500";
    if (budget.status === "near") return "bg-yellow-500";
    return "bg-red-500";
  };

  const chartData = [
    { name: "Flights", value: budget.breakdown.flights, color: "#3b82f6" },
    { name: "Accommodations", value: budget.breakdown.accommodation, color: "#8b5cf6" },
    { name: "Experiences", value: budget.breakdown.activities, color: "#10b981" },
    { name: "Dining", value: budget.breakdown.food, color: "#f59e0b" },
    { name: "Transport", value: budget.breakdown.transport, color: "#ef4444" },
  ];

  return (
    <Card className="overflow-hidden" data-testid="card-budget-tracker">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-lg ${getStatusBg()}`}>
              <DollarSign className={`w-6 h-6 ${getStatusColor()}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Budget Tracker
              </h3>
              <p className="text-sm text-muted-foreground">
                Real-time cost optimization
              </p>
            </div>
          </div>
          <Badge
            variant={budget.status === "under" ? "default" : "destructive"}
            className="capitalize"
          >
            {budget.status === "under" && <TrendingDown className="w-3 h-3 mr-1" />}
            {budget.status === "over" && <TrendingUp className="w-3 h-3 mr-1" />}
            {budget.status === "near" && <AlertCircle className="w-3 h-3 mr-1" />}
            {budget.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Budget Display */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <motion.span
              key={animatedAllocated}
              initial={{ scale: 1.2, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold text-foreground tabular-nums"
              data-testid="text-allocated-budget"
            >
              ${animatedAllocated.toLocaleString()}
            </motion.span>
            <span className="text-2xl text-muted-foreground">/</span>
            <span className="text-2xl font-semibold text-muted-foreground tabular-nums">
              ${budget.budget.toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            ${budget.remaining.toLocaleString()} remaining
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={percentage} 
            className="h-3"
            data-testid="progress-budget"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span className={`font-semibold ${getStatusColor()}`}>
              {percentage.toFixed(1)}%
            </span>
            <span>100%</span>
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List Breakdown */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-foreground mb-3">
              Cost Breakdown
            </h4>
            <div className="space-y-2">
              {chartData.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  data-testid={`breakdown-${item.name.toLowerCase()}`}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    ${item.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "6px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
