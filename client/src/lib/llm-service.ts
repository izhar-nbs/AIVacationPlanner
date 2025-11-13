/**
 * LLM Service - Integration with free LLM APIs
 * Supports multiple providers: Groq, Together AI, Hugging Face
 */

import type { VacationPreferences, Destination } from "@shared/schema";

// LLM Provider configuration
const LLM_PROVIDERS = {
  groq: {
    url: 'https://api.groq.com/openai/v1/chat/completions',
    model: 'llama-3.1-8b-instant', // Fast and free
    requiresKey: true,
  },
  together: {
    url: 'https://api.together.xyz/v1/chat/completions',
    model: 'meta-llama/Llama-3-8b-chat-hf',
    requiresKey: true,
  },
  huggingface: {
    url: 'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3-8B-Instruct',
    model: 'meta-llama/Meta-Llama-3-8B-Instruct',
    requiresKey: false, // Can work without key (rate limited)
  },
};

interface LLMResponse {
  content: string;
  provider: string;
  model: string;
}

interface DestinationSuggestion {
  name: string;
  country: string;
  matchScore: number;
  reasons: string[];
  description: string;
  climate: string;
  bestMonth: string;
}

/**
 * LLM Service class for AI-powered vacation planning
 */
export class LLMService {
  private static instance: LLMService;
  private apiKey: string | null = null;
  private provider: keyof typeof LLM_PROVIDERS = 'groq';

  private constructor() {
    // Try to get API key from environment
    this.apiKey = import.meta.env.VITE_LLM_API_KEY || null;
  }

  static getInstance(): LLMService {
    if (!LLMService.instance) {
      LLMService.instance = new LLMService();
    }
    return LLMService.instance;
  }

  /**
   * Set API key manually
   */
  setApiKey(key: string) {
    this.apiKey = key;
  }

  /**
   * Set LLM provider
   */
  setProvider(provider: keyof typeof LLM_PROVIDERS) {
    this.provider = provider;
  }

  /**
   * Check if LLM is available
   */
  isAvailable(): boolean {
    const config = LLM_PROVIDERS[this.provider];
    return !config.requiresKey || !!this.apiKey;
  }

  /**
   * Make LLM API call
   */
  private async callLLM(prompt: string, systemPrompt?: string): Promise<LLMResponse> {
    const config = LLM_PROVIDERS[this.provider];

    if (config.requiresKey && !this.apiKey) {
      throw new Error(`API key required for ${this.provider}. Set VITE_LLM_API_KEY in .env`);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const messages = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    try {
      const response = await fetch(config.url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: config.model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`LLM API error: ${response.status} - ${error}`);
      }

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || '';

      return {
        content,
        provider: this.provider,
        model: config.model,
      };
    } catch (error) {
      console.error('LLM API call failed:', error);
      throw error;
    }
  }

