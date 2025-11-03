import { z } from "zod";

// Chat Message Types
export interface ChatMessage {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
}

// Agent Types
export type AgentStatus = "idle" | "working" | "completed";

export interface AgentUpdate {
  progress: number;
  status: string;
  timestamp: Date;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  icon: string;
  progress: number;
  status: AgentStatus;
  currentTask: string;
  updates: AgentUpdate[];
  result?: any;
}

// Destination Types
export interface Destination {
  id: string;
  name: string;
  country: string;
  imageUrl: string;
  matchScore: number;
  description: string;
  reasons: string[];
  climate: string;
  bestMonth: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  alternatives?: {
    name: string;
    priceDiff: number;
    matchScore: number;
  }[];
}

// Flight Types
export interface Flight {
  id: string;
  airline: string;
  departureCity: string;
  arrivalCity: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  price: number;
  stops: number;
  class: "economy" | "premium" | "business" | "first";
  recommended?: boolean;
  tradeoffs?: string;
}

// Hotel Types
export interface Hotel {
  id: string;
  name: string;
  imageUrl: string;
  stars: number;
  pricePerNight: number;
  totalPrice: number;
  amenities: string[];
  rating: number;
  reviewCount: number;
  aiReasoning: string;
  location: string;
  type: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Activity Types
export interface Activity {
  id: string;
  time: string;
  name: string;
  description: string;
  cost: number;
  duration: string;
  category: "relaxation" | "adventure" | "culture" | "dining" | "transport";
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Itinerary Types
export interface DayItinerary {
  day: number;
  date: string;
  activities: Activity[];
  totalCost: number;
}

export interface CompleteItinerary {
  days: DayItinerary[];
  totalDays: number;
  pacing: {
    activities: number;
    relaxation: number;
  };
}

// Budget Types
export interface BudgetBreakdown {
  flights: number;
  accommodation: number;
  activities: number;
  food: number;
  transport: number;
  total: number;
}

export interface BudgetStatus {
  allocated: number;
  budget: number;
  remaining: number;
  status: "under" | "near" | "over";
  breakdown: BudgetBreakdown;
}

// Trip Plan Types
export interface TripPlan {
  id: string;
  destination: Destination;
  flights: Flight[];
  selectedFlight?: Flight;
  hotels: Hotel[];
  selectedHotel?: Hotel;
  itinerary: CompleteItinerary;
  budget: BudgetStatus;
  createdAt: Date;
}

// User Input Types
export interface VacationPreferences {
  description: string;
  budget?: number;
  duration?: number;
  travelers?: number;
  departureCity?: string;
  month?: string;
  interests?: string[];
}

// Inter-Agent Message Types
export interface InterAgentMessage {
  id: string;
  from: string;
  to: string;
  message: string;
  timestamp: Date;
}

// Refinement Types
export type RefinementType = "cheaper" | "upgrade" | "change_destination" | "more_activities" | "less_activities";

export interface RefinementRequest {
  type: RefinementType;
  parameter?: string;
}

// Payment Types
export interface PaymentInfo {
  name: string;
  email: string;
  cardNumber: string;
  cvv: string;
  expiry: string;
}

// App State Types
export type AppPhase = "input" | "processing" | "results" | "refinement" | "checkout" | "confirmation";
