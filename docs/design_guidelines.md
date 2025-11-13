# NorthBay AI Vacation Planner - Enterprise Design Guidelines

## Design Approach

**Reference-Based**: Drawing from Booking.com's data density + Amadeus's enterprise credibility + Bloomberg Terminal's information architecture. Creates a sophisticated business travel platform demonstrating AI orchestration through refined, professional design.

**Core Principles**:
- Executive efficiency: Dense information, minimal scrolling
- Professional restraint: Sophisticated over flashy
- Global clarity: Culturally universal iconography and patterns
- Enterprise trust: Data transparency and security prominence

## Core Design Elements

### Typography
- **Primary**: Inter (variable weights)
- **Hierarchy**:
  - Dashboard headers: 2xl-3xl, semibold (never larger)
  - Data labels: xs-sm, medium, uppercase tracking
  - Primary values: xl-2xl, bold
  - Body content: sm-base, regular
  - Metadata: xs, medium, muted

### Layout System
**Spacing**: Tailwind units 2, 3, 4, 6, 8, 12, 16

**Structure**:
- Container: max-w-screen-2xl
- Section padding: py-8 to py-12 (compact)
- Card padding: p-4 to p-6 (tight)
- Grid gaps: gap-4 to gap-6
- Dense layouts: Information above the fold

## Component Library

### Executive Hero
**Layout** (h-screen, split design):
- **Left Panel** (w-7/12): Premium destination image, subtle gradient overlay
  - Headline overlay: "AI-Powered Executive Travel" (text-4xl, semibold)
  - Trust indicators: "Enterprise-Grade Security | 500+ Global Partners"
  
- **Right Panel** (w-5/12): Integrated search dashboard (no separate card)
  - Search inputs stacked vertically: Destination, Dates, Budget, Traveler count
  - Each field: clean, bordered, h-12, with subtle icons
  - "Generate Itinerary" button: full-width, h-14, backdrop-blur
  - Live stats below: "2,847 hotels analyzed | 1,293 flights compared | Updated 3s ago"

### AI Orchestration Dashboard
**Horizontal Status Bar** (below hero, full-width, py-6, border-y):
- Agent cards in grid-cols-5 (not vertical sidebar)
- Each agent: Icon, Name, Progress percentage, Status text
- Compact design: h-20 per card
- Real-time pulse indicators
- Collaboration graph: Small network visualization showing agent interactions

### Results Dashboard (Main Content Area)
**Multi-Panel Layout** (grid-cols-12, gap-6):

**Left: Master Itinerary** (col-span-8):
- Compact timeline: Day headers small, activity cards dense
- Each activity: Small thumbnail (w-16), title, time, cost
- Running total visible per day
- Drag handles minimal

**Right: Live Options** (col-span-4, sticky):
- **Flight Selector** (compact cards):
  - Airline logo, route, times in single line
  - Price prominent, duration secondary
  - "AI Best" badge subtle
  
- **Hotel Selector** (image gallery):
  - 3:2 ratio thumbnails
  - Star rating, price per night
  - Amenities as icon grid (no labels)
  
- **Budget Tracker**:
  - Large total at top
  - Segmented bar graph
  - Category breakdown table (dense)

### Enterprise Data Tables
**Flight Comparison** (when expanded):
- Table layout: 6-8 columns
- Sortable headers with icons
- Price differential highlighting
- Airline alliance badges
- Carbon footprint data column
- Hover: subtle row highlight only

### Global Trust Elements
**Enterprise Footer Bar** (compact, py-4):
- Security certifications: ISO, SOC2 badges
- Compliance: GDPR, CCPA indicators
- "24/7 Concierge" | "Corporate Account Support"
- Language/currency selectors (icon + dropdown)

### Navigation
**Fixed Header** (h-16, border-b, backdrop-blur):
- Logo left (wordmark only, compact)
- Nav center: "Dashboard" | "Analytics" | "Reports" | "Settings"
- Right: User avatar, notifications, profile
- Search: icon only (expands to inline search)

## Images

### Hero
Single sophisticated travel image: Business-class cabin, executive lounge, or upscale hotel lobby. Professional photography, 3:2 aspect ratio, subtle gradient overlay (20% opacity max) for text legibility. Conveys luxury and professionalism, not vacation excitement.

### Itinerary Thumbnails
Destination landmarks, hotel properties, dining venues. Small scale (64-96px), 1:1 or 4:3 ratio. Clean, professional photography.

### Hotel/Flight Images
Property exteriors, room interiors, aircraft cabins. 3:2 ratio for consistency. Premium quality emphasizing business travel amenities.

All images: Professional, refined, internationally recognizable. Avoid culturally specific gestures or symbols.

## Animations

Minimal, professional:
- Data updates: Subtle number transitions (duration-300)
- Card interactions: Hover shadow only, no scale
- Progress indicators: Smooth circular fills
- Loading states: Subtle skeleton screens
- NO confetti, NO parallax, NO dramatic transitions

## Responsive Behavior

- Desktop (primary): Full dashboard layout
- Tablet: Stack side panels below main, keep compact spacing
- Mobile: Single column, collapsible sections, bottom navigation
- All viewports: Dense information architecture maintained

## Accessibility

WCAG AAA compliance: High contrast ratios (7:1 minimum), focus indicators prominent, semantic HTML throughout, ARIA labels comprehensive, keyboard navigation complete, screen reader optimized, RTL language support, multi-language ready.