# 🚀 Getting Started

## Quick Setup (5 minutes)

### Prerequisites
- Node.js v18+ ([Download](https://nodejs.org/))
- npm v9+ (comes with Node.js)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. (Optional) Configure LLM API
cp .env.example .env
# Edit .env and add your Groq API key

# 3. Start development server
npm run dev

# 4. Open browser
# http://localhost:5000
```

---

## 📁 Project Structure

```
AIHolidayPlanner/
├── client/          # Frontend (React + TypeScript)
├── server/          # Backend (Express)
├── shared/          # Shared types
├── docs/            # Documentation
└── tests/           # Tests
```

---

## 🎯 Key Features

1. **Multi-Agent AI** - 5 specialized agents working in parallel
2. **Real-time Processing** - Complete planning in 5 minutes
3. **Explainable AI** - Transparent reasoning for every decision
4. **Instant Refinement** - Real-time recalculation
5. **Executive Summary** - C-suite ready overview

---

## 🧪 Testing

```bash
# Run all tests
npm test

# Type checking
npm run check

# Build for production
npm run build
```

---

## 📚 Documentation

- **[Code Structure](./CODE_STRUCTURE.md)** - Project organization
- **[Design Patterns](./DESIGN_PATTERNS.md)** - Patterns used
- **[Code Review Guide](./CODE_REVIEW_GUIDE.md)** - For reviewers
- **[Demo Guide](./DEMO_GUIDE.md)** - How to demo

---

## 🆘 Troubleshooting

### npm not found?
Install Node.js from nodejs.org

### Port 5000 in use?
```bash
$env:PORT=3000; npm run dev
```

### Module errors?
```bash
rm -rf node_modules
npm install
```

---

## 🎊 You're Ready!

Your app is now running at: **http://localhost:5000**

Try entering: "Beach vacation, 5 days, $3000"

---

**Need Help?** Check the [docs](./README.md) or review the [code structure](./CODE_STRUCTURE.md).
