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
import type { TripPlan, BudgetStatus } from "@shared/schema";
import { generateTripPDF } from "@/lib/pdf-export";
import { generateCalendarFile } from "@/lib/calendar-export";
import { useToast } from "@/hooks/use-toast";
import { MapView } from "./map-view";
import { destinations } from "@/lib/mock-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ResultsPresentationProps {
  plan: TripPlan;
  selectedFlightId: string;
  selectedHotelId: string;
  onFlightChange: (flightId: string) => void;
  onHotelChange: (hotelId: string) => void;
  onDestinationChange: (destinationName: string) => void;
  dynamicBudget: BudgetStatus | null;
}

export function ResultsPresentation({ 
  plan, 
  selectedFlightId,
  selectedHotelId,
  onFlightChange,
  onHotelChange,
  onDestinationChange,
  dynamicBudget
}: ResultsPresentationProps) {
  const { toast } = useToast();
  
  const currentFlight = plan.flights.find(f => f.id === selectedFlightId) || plan.flights[0];
  const currentHotel = plan.hotels.find(h => h.id === selectedHotelId) || plan.hotels[0];
  
  const handleFlightChange = (flightId: string) => {
    onFlightChange(flightId);
    const flight = plan.flights.find(f => f.id === flightId);
    toast({
      title: "Flight Selection Updated",
      description: `Switched to ${flight?.airline} - ${flight?.departureTime}. Budget recalculated automatically.`,
    });
  };
  
  const handleHotelChange = (hotelId: string) => {
    onHotelChange(hotelId);
    const hotel = plan.hotels.find(h => h.id === hotelId);
    toast({
      title: "Hotel Selection Updated",
      description: `Switched to ${hotel?.name}. Budget recalculated automatically.`,
    });
  };
  
  const scrollToFlights = () => {
    document.querySelector('[data-flights-section]')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const scrollToHotels = () => {
    document.querySelector('[data-hotels-section]')?.scrollIntoView({ behavior: 'smooth' });
  };

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

  // Calculate total trip cost from dynamic budget
  const totalCost = dynamicBudget ? dynamicBudget.allocated : (currentFlight.price + currentHotel.totalPrice);

  return (
    <div className="space-y-6">
      {/* DESTINATION HERO - Prominently display selected destination FIRST */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        <Card className="overflow-hidden border-primary/30 shadow-2xl" data-testid="card-destination-hero">
          {/* Hero Image */}
          <div className="relative h-[280px] overflow-hidden">
            <img
              src={plan.destination.imageUrl}
              alt={plan.destination.name}
              className="w-full h-full object-cover"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            
            {/* Hero Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-6">
              {/* Top Badge */}
              <div className="flex justify-between items-start">
                <Badge variant="default" className="bg-white/95 backdrop-blur-sm text-foreground shadow-lg">
                  <Check className="w-3 h-3 mr-1" />
                  Plan Complete
                </Badge>
                <Badge className="bg-white/95 backdrop-blur-sm text-foreground text-base px-4 py-2 shadow-lg">
                  <Star className="w-4 h-4 mr-1.5 fill-primary text-primary" />
                  <span className="font-bold">{plan.destination.matchScore}</span>
                  <span className="text-muted-foreground text-sm ml-1">/100 Match</span>
                </Badge>
              </div>
              
              {/* Destination Title */}
              <div className="space-y-3">
                <h2 className="text-4xl font-bold text-white drop-shadow-lg flex items-center gap-3">
                  <MapPin className="w-8 h-8" />
                  {plan.destination.name}
                </h2>
                <p className="text-white/90 text-lg drop-shadow-md max-w-2xl">
                  {plan.destination.description}
                </p>
                <div className="flex gap-2 flex-wrap items-center">
                  <Select
                    value={plan.destination.name}
                    onValueChange={onDestinationChange}
                  >
                    <SelectTrigger 
                      className="w-[220px] bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg border-none h-9"
                      data-testid="select-destination"
                    >
                      <MapPin className="w-4 h-4 mr-2 text-primary" />
                      <SelectValue placeholder="Change destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {destinations.map((dest) => (
                        <SelectItem 
                          key={dest.id} 
                          value={dest.name}
                          data-testid={`destination-option-${dest.id}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{dest.name}</span>
                            <span className="text-xs text-muted-foreground">({dest.country})</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePDFExport}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    data-testid="button-export-pdf"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCalendarExport}
                    className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
                    data-testid="button-export-calendar"
                  >
                    <Calendar className="w-3 h-3 mr-1" />
                    Calendar
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Why This Destination - Compact */}
          <CardContent className="p-6 bg-card/50">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary" />
              Why {plan.destination.name}?
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {plan.destination.reasons.slice(0, 4).map((reason, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <Check className="w-3.5 h-3.5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Trip Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.05 }}
      >
        <Card className="border-primary/30 bg-primary/5" data-testid="card-trip-summary">
          <CardHeader className="pb-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Check className="w-5 h-5 text-primary" />
              Your Selected Trip
            </h3>
            <p className="text-sm text-muted-foreground">Click any option below to change your selection</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Flight */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card border hover-elevate cursor-pointer" onClick={scrollToFlights}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Plane className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">{currentFlight.airline}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {currentFlight.departureTime} • {currentFlight.duration} • {currentFlight.stops === 0 ? 'Direct' : `${currentFlight.stops} stop${currentFlight.stops > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className="text-lg font-bold text-foreground">${currentFlight.price.toLocaleString()}</div>
                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" data-testid="button-change-flight">
                    Change Flight
                  </Button>
                </div>
              </div>
            </div>

            {/* Selected Hotel */}
            <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-card border hover-elevate cursor-pointer" onClick={scrollToHotels}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <HotelIcon className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground line-clamp-1">{currentHotel.name}</h4>
                  <p className="text-sm text-muted-foreground truncate">
                    {currentHotel.stars} stars • ${currentHotel.pricePerNight}/night × 7 nights
                  </p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <div className="text-lg font-bold text-foreground">${currentHotel.totalPrice.toLocaleString()}</div>
                  <Button variant="ghost" size="sm" className="h-auto py-1 px-2 text-xs" data-testid="button-change-hotel">
                    Change Hotel
                  </Button>
                </div>
              </div>
            </div>

            {/* Total Price */}
            <div className="pt-4 border-t flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Trip Cost</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Flights + 7 nights + Activities
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">${totalCost.toLocaleString()}</div>
                <Badge variant={totalCost <= (plan.budget.budget || 5000) ? "default" : "destructive"} className="mt-1">
                  {totalCost <= (plan.budget.budget || 5000) ? 'Within Budget' : 'Over Budget'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* Flights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        data-flights-section
      >
        <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Flight Options
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plan.flights.map((flight) => (
            <Card
              key={flight.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedFlightId === flight.id ? "border-primary border-2 shadow-lg shadow-primary/20" : "shadow-md"
              } ${flight.recommended ? "ring-2 ring-primary/30" : ""}`}
              onClick={() => handleFlightChange(flight.id)}
              data-testid={`card-flight-${flight.id}`}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-foreground text-lg">
                      {flight.airline}
                    </h4>
                    <p className="text-sm text-muted-foreground capitalize font-medium">
                      {flight.class}
                    </p>
                  </div>
                  {flight.recommended && (
                    <Badge className="bg-gradient-to-r from-primary to-secondary text-white shadow-md">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Best Value
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Duration</span>
                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {flight.duration}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground font-medium">Stops</span>
                    <span className="font-semibold text-foreground">
                      {flight.stops === 0 ? "Direct" : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <div className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    ${flight.price.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">
                    per person
                  </p>
                  {flight.tradeoffs && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
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
        data-hotels-section
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
                selectedHotelId === hotel.id ? "border-primary border-2" : ""
              }`}
              onClick={() => handleHotelChange(hotel.id)}
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
                  <span className="text-muted-foreground ml-1">Experiences</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-foreground">
                    {plan.itinerary.pacing.relaxation}%
                  </span>
                  <span className="text-muted-foreground ml-1">Wellness</span>
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
