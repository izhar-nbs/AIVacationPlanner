# 🚀 Enterprise Improvements - Implementation Guide

## Quick Wins (Implement Today)

### 1. Add Error Boundary (15 minutes)

Create `client/src/components/ErrorBoundary.tsx`:

```typescript
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to error tracking service (Sentry, etc.)
    console.error('Error caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md p-8 text-center space-y-4">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto" />
            <h2 className="text-2xl font-bold">Something went wrong</h2>
            <p className="text-muted-foreground">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>
            <Button onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
```

Wrap your app in `client/src/App.tsx`:
```typescript
import { ErrorBoundary } from '@/components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        {/* ... rest of app */}
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
```

---


### 2. Add Analytics Tracking (30 minutes)

Create `client/src/lib/analytics.ts`:

```typescript
// Google Analytics 4 integration
export class Analytics {
  private static instance: Analytics;
  private initialized = false;

  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }

  init(measurementId: string) {
    if (this.initialized) return;
    
    // Load GA4 script
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    script.async = true;
    document.head.appendChild(script);

    window.dataLayer = window.dataLayer || [];
    function gtag(...args: any[]) {
      window.dataLayer.push(arguments);
    }
    gtag('js', new Date());
    gtag('config', measurementId);

    this.initialized = true;
  }

  // Track custom events
  trackEvent(eventName: string, params?: Record<string, any>) {
    if (!this.initialized) return;
    
    window.gtag?.('event', eventName, params);
  }

  // Specific tracking methods
  trackVacationRequest(preferences: VacationPreferences) {
    this.trackEvent('vacation_request_submitted', {
      budget: preferences.budget,
      duration: preferences.duration,
      destination: preferences.destination?.name,
    });
  }

  trackDestinationChange(from: string, to: string) {
    this.trackEvent('destination_changed', { from, to });
  }

  trackCheckoutInitiated(tripPlan: TripPlan) {
    this.trackEvent('checkout_initiated', {
      destination: tripPlan.destination.name,
      total_cost: tripPlan.budget.allocated,
    });
  }

  trackAgentCompletion(agentId: string, duration: number) {
    this.trackEvent('agent_completed', {
      agent_id: agentId,
      duration_ms: duration,
    });
  }
}

// Export singleton
export const analytics = Analytics.getInstance();
```

Initialize in `client/src/main.tsx`:
```typescript
import { analytics } from '@/lib/analytics';

// Initialize analytics
analytics.init('G-XXXXXXXXXX'); // Replace with your GA4 ID

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Add tracking to vacation-planner.tsx:
```typescript
import { analytics } from '@/lib/analytics';

const handleStartPlanning = async (prefs: VacationPreferences) => {
  analytics.trackVacationRequest(prefs);
  // ... rest of function
};

const handleDestinationChange = async (newDestinationName: string) => {
  analytics.trackDestinationChange(
    tripPlan?.destination.name || '',
    newDestinationName
  );
  // ... rest of function
};
```

---


### 3. Add Loading Skeletons (20 minutes)

Create `client/src/components/ui/skeleton.tsx`:

```typescript
import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...props}
    />
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Destination Hero Skeleton */}
      <div className="relative h-[280px] rounded-lg overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Flight Options Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>

      {/* Hotel Options Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>

      {/* Itinerary Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  );
}

export function AgentDashboardSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-4 w-48" />
        </div>
      ))}
    </div>
  );
}
```

Use in vacation-planner.tsx:
```typescript
import { ResultsSkeleton } from '@/components/ui/skeleton';

// In render:
{phase === "processing" && (
  <ResultsSkeleton />
)}
```

---


### 4. Add Input Validation (25 minutes)

Install Zod (if not already):
```bash
npm install zod
```

Create `client/src/lib/validators.ts`:

```typescript
import { z } from 'zod';

export const VacationPreferencesSchema = z.object({
  description: z.string()
    .min(10, 'Please provide at least 10 characters')
    .max(500, 'Description too long (max 500 characters)'),
  budget: z.number()
    .min(500, 'Minimum budget is $500')
    .max(100000, 'Maximum budget is $100,000'),
  duration: z.number()
    .min(1, 'Minimum duration is 1 day')
    .max(30, 'Maximum duration is 30 days'),
  travelers: z.number()
    .min(1, 'At least 1 traveler required')
    .max(10, 'Maximum 10 travelers'),
  departureCity: z.string().optional(),
  month: z.string().optional(),
  interests: z.array(z.string()).optional(),
});

export type ValidatedPreferences = z.infer<typeof VacationPreferencesSchema>;

export function validatePreferences(prefs: unknown) {
  return VacationPreferencesSchema.safeParse(prefs);
}

// Sanitize user input
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
}
```

Use in chat-interface.tsx:
```typescript
import { validatePreferences, sanitizeInput } from '@/lib/validators';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (!input.trim()) return;

  // Sanitize input
  const sanitized = sanitizeInput(input);
  
  // ... rest of parsing logic
  
  // Validate before sending
  const validation = validatePreferences({
    description: sanitized,
    budget: currentBudget,
    duration: currentDuration,
    travelers: 2,
    departureCity: currentDepartureCity,
    month: currentMonth,
    interests: likesAdventure ? ["adventure"] : ["relaxation"],
  });

  if (!validation.success) {
    toast({
      title: "Invalid Input",
      description: validation.error.errors[0].message,
      variant: "destructive",
    });
    return;
  }

  // Use validated data
  onStartPlanning(validation.data);
};
```

---

