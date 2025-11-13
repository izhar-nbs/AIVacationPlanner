import type { Destination } from "@shared/schema";
import { destinations } from "./mock-data";

/**
 * DestinationResolver - Intelligently extracts and matches destinations from user input
 * Supports fuzzy matching, keyword extraction, and fallback to ad-hoc destinations
 */

interface ResolvedDestination {
  destination: Destination;
  confidence: "high" | "medium" | "low";
  matchedKeyword?: string;
}

/**
 * Calculates similarity between two strings using Levenshtein distance
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  
  if (s1 === s2) return 1.0;
  if (s1.includes(s2) || s2.includes(s1)) return 0.9;
  
  // Simple trigram similarity
  const len1 = s1.length;
  const len2 = s2.length;
  const maxLen = Math.max(len1, len2);
  
  if (maxLen === 0) return 1.0;
  
  let matches = 0;
  for (let i = 0; i < Math.min(len1, len2); i++) {
    if (s1[i] === s2[i]) matches++;
  }
  
  return matches / maxLen;
}

/**
 * Extract potential destination keywords from user message
 */
function extractDestinationKeywords(message: string): string[] {
  const keywords: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  // Common destination-related phrases
  const patterns = [
    /(?:to|in|at|visit|explore|see|trip to|vacation in|travel to)\s+([a-z\s]+?)(?:\s+for|\s+with|\s+and|\s+,|$)/gi,
    /([a-z\s]{3,}?)(?:\s+beach|\s+island|\s+resort|\s+city|\s+destination)/gi,
  ];
  
  patterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(lowerMessage)) !== null) {
      const keyword = match[1]?.trim();
      if (keyword && keyword.length > 2) {
        keywords.push(keyword);
      }
    }
  });
  
  // Also check for known destination names directly
  destinations.forEach(dest => {
    if (lowerMessage.includes(dest.name.toLowerCase()) || 
        lowerMessage.includes(dest.country.toLowerCase())) {
      keywords.push(dest.name);
    }
  });
  
  return Array.from(new Set(keywords));
}

/**
 * Find best matching destination from curated list
 */
function findBestMatch(keyword: string): { destination: Destination; score: number } | null {
  let bestMatch: { destination: Destination; score: number } | null = null;
  
  destinations.forEach(dest => {
    const nameScore = calculateSimilarity(keyword, dest.name);
    const countryScore = calculateSimilarity(keyword, dest.country);
    const score = Math.max(nameScore, countryScore);
    
    if (score > 0.6 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { destination: dest, score };
    }
  });
  
  return bestMatch;
}

/**
 * Create ad-hoc destination for unknown locations
 */
function createAdHocDestination(name: string): Destination {
  const formattedName = name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
  
  return {
    id: `adhoc-${name.toLowerCase().replace(/\s+/g, '-')}`,
    name: formattedName,
    country: "Unknown",
    imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop",
    matchScore: 75,
    description: `A wonderful destination for your next adventure. Let our AI agents curate the perfect experience for you.`,
    climate: "Varies by season",
    bestMonth: "Year-round",
    coordinates: { lat: 0, lng: 0 },
    reasons: [
      "Unique local experiences await",
      "Rich cultural heritage to explore",
      "Authentic cuisine and hospitality",
      "Perfect for memorable adventures",
    ],
  };
}

/**
 * Main resolver function - extracts destination from user message
 */
export function resolveDestination(message: string, explicitDestination?: string): ResolvedDestination {
  // Priority 1: Use explicit destination if provided
  if (explicitDestination) {
    const match = findBestMatch(explicitDestination);
    if (match && match.score > 0.8) {
      return {
        destination: match.destination,
        confidence: "high",
        matchedKeyword: explicitDestination,
      };
    }
    return {
      destination: createAdHocDestination(explicitDestination),
      confidence: "low",
      matchedKeyword: explicitDestination,
    };
  }
  
  // Priority 2: Extract from natural language message
  const keywords = extractDestinationKeywords(message);
  
  if (keywords.length === 0) {
    // Fallback to first curated destination
    return {
      destination: destinations[0],
      confidence: "low",
    };
  }
  
  // Find best match from extracted keywords
  let bestOverall: { destination: Destination; score: number; keyword: string } = {
    destination: destinations[0],
    score: 0,
    keyword: keywords[0]
  };
  
  keywords.forEach(keyword => {
    const match = findBestMatch(keyword);
    if (match && match.score > bestOverall.score) {
      bestOverall = { destination: match.destination, score: match.score, keyword };
    }
  });
  
  if (bestOverall.score > 0.85) {
    return {
      destination: bestOverall.destination,
      confidence: "high",
      matchedKeyword: bestOverall.keyword,
    };
  } else if (bestOverall.score > 0.7) {
    return {
      destination: bestOverall.destination,
      confidence: "medium",
      matchedKeyword: bestOverall.keyword,
    };
  }
  
  // Last resort: Create ad-hoc destination from first keyword
  return {
    destination: createAdHocDestination(keywords[0]),
    confidence: "low",
    matchedKeyword: keywords[0],
  };
}

/**
 * Get friendly confidence message for UI feedback
 */
export function getConfidenceMessage(confidence: "high" | "medium" | "low", destinationName: string): string {
  switch (confidence) {
    case "high":
      return `Planning your trip to ${destinationName}`;
    case "medium":
      return `Planning your trip to ${destinationName} (based on your request)`;
    case "low":
      return `We'll help you explore ${destinationName}`;
  }
}
