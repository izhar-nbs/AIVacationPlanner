# NorthBay Agentic AI Demo - Design Guidelines

## Design Approach

**Hybrid Approach**: Enterprise SaaS design system (AWS Console + Linear's typography + Stripe's restraint) combined with modern AI dashboard patterns. Creates professional credibility while showcasing cutting-edge AI capabilities.

**Core Principles**:
- Enterprise-grade polish through precise alignment and consistent spacing
- AI transparency through real-time agent status visualization
- Technical sophistication via data visualization and process flows
- B2B trust-building through professional, uncluttered interface

## Core Design Elements

### Typography
- **Primary Font**: Inter (all contexts - display through microcopy)
- **Hierarchy**:
  - Page title: 3xl-4xl, semibold
  - Section headers: 2xl-3xl, semibold
  - Agent names: xl, semibold
  - Body text: base, regular
  - Status updates: sm, medium
  - Metadata/timestamps: xs, regular, uppercase tracking-wide

### Layout System
**Spacing Primitives**: Tailwind units 2, 4, 6, 8, 12, 16, 24

**Core Grid Structure**:
- Container: max-w-screen-2xl with full viewport height
- Left Sidebar: w-80, fixed, border-r
- Center Column: flex-1, min-w-0
- Right Sidebar: w-96, fixed, border-l
- Section padding: p-6 to p-8
- Card padding: p-4 to p-6
- Element gaps: gap-4 to gap-6

## Component Library

### Global Layout

**Header Bar** (all pages):
- Fixed top, full width, h-16, border-b
- NorthBay logo left (h-8), navigation center, user avatar + "Demo Mode" badge right
- Clean corporate aesthetic with subtle shadow

**3-Column Dashboard** (main interface):
- Left: Quick suggestions sidebar with preset prompts
- Center: Chat interface with message history
- Right: Always-visible agent status dashboard

### Left Sidebar - Quick Suggestions

**Structure**:
- Header: "Quick Start" with icon
- Category sections with dividers
- Preset prompt cards in vertical stack (gap-2)

**Prompt Cards**:
- Compact design (p-3), subtle border, hover lift
- Icon left (Heroicons), prompt text truncated
- Click to populate chat input
- Categories: "Family Vacations", "Business Travel", "Weekend Getaways", "Adventure Trips"
- 3-4 prompts per category

**Bottom Section**:
- "Recent Conversations" list with timestamps
- Load previous session functionality

### Center Column - Chat Interface

**Header**:
- Title: "AI Vacation Planner" with subtitle "Powered by Multi-Agent Architecture"
- Session info: timestamp, request ID for enterprise tracking

**Message Container**:
- Scrollable area with max-h constraint
- User messages: right-aligned, background treatment
- AI responses: left-aligned with agent avatar icon
- Typing indicators with animated dots
- Timestamp on each message (xs, muted)

**Input Area** (bottom fixed):
- Large textarea (min-h-24) with professional placeholder
- Send button with icon, disabled state styling
- Character counter, attachment option (for itinerary exports)
- "Processing..." state with progress indicator

**AI Response Cards** (within chat):
- Destination recommendations: image thumbnail (4:3, small), title, 2-line description, match score badge
- Flight options: compact table format, 2-3 rows, key metrics
- Hotels: horizontal card layout with image left (1:1), details right
- Each with "View Details" expansion

### Right Sidebar - Agent Dashboard

**Header**:
- "AI Agents" title with live status count badge
- "All systems operational" indicator

**Agent Status Cards** (vertical stack, gap-4):
- Icon top-left (Heroicons: MapIcon, CalendarIcon, HomeIcon, WalletIcon, SparklesIcon)
- Agent name: "Destination Finder", "Flight Curator", "Hotel Concierge", "Budget Optimizer", "Itinerary Builder"
- Status badge: "Idle" / "Analyzing" / "Complete" with appropriate styling
- Progress bar (h-2, rounded) with percentage label
- Current action text: "Analyzing 847 destinations..." with typewriter effect
- Completion timestamp when done

**Agent Communication Flows**:
- Connector lines between cards (subtle, animated dashed)
- Data exchange indicators: "→ Sent budget constraints to Hotel Concierge"
- Micro-animations on status changes

**Collaboration Panel** (bottom):
- "Inter-Agent Activity" feed
- Recent exchanges in compact list format
- Timestamps and agent-to-agent messages

