# 🏗️ Code Structure & Organization

## Overview

This project follows **industry-standard patterns** with clear separation of concerns, making it maintainable and scalable.

---

## 📁 Project Structure

```
AIHolidayPlanner/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/          # Base UI components (shadcn/ui)
│   │   │   └── vacation/    # Feature-specific components
│   │   ├── lib/             # Business logic & utilities
│   │   │   ├── services/    # External service integrations
│   │   │   ├── utils/       # Helper functions
│   │   │   └── hooks/       # Custom React hooks
│   │   ├── pages/           # Page components (routes)
│   │   └── types/           # TypeScript type definitions
│   └── public/              # Static assets
│
├── server/                   # Backend Express server
│   ├── routes/              # API route handlers
│   ├── services/            # Business logic
│   └── middleware/          # Express middleware
│
├── shared/                   # Shared code (client + server)
│   ├── types/               # Shared TypeScript types
│   └── constants/           # Shared constants
│
├── docs/                     # Documentation
└── tests/                    # Test files

```

---

## 🎯 Design Principles

### 1. **Separation of Concerns**
- **Components**: Only UI rendering
- **Services**: Business logic and API calls
- **Utils**: Pure helper functions
- **Hooks**: Reusable stateful logic

### 2. **Single Responsibility**
- Each file has ONE clear purpose
- Functions do ONE thing well
- Components render ONE concept

### 3. **DRY (Don't Repeat Yourself)**
- Shared logic in utilities
- Reusable components
- Configuration constants

### 4. **SOLID Principles**
- **S**ingle Responsibility
- **O**pen/Closed (extensible)
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

---

## 📦 Component Organization

### Base UI Components (`client/src/components/ui/`)
- Reusable, generic components
- No business logic
- Styled with Tailwind CSS
- Examples: Button, Card, Dialog

### Feature Components (`client/src/components/vacation/`)
- Business-specific components
- Compose base UI components
- Handle feature logic
- Examples: AgentDashboard, BudgetTracker

---

## 🔧 Service Layer (`client/src/lib/`)

### Services
- **LLM Service**: AI integration
- **Analytics Service**: Tracking
- **Agent Simulation**: Multi-agent orchestration

### Utilities
- **Validators**: Input validation
- **Formatters**: Data formatting
- **Calculators**: Business calculations

---

## 🎨 Styling Strategy

### Tailwind CSS
- Utility-first approach
- Consistent design system
- Responsive by default

### Component Variants
- Using `class-variance-authority`
- Type-safe variants
- Reusable patterns

---

## 🔄 State Management

### Local State (useState)
- Component-specific state
- Simple, predictable

### Shared State (Context)
- Cross-component state
- Minimal prop drilling

### Server State (TanStack Query)
- API data caching
- Automatic refetching
- Loading states

---

## 🧪 Testing Strategy

### Unit Tests
- Pure functions
- Utilities
- Services

### Integration Tests
- Component interactions
- API calls
- User flows

### E2E Tests
- Complete user journeys
- Critical paths
- Demo scenarios

---

## 📝 Naming Conventions

### Files
- **Components**: PascalCase (`AgentDashboard.tsx`)
- **Utilities**: camelCase (`formatCurrency.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)

### Variables
- **Components**: PascalCase (`<AgentCard />`)
- **Functions**: camelCase (`calculateBudget()`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_BUDGET`)

### Types
- **Interfaces**: PascalCase (`interface TripPlan`)
- **Types**: PascalCase (`type AgentStatus`)
- **Enums**: PascalCase (`enum Phase`)

---

## 🔐 Security Practices

### Input Validation
- All user input sanitized
- Zod schemas for validation
- XSS prevention

### API Keys
- Stored in environment variables
- Never committed to git
- Accessed via `import.meta.env`

### Error Handling
- Error boundaries for React
- Try-catch for async operations
- User-friendly error messages

---

## 🚀 Performance Optimizations

### Code Splitting
- Lazy loading routes
- Dynamic imports
- Smaller bundles

### Memoization
- React.memo for expensive components
- useMemo for calculations
- useCallback for functions

### Asset Optimization
- Image lazy loading
- SVG icons
- Minified bundles

---

## 📊 Monitoring & Analytics

### Error Tracking
- Error boundary catches
- Console logging (dev)
- Sentry integration (prod)

### User Analytics
- Google Analytics 4
- Custom event tracking
- Performance metrics

---

## 🔄 Development Workflow

### 1. Feature Development
```
1. Create feature branch
2. Implement in isolation
3. Write tests
4. Code review
5. Merge to main
```

### 2. Code Review Checklist
- [ ] Follows naming conventions
- [ ] Has proper types
- [ ] Includes error handling
- [ ] Is well-documented
- [ ] Has tests
- [ ] No console.logs
- [ ] No hardcoded values

### 3. Deployment
```
1. Run tests
2. Build production
3. Deploy to staging
4. QA testing
5. Deploy to production
```

---

## 🎓 For Code Reviewers

### What to Look For

1. **Code Quality**
   - Clear, readable code
   - Proper TypeScript usage
   - Consistent formatting

2. **Architecture**
   - Proper separation of concerns
   - Reusable components
   - Scalable structure

3. **Best Practices**
   - Error handling
   - Input validation
   - Security measures

4. **Performance**
   - No unnecessary re-renders
   - Optimized algorithms
   - Efficient data structures

5. **Maintainability**
   - Clear documentation
   - Logical organization
   - Easy to extend

---

## 📚 Further Reading

- [Design Patterns](./DESIGN_PATTERNS.md)
- [Best Practices](./BEST_PRACTICES.md)
- [API Documentation](./API.md)

---

**Last Updated**: November 14, 2025  
**Maintained By**: Development Team
