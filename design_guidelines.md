# AI Vacation Planner Demo - Design Guidelines

## Design Philosophy
Enterprise-grade demo focused on "WOW factor" - every interaction must feel polished and production-ready. The goal is to visually demonstrate AI agent orchestration through stunning animations and clear information hierarchy.

## Visual Foundation

### Color Palette
- **Primary**: Blue/Green accents (professional, trustworthy)
- **Background**: White base for clean, modern feel
- **Status Colors**: 
  - Green: Under budget, completed states
  - Yellow: Warning states, near budget limit
  - Red: Over budget, error states
- **Agent Cards**: Distinct subtle color coding per agent type

### Typography
- **Primary Font**: Inter or Poppins (professional, modern)
- **Hierarchy**:
  - Large, bold headings for section titles
  - Medium weight for agent names and card headers
  - Regular weight for descriptions and body text
  - Tabular numbers for budget counters and pricing

### Spacing System
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32 for consistent rhythm throughout the application.

## Layout Structure

### Single Page Flow
Five distinct phases with smooth transitions:
1. **Conversational Input** (top of page)
2. **Multi-Agent Dashboard** (central focus during processing)
3. **Results Presentation** (scrollable detailed view)
4. **Refinement Controls** (sticky or floating)
5. **Checkout Modal** (overlay)

### Container Strategy
- Max-width container (1280px) for main content
- Full-width for hero/dramatic moments
- Generous padding (px-6 md:px-12) for breathing room

## Component Library

### 1. Chat Interface
- **Layout**: Large central textarea with chat bubble history above
- **Textarea**: 
  - Placeholder: "Describe your dream vacation..."
  - Min height: 120px
  - Rounded corners, subtle border
  - Focus state with blue accent
- **Chat Bubbles**:
  - User messages: Right-aligned, blue background
  - AI messages: Left-aligned, light gray background
  - Avatar icons for visual distinction
  - Smooth fade-in animations for new messages

### 2. Multi-Agent Dashboard (KEY WOW ELEMENT)
- **Grid Layout**: 2x3 responsive grid (2 columns on mobile, 3 on desktop)
- **Agent Cards**:
  - Large icon at top (Lucide React icons)
  - Agent name in bold
  - Animated progress bar (0-100%) with smooth transitions
  - Status text updates every 2-3 seconds
  - Checkmark animation when complete
  - Subtle hover lift effect
  - Card elevation with shadow
- **Inter-Agent Messages**: 
  - Small toast-style notifications between cards
  - Arrow indicators showing communication flow
  - Brief display duration (3-4 seconds)

### 3. Budget Tracker
- **Position**: Sticky during agent processing phase
- **Elements**:
  - Large animated counter: "$4,320 / $5,000"
  - Horizontal progress bar (full width)
  - Color transitions: smooth gradient from green → yellow → red
  - Breakdown pie chart (medium size, animated segments)
  - Category labels with amounts
- **Animations**: CountUp effect for numbers, smooth bar fills

### 4. Results Cards

**Destination Card**:
- Hero image (16:9 ratio, full card width)
- Prominent match score badge (96/100)
- "Why this destination?" expandable section with 5 bullet points
- Alternative options as smaller cards below

**Flight Comparison Table**:
- 3-column side-by-side layout
- Header: Airline, Duration, Price
- Highlight recommended option with subtle border/background
- Trade-off callouts in small text
- Icons for amenities

**Hotel Cards** (Grid of 4):
- Square/landscape images
- Star rating with icons
- Price per night (bold, prominent)
- AI reasoning tooltip on hover
- "Select" button

**Itinerary Timeline**:
- Vertical timeline with connecting line
- Day cards with time/activity/cost
- Icons for activity types
- Expandable details
- Pacing indicator at bottom

### 5. Refinement Interface
- **Button Group**: "Make it Cheaper" | "Change Destination" | "Upgrade Hotel"
- **Comparison View**: Side-by-side cards showing Old Plan vs New Plan
- **Recalculation Animation**: 10-second progress with skeleton loaders
- **Highlight Changes**: Yellow background fade on modified values

### 6. Checkout Modal
- **Overlay**: Semi-transparent dark background
- **Modal Card**: Centered, white, with close button
- **Pre-filled Form**:
  - Card: 1111 1111 1111 1111
  - CVV: 111
  - Expiry: 12/25
- **Success Animation**: Checkmark with confetti effect
- **Confirmation Screen**: Trip summary with download buttons

## Animations & Interactions

### Critical Animations
- **Agent Progress Bars**: Smooth 0-100% fills over 45-60 seconds
- **Budget Counter**: CountUp effect with easing
- **Card Appearances**: Stagger fade-in from bottom
- **Status Updates**: Subtle pulse on text changes
- **Success States**: Bounce or scale effect with checkmarks

### Hover States
- Cards: Subtle lift (translateY -2px) + shadow increase
- Buttons: Background color shift + slight scale
- Table rows: Light background highlight
- Interactive elements: Cursor pointer + visual feedback

### Loading States
- Skeleton loaders during agent processing
- Shimmer effect on placeholder content
- Spinner for quick actions
- Progress indicators for longer operations

## Responsive Behavior
- **Mobile**: Single column, stacked cards, simplified charts
- **Tablet**: 2-column grid, condensed spacing
- **Desktop**: Full 3-column grid, optimal spacing

## Interactive Elements

### Buttons
- **Primary**: Bold blue, rounded corners, medium size
- **Secondary**: Outline style with blue border
- **Success**: Green background for "Book" actions
- **Hover**: All buttons scale slightly (1.02) and darken

### Toast Notifications
- Position: Top-right corner
- Auto-dismiss: 4 seconds
- Types: Success (green), Info (blue), Warning (yellow), Error (red)
- Slide-in animation from right

## Key Differentiator Highlights
Display prominently:
- "15 hours → 5 minutes" comparison graphic
- "500+ sources checked automatically" badge
- "Explainable AI" tag on reasoning sections
- "Real-time adaptation" indicator during refinements

## Images

### Hero Section
Not needed - chat interface is the entry point

### Destination Cards
- High-quality destination photos (Cancún beaches, Tulum ruins, etc.)
- Aspect ratio: 16:9
- Professional travel photography style

### Hotel Cards  
- Property exterior/interior shots
- Aspect ratio: 4:3
- Consistent sizing across all cards

### Activity Icons
Use Lucide React icons throughout for activities, amenities, and status indicators

## Accessibility
- Adequate contrast ratios (WCAG AA minimum)
- Focus indicators on all interactive elements
- Aria labels for screen readers
- Keyboard navigation support
- Alt text for all images