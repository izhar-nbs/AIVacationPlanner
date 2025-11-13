# AI Vacation Planner Demo

## Overview

This project is an enterprise-grade demo application showcasing AI agent orchestration for vacation planning. It simulates 5 autonomous AI agents working in parallel to generate comprehensive vacation plans in minutes, a process that traditionally takes hours of manual research. The application is a single-page application (SPA) featuring a conversational chat interface, real-time multi-agent visualization, and detailed trip planning results with mock booking capabilities. The primary goal is to demonstrate the "WOW factor" of AI orchestration through polished UI, animations, and seamless user experience, acting as a professional demo for client presentations.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, utilizing Wouter for SPA routing.
- **UI Components**: Shadcn UI (New York style) built on Radix UI primitives, styled with Tailwind CSS for a consistent design system.
- **Animation**: Framer Motion is used for all animations, including phase transitions, real-time agent progress, budget tracking, and success states.
- **State Management**: Local React state with hooks; agent simulation state managed via a singleton `AgentSimulation` class.
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
-   **PDF Export**: Client-side PDF generation of the trip plan using `jspdf`.
-   **Calendar Export**: `.ics` file generation for itinerary activities using `ics`.
-   **Interactive Map**: Leaflet-based map (`react-leaflet`) displaying destinations, hotels, and activities with interactive markers.
-   **Enhanced Agent Communication**: A panel displaying real-time, chronological inter-agent messages.
-   **Comparison View**: A side-by-side comparison of "Current Plan" vs. "New Plan" during refinement, highlighting changes and price differences.
-   **UI/UX**: Features a custom circular progress for agents, professional card designs, gradient message bubbles, and a 3-column layout (suggestions, chat/results, agent dashboard) for a premium travel portal aesthetic.

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