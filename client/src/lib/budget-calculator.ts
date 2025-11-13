import type { TripPlan, BudgetStatus, Flight, Hotel } from "@shared/schema";

/**
 * Dynamically calculates budget status based on actual selected options
 */
export function calculateBudgetFromSelections(
  plan: TripPlan,
  selectedFlightId: string,
  selectedHotelId: string
): BudgetStatus {
  const selectedFlight = plan.flights.find(f => f.id === selectedFlightId);
  const selectedHotel = plan.hotels.find(h => h.id === selectedHotelId);
  
  // Always use first options if selections invalid - never return original plan.budget reference
  const flight = selectedFlight || plan.flights[0];
  const hotel = selectedHotel || plan.hotels[0];
  
  if (!flight || !hotel) {
    // Deep clone plan budget as last resort
    return {
      ...plan.budget,
      breakdown: { ...plan.budget.breakdown }
    };
  }
  
  // Calculate individual costs
  const flightCost = flight.price;
  const accommodationCost = hotel.totalPrice;
  const activitiesCost = calculateActivitiesCost(plan);
  const foodCost = calculateFoodCost(plan);
  const transportCost = calculateTransportCost(plan);
  
  const totalAllocated = flightCost + accommodationCost + activitiesCost + foodCost + transportCost;
  const remaining = plan.budget.budget - totalAllocated;
  const percentage = (totalAllocated / plan.budget.budget) * 100;
  
  // Determine status
  let status: "under" | "near" | "over" = "under";
  if (percentage >= 100) {
    status = "over";
  } else if (percentage >= 90) {
    status = "near";
  }
  
  return {
    budget: plan.budget.budget,
    allocated: totalAllocated,
    remaining,
    status,
    breakdown: {
      flights: flightCost,
      accommodation: accommodationCost,
      activities: activitiesCost,
      food: foodCost,
      transport: transportCost,
      total: totalAllocated,
    },
  };
}

/**
 * Calculate estimated activities cost based on itinerary
 */
function calculateActivitiesCost(plan: TripPlan): number {
  // Sum all activity costs from the itinerary
  let total = 0;
  plan.itinerary.days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.cost) {
        total += activity.cost;
      }
    });
  });
  
  // If no activity costs defined, estimate based on destination and duration
  if (total === 0) {
    const dailyActivityBudget = 100; // $100/day baseline
    total = plan.itinerary.days.length * dailyActivityBudget;
  }
  
  return total;
}

/**
 * Calculate estimated food cost
 */
function calculateFoodCost(plan: TripPlan): number {
  const dailyFoodBudget = 80; // $80/day for meals
  return plan.itinerary.days.length * dailyFoodBudget;
}

/**
 * Calculate local transport cost
 */
function calculateTransportCost(plan: TripPlan): number {
  const dailyTransportBudget = 30; // $30/day for local transport
  return plan.itinerary.days.length * dailyTransportBudget;
}
