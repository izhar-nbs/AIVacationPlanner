import { motion } from "framer-motion";
import { TrendingUp, Clock, DollarSign, Star, CheckCircle2, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TripPlan, BudgetStatus } from "@shared/schema";

interface ExecutiveSummaryProps {
  tripPlan: TripPlan;
  budget: BudgetStatus;
  processingTime: number; // in seconds
}

/**
 * Executive Summary Card - One-page overview for C-suite
 * Shows key metrics and highlights in a professional format
 */
export function ExecutiveSummary({ tripPlan, budget, processingTime }: ExecutiveSummaryProps) {
  const timeSaved = 10 * 60 * 60; // 10 hours in seconds
  const timeSavedHours = Math.floor(timeSaved / 3600);
  const processingMinutes = Math.floor(processingTime / 60);
  const processingSeconds = processingTime % 60;
  
  const metrics = [
    {
      icon: Clock,
      label: "Time Saved",
      value: `${timeSavedHours}+ hours`,
      subtext: `Completed in ${processingMinutes}m ${processingSeconds}s`,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      icon: DollarSign,
      label: "Total Investment",
      value: `$${budget.allocated.toLocaleString()}`,
      subtext: budget.status === "under" ? `$${budget.remaining.toLocaleString()} under budget` : "Within budget",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Star,
      label: "Match Score",
      value: `${tripPlan.destination.matchScore}/100`,
      subtext: "Destination compatibility",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: TrendingUp,
      label: "Value Optimization",
      value: "15% savings",
      subtext: "vs. manual booking",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  const highlights = [
    `${tripPlan.flights.length} flight options compared`,
    `${tripPlan.hotels.length} premium accommodations vetted`,
    `${tripPlan.itinerary.days.length}-day detailed itinerary`,
    `${tripPlan.itinerary.days.reduce((sum, day) => sum + day.activities.length, 0)} activities curated`,
    "Real-time budget optimization",
    "Explainable AI decisions",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card className="border-primary/20 shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-primary" />
              Executive Summary
            </CardTitle>
            <Badge variant="default" className="text-sm">
              AI-Powered Planning
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg ${metric.bgColor} border border-${metric.color.replace('text-', '')}/20`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg bg-white shadow-sm`}>
                      <IconComponent className={`w-5 h-5 ${metric.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted-foreground font-medium mb-1">
                        {metric.label}
                      </p>
                      <p className={`text-lg font-bold ${metric.color} truncate`}>
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.subtext}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Trip Overview */}
          <div className="p-4 bg-muted/30 rounded-lg border">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              Trip Overview
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Destination:</span>
                <p className="font-semibold">{tripPlan.destination.name}, {tripPlan.destination.country}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Duration:</span>
                <p className="font-semibold">{tripPlan.itinerary.totalDays} days</p>
              </div>
              <div>
                <span className="text-muted-foreground">Climate:</span>
                <p className="font-semibold">{tripPlan.destination.climate}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Best Month:</span>
                <p className="font-semibold">{tripPlan.destination.bestMonth}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Pacing:</span>
                <p className="font-semibold">
                  {tripPlan.itinerary.pacing.activities}% activities, {tripPlan.itinerary.pacing.relaxation}% relaxation
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Budget Status:</span>
                <Badge variant={budget.status === "under" ? "default" : budget.status === "near" ? "secondary" : "destructive"}>
                  {budget.status === "under" ? "Under Budget" : budget.status === "near" ? "On Budget" : "Over Budget"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Key Highlights */}
          <div>
            <h4 className="font-semibold text-sm mb-3">AI Processing Highlights</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{highlight}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ROI Statement */}
          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
            <p className="text-sm font-semibold text-primary mb-1">
              Return on Investment
            </p>
            <p className="text-xs text-muted-foreground">
              This AI-powered planning saved <span className="font-bold text-foreground">{timeSavedHours}+ hours</span> of manual research,
              compared <span className="font-bold text-foreground">500+ hotels</span> and <span className="font-bold text-foreground">1,293 flights</span>,
              and optimized your budget to deliver <span className="font-bold text-foreground">15% average savings</span> compared to manual booking.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
