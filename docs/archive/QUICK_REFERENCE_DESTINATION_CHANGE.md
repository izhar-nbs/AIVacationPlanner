# 🚀 Quick Reference - Destination Change Feature

## ⚡ Quick Start

**App URL**: http://localhost:5000  
**Status**: ✅ Running and ready to test

---

## 🎯 Two Ways to Change Destination

### Method 1: UI Dropdown (Easiest)
1. Get your initial trip plan
2. Look for dropdown at top of results
3. Click and select new destination
4. Done! Agents reconfigure automatically

### Method 2: Chat Message
1. Get your initial trip plan
2. Type in chat: "Change destination to Bali"
3. Done! AI handles the rest

---

## 💬 Chat Commands That Work

```
✅ "Change destination to Bali"
✅ "Switch to Santorini"  
✅ "Try Cancún instead"
✅ "What about Bali?"
✅ "Show me Santorini"
✅ "Plan for Bali"
✅ Just type: "Bali"
```

---

## 📍 Available Destinations

1. **Cancún, Mexico** - Caribbean beach paradise
2. **Bali, Indonesia** - Spiritual wellness retreat
3. **Santorini, Greece** - Romantic Mediterranean escape

---

## 🔍 What to Look For

### In Results Page:
- **Dropdown selector** with MapPin icon (📍)
- Located in destination hero card
- Shows current destination

### After Changing:
- **Toast notification**: "Destination Updated"
- **Agents restart**: All progress bars reset to 0%
- **New plan**: Generated in 2-3 minutes
- **Comparison view**: Old vs New side-by-side
- **Budget update**: Automatic recalculation

---

## ⏱️ Expected Timings

| Action | Time |
|--------|------|
| Dropdown click → Agent start | < 1 sec |
| Chat message → Agent start | < 2 sec |
| Agent simulation | 2-3 min |
| Budget recalculation | Instant |

---

## 🐛 Quick Troubleshooting

**Dropdown not visible?**  
→ Make sure you're on results page (after agents complete)

**Chat not detecting?**  
→ Use exact names: "Cancún", "Bali", "Santorini"

**Agents not restarting?**  
→ Check browser console (F12), refresh if needed

---

## 📚 Full Documentation

- **Feature Details**: `DESTINATION_CHANGE_FEATURE.md`
- **Test Guide**: `TEST_DESTINATION_CHANGE.md`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`

---

## ✅ Success Checklist

- [ ] Dropdown appears in results
- [ ] Can select different destination
- [ ] Chat detects "Change to X"
- [ ] Agents restart and animate
- [ ] New plan generates
- [ ] Comparison view shows
- [ ] Budget updates automatically

---

**Quick Tip**: Try changing destinations multiple times to see how the AI adapts to each location!

---

**Version**: 1.0  
**Status**: ✅ Ready to Use  
**Last Updated**: November 14, 2025