  /**
   * Suggest destinations based on user preferences
   */
  async suggestDestinations(preferences: VacationPreferences): Promise<DestinationSuggestion[]> {
    const systemPrompt = `You are a professional travel advisor AI. Analyze vacation requests and suggest the 3 best destinations.
Return ONLY a valid JSON array with this exact structure (no markdown, no extra text):
[
  {
    "name": "City Name",
    "country": "Country",
    "matchScore": 95,
    "reasons": ["reason 1", "reason 2", "reason 3", "reason 4", "reason 5"],
    "description": "One compelling sentence about this destination",
    "climate": "Brief climate description",
    "bestMonth": "Best month to visit"
  }
]`;

    const prompt = `Suggest 3 destinations for this vacation:
- Description: ${preferences.description}
- Budget: $${preferences.budget || 5000}
- Duration: ${preferences.duration || 7} days
- Travelers: ${preferences.travelers || 2}
- Departure: ${preferences.departureCity || 'flexible'}
- Month: ${preferences.month || 'flexible'}
- Interests: ${preferences.interests?.join(', ') || 'general tourism'}

Consider budget, interests, season, and travel time. Return JSON array only.`;

    try {
      const response = await this.callLLM(prompt, systemPrompt);
      
      // Parse JSON response
      const jsonMatch = response.content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('Invalid JSON response from LLM');
      }

      const suggestions: DestinationSuggestion[] = JSON.parse(jsonMatch[0]);
      return suggestions.slice(0, 3); // Ensure max 3
    } catch (error) {
      console.error('Failed to get LLM suggestions:', error);
      // Return fallback suggestions
      return this.getFallbackSuggestions(preferences);
    }
  }

  /**
   * Generate dynamic AI response based on user input
   */
  async generateResponse(preferences: VacationPreferences, destination: Destination): Promise<string> {
    const systemPrompt = `You are a friendly, professional travel concierge AI. Generate a brief, enthusiastic response (2-3 sentences) confirming the vacation request. Be specific about the details provided. Sound natural and conversational.`;

    const prompt = `Generate a confirmation message for this vacation request:
- Destination: ${destination.name}, ${destination.country}
- Budget: $${preferences.budget || 5000}
- Duration: ${preferences.duration || 7} days
- Travelers: ${preferences.travelers || 2}
- Interests: ${preferences.interests?.join(', ') || 'relaxation and exploration'}

Confirm the details and express excitement about planning their trip. Keep it brief and natural.`;

    try {
      const response = await this.callLLM(prompt, systemPrompt);
      return response.content.trim();
    } catch (error) {
      console.error('Failed to generate response:', error);
      // Fallback to template
      return this.getFallbackResponse(preferences, destination);
    }
  }

  /**
   * Generate destination description
   */
  async generateDestinationDescription(
    destinationName: string,
    preferences: VacationPreferences
  ): Promise<string> {
    const systemPrompt = `You are a travel writer. Create a compelling, one-sentence description of a destination that matches the traveler's interests.`;

    const prompt = `Write one compelling sentence about ${destinationName} for travelers interested in: ${preferences.interests?.join(', ') || 'general tourism'}. Budget: $${preferences.budget || 5000}. Make it specific and enticing.`;

    try {
      const response = await this.callLLM(prompt, systemPrompt);
      return response.content.trim();
    } catch (error) {
      return `Discover the unique charm and unforgettable experiences that ${destinationName} has to offer.`;
    }
  }

  /**
   * Fallback suggestions when LLM is unavailable
   */
  private getFallbackSuggestions(preferences: VacationPreferences): DestinationSuggestion[] {
    const budget = preferences.budget || 5000;
    const interests = preferences.interests || [];
    
    // Intelligent fallback based on preferences
    const suggestions: DestinationSuggestion[] = [];

    // Beach/relaxation destinations
    if (interests.some(i => ['beach', 'relaxation', 'wellness'].includes(i.toLowerCase())) || 
        preferences.description.toLowerCase().includes('beach')) {
      suggestions.push({
        name: 'Bali',
        country: 'Indonesia',
        matchScore: 92,
        reasons: [
          'World-class beaches and wellness retreats',
          'Affordable luxury within your budget',
          'Rich cultural experiences',
          'Excellent food scene',
          'Perfect for relaxation and adventure'
        ],
        description: 'A spiritual paradise combining pristine beaches with cultural richness',
        climate: 'Tropical, 80°F year-round',
        bestMonth: preferences.month || 'April-October'
      });
    }

    // Adventure destinations
    if (interests.some(i => ['adventure', 'hiking', 'nature'].includes(i.toLowerCase()))) {
      suggestions.push({
        name: 'Costa Rica',
        country: 'Costa Rica',
        matchScore: 90,
        reasons: [
          'Incredible biodiversity and nature',
          'Adventure activities galore',
          'Eco-friendly tourism',
          'Beautiful beaches and rainforests',
          'Great value for money'
        ],
        description: 'An adventure paradise with rainforests, volcanoes, and pristine beaches',
        climate: 'Tropical, varies by region',
        bestMonth: preferences.month || 'December-April'
      });
    }

    // Cultural/historical destinations
    if (interests.some(i => ['culture', 'history', 'art'].includes(i.toLowerCase()))) {
      suggestions.push({
        name: 'Rome',
        country: 'Italy',
        matchScore: 88,
        reasons: [
          'Unparalleled historical sites',
          'World-famous art and architecture',
          'Exceptional Italian cuisine',
          'Walkable city center',
          'Rich cultural experiences'
        ],
        description: 'The Eternal City where ancient history meets modern Italian culture',
        climate: 'Mediterranean, mild winters',
        bestMonth: preferences.month || 'April-June'
      });
    }

    // Default suggestions if none match
    if (suggestions.length === 0) {
      suggestions.push(
        {
          name: 'Barcelona',
          country: 'Spain',
          matchScore: 89,
          reasons: [
            'Perfect blend of beach and city',
            'Stunning architecture',
            'Vibrant food scene',
            'Rich culture and nightlife',
            'Great weather year-round'
          ],
          description: 'A vibrant Mediterranean city combining culture, beaches, and gastronomy',
          climate: 'Mediterranean, warm summers',
          bestMonth: preferences.month || 'May-September'
        },
        {
          name: 'Tokyo',
          country: 'Japan',
          matchScore: 87,
          reasons: [
            'Unique cultural experience',
            'World-class cuisine',
            'Safe and clean',
            'Modern and traditional blend',
            'Excellent public transportation'
          ],
          description: 'A fascinating blend of ultra-modern and traditional Japanese culture',
          climate: 'Temperate, four distinct seasons',
          bestMonth: preferences.month || 'March-May'
        }
      );
    }

    return suggestions.slice(0, 3);
  }

  /**
   * Fallback response template
   */
  private getFallbackResponse(preferences: VacationPreferences, destination: Destination): string {
    const budget = preferences.budget || 5000;
    const duration = preferences.duration || 7;
    const travelers = preferences.travelers || 2;

    return `Perfect! I'm planning your ${duration}-day journey to ${destination.name} for ${travelers} ${travelers === 1 ? 'traveler' : 'travelers'} with a $${budget.toLocaleString()} budget. Our AI concierge team is now curating flights, accommodations, and experiences tailored to your interests. Watch as our 5 specialized agents work in real-time!`;
  }
}

// Export singleton
export const llmService = LLMService.getInstance();
