# AI Vacation Planner Demo

## Overview

This project is an enterprise-grade demo application showcasing AI agent orchestration for vacation planning. It simulates 5 autonomous AI agents working in parallel to generate comprehensive vacation plans in minutes, a process that traditionally takes hours of manual research. The application is a single-page application (SPA) featuring a conversational chat interface, real-time multi-agent visualization, and detailed trip planning results with mock booking capabilities. The primary goal is to demonstrate the "WOW factor" of AI orchestration through polished UI, animations, and seamless user experience, acting as a professional demo for client presentations.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### November 13, 2025 - Demo-Ready Enterprise Transformation
-   **Professional Typography System**: Migrated to Inter font family with refined hierarchy for enterprise readability.
    -   Compact font sizes: base/sm/xs for information density, uppercase tracking for data labels.
    -   Professional typeface stack with system font fallbacks for global compatibility.
-   **Refined Color Palette**: Enterprise-grade colors matching Fortune 500 standards.
    -   Primary: Trust blue (215 85% 50%) replacing bright blue - industry standard.
    -   Secondary: Sophisticated teal (185 65% 45%) for professional accents.
    -   Subtle borders (210 10% 88%), refined neutrals, reduced elevation opacity (0.015/0.04).
    -   Reduced border radius to 0.5rem for compact, professional aesthetic.
-   **Removed All Hardcoded Values**: Production-ready calculations throughout.
    -   Budget now dynamically uses user preferences or calculates from selections (no more $5000 hardcode).
    -   Agent messages generic and contextual (removed "$850", "$1,500", "$800 max", "$4,320 total").
    -   Flight results: "Multiple options ready" instead of "3 options from $850".
    -   Budget Guardian: "Analyzing price points" instead of static dollar amounts.
-   **Layout Optimization for Minimal Scrolling**: 25-40% reduction in spacing for information density.
    -   Header: py-4 → py-2.5, logo 10x10 → 8x8, font sizes reduced for compactness.
    -   Main layout: px-8 py-6 space-y-6 → px-6 py-4 space-y-4.
    -   Right panel: w-[35%] p-6 space-y-5 → w-[32%] p-4 space-y-3.5 (tighter density).
    -   Max width: 1800px → 1920px for better screen utilization.
    -   Suggestions carousel: py-4 gap-3 → py-2.5 gap-2, compact template buttons.
-   **Instant Planning Flow**: Single-message demo experience for executive presentations.
    -   User types ONE message (e.g., "Plan a vacation to Paris") → agents deploy immediately.
    -   Smart extraction: parses budget ($5,000), duration (7 days), month, departure city from natural language.
    -   Premium defaults: fills missing details transparently ($5,000 executive budget, 7-day journey, June departure, from New York).
    -   NO follow-up questions — proceeds directly to multi-agent orchestration in ~12 seconds.
    -   Transparent AI response shows assumptions: "Assuming $5,000 executive budget, 7-day journey... adjust anytime after results."
-   **Dynamic Budget System**: Real-time calculation based on actual user selections.
    -   Budget updates instantly when users select different flights or hotels.
    -   BudgetTracker displays live-calculated breakdown with 5 categories.
    -   Checkout button disabled until valid budget exists, modal uses live dynamicBudget state.
-   **Dynamic Destination System**: Fully dynamic destination handling with fuzzy matching.
    -   Created `destination-resolver.ts` with trigram similarity for intelligent extraction.
    -   Destinations, flights, hotels all reflect user input (Paris → Paris results, Bali → Bali results).
-   **Component Refinements**: Professional, compact styling across all UI elements.
    -   CTA button: "Review & Book Trip" in header, always visible (h-8, text-xs).
    -   Processing indicator: Smaller, uppercase label (text-[11px]).
    -   All components follow enterprise design guidelines with subtle animations.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, utilizing Wouter for SPA routing.
- **UI Components**: Shadcn UI (New York style) built on Radix UI primitives, styled with Tailwind CSS for a consistent design system.
- **Animation**: Framer Motion is used for all animations, including phase transitions, real-time agent progress, budget tracking, and success states.
- **State Management**: Local React state with hooks; agent simulation state managed via a singleton `AgentSimulation` class. Dynamic budget managed via controlled component pattern in VacationPlanner with instant recalculation on selection changes.
- **Design System**: Tailwind CSS with custom HSL-based color system for light/dark mode, custom elevation utilities, and modern typography.

