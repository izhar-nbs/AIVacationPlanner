# 🚀 Quick Start Guide - AIHolidayPlanner

## For First-Time Setup

### 1. Install Node.js
```
Download from: https://nodejs.org/
Install the LTS version
Restart your terminal after installation
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Start Development Server
```powershell
npm run dev
```
**OR** double-click `start-dev.bat`

### 4. Open Browser
```
http://localhost:5000
```

---

## Daily Development

### Start Server
```powershell
npm run dev
```

### Stop Server
Press `Ctrl + C` in terminal

### Check for Errors
```powershell
npm run check
```

### Build for Production
```powershell
npm run build
npm start
```

---

## Test the Demo

### 1. Enter Vacation Request
```
Beach vacation, $5000, 7 days, couple, June, NYC, food & relaxation
```

### 2. Watch Agents Work (2-3 min)
- Destination Scout
- Flight Optimizer
- Accommodation Finder
- Itinerary Architect
- Budget Guardian

### 3. Review Results
- Destination match
- Flight options
- Hotel choices
- Day-by-day itinerary

### 4. Try Refinements
- Make it Cheaper
- Upgrade Hotel
- Change Destination

### 5. Test Checkout
```
Card: 1111 1111 1111 1111
CVV: 111
Expiry: 12/25
```

---

## Common Commands

| Command | Description |
|---------|-------------|
| `npm install` | Install dependencies |
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Run production server |
| `npm run check` | Type check TypeScript |
| `npm run db:push` | Update database schema |

---

## Troubleshooting

### npm not found?
→ Install Node.js from nodejs.org

### Port 5000 in use?
→ `$env:PORT=3000; npm run dev`

### Module errors?
→ `npm install`

### Build errors?
→ Delete `node_modules`, run `npm install`

---

## Project Structure

```
AIHolidayPlanner/
├── client/src/          # Frontend React app
│   ├── components/      # UI components
│   ├── pages/          # Page components
│   └── lib/            # Utilities
├── server/             # Backend Express
└── shared/             # Shared types
```

---

## Key Files

- `README.md` - Full documentation
- `SETUP_GUIDE.md` - Detailed setup
- `CONFIGURATION_CHECKLIST.md` - Setup checklist
- `design_guidelines.md` - Design system
- `.env.example` - Environment template

---

## Support

📖 Read: `SETUP_GUIDE.md` for detailed instructions
✅ Check: `CONFIGURATION_CHECKLIST.md` for verification
🎨 Design: `design_guidelines.md` for styling

---

**Ready to start?** Run `npm run dev` and open http://localhost:5000
