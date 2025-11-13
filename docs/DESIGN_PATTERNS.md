# 🎨 Design Patterns Used

## Overview

This project implements **industry-standard design patterns** to ensure maintainability, scalability, and code quality.

---

## 1. 🏭 Creational Patterns

### Singleton Pattern
**Used in**: Services (Analytics, LLM)

**Why**: Ensure single instance across application

**Example**:
```typescript
// client/src/lib/analytics.ts
export class Analytics {
  private static instance: Analytics;
  
  static getInstance(): Analytics {
    if (!Analytics.instance) {
      Analytics.instance = new Analytics();
    }
    return Analytics.instance;
  }
}

export const analytics = Analytics.getInstance();
```

**Benefits**:
- Single source of truth
- Consistent state
- Memory efficient

---

### Factory Pattern
**Used in**: Component creation, Mock data generation

**Why**: Centralize object creation logic

**Example**:
```typescript
// client/src/lib/mock-data.ts
export function createDestination(params: DestinationParams): Destination {
  return {
    id: generateId(),
    name: params.name,
    // ... other properties
  };
}
```

**Benefits**:
- Consistent object creation
- Easy to modify
- Testable

---

## 2. 🏗️ Structural Patterns

### Adapter Pattern
**Used in**: LLM service integration

**Why**: Adapt different LLM providers to common interface

**Example**:
```typescript
// client/src/lib/llm-service.ts
interface LLMProvider {
  call(prompt: string): Promise<string>;
}

class GroqAdapter implements LLMProvider {
  async call(prompt: string) {
    // Groq-specific implementation
  }
}

class HuggingFaceAdapter implements LLMProvider {
  async call(prompt: string) {
    // HuggingFace-specific implementation
  }
}
```

**Benefits**:
- Easy to switch providers
- Consistent interface
- Extensible

---

### Facade Pattern
**Used in**: Complex subsystem access

**Why**: Simplify complex operations

**Example**:
```typescript
// client/src/lib/agent-simulation.ts
export class AgentSimulation {
  // Facade for complex multi-agent orchestration
  async runSimulation(
    onAgentUpdate: Callback,
    onMessage: Callback,
    onComplete: Callback
  ) {
    // Hides complexity of agent coordination
  }
}
```

**Benefits**:
- Simple API
- Hides complexity
- Easy to use

---

### Composite Pattern
**Used in**: Component composition

**Why**: Build complex UIs from simple components

**Example**:
```typescript
// Components compose other components
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <AgentCard />
  </CardContent>
</Card>
```

**Benefits**:
- Reusable components
- Flexible composition
- Maintainable

---

## 3. 🔄 Behavioral Patterns

### Observer Pattern
**Used in**: State management, Event handling

**Why**: React to state changes

**Example**:
```typescript
// React's useState is observer pattern
const [state, setState] = useState(initial);

// Components re-render when state changes
useEffect(() => {
  // React to state changes
}, [state]);
```

**Benefits**:
- Reactive updates
- Decoupled components
- Event-driven

---

### Strategy Pattern
**Used in**: Validation, Formatting

**Why**: Interchangeable algorithms

**Example**:
```typescript
// client/src/lib/validators.ts
interface ValidationStrategy {
  validate(input: unknown): boolean;
}

class EmailValidator implements ValidationStrategy {
  validate(input: unknown) {
    // Email validation logic
  }
}

class CardValidator implements ValidationStrategy {
  validate(input: unknown) {
    // Card validation logic
  }
}
```

**Benefits**:
- Flexible algorithms
- Easy to extend
- Testable

---

### Command Pattern
**Used in**: User actions, Undo/Redo

**Why**: Encapsulate actions

**Example**:
```typescript
// User actions as commands
interface Command {
  execute(): void;
  undo(): void;
}

class ChangeDestinationCommand implements Command {
  execute() {
    // Change destination
  }
  
  undo() {
    // Revert to previous
  }
}
```

**Benefits**:
- Encapsulated actions
- Undo/Redo support
- Action history

---

### Template Method Pattern
**Used in**: Component lifecycle

**Why**: Define algorithm skeleton

**Example**:
```typescript
// React component lifecycle
class Component {
  // Template method
  render() {
    this.beforeRender();
    const ui = this.renderContent();
    this.afterRender();
    return ui;
  }
  
  // Steps to override
  beforeRender() {}
  renderContent() {}
  afterRender() {}
}
```

**Benefits**:
- Consistent flow
- Extensible
- Reusable logic

---

## 4. 🎯 React-Specific Patterns

### Container/Presentational Pattern
**Used in**: Component organization

**Why**: Separate logic from UI

**Example**:
```typescript
// Container (logic)
function VacationPlannerContainer() {
  const [state, setState] = useState();
  const handleAction = () => {};
  
  return <VacationPlannerView 
    state={state} 
    onAction={handleAction} 
  />;
}

// Presentational (UI)
function VacationPlannerView({ state, onAction }) {
  return <div>{/* Pure UI */}</div>;
}
```

