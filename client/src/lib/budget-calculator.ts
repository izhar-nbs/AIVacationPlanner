import type { TripPlan, BudgetStatus, Flight, Hotel, VacationPreferences } from "@shared/schema";

/**
 * Dynamically calculates budget status based on actual selected options
 * Always computes fresh values - never uses stale plan.budget
 */
export function calculateBudgetFromSelections(
  plan: TripPlan,
  selectedFlightId: string,
  selectedHotelId: string,
  userPreferences?: VacationPreferences
): BudgetStatus {
  const selectedFlight = plan.flights.find(f => f.id === selectedFlightId);
  const selectedHotel = plan.hotels.find(h => h.id === selectedHotelId);
  
  // Always use first options if selections invalid - never return original plan.budget reference
  const flight = selectedFlight || plan.flights[0];
  const hotel = selectedHotel || plan.hotels[0];
  
  // Calculate individual costs - ALWAYS compute fresh (treat missing as 0)
  const flightCost = flight?.price || 0;
  const accommodationCost = hotel?.totalPrice || 0;
  const activitiesCost = calculateActivitiesCost(plan, userPreferences?.budget);
  const foodCost = calculateFoodCost(plan, userPreferences?.budget);
  const transportCost = calculateTransportCost(plan, userPreferences?.budget);
  
  const totalAllocated = flightCost + accommodationCost + activitiesCost + foodCost + transportCost;
  
  // Compute fresh budget ceiling from user preferences or calculate from total (never trust plan.budget)
  const budgetCeiling = userPreferences?.budget || totalAllocated;
  const remaining = budgetCeiling - totalAllocated;
  const percentage = (totalAllocated / budgetCeiling) * 100;
  
  // Determine status with realistic thresholds for demo
  let status: "under" | "near" | "over" = "under";
  if (percentage >= 115) {  // Over 15% budget = truly over
    status = "over";
  } else if (percentage >= 90) {  // Within 10-15% = near budget
    status = "near";
  }
  
  return {
    budget: budgetCeiling, // Fresh computed ceiling, not plan.budget.budget
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
 * Calculate estimated activities cost based on itinerary and budget tier
 */
function calculateActivitiesCost(plan: TripPlan, userBudget?: number): number {
  const budget = userBudget || 5000;
  const budgetTier = budget >= 8000 ? 'luxury' : budget >= 3000 ? 'mid' : 'economy';
  
  // Sum all activity costs from the itinerary
  let rawTotal = 0;
  plan.itinerary.days.forEach(day => {
    day.activities.forEach(activity => {
      if (activity.cost) {
        rawTotal += activity.cost;
      }
    });
  });
  
  // Scale activity costs based on budget tier
  const scaleFactor = budgetTier === 'economy' ? 0.5 : budgetTier === 'mid' ? 0.75 : 1.0;
  const scaledTotal = rawTotal * scaleFactor;
  
  // If no activity costs or after scaling is 0, use tier-appropriate daily budget
  if (scaledTotal === 0) {
    const dailyActivityBudget = budgetTier === 'economy' ? 50 : budgetTier === 'mid' ? 80 : 120;
    return plan.itinerary.days.length * dailyActivityBudget;
  }
  
  return scaledTotal;
}

/**
 * Calculate estimated food cost based on budget tier
 */
function calculateFoodCost(plan: TripPlan, userBudget?: number): number {
  const budget = userBudget || 5000;
  const budgetTier = budget >= 8000 ? 'luxury' : budget >= 3000 ? 'mid' : 'economy';
  
  const dailyFoodBudget = budgetTier === 'economy' ? 50 : budgetTier === 'mid' ? 80 : 120;
  return plan.itinerary.days.length * dailyFoodBudget;
}

/**
 * Calculate local transport cost based on budget tier
 */
function calculateTransportCost(plan: TripPlan, userBudget?: number): number {
  const budget = userBudget || 5000;
  const budgetTier = budget >= 8000 ? 'luxury' : budget >= 3000 ? 'mid' : 'economy';
  
  const dailyTransportBudget = budgetTier === 'economy' ? 20 : budgetTier === 'mid' ? 30 : 50;
  return plan.itinerary.days.length * dailyTransportBudget;
}
