import type { VacationPreferences, TripPlan } from "@shared/schema";

// Extend Window interface for gtag
declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Analytics service for tracking user interactions and events
 * Supports Google Analytics 4 and can be extended for other platforms
 */
export class Analytics {
  private static instance: Analytics;
  private initialized = false;
  private measurementId: string | null = null;

  private constructor() {}

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  /**
   * Initialize analytics with Google Analytics 4
   * @param measurementId - GA4 Measurement ID (e.g., 'G-XXXXXXXXXX')
   */
  init(measurementId: string) {
    if (this.initialized) {
      console.warn('Analytics already initialized');
      return;
    }

    this.measurementId = measurementId;
    
    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    // Initialize dataLayer
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(...args: any[]) {
      window.dataLayer.push(args);
    };
    
    window.gtag('js', new Date());
    window.gtag('config', measurementId, {
      send_page_view: true,
      anonymize_ip: true, // GDPR compliance
    });

    this.initialized = true;
    console.log('Analytics initialized:', measurementId);
  }

  /**
   * Track custom events
   * @param eventName - Name of the event
   * @param params - Event parameters
   */
  trackEvent(eventName: string, params?: Record<string, any>) {
    if (!this.initialized) {
      console.warn('Analytics not initialized. Call init() first.');
      return;
    }
    
    window.gtag?.('event', eventName, params);
    console.log('Analytics event:', eventName, params);
  }

  /**
   * Track page views
   * @param path - Page path
   * @param title - Page title
   */
  trackPageView(path: string, title?: string) {
    this.trackEvent('page_view', {
      page_path: path,
      page_title: title || document.title,
    });
  }

  // ===== Vacation Planner Specific Events =====

  /**
   * Track when user submits vacation request
   */
  trackVacationRequest(preferences: VacationPreferences) {
    this.trackEvent('vacation_request_submitted', {
      budget: preferences.budget,
      duration: preferences.duration,
      destination: preferences.destination?.name || 'unknown',
      travelers: preferences.travelers,
      departure_city: preferences.departureCity,
      month: preferences.month,
      interests: preferences.interests?.join(','),
    });
  }

  /**
   * Track destination changes
   */
  trackDestinationChange(from: string, to: string) {
    this.trackEvent('destination_changed', {
      from_destination: from,
      to_destination: to,
    });
  }

  /**
   * Track when checkout is initiated
   */
  trackCheckoutInitiated(tripPlan: TripPlan) {
    this.trackEvent('checkout_initiated', {
      destination: tripPlan.destination.name,
      total_cost: tripPlan.budget.allocated,
      match_score: tripPlan.destination.matchScore,
    });
  }

  /**
   * Track when checkout is completed
   */
  trackCheckoutCompleted(tripPlan: TripPlan, totalCost: number) {
    this.trackEvent('purchase', {
      transaction_id: `trip_${Date.now()}`,
      value: totalCost,
      currency: 'USD',
      destination: tripPlan.destination.name,
      items: [
        {
          item_id: tripPlan.destination.id,
          item_name: tripPlan.destination.name,
          item_category: 'vacation_package',
          price: totalCost,
          quantity: 1,
        },
      ],
    });
  }

  /**
   * Track agent completion
   */
  trackAgentCompletion(agentId: string, duration: number) {
    this.trackEvent('agent_completed', {
      agent_id: agentId,
      duration_ms: duration,
    });
  }

  /**
   * Track refinement requests
   */
  trackRefinement(refinementType: string) {
    this.trackEvent('refinement_requested', {
      refinement_type: refinementType,
    });
  }

  /**
   * Track flight selection
   */
  trackFlightSelection(flightId: string, price: number) {
    this.trackEvent('flight_selected', {
      flight_id: flightId,
      price: price,
    });
  }

  /**
   * Track hotel selection
   */
  trackHotelSelection(hotelId: string, price: number) {
    this.trackEvent('hotel_selected', {
      hotel_id: hotelId,
      price: price,
    });
  }

  /**
   * Track PDF export
   */
  trackPDFExport(destination: string) {
    this.trackEvent('pdf_exported', {
      destination: destination,
    });
  }

  /**
   * Track calendar export
   */
  trackCalendarExport(destination: string) {
    this.trackEvent('calendar_exported', {
      destination: destination,
    });
  }

  /**
   * Track errors
   */
  trackError(error: Error, context?: string) {
    this.trackEvent('error_occurred', {
      error_message: error.message,
      error_stack: error.stack?.substring(0, 500), // Limit stack trace length
      context: context,
    });
  }

  /**
   * Track user timing (performance metrics)
   */
  trackTiming(category: string, variable: string, value: number) {
    this.trackEvent('timing_complete', {
      name: variable,
      value: value,
      event_category: category,
    });
  }
}

// Export singleton instance
export const analytics = Analytics.getInstance();
