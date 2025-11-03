import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  Palmtree, 
  Mountain, 
  Building2, 
  Heart,
  Briefcase,
  Users,
  Compass
} from "lucide-react";

interface SuggestionsSidebarProps {
  onSelectSuggestion: (prompt: string) => void;
}

const suggestions = [
  {
    category: "Family Vacations",
    icon: Users,
    prompts: [
      "Family beach vacation, 7 days, $8,000 budget",
      "Kid-friendly theme park trip, 5 days, $6,000",
      "Educational cultural tour for family, 10 days"
    ]
  },
  {
    category: "Business Travel",
    icon: Briefcase,
    prompts: [
      "Executive retreat with team building, 3 days",
      "Conference attendance in major city, 4 days",
      "International business meetings, 1 week"
    ]
  },
  {
    category: "Weekend Getaways",
    icon: Compass,
    prompts: [
      "Romantic weekend escape, 3 days, $2,000",
      "Adventure weekend in mountains, 2 days",
      "Spa wellness retreat, 3 days, $3,000"
    ]
  },
  {
    category: "Adventure Trips",
    icon: Mountain,
    prompts: [
      "Hiking and outdoor adventure, 10 days, $7,000",
      "Scuba diving tropical destination, 1 week",
      "Safari and wildlife experience, 12 days"
    ]
  }
];

export function SuggestionsSidebar({ onSelectSuggestion }: SuggestionsSidebarProps) {
  return (
    <div className="h-full overflow-y-auto bg-card border-r border-border p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quick Start</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a template to begin planning instantly
        </p>
      </div>

      {/* Popular Destinations */}
      <Card data-testid="card-popular-destinations">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Palmtree className="w-4 h-4" />
            Popular Destinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full justify-start text-left hover-elevate active-elevate-2"
            onClick={() => onSelectSuggestion("Tropical beach paradise, 7 days, $5,000 budget")}
            data-testid="button-suggestion-tropical"
          >
            <Palmtree className="w-4 h-4 mr-2" />
            Tropical Beach Paradise
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left hover-elevate active-elevate-2"
            onClick={() => onSelectSuggestion("European cultural cities, 10 days, $8,000")}
            data-testid="button-suggestion-european"
          >
            <Building2 className="w-4 h-4 mr-2" />
            European City Tour
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left hover-elevate active-elevate-2"
            onClick={() => onSelectSuggestion("Mountain adventure and hiking, 7 days, $6,000")}
            data-testid="button-suggestion-mountain"
          >
            <Mountain className="w-4 h-4 mr-2" />
            Mountain Adventure
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left hover-elevate active-elevate-2"
            onClick={() => onSelectSuggestion("Romantic honeymoon getaway, 10 days, $10,000")}
            data-testid="button-suggestion-romantic"
          >
            <Heart className="w-4 h-4 mr-2" />
            Romantic Honeymoon
          </Button>
        </CardContent>
      </Card>

      {/* Suggestion Categories */}
      {suggestions.map((category, idx) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card data-testid={`card-category-${category.category.toLowerCase().replace(/\s/g, '-')}`}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <category.icon className="w-4 h-4" />
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {category.prompts.map((prompt, promptIdx) => (
                <Button
                  key={promptIdx}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-left text-xs hover-elevate active-elevate-2"
                  onClick={() => onSelectSuggestion(prompt)}
                  data-testid={`button-suggestion-${idx}-${promptIdx}`}
                >
                  {prompt}
                </Button>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* AI Badge */}
      <div className="pt-4 border-t border-border">
        <Badge variant="outline" className="w-full justify-center">
          <Sparkles className="w-3 h-3 mr-1" />
          Powered by Multi-Agent AI
        </Badge>
      </div>
    </div>
  );
}
