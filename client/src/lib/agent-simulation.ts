import type { 
  Agent, 
  AgentUpdate, 
  InterAgentMessage,
  TripPlan,
  BudgetStatus,
  Destination,
  VacationPreferences
} from "@shared/schema";
import { destinations, flights, hotels, generateItinerary, generateDestinationData } from "./mock-data";

export type AgentUpdateCallback = (agentId: string, update: Partial<Agent>) => void;
export type MessageCallback = (message: InterAgentMessage) => void;
export type CompletionCallback = (plan: TripPlan) => void;

export interface SimulationContext {
  destination: Destination;
  preferences?: VacationPreferences;
}

// Agent status update sequences (optimized for fast demo - completes in ~12 seconds)
const agentSequences = {
  "destination-scout": [
    { progress: 15, task: "Analyzing weather patterns...", delay: 1200 },
    { progress: 35, task: "Scanning travel restrictions...", delay: 1600 },
    { progress: 55, task: "Comparing 45 destinations...", delay: 2000 },
    { progress: 75, task: "Evaluating match scores...", delay: 1600 },
    { progress: 90, task: "Ranking top 3 options...", delay: 1200 },
    { progress: 100, task: "Top 3 destinations found ✓", delay: 800, result: "Perfect match (96/100)" },
  ],
  "flight-optimizer": [
    { progress: 10, task: "Searching JFK flights...", delay: 800 },
    { progress: 25, task: "Scanning global flight inventory...", delay: 1600 },
    { progress: 45, task: "Analyzing prices and routes...", delay: 2000 },
    { progress: 65, task: "Checking seat availability...", delay: 1600 },
    { progress: 85, task: "Optimizing for best value...", delay: 1600 },
    { progress: 100, task: "Best routes identified ✓", delay: 800, result: "Multiple options ready" },
  ],
  "accommodation-finder": [
    { progress: 12, task: "Scanning 200+ hotels...", delay: 1200 },
    { progress: 30, task: "Filtering by amenities...", delay: 1600 },
    { progress: 50, task: "Analyzing guest reviews...", delay: 2000 },
    { progress: 70, task: "Comparing room rates...", delay: 1600 },
    { progress: 88, task: "Evaluating all-inclusive options...", delay: 1200 },
    { progress: 100, task: "Top hotels selected ✓", delay: 800, result: "4 properties found" },
  ],
  "itinerary-architect": [
    { progress: 18, task: "Mapping local attractions...", delay: 1600 },
    { progress: 35, task: "Identifying must-see sites...", delay: 2000 },
    { progress: 55, task: "Optimizing daily timing...", delay: 2000 },
    { progress: 75, task: "Balancing activities & rest...", delay: 1600 },
    { progress: 92, task: "Adding dining experiences...", delay: 1200 },
    { progress: 100, task: "7-day itinerary complete ✓", delay: 800, result: "28 activities planned" },
  ],
  "budget-guardian": [
    { progress: 20, task: "Establishing budget parameters...", delay: 800 },
    { progress: 45, task: "Analyzing price points across options...", delay: 2400 },
    { progress: 70, task: "Calculating optimal value scenarios...", delay: 2000 },
    { progress: 90, task: "Finalizing cost breakdown...", delay: 1600 },
    { progress: 100, task: "Budget analysis complete ✓", delay: 800, result: "Multiple options prepared" },
  ],
};

// Inter-agent messages (optimized timing for fast demo)
const interAgentMessages: Array<{ from: string; to: string; message: string; delay: number }> = [
  { 
    from: "Budget Guardian", 
    to: "Flight Optimizer", 
    message: "Analyzing competitive flight pricing", 
    delay: 3200 
  },
  { 
    from: "Destination Scout", 
    to: "Accommodation Finder", 
    message: "Focus on beachfront and luxury properties", 
    delay: 4800 
  },
  { 
    from: "Flight Optimizer", 
    to: "Itinerary Architect", 
    message: "Flight arrival scheduled for early afternoon", 
    delay: 7200 
  },
  { 
    from: "Budget Guardian", 
    to: "Itinerary Architect", 
    message: "Activity budget parameters established", 
    delay: 10000 
  },
  { 
    from: "Accommodation Finder", 
    to: "Itinerary Architect", 
    message: "Hotel has spa & pool - include in plans", 
    delay: 12800 
  },
];

export class AgentSimulation {
  private timers: NodeJS.Timeout[] = [];
  private context: SimulationContext;

  constructor(context: SimulationContext) {
    this.context = context;
  }

