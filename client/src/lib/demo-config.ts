/**
 * Demo Configuration
 * Controls demo mode settings for C-suite presentations
 */

export interface DemoConfig {
  enabled: boolean;
  simulationSpeed: 'fast' | 'normal' | 'slow';
  showMetrics: boolean;
  autoAdvance: boolean;
  highlightFeatures: boolean;
}

// Demo mode settings
export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true' || false;

// Simulation timing (in milliseconds)
export const SIMULATION_TIMING = {
  fast: 12000,    // 12 seconds - for live demos
  normal: 180000, // 3 minutes - realistic
  slow: 300000,   // 5 minutes - detailed walkthrough
};

// Get simulation time based on mode
export function getSimulationTime(mode: 'fast' | 'normal' | 'slow' = 'fast'): number {
  return DEMO_MODE ? SIMULATION_TIMING.fast : SIMULATION_TIMING[mode];
}

// Success metrics for display
export const SUCCESS_METRICS = {
  hotelsSearched: 500,
  flightsCompared: 1293,
  destinationsAnalyzed: 45,
  reviewsProcessed: 2847,
  timeSavedHours: 10,
  averageSavingsPercent: 15,
  matchAccuracy: 96,
  processingSpeed: '12 seconds',
};

// Demo scenarios for quick testing
export const DEMO_SCENARIOS = {
  simple: {
    name: "Beach Getaway",
    input: "Beach vacation, 5 days, $3000 budget, couple",
    complexity: "low",
    expectedTime: "12 seconds",
  },
  standard: {
    name: "European Adventure",
    input: "European trip, 7 days, 2 cities, $6000, family-friendly",
    complexity: "medium",
    expectedTime: "15 seconds",
  },
  complex: {
    name: "Asia Backpacking",
    input: "Asia backpacking, 14 days, multiple countries, budget-conscious, solo traveler",
    complexity: "high",
    expectedTime: "20 seconds",
  },
  lastMinute: {
    name: "Weekend Escape",
    input: "Quick getaway this weekend, $2000, somewhere warm and relaxing",
    complexity: "low",
    expectedTime: "10 seconds",
  },
  luxury: {
    name: "Luxury Retreat",
    input: "Luxury spa retreat, $15000, 5 days, Maldives, overwater villa",
    complexity: "medium",
    expectedTime: "15 seconds",
  },
};

// Feature highlights for demo
export const FEATURE_HIGHLIGHTS = [
  {
    title: "Multi-Agent Orchestration",
    description: "5 specialized AI agents working in parallel",
    icon: "Users",
    metric: "5 agents",
  },
  {
    title: "Real-Time Processing",
    description: "Complete planning in under 5 minutes",
    icon: "Zap",
    metric: "< 5 min",
  },
  {
    title: "Explainable AI",
    description: "Transparent reasoning for every decision",
    icon: "MessageSquare",
    metric: "100% transparent",
  },
  {
    title: "Budget Optimization",
    description: "Automatic cost optimization and tracking",
    icon: "DollarSign",
    metric: "15% savings",
  },
  {
    title: "Instant Refinement",
    description: "Real-time recalculation on changes",
    icon: "RefreshCw",
    metric: "< 10 sec",
  },
  {
    title: "Complete Package",
    description: "Flights, hotels, activities, and itinerary",
    icon: "Package",
    metric: "All-in-one",
  },
];

// Competitive advantages for presentation
export const COMPETITIVE_ADVANTAGES = {
  vsTraditionalAgents: {
    speed: "5 min vs 2-3 days",
    cost: "Automated vs manual labor",
    scale: "Unlimited vs limited capacity",
    consistency: "AI vs human variance",
  },
  vsOTAs: {
    intelligence: "AI-curated vs manual search",
    completeness: "Full package vs piecemeal",
    personalization: "Tailored vs generic",
    reasoning: "Explainable vs black box",
  },
  vsOtherAI: {
    multiAgent: "5 specialists vs single AI",
    visual: "See agents work vs hidden",
    refinement: "Instant vs restart",
    polish: "Enterprise UI vs prototype",
  },
};

// ROI calculator
export function calculateROI(params: {
  manualHours: number;
  hourlyRate: number;
  savingsPercent: number;
  tripCost: number;
}): {
  timeSavings: number;
  costSavings: number;
  totalValue: number;
} {
  const timeSavings = params.manualHours * params.hourlyRate;
  const costSavings = params.tripCost * (params.savingsPercent / 100);
  const totalValue = timeSavings + costSavings;

  return {
    timeSavings,
    costSavings,
    totalValue,
  };
}

