import { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion, AnimatePresence } from "framer-motion";
import { Map as MapIcon, ChevronDown, ChevronUp, MapPin, Hotel as HotelIcon, Activity } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TripPlan } from "@shared/schema";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapViewProps {
  plan: TripPlan;
}

export function MapView({ plan }: MapViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get destination coordinates from plan data
  const destinationCoords: [number, number] = [
    plan.destination.coordinates.lat,
    plan.destination.coordinates.lng
  ];
  
  // Create custom icons
  const hotelIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const activityIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Extract hotel coordinates or use slight offset from destination
  const hotelCoords: [number, number] | null = useMemo(() => {
    if (plan.selectedHotel?.coordinates) {
      return [plan.selectedHotel.coordinates.lat, plan.selectedHotel.coordinates.lng];
    }
    // Fallback: slight offset from destination
    return [destinationCoords[0] + 0.005, destinationCoords[1] - 0.005];
  }, [plan.selectedHotel, destinationCoords]);

  // Extract activity locations from itinerary
  const activityLocations = useMemo(() => {
    const locations: Array<{
      name: string;
      lat: number;
      lng: number;
      category: string;
    }> = [];

    // Collect unique activities with coordinates
    const seen = new Set<string>();
    
    plan.itinerary.days.forEach(day => {
      day.activities.forEach(activity => {
        // Skip transport and dining activities
        if (activity.category === "transport" || activity.category === "dining") {
          return;
        }

        if (activity.coordinates) {
          const key = `${activity.coordinates.lat}-${activity.coordinates.lng}`;
          if (!seen.has(key)) {
            seen.add(key);
            locations.push({
              name: activity.name,
              lat: activity.coordinates.lat,
              lng: activity.coordinates.lng,
              category: activity.category
            });
          }
        }
      });
    });

    // If no activities have coordinates, generate some sample points around destination
    if (locations.length === 0) {
      const offsets = [
        { lat: 0.02, lng: -0.02, name: "Beach Activities", category: "relaxation" },
        { lat: -0.01, lng: 0.01, name: "City Center", category: "culture" },
        { lat: 0.01, lng: 0.02, name: "Historic Sites", category: "culture" },
      ];
      
      offsets.forEach(offset => {
        locations.push({
          name: offset.name,
          lat: destinationCoords[0] + offset.lat,
          lng: destinationCoords[1] + offset.lng,
          category: offset.category
        });
      });
    }

    return locations;
  }, [plan.itinerary, destinationCoords]);

  return (
    <Card className="overflow-hidden" data-testid="card-map">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapIcon className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">
              Destination Map
            </h3>
            <Badge variant="outline" className="ml-2 text-xs">
              {plan.destination.name}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            data-testid="button-toggle-map"
            className="gap-1"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Collapse
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Expand
              </>
            )}
          </Button>
        </div>
      </CardHeader>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CardContent className="p-0">
              <div className="h-[400px] w-full relative">
                <MapContainer
                  center={destinationCoords}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Main destination marker */}
                  <Marker position={destinationCoords}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold text-sm">{plan.destination.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.destination.country}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Hotel marker */}
                  {hotelCoords && plan.selectedHotel && (
                    <Marker position={hotelCoords} icon={hotelIcon}>
                      <Popup>
                        <div>
                          <p className="font-semibold text-sm flex items-center gap-1">
                            <HotelIcon className="w-3 h-3" />
                            {plan.selectedHotel.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {plan.selectedHotel.stars}★ Hotel
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Activity markers */}
                  {activityLocations.map((location, index) => (
                    <Marker 
                      key={`${location.lat}-${location.lng}-${index}`}
                      position={[location.lat, location.lng]} 
                      icon={activityIcon}
                    >
                      <Popup>
                        <div>
                          <p className="font-semibold text-sm flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {location.name}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {location.category}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>

              {/* Legend */}
              <div className="p-4 border-t bg-muted/30">
                <div className="flex items-center justify-center gap-6 flex-wrap text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="text-muted-foreground">Destination</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <HotelIcon className="w-4 h-4 text-red-600" />
                    <span className="text-muted-foreground">Hotel</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-600" />
                    <span className="text-muted-foreground">
                      Activities ({activityLocations.length})
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collapsed preview */}
      {!isExpanded && (
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapIcon className="w-4 h-4" />
            <span>Click to view interactive map with hotel and activity locations</span>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
