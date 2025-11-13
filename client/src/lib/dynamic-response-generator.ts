import { VacationPreferences } from "@shared/schema";
import { llmService } from "./llm-service";

interface ResponseContext {
  destination: string;
  budgetTier: 'economy' | 'mid' | 'luxury';
  duration: number;
  month?: string;
  departureCity?: string;
}

function determineBudgetTier(budget: number): 'economy' | 'mid' | 'luxury' {
  if (budget < 3000) return 'economy';
  if (budget <= 8000) return 'mid';
  return 'luxury';
}

const INTRO_TEMPLATES = {
  economy: [
    "I've identified an excellent value itinerary for {destination}.",
    "I've curated a budget-conscious plan to {destination}.",
    "Here's a smart, cost-effective journey to {destination}.",
  ],
  mid: [
    "I've designed a well-balanced itinerary for {destination}.",
    "I've assembled a premium travel plan to {destination}.",
    "Here's your curated journey to {destination}.",
  ],
  luxury: [
    "I've orchestrated an exclusive experience in {destination}.",
    "I've curated a luxury itinerary for {destination}.",
    "Here's your bespoke journey to {destination}.",
  ],
};

const DURATION_INSIGHTS = {
  short: [
    "This {duration}-day trip maximizes your time with carefully selected experiences.",
    "Your {duration}-day journey focuses on the essential highlights.",
  ],
  medium: [
    "Your {duration}-day itinerary balances exploration with relaxation.",
    "This {duration}-day plan provides comprehensive coverage of the destination.",
  ],
  long: [
    "Your {duration}-day journey allows for immersive cultural experiences.",
    "This extended {duration}-day itinerary captures the destination's depth.",
  ],
};

const DESTINATION_INSIGHTS: Record<string, string[]> = {
  Paris: [
    "The City of Light awaits with world-class museums, Michelin dining, and iconic landmarks.",
    "Experience Parisian elegance through art, gastronomy, and timeless architecture.",
  ],
  Tokyo: [
    "Japan's vibrant capital blends ancient traditions with cutting-edge innovation.",
    "Discover Tokyo's unique fusion of serene temples and neon-lit districts.",
  ],
  Bali: [
    "Indonesia's island paradise offers spiritual tranquility amid lush landscapes.",
    "Experience Bali's harmonious blend of culture, nature, and wellness.",
  ],
  Barcelona: [
    "Gaudí's masterpieces and Mediterranean charm define this Catalan gem.",
    "Barcelona captivates with Gothic quarters, modernist architecture, and beach culture.",
  ],
  Dubai: [
    "The Emirates' crown jewel showcases futuristic luxury and desert heritage.",
    "Dubai offers world-record attractions amid Arabian hospitality.",
  ],
  Maldives: [
    "Pristine atolls and overwater luxury create an unparalleled tropical escape.",
    "The Maldives delivers barefoot elegance in crystal-clear waters.",
  ],
  "New York": [
    "The city that never sleeps offers unmatched energy, culture, and diversity.",
    "NYC combines iconic landmarks with world-class dining and entertainment.",
  ],
  London: [
    "Britain's capital blends royal history with contemporary culture.",
    "London offers centuries of heritage alongside cutting-edge creativity.",
  ],
  Rome: [
    "The Eternal City layers millennia of history with la dolce vita.",
    "Rome presents ancient wonders amid vibrant Italian street life.",
  ],
  Santorini: [
    "Greece's clifftop jewel enchants with whitewashed beauty and Aegean sunsets.",
    "Santorini combines volcanic drama with romantic Mediterranean charm.",
  ],
};

const TIMING_NOTES: Record<string, string[]> = {
  June: [
    "June offers ideal weather conditions for your journey.",
    "Summer travel provides extended daylight for exploration.",
  ],
  July: [
    "July's peak season ensures all attractions operate at full capacity.",
    "Mid-summer brings vibrant local festivals and events.",
  ],
  August: [
    "August provides warm weather perfect for outdoor activities.",
    "Late summer offers excellent conditions for your adventure.",
  ],
  December: [
    "December adds festive charm to your destination.",
    "Year-end travel captures unique seasonal celebrations.",
  ],
  March: [
    "Spring shoulder season provides fewer crowds and pleasant weather.",
    "March offers ideal conditions before peak tourist season.",
  ],
  September: [
    "Early fall provides perfect weather with reduced crowds.",
    "September's shoulder season delivers excellent value and comfort.",
  ],
};

const CLOSING_TEMPLATES = {
  economy: [
    "You're getting exceptional value without compromising on quality.",
    "This efficient plan maximizes experiences within your budget.",
  ],
  mid: [
    "This balanced approach delivers quality experiences at fair value.",
    "Your itinerary combines comfort with authentic local experiences.",
  ],
  luxury: [
    "Every detail reflects premium service and exclusive access.",
    "This curated experience ensures unforgettable memories.",
  ],
};

// Utility to randomly select without immediate repetition
let lastSelections = new Map<string, number>();

