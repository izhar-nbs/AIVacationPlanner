import type { 
  Agent, 
  AgentUpdate, 
  InterAgentMessage,
  TripPlan,
  BudgetStatus 
} from "@shared/schema";
import { destinations, flights, hotels, generateItinerary } from "./mock-data";

export type AgentUpdateCallback = (agentId: string, update: Partial<Agent>) => void;
export type MessageCallback = (message: InterAgentMessage) => void;
export type CompletionCallback = (plan: TripPlan) => void;

// Agent status update sequences
const agentSequences = {
  "destination-scout": [
    { progress: 15, task: "Analyzing weather patterns...", delay: 3000 },
    { progress: 35, task: "Scanning travel restrictions...", delay: 4000 },
    { progress: 55, task: "Comparing 45 destinations...", delay: 5000 },
    { progress: 75, task: "Evaluating match scores...", delay: 4000 },
    { progress: 90, task: "Ranking top 3 options...", delay: 3000 },
    { progress: 100, task: "Top 3 destinations found ✓", delay: 2000, result: "Cancún (96/100)" },
  ],
  "flight-optimizer": [
    { progress: 10, task: "Searching JFK flights...", delay: 2000 },
    { progress: 25, task: "Found 89 flight options...", delay: 4000 },
    { progress: 45, task: "Analyzing prices and routes...", delay: 5000 },
    { progress: 65, task: "Checking seat availability...", delay: 4000 },
    { progress: 85, task: "Optimizing for best value...", delay: 4000 },
    { progress: 100, task: "Best routes identified ✓", delay: 2000, result: "3 options from $850" },
  ],
  "accommodation-finder": [
    { progress: 12, task: "Scanning 200+ hotels...", delay: 3000 },
    { progress: 30, task: "Filtering by amenities...", delay: 4000 },
    { progress: 50, task: "Analyzing guest reviews...", delay: 5000 },
    { progress: 70, task: "Comparing room rates...", delay: 4000 },
    { progress: 88, task: "Evaluating all-inclusive options...", delay: 3000 },
    { progress: 100, task: "Top hotels selected ✓", delay: 2000, result: "4 properties found" },
  ],
  "itinerary-architect": [
    { progress: 18, task: "Mapping local attractions...", delay: 4000 },
    { progress: 35, task: "Identifying must-see sites...", delay: 5000 },
    { progress: 55, task: "Optimizing daily timing...", delay: 5000 },
    { progress: 75, task: "Balancing activities & rest...", delay: 4000 },
    { progress: 92, task: "Adding dining experiences...", delay: 3000 },
    { progress: 100, task: "7-day itinerary complete ✓", delay: 2000, result: "28 activities planned" },
  ],
  "budget-guardian": [
    { progress: 80, task: "Flight: $1,200 | Hotel: $0 | Activities: $0", delay: 2000 },
    { progress: 85, task: "Flight: $1,200 | Hotel: $2,450 | Activities: $0", delay: 8000 },
    { progress: 90, task: "Flight: $1,200 | Hotel: $2,450 | Activities: $670", delay: 6000 },
    { progress: 95, task: "Optimizing total costs...", delay: 4000 },
    { progress: 100, task: "Budget optimized ✓", delay: 2000, result: "$4,320 total" },
  ],
};

// Inter-agent messages
const interAgentMessages: Array<{ from: string; to: string; message: string; delay: number }> = [
  { 
    from: "Budget Guardian", 
    to: "Flight Optimizer", 
    message: "Stay under $1,500 for flights", 
    delay: 8000 
  },
  { 
    from: "Destination Scout", 
    to: "Accommodation Finder", 
    message: "Focus on beachfront properties in Cancún", 
    delay: 12000 
  },
  { 
    from: "Flight Optimizer", 
    to: "Itinerary Architect", 
    message: "Arrival at 12:15 PM on June 15", 
    delay: 18000 
  },
  { 
    from: "Budget Guardian", 
    to: "Itinerary Architect", 
    message: "Activity budget: $800 max", 
    delay: 25000 
  },
  { 
    from: "Accommodation Finder", 
    to: "Itinerary Architect", 
    message: "Hotel has spa & pool - include in plans", 
    delay: 32000 
  },
];

export class AgentSimulation {
  private timers: NodeJS.Timeout[] = [];

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
    const destination = destinations[0]; // Cancún
    const itinerary = generateItinerary();
    
    // Calculate total activity costs
    const activitiesCost = itinerary.days.reduce(
      (sum, day) => sum + day.totalCost,
      0
    );

    const flightCost = flights[0].price; // Direct Delta flight
    const hotelCost = hotels[0].totalPrice; // Hyatt Zilara
    const foodCost = 0; // Included in all-inclusive
    const transportCost = 0; // Included

    const total = flightCost + hotelCost + activitiesCost;
    const budget = 5000;

    const budgetStatus: BudgetStatus = {
      allocated: total,
      budget: budget,
      remaining: budget - total,
      status: total < budget * 0.9 ? "under" : total > budget ? "over" : "near",
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
      flights,
      selectedFlight: flights[0],
      hotels,
      selectedHotel: hotels[0],
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
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 8000));

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
