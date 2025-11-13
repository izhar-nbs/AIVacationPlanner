# AIHolidayPlanner - Complete Setup Guide

## 🎯 Overview

This guide will walk you through setting up the NorthBay AI Vacation Planner from scratch on your Windows system.

## ✅ Step 1: Install Node.js and npm

### Download and Install Node.js

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS (Long Term Support)** version for Windows
3. Run the installer (.msi file)
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose the default installation path
   - **Important**: Make sure "Add to PATH" is checked
   - Install the recommended tools (including npm)

### Verify Installation

Open a new PowerShell or Command Prompt window and run:

```powershell
node --version
# Should output: v18.x.x or higher

npm --version
# Should output: 9.x.x or higher
```

**Note**: You must open a NEW terminal window after installing Node.js for the PATH changes to take effect.

## ✅ Step 2: Install Project Dependencies

Navigate to your project directory and install all required packages:

```powershell
cd E:\AIHolidayPlanner
npm install
```

This will install all dependencies listed in `package.json`, including:
- React and React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Framer Motion (animations)
- Lucide React (icons)
- shadcn/ui components
- Express.js (backend)
- And many more...

**Expected time**: 2-5 minutes depending on your internet connection.

## ✅ Step 3: Verify Project Structure

Your project should have this structure:

```
AIHolidayPlanner/
├── node_modules/          ✅ Created after npm install
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── lib/
│   │   └── hooks/
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   └── storage.ts
├── shared/
│   └── schema.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

## ✅ Step 4: Start the Development Server

Run the development server:

```powershell
npm run dev
```

You should see output like:

```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

serving on port 5000
```

## ✅ Step 5: Access the Application

Open your web browser and navigate to:

```
http://localhost:5000
```

You should see the NorthBay AI Vacation Planner interface!

## 🎮 Step 6: Test the Application

### Quick Test Flow:

1. **Enter a vacation request** in the chat interface:
   ```
   Beach vacation, $5000 budget, 7 days, couple, June, departing from NYC, interested in food and relaxation
   ```

2. **Watch the AI agents work** in the right sidebar:
   - Destination Scout
   - Flight Optimizer
   - Accommodation Finder
   - Itinerary Architect
   - Budget Guardian

3. **Review the results** after ~2-3 minutes of simulation

4. **Try refinements**:
   - Click "Make it Cheaper"
   - Click "Upgrade Hotel"
   - Change destination

5. **Test checkout** with demo credentials:
   - Card: 1111 1111 1111 1111
   - CVV: 111
   - Expiry: 12/25

## 🔧 Common Issues and Solutions

### Issue: "npm is not recognized"

**Solution**: 
- Node.js is not installed or not in PATH
- Install Node.js from nodejs.org
- Restart your terminal after installation

### Issue: Port 5000 already in use

**Solution**:
```powershell
# Use a different port
$env:PORT=3000; npm run dev
```

### Issue: Module not found errors

**Solution**:
```powershell
# Clean install
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: TypeScript errors

**Solution**:
```powershell
# Run type checking
npm run check
```

### Issue: Build fails

**Solution**:
```powershell
# Clear cache and rebuild
npm run build
```

## 🎨 Customization

### Change Port

Edit `server/index.ts` or set environment variable:
```powershell
$env:PORT=3000
npm run dev
```

### Modify Agent Behavior

Edit `client/src/lib/agent-simulation.ts` to adjust:
- Agent processing times
- Progress update intervals
- Mock data generation

### Update Styling

Edit `tailwind.config.ts` for theme customization:
- Colors
- Fonts
- Spacing
- Breakpoints

### Add New Destinations

Edit `client/src/lib/mock-data.ts` to add more:
- Destinations
- Hotels
- Activities
- Airlines

## 📦 Production Build

To create a production build:

```powershell
# Build the application
npm run build

# Start production server
npm start
```

The built files will be in the `dist/` directory.

## 🔍 Project Scripts Explained

- `npm run dev` - Starts development server with hot reload
- `npm run build` - Creates optimized production build
- `npm start` - Runs production server
- `npm run check` - Type checks TypeScript without building
- `npm run db:push` - Pushes database schema (optional)

## 🌐 Browser Compatibility

Tested and working on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 📱 Mobile Testing

The app is responsive. To test on mobile:

1. Find your local IP address:
   ```powershell
   ipconfig
   ```

2. Access from mobile device on same network:
   ```
   http://YOUR_IP_ADDRESS:5000
   ```

## 🚀 Next Steps

After successful setup:

1. ✅ Explore the codebase
2. ✅ Read `design_guidelines.md` for design principles
3. ✅ Check `attached_assets/` for project requirements
4. ✅ Customize mock data in `client/src/lib/mock-data.ts`
5. ✅ Add real API integrations (optional)

## 📚 Additional Resources

- [React Documentation](https://react.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Vite Guide](https://vitejs.dev/guide/)
- [Framer Motion](https://www.framer.com/motion/)

## 🆘 Getting Help

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review error messages in the terminal
3. Check browser console for frontend errors
4. Verify all dependencies are installed
5. Ensure Node.js version is 18 or higher

## ✨ Success Checklist

- [ ] Node.js and npm installed
- [ ] Dependencies installed (`node_modules/` exists)
- [ ] Development server starts without errors
- [ ] Application loads in browser
- [ ] Can enter vacation preferences
- [ ] Agents simulate and show progress
- [ ] Results display correctly
- [ ] Refinement works
- [ ] Checkout flow completes

If all items are checked, you're ready to go! 🎉
