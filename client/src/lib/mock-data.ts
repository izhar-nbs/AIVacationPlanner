import type { Destination, Flight, Hotel, Activity } from "@shared/schema";

// Destinations
export const destinations: Destination[] = [
  {
    id: "cancun",
    name: "Cancún",
    country: "Mexico",
    imageUrl: "https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&h=600&fit=crop",
    matchScore: 96,
    description: "Paradise beaches meet vibrant culture in this Caribbean gem. Perfect for couples seeking relaxation with world-class dining.",
    climate: "Tropical, 82°F average",
    bestMonth: "June",
    reasons: [
      "Perfect weather in June with minimal rain (28 days of sunshine)",
      "All-inclusive resorts offer exceptional value for couples",
      "World-renowned food scene combining Mexican and international cuisine",
      "Easy 4-hour direct flight from NYC",
      "Beautiful beaches with calm, turquoise waters ideal for relaxation",
    ],
    alternatives: [
      { name: "Tulum", priceDiff: 200, matchScore: 88 },
      { name: "Playa del Carmen", priceDiff: -150, matchScore: 85 },
    ],
  },
  {
    id: "bali",
    name: "Bali",
    country: "Indonesia",
    imageUrl: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&h=600&fit=crop",
    matchScore: 92,
    description: "Tropical paradise with stunning temples, rice terraces, and incredible food culture.",
    climate: "Tropical, 80°F average",
    bestMonth: "June-August",
    reasons: [
      "Incredible food scene with fresh seafood and traditional Balinese cuisine",
      "Perfect balance of beach relaxation and cultural experiences",
      "Luxury accommodations at affordable prices",
      "World-class spas and wellness retreats",
      "Stunning sunsets and romantic atmosphere",
    ],
  },
  {
    id: "santorini",
    name: "Santorini",
    country: "Greece",
    imageUrl: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&h=600&fit=crop",
    matchScore: 90,
    description: "Iconic white-washed villages perched on cliffs with breathtaking sunset views.",
    climate: "Mediterranean, 78°F average",
    bestMonth: "May-October",
    reasons: [
      "World-famous sunsets and romantic atmosphere",
      "Exceptional Greek cuisine and local wines",
      "Stunning caldera views from luxury hotels",
      "Perfect weather for beach and exploration",
      "Rich history and cultural experiences",
    ],
  },
];

// Flights
export const flights: Flight[] = [
  {
    id: "direct-delta",
    airline: "Delta Airlines",
    departureCity: "New York (JFK)",
    arrivalCity: "Cancún (CUN)",
    departureTime: "8:00 AM",
    arrivalTime: "12:15 PM",
    duration: "4h 15m",
    price: 1200,
    stops: 0,
    class: "economy",
    recommended: true,
    tradeoffs: "Best value - direct flight, convenient times",
  },
  {
    id: "budget-spirit",
    airline: "Spirit Airlines",
    departureCity: "New York (LGA)",
    arrivalCity: "Cancún (CUN)",
    departureTime: "6:00 AM",
    arrivalTime: "2:45 PM",
    duration: "7h 45m",
    price: 850,
    stops: 1,
    class: "economy",
    tradeoffs: "Saves $350 but adds 3.5 hours with layover in Fort Lauderdale",
  },
  {
    id: "premium-american",
    airline: "American Airlines",
    departureCity: "New York (JFK)",
    arrivalCity: "Cancún (CUN)",
    departureTime: "10:00 AM",
    arrivalTime: "2:30 PM",
    duration: "4h 30m",
    price: 2100,
    stops: 0,
    class: "business",
    tradeoffs: "Premium comfort with lie-flat seats and priority boarding",
  },
];

