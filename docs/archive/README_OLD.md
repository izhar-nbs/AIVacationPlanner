# NorthBay AI Vacation Planner

Professional Agentic AI Vacation Planner Demo - A stunning single-page application showcasing 5 AI agents autonomously planning complete vacations in 5 minutes.

## 🚀 Quick Start

### Prerequisites

Before running this project, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup** (Optional - No backend required for demo)
   
   The project uses mock data and doesn't require a database for the demo. However, if you want to set up the database for future features:
   
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Edit .env and add your DATABASE_URL if needed
   ```

### Running the Application

#### Development Mode
```bash
npm run dev
```
The application will start at `http://localhost:5000`

#### Production Build
```bash
npm run build
npm start
```

#### Type Checking
```bash
npm run check
```

## 📁 Project Structure

```
AIHolidayPlanner/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   └── vacation/ # Vacation planner specific components
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions and helpers
│   │   └── hooks/        # Custom React hooks
│   ├── public/           # Static assets
│   └── index.html        # HTML entry point
├── server/               # Backend Express server
│   ├── index.ts         # Server entry point
│   ├── routes.ts        # API routes
│   ├── storage.ts       # Database operations
│   └── vite.ts          # Vite dev server setup
├── shared/              # Shared types and schemas
│   └── schema.ts        # TypeScript interfaces and Zod schemas
└── attached_assets/     # Project documentation and requirements
```

## 🎯 Key Features

### 1. Conversational Input (Chat Interface)
- Natural language vacation planning
- Smart follow-up questions
- Handles vague inputs intelligently

### 2. Multi-Agent Dashboard
- **Destination Scout** - Analyzes destinations and finds top matches
- **Flight Optimizer** - Searches and compares flight options
- **Accommodation Finder** - Scans hotels and reviews
- **Itinerary Architect** - Creates day-by-day schedules
- **Budget Guardian** - Monitors and optimizes spending

### 3. Live Budget Tracker
- Real-time budget updates
- Visual progress indicators
- Breakdown by category (flights, hotels, activities, etc.)

### 4. Results Presentation
- Destination cards with match scores
- Flight comparison tables
- Hotel options with AI reasoning
- Complete 7-day itinerary

### 5. Real-Time Refinement
- Instant recalculation (<10 seconds)
- Compare old vs new plans
- Budget-aware adjustments

### 6. Checkout Flow
- Fake payment for demo purposes
- Pre-filled test card: 1111 1111 1111 1111
- Success confirmation with downloadable itinerary

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Routing**: Wouter
- **State Management**: React Hooks + TanStack Query
- **Backend**: Express.js + TypeScript
- **Database**: PostgreSQL with Drizzle ORM (optional for demo)
- **Build Tool**: Vite

## 🎨 Design System

The application follows enterprise-grade design principles:

- **Typography**: Inter font family
- **Layout**: Dense, information-rich interface
- **Colors**: Professional blue/green accents on white background
- **Animations**: Subtle, professional transitions
- **Responsive**: Mobile-first design

See `design_guidelines.md` for detailed design specifications.

## 🧪 Demo Flow (5 minutes)

1. **Input** (30s): User describes dream vacation
2. **Processing** (2-3min): Watch 5 AI agents work in parallel
3. **Results** (1min): Review complete package with reasoning
4. **Refine** (30s): Adjust preferences, instant recalculation
5. **Book** (30s): Fake payment with test card
6. **Success**: Confirmation with downloadable itinerary

## 📝 Test Credentials

For the demo checkout flow, use:
- **Card Number**: 1111 1111 1111 1111
- **CVV**: 111
- **Expiry**: 12/25
- **Name**: Any name
- **Email**: Any email

## 🔧 Configuration Files

- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration
- `vite.config.ts` - Vite build configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `drizzle.config.ts` - Database configuration (optional)
- `components.json` - shadcn/ui configuration

## 🚨 Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can change it by setting the PORT environment variable:
```bash
PORT=3000 npm run dev
```

### Database Connection Issues
The demo works without a database. If you see database errors, they can be safely ignored for the demo functionality.

### Build Errors
Make sure all dependencies are installed:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript type checking
- `npm run db:push` - Push database schema changes (if using database)

## 🎯 Key Differentiators

- **Speed**: 15 hours → 5 minutes
- **Scale**: 500+ sources checked automatically
- **Transparency**: Explainable AI with reasoning for every decision
- **Adaptability**: Real-time recalculation in <10 seconds
- **Orchestration**: Visual multi-agent parallel processing

## 📄 License

MIT

## 🤝 Contributing

This is a demo project. For production use, consider:
- Implementing real API integrations
- Adding user authentication
- Setting up proper database
- Implementing real payment processing
- Adding comprehensive error handling
- Setting up monitoring and analytics

## 📞 Support

For issues or questions, please refer to the project documentation in `attached_assets/` or check the inline code comments.
