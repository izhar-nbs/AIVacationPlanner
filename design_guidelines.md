# NorthBay Agentic Vacation Planner - Design Guidelines

## Design Approach

**Reference-Based Approach**: Drawing inspiration from luxury travel platforms (Airbnb Luxe, Mr & Mrs Smith, Virtuoso) combined with modern SaaS polish (Linear's typography, Stripe's restraint). This creates sophistication without sterility - aspirational yet approachable.

**Core Principles**:
- Premium positioning through visual hierarchy and generous spacing
- Trust-building through transparency of AI agent work
- Wanderlust evocation via imagery and motion
- Professional sophistication avoiding tech-startup aesthetics

## Core Design Elements

### Typography
- **Display Font**: Playfair Display or Cormorant Garamond (luxury serif for headlines)
- **Body Font**: Inter or Circular (clean, modern sans-serif)
- **Hierarchy**:
  - Hero headline: Display font, 4xl-6xl, regular weight
  - Section titles: Display font, 3xl-4xl, medium weight
  - Agent names/card headers: Sans-serif, xl-2xl, semibold
  - Body text: Sans-serif, base-lg, regular weight
  - Pricing: Sans-serif, 2xl-3xl, bold, tabular numbers
  - Microcopy: Sans-serif, sm, medium weight

### Layout System
**Spacing Primitives**: Tailwind units 4, 6, 8, 12, 16, 24, 32, 48
- Section padding: py-24 md:py-32
- Card padding: p-6 md:p-8
- Element spacing: gap-8 md:gap-12
- Container max-width: max-w-7xl
- Narrow content: max-w-4xl

## Component Library

### Hero Section
- Full viewport height (min-h-screen)
- Large background image (luxury destination: overwater bungalows, pristine beaches)
- Centered content with blurred-background overlay card
- Display font headline: "Your Perfect Vacation, Orchestrated by AI"
- Subheadline explaining luxury personalization
- Large chat textarea (min-h-32) with premium placeholder
- Trust indicators below: "Trusted by 10,000+ travelers" with 5-star rating
- Subtle scroll indicator at bottom

### Navigation
- Sticky transparent header with blur backdrop
- Logo left, minimal nav links center, CTA button right
- Transitions to solid background on scroll
- Clean, unobtrusive design

### Multi-Agent Dashboard (Central Experience)
**Layout**: 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3)

**Agent Cards**:
- Elevated cards with subtle gradient borders (luxury accent)
- Large icon at top (Heroicons: MapIcon, CalendarIcon, HomeIcon, etc.)
- Agent name in display font, smaller size
- Animated horizontal progress bar with gradient fill
- Status text updates with typewriter effect
- Completion: checkmark icon with subtle scale animation
- Hover: gentle lift (translateY -1px) with shadow enhancement

**Inter-Agent Communication**:
- Elegant toast notifications between cards
- Curved connection lines with animated dots
- Premium microcopv: "Flight Curator found 3 perfect options..."
- Brief display with graceful fade

### Budget Tracker
- Sticky card during processing, top-right position
- Large counter with luxury typography: "$4,320 / $5,000"
- Thin elegant progress bar (h-2) with gradient
- Breakdown: horizontal bar chart (not pie) with labeled segments
- Smooth color transitions reflecting budget status
- CountUp animation with easing function

### Results Presentation

**Destination Hero Card**:
- Full-width dramatic image (16:9, high-quality destination photo)
- Overlay gradient for text readability
- Large match score badge: "96% Perfect Match"
- Expandable "Why Cancún?" section with 5 compelling reasons
- Alternative destinations as smaller cards in 3-column grid below

**Flight Comparison**:
- Clean table layout, 3 options side-by-side
- Recommended option: subtle border accent, "Best Value" badge
- Key details: airline logo, duration with clock icon, price bold
- Trade-off indicators: icons for baggage, legroom, timing
- "Select" buttons with gradient background

**Hotel Grid**:
- 4-column responsive grid (grid-cols-1 md:grid-cols-2 lg:grid-cols-4)
- Landscape images (3:2 ratio) with hover zoom effect
- Elegant overlay with hotel name, star rating (filled star icons), price
- "AI Recommended" badge on top choice
- Hover: detailed description overlay with blur backdrop

**Itinerary Timeline**:
- Vertical timeline with elegant connecting line
- Day cards: date in display font, activities listed with icons
- Time slots, activity names, cost per item
- Expandable details with smooth accordion
- Bottom summary: "5 Days • 12 Activities • $1,847"

### Refinement Interface
- Floating action bar at bottom (sticky, blur backdrop)
- Button group: "Make it Cheaper" | "Different Destination" | "Luxury Upgrade"
- Comparison modal: split-screen old vs. new with highlighted differences
- Recalculation: 45-second progress with skeleton loaders showing card structure
- Change indicators: subtle pulse on modified values

### Checkout Experience
- Full-screen modal with dark overlay (backdrop-blur)
- Centered card (max-w-2xl) with premium styling
- Trip summary: destination image, dates, total breakdown
- Pre-filled form in elegant layout (2-column on desktop)
- Payment fields: Card ending 1111, CVV 111, Exp 12/25
- "Complete Booking" button with gradient
- Success: animated checkmark, confetti particles, confirmation with download options

## Animations

Use sparingly for premium feel:
- **Agent Progress**: Smooth 0-100% fills over 45-60 seconds with easing
- **Budget Counter**: CountUp with spring easing
- **Card Reveals**: Staggered fade-in from bottom (delay-100, delay-200)
- **Success States**: Gentle scale bounce (scale-105) on checkmarks
- **Hover Effects**: Subtle lifts, no excessive motion
- **Image Parallax**: Light parallax on hero scroll (translateY 10-20%)

## Images

### Hero Section
**Required**: Large, inspiring luxury destination photo
- Style: Professional travel photography, aspirational quality
- Subject: Overwater bungalows, pristine beaches, luxury resorts
- Treatment: Slight darkening for text contrast
- Aspect: Full viewport background, object-cover

### Destination Cards
- High-resolution location photography (16:9 ratio)
- Examples: Cancún beaches, Tulum ruins, Maldives waters, Swiss Alps
- Quality: Premium, magazine-style imagery

### Hotel Images
- Landscape property photos (3:2 ratio)
- Focus: Luxury interiors, pools, views, amenities
- Consistent professional quality

### Activity Icons
Use Heroicons consistently: MapIcon, SunIcon, UtensilsIcon, CameraIcon, HeartIcon

## Responsive Behavior
- **Mobile**: Single column, stacked cards, simplified timeline, bottom nav
- **Tablet**: 2-column grids, condensed spacing (py-16)
- **Desktop**: Full 3-4 column layouts, optimal spacing (py-32)

## Trust Elements
Position prominently throughout:
- "15 hours → 5 minutes" comparison with icon graphic
- "500+ luxury properties vetted" badge with checkmark
- "Explainable AI" tags on recommendation cards
- Client testimonials: elegant quote cards with traveler photos
- "Real-time price monitoring" indicator during refinement

## Accessibility
- High contrast text overlays on images
- Focus indicators: subtle luxury accent border
- Keyboard navigation throughout
- Screen reader labels on all interactive elements
- Alt text for destination imagery