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
    <div className="w-full py-2.5 px-4 bg-muted/30 border-b border-border">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-[0.1em]">
            Quick Templates
          </span>
          <div className="h-px flex-1 bg-border/50" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar">
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              whileHover={{ scale: 1.01, y: -1 }}
              whileTap={{ scale: 0.99 }}
            >
              <Button
                variant="outline"
                onClick={() => onSelectSuggestion(suggestion.prompt)}
                className="flex items-center gap-1.5 px-3 py-1.5 h-auto whitespace-nowrap bg-white hover-elevate active-elevate-2 border-border/50 text-xs font-medium"
                data-testid={`suggestion-${suggestion.id}`}
              >
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${suggestion.color} flex items-center justify-center flex-shrink-0`}>
                  <suggestion.icon className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-foreground">{suggestion.label}</span>
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
