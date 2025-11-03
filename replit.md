# AI Vacation Planner Demo

## Overview

This is a professional demo application showcasing AI agent orchestration for vacation planning. The system simulates 5 autonomous AI agents working in parallel to plan complete vacations in approximately 5 minutes, demonstrating what traditionally takes 10+ hours of manual research. Built as a single-page application, it features a conversational chat interface, real-time multi-agent visualization, and comprehensive trip planning results with booking capabilities.

The application is designed as an enterprise-grade demo with a focus on "WOW factor" through polished animations, visual feedback, and seamless user interactions. It uses mock data throughout - no actual API calls or real booking functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript, using a single-page application (SPA) pattern via Wouter for routing.

**UI Component System**: Shadcn UI components (New York style) built on Radix UI primitives, providing accessible, production-ready components with Tailwind CSS styling. All components follow a consistent design system with defined color palettes, spacing units, and typography hierarchy.

**Animation Strategy**: Framer Motion for all animations and transitions. Key animation patterns include:
- Smooth phase transitions (input → processing → results → checkout)
- Real-time agent progress visualization with staggered animations
- Budget tracker with animated counters and progress bars
- Success states with celebration animations

**State Management**: Local React state with hooks. No global state management library is used - state flows through props from the main `VacationPlanner` page component to child components. Agent simulation state is managed via a singleton `AgentSimulation` class instantiated with `useRef`.

**Design System**: Tailwind CSS with custom configuration extending the Shadcn theme:
- HSL-based color system for light/dark mode support
- Custom elevation utilities (`elevate-1`, `elevate-2`) for hover/active states
- Consistent spacing scale (2, 4, 6, 8, 12, 16, 20, 24, 32)
- Typography using modern fonts (Inter/Poppins family)
- Maximum container width of 1280px for main content

### Application Flow

**Phase-Based Architecture**: The application progresses through distinct phases managed by state:

1. **Input Phase**: Chat-based conversational interface where users describe vacation preferences. AI asks follow-up questions to gather requirements (destination type, budget, duration, departure city, travel month, interests).

2. **Processing Phase**: Multi-agent dashboard showing 5 agents running in parallel:
   - Destination Scout (finds and ranks destinations)
   - Flight Optimizer (searches and compares flight options)
   - Accommodation Finder (scans hotels and resorts)
   - Itinerary Architect (plans daily activities)
   - Budget Guardian (continuously monitors spending)

3. **Results Phase**: Tabbed interface displaying comprehensive trip plan including destinations, flights, hotels, and day-by-day itinerary.

4. **Refinement Phase**: Quick-adjust controls for modifying budget, upgrading options, or changing preferences.

5. **Checkout Phase**: Modal overlay with booking form and success confirmation.

### Agent Simulation System

**Design Pattern**: Time-based state machine with callback architecture. The `AgentSimulation` class orchestrates multiple agents using `setTimeout` chains to simulate realistic processing delays.

**Key Features**:
- Each agent follows a predefined sequence of status updates with specific delays (2-5 seconds per step)
- Agents run in parallel but can send "messages" to each other (e.g., Destination Scout informs Flight Optimizer of selected destination)
- Budget Guardian continuously updates throughout the process
- Inter-agent communication simulated through callback functions
- Cleanup mechanism to prevent memory leaks when component unmounts

**Mock Data Strategy**: All data (destinations, flights, hotels, activities) is defined in `mock-data.ts`. The simulation system selects and returns this data at appropriate times to create realistic results.

### Backend Architecture

**Express Server**: Minimal Node.js/Express backend primarily serving as a static file server for the built frontend. The `registerRoutes` function is designed to accept API route definitions but currently empty - all functionality is client-side.

**Storage Interface**: Defined but unused `IStorage` interface with `MemStorage` in-memory implementation. This provides a pattern for future database integration but is not utilized in current demo implementation.

**Development Setup**: Vite middleware mode for hot module replacement during development, with custom error logging and request tracking.

### Data Schema

**TypeScript-First Design**: Shared schema definitions in `shared/schema.ts` used by both frontend and backend (though backend is minimal). Key types include:

- `ChatMessage`: User and AI conversation messages
- `Agent`: Agent state including progress, status, and result data
- `VacationPreferences`: User-specified trip requirements
- `TripPlan`: Complete vacation plan with destinations, flights, hotels, itinerary
- `BudgetStatus`: Real-time budget tracking with breakdown by category

All types are exported and imported using path aliases (`@shared/*`) configured in both TypeScript and Vite.

## External Dependencies

### UI Component Libraries

- **Radix UI**: Headless component primitives providing accessibility and behavior (Dialog, Accordion, Tabs, Tooltip, Progress, etc.)
- **Shadcn UI**: Pre-configured Radix components with Tailwind styling following the "New York" design system
- **Lucide React**: Icon library for consistent iconography throughout the application
- **Framer Motion**: Animation library for all transitions, gestures, and animated states

### Styling and Design

- **Tailwind CSS**: Utility-first CSS framework with custom configuration for theme variables
- **class-variance-authority**: Type-safe variant API for component styling
- **tailwind-merge & clsx**: Utility for merging Tailwind classes without conflicts

### Chart Visualization

- **Recharts**: Chart library used in BudgetTracker for pie chart visualization of budget breakdown

### Form Handling

- **React Hook Form**: Form state management and validation
- **Zod**: Schema validation for form data
- **@hookform/resolvers**: Integration between React Hook Form and Zod

### Database (Configured but Unused)

- **Drizzle ORM**: TypeScript ORM configured for PostgreSQL
- **@neondatabase/serverless**: Neon Postgres driver (referenced in package.json)
- **drizzle-zod**: Integration for generating Zod schemas from Drizzle schemas

Note: While database tooling is configured (drizzle.config.ts, schema imports), the application currently uses only in-memory mock data. The database configuration suggests future capability for persisting trip plans or user sessions.

### Development Tools

- **Vite**: Build tool and development server with React plugin
- **TypeScript**: Type safety throughout the application
- **Wouter**: Lightweight routing library (though app is primarily single-page)
- **@tanstack/react-query**: Data fetching and caching library (configured but minimal usage given mock data approach)

### Replit-Specific Plugins

- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Code navigation helper
- **@replit/vite-plugin-dev-banner**: Development environment banner

These plugins are conditionally loaded only in development mode on Replit environment.