// Hotels
export const hotels: Hotel[] = [
  {
    id: "hyatt-zilara",
    name: "Hyatt Zilara Cancún",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop",
    stars: 5,
    pricePerNight: 350,
    totalPrice: 2450,
    amenities: ["All-Inclusive", "Beachfront", "Spa", "Fine Dining", "Pool"],
    rating: 4.8,
    reviewCount: 3247,
    aiReasoning: "Adults-only all-inclusive resort perfect for couples. Includes all meals, drinks, and activities. Great value compared to paying separately for dining.",
    location: "Hotel Zone, Beachfront",
    type: "Resort",
  },
  {
    id: "ritz-carlton",
    name: "The Ritz-Carlton Cancún",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop",
    stars: 5,
    pricePerNight: 450,
    totalPrice: 3150,
    amenities: ["Luxury Spa", "Beachfront", "Fine Dining", "Infinity Pool"],
    rating: 4.9,
    reviewCount: 2891,
    aiReasoning: "Premium luxury with exceptional service. Best option if budget allows for splurge on accommodation.",
    location: "Hotel Zone, Prime Beachfront",
    type: "Luxury Hotel",
  },
  {
    id: "secrets-moxche",
    name: "Secrets Moxché",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=600&fit=crop",
    stars: 4,
    pricePerNight: 280,
    totalPrice: 1960,
    amenities: ["All-Inclusive", "Adults-Only", "Beach Access", "Multiple Pools"],
    rating: 4.6,
    reviewCount: 1823,
    aiReasoning: "Budget-friendly all-inclusive option while maintaining quality. Saves $490 vs Hyatt Zilara for similar experience.",
    location: "Playa Mujeres, Quieter Area",
    type: "Resort",
  },
  {
    id: "live-aqua",
    name: "Live Aqua Beach Resort",
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&h=600&fit=crop",
    stars: 5,
    pricePerNight: 320,
    totalPrice: 2240,
    amenities: ["All-Inclusive", "Spa", "Beachfront", "Gourmet Dining"],
    rating: 4.7,
    reviewCount: 2156,
    aiReasoning: "Boutique luxury all-inclusive with exceptional culinary program. Perfect balance of luxury and value.",
    location: "Hotel Zone, Central Location",
    type: "Boutique Resort",
  },
];

