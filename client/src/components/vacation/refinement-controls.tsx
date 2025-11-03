import { motion } from "framer-motion";
import { 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Activity,
  CreditCard,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { RefinementRequest } from "@shared/schema";

interface RefinementControlsProps {
  onRefine: (request: RefinementRequest) => void;
  onCheckout: () => void;
}

export function RefinementControls({ onRefine, onCheckout }: RefinementControlsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 mb-2 justify-center md:justify-start">
                <Sparkles className="w-5 h-5 text-primary" />
                <h3 className="text-xl font-bold text-foreground">
                  Love your plan?
                </h3>
              </div>
              <p className="text-muted-foreground">
                Book now or refine the details to perfection
              </p>
            </div>
            <Button
              size="lg"
              className="min-w-[200px]"
              onClick={onCheckout}
              data-testid="button-checkout"
            >
              <CreditCard className="w-5 h-5 mr-2" />
              Book This Trip
            </Button>
          </div>
        </CardContent>
      </Card>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Or Refine Your Plan
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Make adjustments and watch the AI instantly recalculate everything
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-start gap-2 hover-elevate"
            onClick={() => onRefine({ type: "cheaper" })}
            data-testid="button-adjust-budget"
          >
            <DollarSign className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-semibold text-foreground">Adjust Budget</div>
              <div className="text-xs text-muted-foreground">
                Optimize costs for better value
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-start gap-2 hover-elevate"
            onClick={() => onRefine({ type: "upgrade" })}
            data-testid="button-refine-upgrade"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-semibold text-foreground">Upgrade Hotels</div>
              <div className="text-xs text-muted-foreground">
                Premium accommodations
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-start gap-2 hover-elevate"
            onClick={() => onRefine({ type: "change_destination" })}
            data-testid="button-refine-destination"
          >
            <MapPin className="w-5 h-5 text-purple-600" />
            <div className="text-left">
              <div className="font-semibold text-foreground">Change Destination</div>
              <div className="text-xs text-muted-foreground">
                Explore alternatives
              </div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-4 flex-col items-start gap-2 hover-elevate"
            onClick={() => onRefine({ type: "more_activities" })}
            data-testid="button-refine-activities"
          >
            <Activity className="w-5 h-5 text-orange-600" />
            <div className="text-left">
              <div className="font-semibold text-foreground">More Activities</div>
              <div className="text-xs text-muted-foreground">
                Action-packed itinerary
              </div>
            </div>
          </Button>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          All refinements complete in under 10 seconds with full AI recalculation
        </p>
      </div>
    </motion.div>
  );
}
