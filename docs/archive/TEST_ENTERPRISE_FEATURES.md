# 🧪 Testing Enterprise Features

## Quick Test Guide

Your development server is running at: **http://localhost:5000**

All enterprise improvements have been implemented! Here's how to test each feature:

---

## 1. 🛡️ Error Boundary

### Test Method 1: Trigger a React Error

**Option A: Use Browser Console**
1. Open the app: http://localhost:5000
2. Open DevTools (F12)
3. Go to Console tab
4. Type and run:
   ```javascript
   throw new Error('Test error boundary');
   ```

**Option B: Temporarily Break a Component**
1. Open `client/src/pages/vacation-planner.tsx`
2. Add this line inside the component:
   ```typescript
   if (Math.random() > 0.5) throw new Error('Random error');
   ```
3. Refresh the page multiple times

### Expected Behavior:
- ✅ Error boundary catches the error
- ✅ Shows friendly error message with AlertTriangle icon
- ✅ Displays "Something went wrong" heading
- ✅ Shows "Reload Application" and "Go Home" buttons
- ✅ In dev mode, shows error details in expandable section
- ✅ Console logs the error

### What to Verify:
- [ ] Error doesn't crash the entire app
- [ ] User sees friendly message (not technical stack trace)
- [ ] Reload button works
- [ ] Home button works
- [ ] Error details visible in dev mode

---

## 2. 📊 Analytics Tracking