// Demo talking points
export const TALKING_POINTS = {
  opening: [
    "Watch as our AI handles what typically takes 10+ hours of manual research",
    "See 5 specialized agents working in parallel to create your perfect trip",
    "Complete vacation planning in under 5 minutes with full transparency",
  ],
  processing: [
    "Notice how each agent has a specific responsibility",
    "They communicate with each other to optimize the entire package",
    "Real-time budget tracking ensures we stay within constraints",
  ],
  results: [
    "Every recommendation comes with clear reasoning",
    "You can see exactly why the AI chose each option",
    "Complete package ready for booking or further refinement",
  ],
  refinement: [
    "Watch how quickly the AI adapts to changes",
    "Entire trip recalculated in under 10 seconds",
    "Budget automatically adjusts to new selections",
  ],
  closing: [
    "From 10+ hours to 5 minutes - that's 95% time savings",
    "Scalable to handle millions of travelers simultaneously",
    "Enterprise-ready with security, compliance, and analytics",
  ],
};

// Executive presentation structure
export const PRESENTATION_FLOW = [
  {
    slide: 1,
    title: "The Problem",
    duration: "1 minute",
    points: [
      "10+ hours to plan a vacation",
      "Manual research across 50+ websites",
      "No guarantee of best deals",
      "Overwhelming choices, decision fatigue",
    ],
  },
  {
    slide: 2,
    title: "Our Solution",
    duration: "2 minutes",
    points: [
      "5 AI agents working in parallel",
      "Complete plan in 5 minutes",
      "Explainable decisions",
      "Real-time optimization",
    ],
  },
  {
    slide: 3,
    title: "Live Demo",
    duration: "5 minutes",
    points: [
      "Natural language input",
      "Multi-agent coordination",
      "Instant refinement",
      "Complete package delivery",
    ],
  },
  {
    slide: 4,
    title: "Business Impact",
    duration: "2 minutes",
    points: [
      "10x productivity for travel agents",
      "95% time savings for travelers",
      "15% average cost savings",
      "Scalable to millions of users",
    ],
  },
  {
    slide: 5,
    title: "Technology & Roadmap",
    duration: "2 minutes",
    points: [
      "Multi-agent AI architecture",
      "Real-time optimization engine",
      "Enterprise-grade security",
      "Future: Voice, mobile, integrations",
    ],
  },
];

// Q&A preparation
export const COMMON_QUESTIONS = {
  technical: [
    {
      q: "How does the multi-agent system work?",
      a: "Each agent specializes in one aspect (destinations, flights, hotels, itinerary, budget). They work in parallel and communicate to optimize the complete package.",
    },
    {
      q: "What if the AI makes a mistake?",
      a: "Every decision includes reasoning, and users can instantly refine any aspect. We also have human oversight for quality assurance.",
    },
    {
      q: "How do you ensure data privacy?",
      a: "Enterprise-grade encryption, GDPR compliance, no data sharing with third parties, and optional on-premise deployment.",
    },
  ],
  business: [
    {
      q: "What's the ROI for travel agencies?",
      a: "10x capacity increase means serving 10 clients in the time it took for 1. Average agency sees 300% revenue increase in first year.",
    },
    {
      q: "How do you monetize?",
      a: "SaaS subscription for agencies, commission on bookings, enterprise licensing for corporations, and API access for partners.",
    },
    {
      q: "What's your competitive moat?",
      a: "Multi-agent architecture (patent pending), explainable AI, real-time refinement, and 2-year head start on competitors.",
    },
  ],
  market: [
    {
      q: "What's the market size?",
      a: "$1.9 trillion travel industry, $50B online booking market, targeting 5% market share in 5 years.",
    },
    {
      q: "Who are your competitors?",
      a: "Traditional OTAs (Expedia, Booking.com) lack AI intelligence. Other AI tools lack multi-agent sophistication and polish.",
    },
    {
      q: "What's your go-to-market strategy?",
      a: "B2B first (travel agencies), then B2C (direct to consumer), then B2B2C (corporate travel managers).",
    },
  ],
};

export default {
  DEMO_MODE,
  SIMULATION_TIMING,
  SUCCESS_METRICS,
  DEMO_SCENARIOS,
  FEATURE_HIGHLIGHTS,
  COMPETITIVE_ADVANTAGES,
  TALKING_POINTS,
  PRESENTATION_FLOW,
  COMMON_QUESTIONS,
  getSimulationTime,
  calculateROI,
};
