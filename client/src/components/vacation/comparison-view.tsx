import { motion } from "framer-motion";
import { 
  ArrowRight, 
  TrendingDown, 
  TrendingUp, 
  Minus,
  MapPin,
  Plane,
  Hotel as HotelIcon,
  DollarSign,
  Calendar
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { TripPlan } from "@shared/schema";

interface ComparisonViewProps {
  oldPlan: TripPlan;
  newPlan: TripPlan;
}

export function ComparisonView({ oldPlan, newPlan }: ComparisonViewProps) {
  const budgetDiff = newPlan.budget.breakdown.total - oldPlan.budget.breakdown.total;
  const budgetImproved = budgetDiff < 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-2"
      >
        <h2 className="text-2xl font-bold text-foreground">
          Plan Comparison
        </h2>
        <p className="text-muted-foreground">
          See how your vacation plan has been optimized
        </p>
      </motion.div>

      {/* Side-by-side comparison grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Old Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">
              Previous Plan
            </Badge>
          </div>
          
          <Card data-testid="card-old-plan">
            <CardHeader>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {oldPlan.destination.name}, {oldPlan.destination.country}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Match Score: {oldPlan.destination.matchScore}/100
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flight */}
              {oldPlan.selectedFlight && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Plane className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {oldPlan.selectedFlight.airline}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${oldPlan.selectedFlight.price} • {oldPlan.selectedFlight.class}
                    </p>
                  </div>
                </div>
              )}

              {/* Hotel */}
              {oldPlan.selectedHotel && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <HotelIcon className="w-4 h-4 text-muted-foreground mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {oldPlan.selectedHotel.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${oldPlan.selectedHotel.pricePerNight}/night • {oldPlan.selectedHotel.stars}★
                    </p>
                  </div>
                </div>
              )}

              {/* Budget */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <DollarSign className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Total Budget
                  </p>
                  <p className="text-lg font-bold text-foreground">
                    ${oldPlan.budget.breakdown.total.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Activities */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <Calendar className="w-4 h-4 text-muted-foreground mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Activities
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {oldPlan.itinerary.days.reduce((sum, day) => sum + day.activities.length, 0)} activities planned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* New Plan */}
        <div className="space-y-4">
          <div className="flex items-center justify-center">
            <Badge variant="default" className="text-sm">
              Updated Plan
            </Badge>
          </div>
          
          <Card className="border-primary/50" data-testid="card-new-plan">
            <CardHeader>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground">
                    {newPlan.destination.name}, {newPlan.destination.country}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Match Score: {newPlan.destination.matchScore}/100
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Flight */}
              {newPlan.selectedFlight && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <Plane className="w-4 h-4 text-primary mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {newPlan.selectedFlight.airline}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${newPlan.selectedFlight.price} • {newPlan.selectedFlight.class}
                    </p>
                  </div>
                  {oldPlan.selectedFlight && newPlan.selectedFlight.price !== oldPlan.selectedFlight.price && (
                    <div className="flex-shrink-0">
                      {newPlan.selectedFlight.price < oldPlan.selectedFlight.price ? (
                        <Badge variant="default" className="bg-green-600 text-xs gap-1">
                          <TrendingDown className="w-3 h-3" />
                          ${oldPlan.selectedFlight.price - newPlan.selectedFlight.price}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +${newPlan.selectedFlight.price - oldPlan.selectedFlight.price}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Hotel */}
              {newPlan.selectedHotel && (
                <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                  <HotelIcon className="w-4 h-4 text-primary mt-1" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {newPlan.selectedHotel.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      ${newPlan.selectedHotel.pricePerNight}/night • {newPlan.selectedHotel.stars}★
                    </p>
                  </div>
                  {oldPlan.selectedHotel && newPlan.selectedHotel.totalPrice !== oldPlan.selectedHotel.totalPrice && (
                    <div className="flex-shrink-0">
                      {newPlan.selectedHotel.totalPrice < oldPlan.selectedHotel.totalPrice ? (
                        <Badge variant="default" className="bg-green-600 text-xs gap-1">
                          <TrendingDown className="w-3 h-3" />
                          ${oldPlan.selectedHotel.totalPrice - newPlan.selectedHotel.totalPrice}
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="text-xs gap-1">
                          <TrendingUp className="w-3 h-3" />
                          +${newPlan.selectedHotel.totalPrice - oldPlan.selectedHotel.totalPrice}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Budget */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <DollarSign className="w-4 h-4 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Total Budget
                  </p>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-foreground">
                      ${newPlan.budget.breakdown.total.toLocaleString()}
                    </p>
                    {budgetDiff !== 0 && (
                      <Badge 
                        variant={budgetImproved ? "default" : "destructive"}
                        className={budgetImproved ? "bg-green-600 gap-1" : "gap-1"}
                      >
                        {budgetImproved ? (
                          <>
                            <TrendingDown className="w-3 h-3" />
                            Saved ${Math.abs(budgetDiff).toLocaleString()}
                          </>
                        ) : (
                          <>
                            <TrendingUp className="w-3 h-3" />
                            +${Math.abs(budgetDiff).toLocaleString()}
                          </>
                        )}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Activities */}
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <Calendar className="w-4 h-4 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">
                    Activities
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {newPlan.itinerary.days.reduce((sum, day) => sum + day.activities.length, 0)} activities planned
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Summary */}
      <Card className="bg-accent/20 border-accent">
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2">
            <ArrowRight className="w-5 h-5 text-accent-foreground" />
            <p className="text-sm font-medium text-foreground">
              {budgetImproved 
                ? `Your new plan saves you $${Math.abs(budgetDiff).toLocaleString()} while maintaining quality!`
                : `Your new plan includes ${Math.abs(budgetDiff) > 0 ? 'upgraded options' : 'similar options'} for a great experience.`
              }
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
