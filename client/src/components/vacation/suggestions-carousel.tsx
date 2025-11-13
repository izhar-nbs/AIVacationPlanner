import { motion } from "framer-motion";
import { Palmtree, Building2, Mountain, Heart, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SuggestionsCarouselProps {
  onSelectSuggestion: (prompt: string) => void;
}

const suggestions = [
  {
    id: "tropical",
    icon: Palmtree,
    label: "Tropical Paradise",
    prompt: "Tropical beach vacation, 5 days, $8,000 budget",
    color: "from-cyan-500 to-blue-500",
  },
  {
    id: "european",
    icon: Building2,
    label: "European City",
    prompt: "European city tour, 7 days, $6,000 budget",
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "mountain",
    icon: Mountain,
    label: "Mountain Adventure",
    prompt: "Mountain adventure, 5 days, $6,000 budget",
    color: "from-green-500 to-teal-500",
  },
  {
    id: "romantic",
    icon: Heart,
    label: "Romantic Escape",
    prompt: "Romantic honeymoon, 7 days, $10,000 budget",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "family",
    icon: Users,
    label: "Family Vacation",
    prompt: "Family beach vacation, 7 days, $8,000 budget",
    color: "from-amber-500 to-orange-500",
  },
];

export function SuggestionsCarousel({ onSelectSuggestion }: SuggestionsCarouselProps) {
  return (
    <div className="w-full py-4 px-6 bg-gradient-to-r from-background via-muted/10 to-background border-b border-border">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Start
          </span>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 hide-scrollbar">
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={() => onSelectSuggestion(suggestion.prompt)}
                className="flex items-center gap-2 px-4 py-2 h-auto whitespace-nowrap bg-white/80 hover-elevate active-elevate-2 border-border/60"
                data-testid={`suggestion-${suggestion.id}`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                  <suggestion.icon className="w-4 h-4 text-white" />
                </div>
                <span className="text-sm font-medium text-foreground">{suggestion.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