### Setup (One-Time):
1. Create `.env` file in project root (if not exists)
2. Add your GA4 Measurement ID:
   ```
   VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
3. Restart dev server: Stop (Ctrl+C) and run `npm run dev`

### Test Events:

#### Event 1: Vacation Request
1. Open app: http://localhost:5000
2. Enter vacation request: "Beach vacation, $5000, 7 days"
3. Open DevTools Console
4. Look for: `Analytics event: vacation_request_submitted`

**Expected Data:**
```javascript
{
  budget: 5000,
  duration: 7,
  destination: "Cancún",
  travelers: 2,
  departure_city: "New York",
  month: "June",
  interests: "gastronomy,wellness"
}
```

#### Event 2: Destination Change
1. Wait for results to load
2. Change destination via dropdown or chat
3. Check console for: `Analytics event: destination_changed`

**Expected Data:**
```javascript
{
  from_destination: "Cancún",
  to_destination: "Bali"
}
```

#### Event 3: Checkout Initiated
1. Click "Review & Book Trip"
2. Check console for: `Analytics event: checkout_initiated`

**Expected Data:**
```javascript
{
  destination: "Cancún",
  total_cost: 4320,
  match_score: 96
}
```

#### Event 4: Purchase Complete
1. Complete checkout with test card
2. Check console for: `Analytics event: purchase`

**Expected Data:**
```javascript
{
  transaction_id: "trip_1234567890",
  value: 4320,
  currency: "USD",
  destination: "Cancún",
  items: [...]
}
```

### Verify in Google Analytics:
1. Go to GA4 dashboard
2. Navigate to Reports > Realtime
3. Perform actions in app
4. See events appear in real-time

### What to Verify:
- [ ] Console shows "Analytics initialized"
- [ ] Each action logs an event
- [ ] Event data is correct
- [ ] Events appear in GA4 (if configured)

---

## 3. ⏳ Loading Skeletons

### Test Method:

#### Test 1: Results Skeleton
1. Open app: http://localhost:5000
2. Enter vacation request
3. **Immediately** watch the screen during processing

**Expected Behavior:**
- ✅ Skeleton appears instantly
- ✅ Shows placeholder for destination hero
- ✅ Shows 3 flight card skeletons
- ✅ Shows 4 hotel card skeletons
- ✅ Shows 5 itinerary item skeletons
- ✅ All skeletons have pulse animation
- ✅ Skeletons disappear when real data loads

#### Test 2: Agent Dashboard Skeleton
1. Look at right sidebar during processing
2. Should see agent card skeletons

**Expected Behavior:**
- ✅ 5 agent card skeletons
- ✅ Progress bar skeletons
- ✅ Status text skeletons
- ✅ Smooth pulse animation

#### Test 3: Budget Tracker Skeleton
1. Look at right sidebar top during processing
2. Should see budget skeleton

**Expected Behavior:**
- ✅ Total amount skeleton
- ✅ Progress bar skeleton
- ✅ Category breakdown skeletons

### What to Verify:
- [ ] Skeletons appear immediately (no blank screen)
- [ ] Animations are smooth (60fps)
- [ ] Layout matches final content
- [ ] No layout shift when real data loads
- [ ] Responsive on mobile

---

## 4. ✅ Input Validation

### Test Method:

#### Test 1: Description Validation
1. Open app
2. Try entering very short text (< 10 chars): "Beach"
3. Try submitting

**Expected:**
- ❌ Should show error: "Please provide at least 10 characters"

4. Try very long text (> 500 chars)
5. Try submitting

**Expected:**
- ❌ Should show error: "Description too long"

#### Test 2: XSS Prevention
1. Try entering malicious input:
   ```
   <script>alert('XSS')</script>Beach vacation
   ```
2. Submit the form

**Expected:**
- ✅ Script tags removed
- ✅ Only "Beach vacation" remains
- ✅ No alert popup
- ✅ No console errors

#### Test 3: Budget Validation
1. Modify chat-interface.tsx to use validation
2. Try budget < $500
3. Try budget > $100,000

**Expected:**
- ❌ Should show validation errors

#### Test 4: Email Validation (Checkout)
1. Go to checkout
2. Try invalid emails:
   - "notanemail"
   - "test@"
   - "@example.com"
   - "test @example.com"

**Expected:**
- ❌ Should show: "Please enter a valid email address"

#### Test 5: Card Validation (Checkout)
1. Try invalid card numbers:
   - "1234 5678 9012 3456" (fails Luhn)
   - "123" (too short)
   - "abcd efgh ijkl mnop" (not digits)

**Expected:**
- ❌ Should show: "Invalid card number"

2. Try valid test card: "1111 1111 1111 1111"

**Expected:**
- ✅ Should pass validation

#### Test 6: CVV Validation
1. Try invalid CVVs:
   - "12" (too short)
   - "12345" (too long)
   - "abc" (not digits)

**Expected:**
- ❌ Should show: "CVV must be 3 or 4 digits"

#### Test 7: Expiry Validation
1. Try past date: "01/20"

**Expected:**
- ❌ Should show: "Card has expired"

2. Try invalid month: "13/25"

**Expected:**
- ❌ Should show: "Invalid month"

3. Try valid future date: "12/25"

**Expected:**
- ✅ Should pass validation

### What to Verify:
- [ ] All validation rules work
- [ ] Error messages are clear
- [ ] XSS attempts are blocked
- [ ] Valid input passes through
- [ ] Validation is fast (< 100ms)

---

## 5. 🔒 Rate Limiting

### Test Method:

#### Test 1: Basic Rate Limiting
1. Open browser console
2. Run this code:
   ```javascript
   import { rateLimiter } from './lib/validators';
   
   // Try 6 rapid attempts (limit is 5)
   for (let i = 0; i < 6; i++) {
     const allowed = rateLimiter.isAllowed('test-action', 5, 60000);
     console.log(`Attempt ${i + 1}: ${allowed ? 'Allowed' : 'Blocked'}`);
   }
   ```

**Expected Output:**
```
Attempt 1: Allowed
Attempt 2: Allowed
Attempt 3: Allowed
Attempt 4: Allowed
Attempt 5: Allowed
Attempt 6: Blocked
```

#### Test 2: Time Window Reset
1. Wait 60 seconds
2. Try again

**Expected:**
- ✅ Should allow attempts again

### What to Verify:
- [ ] Rate limiter blocks after max attempts
- [ ] Time window resets correctly
- [ ] Different keys are tracked separately

---

## Integration Tests

### Full User Flow:
1. ✅ Open app (no errors)
2. ✅ See loading skeletons during initial load
3. ✅ Enter vacation request (validation passes)
4. ✅ See agent skeletons during processing
5. ✅ Analytics tracks vacation request
6. ✅ Results load (skeletons disappear)
7. ✅ Change destination (analytics tracks)
8. ✅ Select flight (analytics tracks)
9. ✅ Select hotel (analytics tracks)
10. ✅ Click checkout (analytics tracks)
11. ✅ Enter payment info (validation works)
12. ✅ Complete purchase (analytics tracks)
13. ✅ See success confirmation

### Error Scenarios:
1. ✅ Trigger error → Error boundary catches
2. ✅ Invalid input → Validation blocks
3. ✅ XSS attempt → Sanitization removes
4. ✅ Rate limit → Blocks excess attempts

---

## Performance Tests

### Metrics to Check:

#### Loading Skeletons:
- Render time: < 50ms
- Animation FPS: 60fps
- No layout shift

#### Validation:
- Validation time: < 10ms per field
- Sanitization time: < 5ms
- No UI blocking

#### Analytics:
- Event tracking: < 1ms
- No impact on UI performance
- Async loading

#### Error Boundary:
- Error catch time: < 1ms
- Recovery time: Instant
- No memory leaks

---

## Browser Compatibility

Test on:
- [ ] Chrome 90+
- [ ] Firefox 88+
- [ ] Safari 14+
- [ ] Edge 90+

---

## Accessibility Tests

### Error Boundary:
- [ ] Screen reader announces error
- [ ] Buttons are keyboard accessible
- [ ] Focus management works

### Skeletons:
- [ ] ARIA labels present
- [ ] Screen reader friendly
- [ ] No confusing announcements

### Validation:
- [ ] Error messages announced
- [ ] Associated with form fields
- [ ] Clear and helpful

---

## Success Criteria

All features pass when:

1. ✅ Error boundary catches all errors
2. ✅ Analytics tracks all events
3. ✅ Skeletons show during loading
4. ✅ Validation blocks invalid input
5. ✅ XSS attempts are sanitized
6. ✅ Rate limiting works
7. ✅ No console errors
8. ✅ Performance is smooth
9. ✅ Accessible to all users
10. ✅ Works in all browsers

---

## Troubleshooting

### Analytics not working:
- Check `.env` has `VITE_GA_MEASUREMENT_ID`
- Restart dev server after adding env var
- Check console for "Analytics initialized"

### Skeletons not showing:
- Check phase is "processing"
- Verify skeleton components imported
- Check CSS animations enabled

### Validation not working:
- Check Zod is installed: `npm list zod`
- Verify validators imported correctly
- Check console for errors

### Error boundary not catching:
- Verify error is in React component
- Check ErrorBoundary wraps app
- Look for console logs

---

**Test Guide Version**: 1.0  
**Last Updated**: November 14, 2025  
**Status**: Ready for Testing 🚀