### Budget Tracker (within right sidebar)

**Card Design**:
- Prominent placement above agent cards
- Large counter display: "$4,320 / $5,000 Budget"
- Horizontal progress bar with segments
- Breakdown table: Flight, Hotel, Activities, Meals (amounts right-aligned)
- Real-time updates with subtle highlight flash

### Results Presentation (in center column chat)

**Comprehensive Proposal Card**:
- Expandable sections with smooth accordion
- Summary header: destination, dates, total price, match score (large badge)

**Destination Section**:
- Hero image (16:9, professional travel photo)
- Title overlay with gradient backdrop for text
- "Why This Destination" with 5 bullet points, icons for each
- Alternative options: 3-column grid below with smaller cards

**Flight Comparison Table**:
- 3 options in clean table rows
- Columns: Airline (logo), Route, Duration, Price, Baggage, Selection
- Recommended row: subtle border accent
- Trade-off indicators with tooltips

**Hotel Grid**:
- 4-column responsive grid (grid-cols-2 lg:grid-cols-4)
- Square images (1:1) with overlay
- Hotel name, star rating (icons), price per night
- "AI Selected" badge on top choice
- Hover reveals amenities list

**Itinerary Timeline**:
- Vertical layout with connecting line
- Day headers in medium weight
- Activity cards: time, name, cost, description
- Icons for activity types (dining, sightseeing, relaxation)
- Collapsible details for each day
- Footer summary: duration, activity count, subtotal

### Refinement Controls

**Action Bar** (appears after proposal):
- Horizontal button group: "Adjust Budget" | "Change Dates" | "Different Destination" | "Upgrade Options"
- Each triggers specific agent reprocessing
- Loading state: progress indicator with estimated time
- Comparison view: split-screen old vs new with diff highlighting

### Enterprise Features

**Technical Transparency Panel** (collapsible in right sidebar):
- Agent architecture diagram (simple node visualization)
- Token usage counter for cost transparency
- Processing timeline: waterfall chart showing agent execution
- "Explainable AI" badge with reasoning tooltips

**Export Options** (in chat interface):
- "Download Proposal" button → PDF generation
- "Share Session" → unique URL with read-only access
- "Email Itinerary" with form modal

## Images

### Primary Usage
- **Center Column**: Destination photos within chat response cards (16:9, professional travel photography)
- **Hotel Cards**: Property photos (1:1 square for grid consistency)
- **Hero**: NOT USED - application is dashboard-style, no hero section

### Image Specifications
- Destination images: High-quality, professional, aspirational (beaches, cities, landmarks)
- Hotel images: Exterior shots or signature views, consistent quality
- All images: Professional travel photography, NOT stock-photo generic
- Treatment: Slight overlay gradients on text overlays for readability

## Animations

Minimal, purposeful animations:
- **Agent Progress Bars**: Smooth 0-100% fills over realistic timeframes (30-60s)
- **Status Changes**: Gentle pulse on badge updates
- **Card Reveals**: Staggered fade-in (100ms delays) for multi-card layouts
- **Typing Indicators**: Standard dot animation
- **Success States**: Checkmark with scale bounce (scale-105)
- **Hover**: Subtle translateY(-1px) on interactive cards
- **Inter-Agent Lines**: Animated dashed stroke for data flow

## Responsive Behavior
- **Desktop (lg+)**: Full 3-column layout as designed
- **Tablet (md)**: Collapsible sidebars, center column prioritized, drawer overlays
- **Mobile**: Single column, bottom navigation, agent dashboard as modal overlay, stacked cards

## Trust & Enterprise Elements

Position throughout interface:
- "AWS-Powered AI" badge in header
- "NorthBay Solutions" branding with enterprise credibility
- Processing metrics: "Analyzed 1,247 options in 45 seconds"
- Certification badges: "SOC 2 Compliant", "Enterprise-Grade Security"
- Agent explanations: "Why this recommendation" tooltips
- Real-time status: "All agents operational" indicators

## Accessibility
- WCAG AA compliant contrast ratios
- Focus indicators: subtle border enhancement
- Keyboard navigation: full tab order through all interactive elements
- ARIA labels on all agent status cards and progress indicators
- Screen reader announcements for status changes
- Alt text on all destination/hotel imagery