**Benefits**:
- Testable UI
- Reusable components
- Clear separation

---

### Custom Hooks Pattern
**Used in**: Reusable logic

**Why**: Share stateful logic

**Example**:
```typescript
// client/src/hooks/use-toast.ts
function useToast() {
  const [toasts, setToasts] = useState([]);
  
  const toast = (message) => {
    setToasts([...toasts, message]);
  };
  
  return { toast, toasts };
}
```

**Benefits**:
- Reusable logic
- Composable
- Testable

---

### Render Props Pattern
**Used in**: Flexible rendering

**Why**: Share code between components

**Example**:
```typescript
<DataProvider
  render={(data) => (
    <Display data={data} />
  )}
/>
```

**Benefits**:
- Flexible rendering
- Reusable logic
- Composable

---

## 5. 🏛️ Architectural Patterns

### Layered Architecture
**Structure**:
```
Presentation Layer (Components)
    ↓
Business Logic Layer (Services)
    ↓
Data Access Layer (API calls)
    ↓
External Services (LLM, Analytics)
```

**Benefits**:
- Clear separation
- Easy to test
- Maintainable

---

### Service Layer Pattern
**Used in**: Business logic isolation

**Why**: Centralize business rules

**Example**:
```typescript
// Services handle business logic
class TripPlanningService {
  async createPlan(preferences) {
    // Business logic here
  }
}
```

**Benefits**:
- Reusable logic
- Testable
- Maintainable

---

### Repository Pattern
**Used in**: Data access

**Why**: Abstract data source

**Example**:
```typescript
interface TripRepository {
  save(trip: Trip): Promise<void>;
  find(id: string): Promise<Trip>;
}

class LocalStorageRepository implements TripRepository {
  // Implementation
}
```

**Benefits**:
- Flexible data source
- Testable
- Maintainable

---

## 6. 🔐 Security Patterns

### Input Validation Pattern
**Used in**: All user inputs

**Why**: Prevent XSS, injection attacks

**Example**:
```typescript
// client/src/lib/validators.ts
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script>/gi, '')
    .replace(/javascript:/gi, '');
}
```

**Benefits**:
- Secure
- Consistent
- Reusable

---

### Error Boundary Pattern
**Used in**: Error handling

**Why**: Graceful error recovery

**Example**:
```typescript
// client/src/components/ErrorBoundary.tsx
class ErrorBoundary extends React.Component {
  componentDidCatch(error, errorInfo) {
    // Log error
    // Show fallback UI
  }
}
```

**Benefits**:
- Graceful degradation
- User-friendly
- Error tracking

---

## 7. 📊 Performance Patterns

### Memoization Pattern
**Used in**: Expensive calculations

**Why**: Avoid unnecessary recalculations

**Example**:
```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensiveValue(input);
}, [input]);
```

**Benefits**:
- Performance
- Efficient
- Optimized

---

### Lazy Loading Pattern
**Used in**: Code splitting

**Why**: Faster initial load

**Example**:
```typescript
const HeavyComponent = lazy(() => 
  import('./HeavyComponent')
);
```

**Benefits**:
- Faster load
- Smaller bundles
- Better UX

---

## 8. 🧪 Testing Patterns

### Arrange-Act-Assert (AAA)
**Used in**: All tests

**Why**: Clear test structure

**Example**:
```typescript
test('calculates budget correctly', () => {
  // Arrange
  const plan = createMockPlan();
  
  // Act
  const budget = calculateBudget(plan);
  
  // Assert
  expect(budget.total).toBe(5000);
});
```

**Benefits**:
- Clear tests
- Maintainable
- Readable

---

## 📚 Pattern Selection Guide

### When to Use Each Pattern

| Pattern | Use When | Don't Use When |
|---------|----------|----------------|
| Singleton | Need single instance | Need multiple instances |
| Factory | Complex object creation | Simple objects |
| Observer | React to changes | One-time operations |
| Strategy | Multiple algorithms | Single algorithm |
| Facade | Complex subsystem | Simple operations |

---

## 🎓 For Code Reviewers

### Pattern Checklist

- [ ] **Singleton**: Used for services?
- [ ] **Factory**: Used for complex creation?
- [ ] **Observer**: Used for state management?
- [ ] **Strategy**: Used for algorithms?
- [ ] **Facade**: Used for complexity?
- [ ] **Container/Presentational**: UI separated?
- [ ] **Custom Hooks**: Logic reused?
- [ ] **Error Boundary**: Errors handled?
- [ ] **Memoization**: Performance optimized?
- [ ] **Lazy Loading**: Code split?

---

## 📖 Further Reading

- [Code Structure](./CODE_STRUCTURE.md)
- [Best Practices](./BEST_PRACTICES.md)
- [Gang of Four Design Patterns](https://en.wikipedia.org/wiki/Design_Patterns)
- [React Patterns](https://reactpatterns.com/)

---

**Last Updated**: November 14, 2025  
**Pattern Count**: 15+ patterns implemented
