import { useState } from "react";
import { motion } from "framer-motion";
import { 
  MapPin, 
  Star, 
  Check, 
  Info, 
  Plane,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Hotel as HotelIcon,
  Calendar,
  Download,
  FileText
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { TripPlan } from "@shared/schema";
import { generateTripPDF } from "@/lib/pdf-export";
import { generateCalendarFile } from "@/lib/calendar-export";
import { useToast } from "@/hooks/use-toast";
import { MapView } from "./map-view";

interface ResultsPresentationProps {
  plan: TripPlan;
}

export function ResultsPresentation({ plan }: ResultsPresentationProps) {
  const [selectedFlight, setSelectedFlight] = useState(plan.flights[0]?.id);
  const [selectedHotel, setSelectedHotel] = useState(plan.hotels[0]?.id);
  const { toast } = useToast();

  const handlePDFExport = () => {
    try {
      generateTripPDF(plan);
      toast({
        title: "PDF Downloaded",
        description: "Your complete itinerary has been saved as a PDF.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCalendarExport = () => {
    try {
      generateCalendarFile(plan);
      toast({
        title: "Calendar Downloaded",
        description: "Your itinerary has been exported as a calendar file.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "There was an error generating the calendar file. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <div className="space-y-2">
          <Badge variant="default" className="mb-2">
            <Check className="w-3 h-3 mr-1" />
            Plan Complete
          </Badge>
          <h2 className="text-3xl font-bold text-foreground">
            Your Perfect Vacation Plan
          </h2>
          <p className="text-muted-foreground">
            AI-curated itinerary based on 500+ sources
          </p>
        </div>
        
        {/* Export Buttons */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            onClick={handlePDFExport}
            data-testid="button-export-pdf"
            className="gap-2"
          >
            <FileText className="w-4 h-4" />
            Download PDF
          </Button>
          <Button
            variant="outline"
            onClick={handleCalendarExport}
            data-testid="button-export-calendar"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Add to Calendar
          </Button>
        </div>
      </motion.div>

      {/* Destination Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="overflow-hidden" data-testid="card-destination">
          <div className="aspect-video relative overflow-hidden">
            <img
              src={plan.destination.imageUrl}
              alt={plan.destination.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 right-4">
              <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
                <Star className="w-4 h-4 mr-1 fill-current" />
                {plan.destination.matchScore}/100
              </Badge>
            </div>
          </div>
          <CardContent className="p-6 space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <MapPin className="w-6 h-6 text-primary" />
                {plan.destination.name}, {plan.destination.country}
              </h3>
              <p className="text-muted-foreground mt-2">
                {plan.destination.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                <Info className="w-4 h-4 text-primary" />
                Why this destination?
              </h4>
              <ul className="space-y-2">
                {plan.destination.reasons.map((reason, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{reason}</span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.destination.alternatives && (
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Alternative Options
                </h4>
                <div className="flex gap-2 flex-wrap">
                  {plan.destination.alternatives.map((alt, index) => (
                    <Badge key={index} variant="secondary">
                      {alt.name} ({alt.matchScore}/100)
                      {alt.priceDiff > 0 ? ` +$${alt.priceDiff}` : ` -$${Math.abs(alt.priceDiff)}`}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Flights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Flight Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plan.flights.map((flight) => (
            <Card
              key={flight.id}
              className={`cursor-pointer transition-all hover-elevate ${
                selectedFlight === flight.id ? "border-primary border-2" : ""
              } ${flight.recommended ? "ring-2 ring-primary/20" : ""}`}
              onClick={() => setSelectedFlight(flight.id)}
              data-testid={`card-flight-${flight.id}`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {flight.airline}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {flight.class}
                    </p>
                  </div>
                  {flight.recommended && (
                    <Badge variant="default" className="text-xs">
                      Recommended
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Duration</span>
                    <span className="font-medium text-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {flight.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stops</span>
                    <span className="font-medium text-foreground">
                      {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
                <div className="pt-3 border-t border-border">
                  <div className="text-2xl font-bold text-foreground">
                    ${flight.price.toLocaleString()}
                  </div>
                  {flight.tradeoffs && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {flight.tradeoffs}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Hotels */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <HotelIcon className="w-5 h-5 text-primary" />
          Accommodation Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plan.hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className={`cursor-pointer transition-all hover-elevate overflow-hidden ${
                selectedHotel === hotel.id ? "border-primary border-2" : ""
              }`}
              onClick={() => setSelectedHotel(hotel.id)}
              data-testid={`card-hotel-${hotel.id}`}
            >
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardContent className="p-4 space-y-2">
                <div>
                  <h4 className="font-semibold text-foreground line-clamp-1">
                    {hotel.name}
                  </h4>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < hotel.stars
                              ? "text-yellow-500 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {hotel.rating} ({hotel.reviewCount})
                    </span>
                  </div>
                </div>
                
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-bold text-foreground">
                    ${hotel.pricePerNight}
                  </span>
                  <span className="text-xs text-muted-foreground">/night</span>
                </div>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start text-xs h-auto py-1.5"
                      >
                        <Info className="w-3 h-3 mr-1" />
                        AI Reasoning
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="max-w-xs">
                      <p className="text-sm">{hotel.aiReasoning}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardContent>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Itinerary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-primary" />
          7-Day Itinerary
        </h3>
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="day-1" className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                {plan.itinerary.days.map((day) => (
                  <TabsTrigger
                    key={day.day}
                    value={`day-${day.day}`}
                    data-testid={`tab-day-${day.day}`}
                  >
                    Day {day.day}
                  </TabsTrigger>
                ))}
              </TabsList>
              {plan.itinerary.days.map((day) => (
                <TabsContent
                  key={day.day}
                  value={`day-${day.day}`}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-foreground">
                      {day.date}
                    </h4>
                    <Badge variant="secondary">
                      ${day.totalCost} total
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    {day.activities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="flex gap-4 p-3 rounded-lg bg-muted/50 hover-elevate"
                        data-testid={`activity-day-${day.day}-${index}`}
                      >
                        <div className="flex-shrink-0 w-16 text-sm font-semibold text-primary">
                          {activity.time}
                        </div>
                        <div className="flex-1 space-y-1">
                          <h5 className="font-medium text-foreground">
                            {activity.name}
                          </h5>
                          <p className="text-sm text-muted-foreground">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {activity.duration}
                            </span>
                            {activity.cost > 0 && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3" />
                                ${activity.cost}
                              </span>
                            )}
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
            
            <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Trip Pacing
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm">
                  <span className="font-semibold text-foreground">
                    {plan.itinerary.pacing.activities}%
                  </span>
                  <span className="text-muted-foreground ml-1">Activities</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">
                    {plan.itinerary.pacing.relaxation}%
                  </span>
                  <span className="text-muted-foreground ml-1">Relaxation</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Interactive Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <MapView plan={plan} />
      </motion.div>
    </div>
  );
}