function selectVariant(pool: string[], key: string): string {
  const lastIndex = lastSelections.get(key) ?? -1;
  let availableIndices = pool.map((_, i) => i).filter(i => i !== lastIndex);
  
  if (availableIndices.length === 0) {
    availableIndices = pool.map((_, i) => i);
  }
  
  const selectedIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
  lastSelections.set(key, selectedIndex);
  return pool[selectedIndex];
}

function getDurationCategory(days: number): 'short' | 'medium' | 'long' {
  if (days <= 4) return 'short';
  if (days <= 9) return 'medium';
  return 'long';
}

/**
 * Generate dynamic AI response - tries LLM first, falls back to templates
 */
export async function generateDynamicAIResponse(preferences: VacationPreferences): Promise<string> {
  // Extract destination name from Destination object or use description fallback
  const destinationName = preferences.destination 
    ? (typeof preferences.destination === 'string' ? preferences.destination : preferences.destination.name)
    : preferences.description || 'your destination';
    
  // Try LLM first if available
  if (llmService.isAvailable() && preferences.destination) {
    try {
      const response = await llmService.generateResponse(
        preferences,
        typeof preferences.destination === 'string' 
          ? { name: preferences.destination, country: '', id: '', imageUrl: '', matchScore: 0, description: '', climate: '', bestMonth: '', coordinates: { lat: 0, lng: 0 }, reasons: [] }
          : preferences.destination
      );
      return response;
    } catch (error) {
      console.warn('LLM response generation failed, using template:', error);
    }
  }
  
  // Fallback to template-based generation
  const context: ResponseContext = {
    destination: destinationName,
    budgetTier: determineBudgetTier(preferences.budget || 5000),
    duration: preferences.duration || 7,
    month: preferences.month,
    departureCity: preferences.departureCity,
  };

  const parts: string[] = [];

  // 1. Opening line (tier-specific) - now dynamic based on actual destination
  const introTemplate = selectVariant(INTRO_TEMPLATES[context.budgetTier], `intro-${context.budgetTier}`);
  parts.push(introTemplate.replace('{destination}', context.destination));

  // 2. Duration insight - dynamic based on actual duration
  const durationCategory = getDurationCategory(context.duration);
  const durationInsight = selectVariant(DURATION_INSIGHTS[durationCategory], `duration-${durationCategory}`);
  parts.push(durationInsight.replace('{duration}', context.duration.toString()));

  // 3. Destination-specific insight - now truly dynamic
  const destinationPool = DESTINATION_INSIGHTS[context.destination] || [
    `${context.destination} offers unique experiences perfectly tailored to your interests and preferences.`,
    `Discover the authentic charm and unforgettable moments that ${context.destination} has to offer.`,
  ];
  parts.push(selectVariant(destinationPool, `destination-${context.destination}`));

  // 4. Timing note (if month provided) - dynamic based on actual month
  if (context.month && TIMING_NOTES[context.month]) {
    parts.push(selectVariant(TIMING_NOTES[context.month], `timing-${context.month}`));
  } else if (context.month) {
    parts.push(`${context.month} provides excellent conditions for your journey to ${context.destination}.`);
  }

  // 5. Closing (tier-specific) - dynamic based on budget
  parts.push(selectVariant(CLOSING_TEMPLATES[context.budgetTier], `closing-${context.budgetTier}`));

  // 6. Final CTA - always dynamic
  parts.push("Our AI concierge team is now working to curate your perfect itinerary. Watch their progress in real-time!");

  return parts.join(' ');
}

/**
 * Synchronous version for backward compatibility
 */
export function generateDynamicAIResponseSync(preferences: VacationPreferences): string {
  const destinationName = preferences.destination 
    ? (typeof preferences.destination === 'string' ? preferences.destination : preferences.destination.name)
    : preferences.description || 'your destination';
    
  const context: ResponseContext = {
    destination: destinationName,
    budgetTier: determineBudgetTier(preferences.budget || 5000),
    duration: preferences.duration || 7,
    month: preferences.month,
    departureCity: preferences.departureCity,
  };

  const parts: string[] = [];
  const introTemplate = selectVariant(INTRO_TEMPLATES[context.budgetTier], `intro-${context.budgetTier}`);
  parts.push(introTemplate.replace('{destination}', context.destination));

  const durationCategory = getDurationCategory(context.duration);
  const durationInsight = selectVariant(DURATION_INSIGHTS[durationCategory], `duration-${durationCategory}`);
  parts.push(durationInsight.replace('{duration}', context.duration.toString()));

  const destinationPool = DESTINATION_INSIGHTS[context.destination] || [
    `${context.destination} offers unique experiences perfectly tailored to your interests.`,
  ];
  parts.push(selectVariant(destinationPool, `destination-${context.destination}`));

  if (context.month && TIMING_NOTES[context.month]) {
    parts.push(selectVariant(TIMING_NOTES[context.month], `timing-${context.month}`));
  }

  parts.push(selectVariant(CLOSING_TEMPLATES[context.budgetTier], `closing-${context.budgetTier}`));
  parts.push("Our AI concierge team is now curating your perfect itinerary!");

  return parts.join(' ');
}