  async runSimulation(
    onAgentUpdate: AgentUpdateCallback,
    onMessage: MessageCallback,
    onComplete: CompletionCallback
  ) {
    // Clear any existing timers
    this.cleanup();

    // Start all agents in parallel
    const agentPromises = Object.entries(agentSequences).map(([agentId, sequence]) => {
      return this.runAgentSequence(agentId, sequence, onAgentUpdate);
    });

    // Schedule inter-agent messages
    interAgentMessages.forEach(({ from, to, message, delay }) => {
      const timer = setTimeout(() => {
        onMessage({
          id: Date.now().toString(),
          from,
          to,
          message,
          timestamp: new Date(),
        });
      }, delay);
      this.timers.push(timer);
    });

    // Wait for all agents to complete
    await Promise.all(agentPromises);

    // Generate final trip plan
    const plan = this.generateTripPlan();
    
    // Small delay before showing results
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    onComplete(plan);
  }

  private async runAgentSequence(
    agentId: string,
    sequence: Array<{ progress: number; task: string; delay: number; result?: string }>,
    onUpdate: AgentUpdateCallback
  ) {
    // Set initial state
    onUpdate(agentId, {
      status: "working",
      progress: 0,
      currentTask: "Initializing...",
    });

    // Run through sequence
    for (const step of sequence) {
      await new Promise(resolve => setTimeout(resolve, step.delay));
      
      const update: Partial<Agent> = {
        progress: step.progress,
        currentTask: step.task,
      };

      if (step.progress === 100) {
        update.status = "completed";
        update.result = step.result;
      }

      onUpdate(agentId, update);
    }
  }

  private generateTripPlan(): TripPlan {
    const destination = this.context.destination; // Use dynamic destination
    const { flights: destFlights, hotels: destHotels } = generateDestinationData(destination);
    const itinerary = generateItinerary();
    
    // Calculate total activity costs
    const activitiesCost = itinerary.days.reduce(
      (sum, day) => sum + day.totalCost,
      0
    );

    const flightCost = destFlights[0].price;
    const hotelCost = destHotels[0].totalPrice;
    const foodCost = 0; // Included in all-inclusive packages
    const transportCost = 0; // Included in packages

    const total = flightCost + hotelCost + activitiesCost;
    
    // Dynamic budget: use user preference if available, otherwise calculate from selections
    const targetBudget = this.context.preferences?.budget || total;

    const budgetStatus: BudgetStatus = {
      allocated: total,
      budget: targetBudget,
      remaining: targetBudget - total,
      status: total < targetBudget * 0.9 ? "under" : total > targetBudget ? "over" : "near",
      breakdown: {
        flights: flightCost,
        accommodation: hotelCost,
        activities: activitiesCost,
        food: foodCost,
        transport: transportCost,
        total: total,
      },
    };

    return {
      id: Date.now().toString(),
      destination,
      flights: destFlights,
      selectedFlight: destFlights[0],
      hotels: destHotels,
      selectedHotel: destHotels[0],
      itinerary,
      budget: budgetStatus,
      createdAt: new Date(),
    };
  }

  cleanup() {
    this.timers.forEach(timer => clearTimeout(timer));
    this.timers = [];
  }
}

// Refinement simulation
export async function simulateRefinement(
  currentPlan: TripPlan,
  refinementType: string
): Promise<TripPlan> {
  // Simulate processing delay (optimized for fast demo)
  await new Promise(resolve => setTimeout(resolve, 3000));

  const newPlan = { ...currentPlan };

  switch (refinementType) {
    case "cheaper":
      // Switch to budget hotel
      newPlan.selectedHotel = hotels[2]; // Secrets Moxché
      newPlan.hotels = hotels;
      newPlan.budget = {
        ...currentPlan.budget,
        allocated: currentPlan.budget.allocated - 490,
        remaining: currentPlan.budget.remaining + 490,
        breakdown: {
          ...currentPlan.budget.breakdown,
          accommodation: hotels[2].totalPrice,
          total: currentPlan.budget.breakdown.total - 490,
        },
      };
      break;

    case "upgrade":
      // Switch to Ritz-Carlton
      newPlan.selectedHotel = hotels[1];
      newPlan.hotels = hotels;
      newPlan.budget = {
        ...currentPlan.budget,
        allocated: currentPlan.budget.allocated + 700,
        remaining: currentPlan.budget.remaining - 700,
        status: "near",
        breakdown: {
          ...currentPlan.budget.breakdown,
          accommodation: hotels[1].totalPrice,
          total: currentPlan.budget.breakdown.total + 700,
        },
      };
      break;

    case "change_destination":
      // Switch to Bali (would need Bali-specific data in real implementation)
      newPlan.destination = destinations[1] || destinations[0];
      break;

    case "more_activities":
      // Increase activity pacing
      newPlan.itinerary = {
        ...currentPlan.itinerary,
        pacing: {
          activities: 60,
          relaxation: 40,
        },
      };
      break;
  }

  return newPlan;
}
