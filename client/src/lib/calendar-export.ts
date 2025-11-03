import { createEvents, EventAttributes, DateArray } from "ics";
import type { TripPlan } from "@shared/schema";

export function generateCalendarFile(tripPlan: TripPlan): void {
  const events: EventAttributes[] = [];

  tripPlan.itinerary.days.forEach((day) => {
    day.activities.forEach((activity) => {
      // Parse the date and time
      const [month, dayNum, year] = day.date.split("/").map(Number);
      const [timeStr, period] = activity.time.split(" ");
      const [hours, minutes] = timeStr.split(":").map(Number);
      
      // Convert to 24-hour format
      let hour24 = hours;
      if (period === "PM" && hours !== 12) {
        hour24 = hours + 12;
      } else if (period === "AM" && hours === 12) {
        hour24 = 0;
      }

      // Create start date array [year, month, day, hour, minute]
      const start: DateArray = [year, month, dayNum, hour24, minutes];
      
      // Calculate duration (default 1 hour if not specified)
      const durationMatch = activity.duration?.match(/(\d+)/);
      const durationHours = durationMatch ? parseInt(durationMatch[1]) : 1;
      
      const event: EventAttributes = {
        start,
        duration: { hours: durationHours },
        title: activity.name,
        description: `${activity.description}${activity.cost > 0 ? `\n\nCost: $${activity.cost}` : ""}`,
        location: `${tripPlan.destination.name}, ${tripPlan.destination.country}`,
        status: "CONFIRMED",
        busyStatus: "BUSY",
        categories: [activity.category],
      };

      events.push(event);
    });
  });

  // Generate ICS file
  createEvents(events, (error, value) => {
    if (error) {
      console.error("Error generating calendar file:", error);
      return;
    }

    // Create blob and download
    const blob = new Blob([value], { type: "text/calendar;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${tripPlan.destination.name.replace(/\s+/g, "_")}_Trip.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  });
}
