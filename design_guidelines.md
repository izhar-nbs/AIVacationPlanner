# NorthBay AI Vacation Planner - Design Guidelines

## Design Approach

**Reference-Based**: Inspired by Booking.com's trust-building + Airbnb's aspirational imagery + Expedia's clarity, enhanced with Linear's typography precision. Creates a premium consumer travel platform showcasing AI capabilities through elegant, wanderlust-inspiring design.

**Core Principles**:
- Visual luxury through premium imagery and sophisticated shadows
- AI transparency via elegant real-time status visualization
- Trust-building through ratings, verified badges, social proof
- Aspirational yet accessible interface

## Core Design Elements

### Typography
- **Primary**: Inter (all weights)
- **Hierarchy**:
  - Hero headline: 5xl-6xl, bold
  - Section headers: 3xl-4xl, semibold
  - Destination names: 2xl, semibold
  - Price callouts: 3xl, bold
  - Body: base, regular
  - Metadata: sm, medium

### Layout System
**Spacing**: Tailwind units 3, 4, 6, 8, 12, 16, 20, 24

**Structure**:
- Container: max-w-screen-2xl, mx-auto
- Section padding: py-16 to py-24
- Card padding: p-6 to p-8
- Grid gaps: gap-6 to gap-8

## Component Library

### Hero Section
**Layout**:
- Full viewport height (min-h-screen), premium travel destination image
- Gradient overlay (from transparent to deep blue/black, 60% opacity)
- Centered content with max-w-4xl

**Elements**:
- Headline: "Discover Your Perfect Vacation" (text-6xl, bold, white)
- Subheadline: "AI-powered personalization finds your dream destination in seconds"
- Search bar: Large (h-20), white background, rounded-2xl, shadow-2xl
  - Input: "Where do you want to go?", icon left
  - Date pickers: 2 inline fields with calendar icons
  - Budget slider: visual range selector
  - CTA button: "Plan My Trip" with gradient background, blurred backdrop
- Trust badges below: "10M+ Trips Planned" | "4.9★ Rated" | "AI-Verified Best Prices"

### Smart Search Interface
**Conversational Panel** (appears after search):
- Floating card (max-w-3xl, centered, shadow-2xl, rounded-3xl, p-8)
- Chat bubbles: user (right, gradient background) vs AI (left, white, subtle shadow)
- AI avatar: gradient circle with sparkle icon
- Typing indicator: animated gradient dots
- Quick actions: Pills below input ("Beach Paradise" | "Mountain Retreat" | "City Adventure")

### AI Agent Activity Sidebar
**Floating Panel** (right side, w-80, backdrop-blur):
- Semi-transparent white background (bg-white/90)
- Header: "AI Agents Working" with pulse animation
- Agent cards (gap-3):
  - Icon (gradient circles): Compass, Plane, Hotel, Calculator, Calendar
  - Name: "Destination Scout", "Flight Finder", "Hotel Curator", "Budget Wizard", "Itinerary Builder"
  - Status: Progress ring (circular, gradient stroke)
  - Live update: "Analyzing 2,847 options..." with shimmer effect
- Collaboration feed: Agent-to-agent exchanges in compact timeline

### Results Gallery
**Destination Cards** (grid-cols-1 md:grid-cols-2 lg:grid-cols-3, gap-8):
- Image: 16:9 ratio, rounded-2xl, hover scale-105
- Gradient overlay bottom: destination name (text-2xl, bold, white)
- Match score badge: Top-right, gradient, "98% Match"
- Info row: Duration | Activities | Price (icons + text)
- Hover: shadow-2xl, subtle lift

**Flight Options** (within expanded view):
- Horizontal cards with airline logo left
- Route visualization: departure → layover dots → arrival
- Price prominence: text-3xl, bold, gradient
- "AI Recommended" ribbon diagonal corner
- Compare view: side-by-side with diff highlights

**Hotel Carousel**:
- Large cards (4:3 images, rounded-xl)
- Star rating overlay (gold gradient)
- Amenities icons row
- "Best Value" or "Luxury Pick" badges
- Image gallery dots indicator
- Price per night: prominent, bottom-right

### Itinerary Builder
**Timeline Layout**:
- Vertical progression with connecting gradient line
- Day headers: Large date pill with gradient background
- Activity cards: Image thumbnail left (rounded-lg), details right
- Cost breakdown: Running total sidebar
- Drag-to-reorder handles with haptic feedback suggestion
- "Add Activity" cards between days

### Budget Tracker (Sticky Component)
**Floating Widget** (bottom-right):
- Compact card (w-72, rounded-2xl, shadow-xl)
- Large number: "$3,845 / $5,000"
- Gradient progress bar (segmented by category)
- Expand button: Shows detailed breakdown table
- Savings badge: "15% under budget" with checkmark

### Trust Elements
**Social Proof Section**:
- "Travelers Love NorthBay" header
- Testimonial cards: User photo (circular), quote, 5-star rating, location
- Rotating carousel with smooth transitions
- Verified badge on each

**Enterprise Badges** (footer):
- "Powered by Advanced AI" with tech logos
- Security certifications: lock icon + "256-bit Encryption"
- "24/7 Support" | "Best Price Guarantee"

### Navigation Bar
**Fixed Header** (backdrop-blur, border-b):
- Logo left with gradient accent
- Nav links center: "Destinations" | "How It Works" | "Pricing"
- Right: "Sign In" + "Start Planning" (gradient button)
- Scroll: shrinks to h-16, shadow appears

## Images

### Hero
Large, aspirational travel destination (tropical beach, mountain vista, or exotic city). Professional photography, 16:9+ aspect ratio, high resolution. Gradient overlay from transparent (top 30%) to rgba(0,40,100,0.7) (bottom 70%).

### Destination Cards
Premium travel photography (beaches, landmarks, cities, nature). 16:9 ratio, professional quality. Bottom gradient overlay for text legibility.

### Hotels
Property photos showcasing best features (pools, views, rooms). 4:3 ratio for cards, consistent quality across all listings.

### Activities
Lifestyle photography showing experiences (dining, adventures, culture). 1:1 or 4:3, warm and inviting tones.

All images: Vibrant, aspirational, professionally shot. No generic stock photos.

## Animations

- Hero search bar: Fade-up entrance (delay-300)
- Agent progress rings: Smooth circular fill
- Card reveals: Staggered fade-in with scale (duration-500)
- Hover lifts: translateY(-4px) with shadow-2xl
- Success states: Confetti burst on booking completion
- Typing: Gradient shimmer on AI responses
- Scroll: Parallax on hero (subtle, 0.5 speed)

## Responsive Behavior

- Desktop: Full layout with sidebar
- Tablet: Sidebar becomes bottom drawer
- Mobile: Stack all, hero 70vh, cards single column, bottom nav with agent status modal

## Accessibility

Full WCAG AA compliance: contrast ratios verified, focus visible on all interactive elements, ARIA labels on progress indicators, semantic HTML structure, keyboard navigation complete, screen reader optimized.