### Application Flow
The application progresses through distinct, state-managed phases:
1.  **Input Phase**: Conversational chat to gather user vacation preferences.
2.  **Processing Phase**: Multi-agent dashboard visualizing 5 parallel agents (Destination Scout, Flight Optimizer, Accommodation Finder, Itinerary Architect, Budget Guardian) at work.
3.  **Results Phase**: Tabbed interface displaying the comprehensive trip plan (destinations, flights, hotels, itinerary).
4.  **Refinement Phase**: Controls for quick adjustments to the plan.
5.  **Checkout Phase**: Modal for mock booking confirmation.

### Agent Simulation System
-   **Design Pattern**: Time-based state machine with a callback architecture using an `AgentSimulation` class to orchestrate agents via `setTimeout` for realistic delays.
-   **Features**: Agents follow predefined sequences, communicate via callbacks, and the Budget Guardian provides continuous updates. Mock data from `mock-data.ts` is used throughout.

### Backend
-   **Server**: Minimal Node.js/Express server primarily for serving static frontend files.
-   **Storage**: An `IStorage` interface with an in-memory `MemStorage` implementation exists, hinting at future database integration, but is unused in the current demo.

### Data Schema
-   **TypeScript-First**: Shared schema definitions in `shared/schema.ts` for entities like `ChatMessage`, `Agent`, `VacationPreferences`, `TripPlan`, and `BudgetStatus`.
-   **Schema Extensions**: `Destination`, `Hotel`, and `Activity` types include optional `coordinates` for map integration.

### Core Features
-   **Dynamic Budget Calculator**: Real-time budget computation based on selected flights, hotels, and itinerary activities. Updates instantly without re-running agents. Includes breakdown for Flights, Accommodations, Experiences, Dining, and Transport costs.
-   **PDF Export**: Client-side PDF generation of the trip plan using `jspdf`.
-   **Calendar Export**: `.ics` file generation for itinerary activities using `ics`.
-   **Interactive Map**: Leaflet-based map (`react-leaflet`) displaying destinations, hotels, and activities with interactive markers.
-   **Enhanced Agent Communication**: A panel displaying real-time, chronological inter-agent messages.
-   **Comparison View**: A side-by-side comparison of "Current Plan" vs. "New Plan" during refinement, highlighting changes and price differences.
-   **UI/UX**: Features a custom circular progress for agents, professional card designs, gradient message bubbles, and a 3-column layout (suggestions, chat/results, agent dashboard) for a premium travel portal aesthetic. Text overflow prevention with line-clamp utilities.

## External Dependencies

### UI Component Libraries
-   **Radix UI**: Headless components for accessibility and behavior.
-   **Shadcn UI**: Pre-configured Radix components with Tailwind styling.
-   **Lucide React**: Icon library.
-   **Framer Motion**: Animation library.

### Styling and Design
-   **Tailwind CSS**: Utility-first CSS framework.
-   **class-variance-authority**: Type-safe variant API for styling.
-   **tailwind-merge & clsx**: Utilities for merging Tailwind classes.

### Chart Visualization
-   **Recharts**: Used for pie chart visualization in the BudgetTracker.

### Form Handling
-   **React Hook Form**: Form state management and validation.
-   **Zod**: Schema validation.
-   **@hookform/resolvers**: Integration between React Hook Form and Zod.

### Mapping
-   **Leaflet (react-leaflet)**: Interactive map library for displaying geographical data.

### PDF and Calendar Export
-   **jspdf**: Client-side PDF generation.
-   **ics**: RFC 5545 compliant calendar file generation.

### Database (Configured but Unused)
-   **Drizzle ORM**: TypeScript ORM for PostgreSQL.
-   **@neondatabase/serverless**: Neon Postgres driver.
-   **drizzle-zod**: Zod schema generation from Drizzle schemas.

### Development Tools
-   **Vite**: Build tool and development server.
-   **TypeScript**: For type safety.
-   **Wouter**: Lightweight routing library.
-   **@tanstack/react-query**: Data fetching and caching (minimal usage).

### Replit-Specific Plugins (Development Only)
-   **@replit/vite-plugin-runtime-error-modal**
-   **@replit/vite-plugin-cartographer**
-   **@replit/vite-plugin-dev-banner**