import { useState } from "react";
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

// Destination coordinates (hardcoded for demo)
const DESTINATION_COORDS: Record<string, [number, number]> = {
  "cancun": [21.1619, -86.8515],
  "bali": [-8.3405, 115.0920],
  "santorini": [36.3932, 25.4615],
  "maldives": [3.2028, 73.2207],
  "tulum": [20.2114, -87.4654],
};

interface MapViewProps {
  plan: TripPlan;
}

export function MapView({ plan }: MapViewProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get destination coordinates
  const coords = DESTINATION_COORDS[plan.destination.id] || [0, 0];
  
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

  // Sample activity locations (slightly offset from main destination)
  const activityLocations = [
    { name: "Beach Activities", lat: coords[0] + 0.02, lng: coords[1] - 0.02 },
    { name: "City Center", lat: coords[0] - 0.01, lng: coords[1] + 0.01 },
    { name: "Historic Sites", lat: coords[0] + 0.01, lng: coords[1] + 0.02 },
  ];

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
                  center={coords}
                  zoom={12}
                  style={{ height: "100%", width: "100%" }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* Main destination marker */}
                  <Marker position={coords}>
                    <Popup>
                      <div className="text-center">
                        <p className="font-semibold text-sm">{plan.destination.name}</p>
                        <p className="text-xs text-muted-foreground">{plan.destination.country}</p>
                      </div>
                    </Popup>
                  </Marker>

                  {/* Hotel marker */}
                  {plan.selectedHotel && (
                    <Marker position={[coords[0] + 0.005, coords[1] - 0.005]} icon={hotelIcon}>
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
                      key={index}
                      position={[location.lat, location.lng]} 
                      icon={activityIcon}
                    >
                      <Popup>
                        <div>
                          <p className="font-semibold text-sm flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            {location.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Point of Interest
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
                    <span className="text-muted-foreground">Activities</span>
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