// Activities Database
export const activitiesDatabase: Activity[] = [
  // Day 1
  {
    id: "checkin",
    time: "2:00 PM",
    name: "Hotel Check-in",
    description: "Arrive and settle into your beachfront suite",
    cost: 0,
    duration: "1 hour",
    category: "transport",
  },
  {
    id: "welcome-dinner",
    time: "7:00 PM",
    name: "Welcome Dinner at La Habichuela",
    description: "Traditional Mexican cuisine in a romantic garden setting",
    cost: 120,
    duration: "2 hours",
    category: "dining",
  },

  // Day 2
  {
    id: "chichen-itza",
    time: "7:00 AM",
    name: "Chichen Itza Tour",
    description: "Visit the iconic Mayan pyramid, one of the New Seven Wonders of the World",
    cost: 120,
    duration: "8 hours",
    category: "culture",
  },
  {
    id: "cenote-swim",
    time: "12:00 PM",
    name: "Cenote Ik Kil Swimming",
    description: "Cool off in a stunning natural sinkhole",
    cost: 0,
    duration: "1 hour",
    category: "adventure",
  },

  // Day 3
  {
    id: "beach-day",
    time: "9:00 AM",
    name: "Beach Relaxation Day",
    description: "Enjoy the pristine white sand beaches and turquoise waters",
    cost: 0,
    duration: "All day",
    category: "relaxation",
  },
  {
    id: "couples-massage",
    time: "4:00 PM",
    name: "Couples Spa Treatment",
    description: "Oceanfront massage with aromatherapy",
    cost: 200,
    duration: "90 minutes",
    category: "relaxation",
  },

  // Day 4
  {
    id: "snorkeling",
    time: "9:00 AM",
    name: "Snorkeling at Puerto Morelos Reef",
    description: "Explore vibrant coral reefs and tropical fish",
    cost: 80,
    duration: "4 hours",
    category: "adventure",
  },
  {
    id: "seafood-lunch",
    time: "1:30 PM",
    name: "Fresh Seafood Lunch",
    description: "Beachfront restaurant with catch of the day",
    cost: 90,
    duration: "1.5 hours",
    category: "dining",
  },
  {
    id: "sunset-cruise",
    time: "6:00 PM",
    name: "Sunset Catamaran Cruise",
    description: "Romantic sailing with open bar and appetizers",
    cost: 150,
    duration: "3 hours",
    category: "adventure",
  },

  // Day 5
  {
    id: "tulum-ruins",
    time: "8:00 AM",
    name: "Tulum Ruins & Beach",
    description: "Ancient cliffside Mayan city with stunning ocean views",
    cost: 90,
    duration: "6 hours",
    category: "culture",
  },
  {
    id: "mexican-cooking",
    time: "5:00 PM",
    name: "Mexican Cooking Class",
    description: "Learn to make authentic tacos and margaritas",
    cost: 85,
    duration: "3 hours",
    category: "culture",
  },

  // Day 6
  {
    id: "pool-relaxation",
    time: "10:00 AM",
    name: "Pool & Resort Day",
    description: "Relax by the infinity pool with drinks and snacks",
    cost: 0,
    duration: "All day",
    category: "relaxation",
  },
  {
    id: "fine-dining",
    time: "7:30 PM",
    name: "Fine Dining at Porfirio's",
    description: "Upscale Mexican cuisine with tequila tasting",
    cost: 140,
    duration: "2.5 hours",
    category: "dining",
  },

  // Day 7
  {
    id: "morning-yoga",
    time: "7:00 AM",
    name: "Beach Sunrise Yoga",
    description: "Start your final day with peaceful meditation",
    cost: 0,
    duration: "1 hour",
    category: "relaxation",
  },
  {
    id: "shopping",
    time: "10:00 AM",
    name: "La Isla Shopping Village",
    description: "Browse local crafts, souvenirs, and luxury brands",
    cost: 100,
    duration: "3 hours",
    category: "culture",
  },
  {
    id: "farewell-dinner",
    time: "6:00 PM",
    name: "Farewell Dinner at Lorenzillo's",
    description: "Lobster house on the lagoon with live music",
    cost: 130,
    duration: "2 hours",
    category: "dining",
  },
  {
    id: "checkout",
    time: "11:00 PM",
    name: "Hotel Checkout",
    description: "Prepare for departure",
    cost: 0,
    duration: "1 hour",
    category: "transport",
  },
];

// Generate complete itinerary
export function generateItinerary() {
  const days = [
    {
      day: 1,
      date: "June 15, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "checkin")!,
        activitiesDatabase.find(a => a.id === "welcome-dinner")!,
      ],
    },
    {
      day: 2,
      date: "June 16, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "chichen-itza")!,
        activitiesDatabase.find(a => a.id === "cenote-swim")!,
      ],
    },
    {
      day: 3,
      date: "June 17, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "beach-day")!,
        activitiesDatabase.find(a => a.id === "couples-massage")!,
      ],
    },
    {
      day: 4,
      date: "June 18, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "snorkeling")!,
        activitiesDatabase.find(a => a.id === "seafood-lunch")!,
        activitiesDatabase.find(a => a.id === "sunset-cruise")!,
      ],
    },
    {
      day: 5,
      date: "June 19, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "tulum-ruins")!,
        activitiesDatabase.find(a => a.id === "mexican-cooking")!,
      ],
    },
    {
      day: 6,
      date: "June 20, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "pool-relaxation")!,
        activitiesDatabase.find(a => a.id === "fine-dining")!,
      ],
    },
    {
      day: 7,
      date: "June 21, 2024",
      activities: [
        activitiesDatabase.find(a => a.id === "morning-yoga")!,
        activitiesDatabase.find(a => a.id === "shopping")!,
        activitiesDatabase.find(a => a.id === "farewell-dinner")!,
        activitiesDatabase.find(a => a.id === "checkout")!,
      ],
    },
  ];

  return {
    days: days.map(day => ({
      ...day,
      totalCost: day.activities.reduce((sum, activity) => sum + activity.cost, 0),
    })),
    totalDays: 7,
    pacing: {
      activities: 40,
      relaxation: 60,
    },
  };
}
