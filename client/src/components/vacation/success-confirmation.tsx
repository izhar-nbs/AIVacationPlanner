import { motion } from "framer-motion";
import { Check, Download, Calendar, Mail, MapPin, Plane } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TripPlan } from "@shared/schema";

interface SuccessConfirmationProps {
  tripPlan: TripPlan | null;
}

export function SuccessConfirmation({ tripPlan }: SuccessConfirmationProps) {
  const handleDownloadPDF = () => {
    // Mock download functionality
    alert("PDF itinerary downloaded! (Demo)");
  };

  const handleExportCalendar = () => {
    // Mock calendar export
    alert("Added to calendar! (Demo)");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Success Animation */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="text-center space-y-4"
      >
        <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-14 h-14 text-primary-foreground" />
        </div>
        
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-bold text-foreground mb-3"
          >
            Trip Booked Successfully!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground"
          >
            Your dream vacation is confirmed
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-center gap-4"
        >
          <Badge variant="default" className="text-sm px-4 py-2">
            <Mail className="w-4 h-4 mr-2" />
            Confirmation sent to email
          </Badge>
        </motion.div>
      </motion.div>

      {/* Trip Summary */}
      {tripPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary to-accent p-6 text-white">
              <h2 className="text-2xl font-bold mb-2">
                {tripPlan.destination.name}, {tripPlan.destination.country}
              </h2>
              <div className="flex items-center gap-6 text-sm opacity-90">
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {tripPlan.itinerary.totalDays} days
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {tripPlan.destination.matchScore}/100 match
                </span>
              </div>
            </div>

            <CardContent className="p-6 space-y-6">
              {/* Executive Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold text-foreground">
                    ${tripPlan.budget.allocated.toLocaleString()}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Match Score</p>
                  <p className="text-2xl font-bold text-primary">
                    {tripPlan.destination.matchScore}/100
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="text-2xl font-bold text-foreground">
                    {tripPlan.itinerary.totalDays} days
                  </p>
                </div>
              </div>

              {/* Quick Details */}
              <div className="space-y-3 pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground">Your Itinerary Includes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tripPlan.flights[0] && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Plane className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {tripPlan.flights[0].airline}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tripPlan.flights[0].stops === 0 ? "Direct flight" : `${tripPlan.flights[0].stops} stop(s)`}
                        </p>
                      </div>
                    </div>
                  )}
                  {tripPlan.hotels[0] && (
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <MapPin className="w-5 h-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium text-foreground text-sm">
                          {tripPlan.hotels[0].name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tripPlan.hotels[0].stars}-star {tripPlan.hotels[0].type}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Download Options */}
              <div className="pt-6 border-t border-border space-y-3">
                <h3 className="font-semibold text-foreground">Download Your Trip Details</h3>
                <div className="flex gap-3 flex-wrap">
                  <Button
                    variant="outline"
                    onClick={handleDownloadPDF}
                    className="flex-1"
                    data-testid="button-download-pdf"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    PDF Itinerary
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleExportCalendar}
                    className="flex-1"
                    data-testid="button-export-calendar"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Calendar Export
                  </Button>
                </div>
              </div>

              {/* Next Steps */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold text-foreground mb-3">What's Next?</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    Check your email for detailed booking confirmation
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    Download and save your complete itinerary
                  </li>
                  <li className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    Add events to your calendar for easy tracking
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Additional Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted border border-border">
          <Check className="w-4 h-4 text-primary" />
          <span className="text-sm text-foreground">
            Planned in 5 minutes with AI • 500+ sources analyzed
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Have questions? Contact our support team at support@aivacationplanner.com
        </p>
      </motion.div>
    </div>
  );
}
