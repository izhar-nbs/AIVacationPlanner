# 🎯 AIHolidayPlanner - Visual Installation Guide

## Step-by-Step Installation (Windows)

---

## 📥 STEP 1: Install Node.js

### 1.1 Download Node.js
1. Open your web browser
2. Go to: **https://nodejs.org/**
3. Click the **LTS** (Long Term Support) button
4. Download will start automatically (file: `node-v18.x.x-x64.msi`)

### 1.2 Install Node.js
1. Locate the downloaded file (usually in `Downloads` folder)
2. Double-click `node-v18.x.x-x64.msi`
3. Click **Next** on the welcome screen
4. Accept the license agreement → Click **Next**
5. Choose installation location (default is fine) → Click **Next**
6. **IMPORTANT**: Ensure "Add to PATH" is checked → Click **Next**
7. Click **Install** (may require administrator permission)
8. Wait for installation to complete
9. Click **Finish**

### 1.3 Verify Installation
1. Open **PowerShell** or **Command Prompt**
   - Press `Win + R`
   - Type `powershell` or `cmd`
   - Press Enter

2. Type these commands:
   ```powershell
   node --version
   ```
   **Expected output**: `v18.x.x` or higher

   ```powershell
   npm --version
   ```
   **Expected output**: `9.x.x` or higher

3. If you see version numbers, **SUCCESS!** ✅
4. If you see "not recognized", restart your computer and try again

---

## 📂 STEP 2: Navigate to Project

### 2.1 Open Terminal in Project Folder

**Option A: Using File Explorer**
1. Open File Explorer
2. Navigate to: `E:\AIHolidayPlanner`
3. Click in the address bar
4. Type `powershell` and press Enter
5. PowerShell opens in the project folder

**Option B: Using Command**
1. Open PowerShell
2. Type:
   ```powershell
   cd E:\AIHolidayPlanner
   ```
3. Press Enter

### 2.2 Verify You're in the Right Place
Type:
```powershell
dir
```

You should see files like:
- `package.json`
- `README.md`
- `client` folder
- `server` folder

---

## 📦 STEP 3: Install Dependencies

### 3.1 Run Installation Command
In the PowerShell window (still in `E:\AIHolidayPlanner`), type:
```powershell
npm install
```

Press Enter and wait...

### 3.2 What Happens During Installation
- npm downloads all required packages
- Creates `node_modules` folder
- Creates `package-lock.json` file
- Takes 2-5 minutes depending on internet speed

### 3.3 Installation Progress
You'll see output like:
```
npm WARN deprecated ...
added 1234 packages in 2m
```

### 3.4 Verify Installation Success
Check if `node_modules` folder exists:
```powershell
dir node_modules
```

If you see a list of folders, **SUCCESS!** ✅

---

## 🚀 STEP 4: Start Development Server

### 4.1 Start the Server

**Option A: Using npm command**
```powershell
npm run dev
```

**Option B: Using startup script**
Double-click `start-dev.bat` in File Explorer

### 4.2 Wait for Server to Start
You'll see output like:
```
> rest-express@1.0.0 dev
> NODE_ENV=development tsx server/index.ts

serving on port 5000
```

When you see "serving on port 5000", **SUCCESS!** ✅

### 4.3 Keep Terminal Open
**IMPORTANT**: Don't close the PowerShell window!
The server runs in this window.

---

## 🌐 STEP 5: Open Application in Browser

### 5.1 Open Your Browser
1. Open Chrome, Firefox, or Edge
2. In the address bar, type:
   ```
   http://localhost:5000
   ```
3. Press Enter

### 5.2 Application Should Load
You should see:
- NorthBay AI Vacation Planner header
- Chat interface in the center
- Agent dashboard on the right
- Suggestion carousel at the top

If you see this, **SUCCESS!** ✅

---

## 🎮 STEP 6: Test the Application

### 6.1 Enter a Vacation Request
In the chat input box, type:
```
Beach vacation, $5000 budget, 7 days, couple, June, departing from NYC, interested in food and relaxation
```

Click **Send** or press Enter

### 6.2 Watch the Magic Happen
1. AI responds with a message
2. Agents start working (right sidebar)
3. Progress bars animate
4. Budget tracker updates
5. After 2-3 minutes, results appear

### 6.3 Explore Results
- Scroll down to see destination
- View flight options
- Check hotel choices
- Review day-by-day itinerary

### 6.4 Try Refinements
Click buttons like:
- "Make it Cheaper"
- "Upgrade Hotel"
- "Change Destination"

### 6.5 Test Checkout
1. Click "Review & Book Trip"
2. Enter test card details:
   - Card: `1111 1111 1111 1111`
   - CVV: `111`
   - Expiry: `12/25`
3. Click "Process Payment"
4. See success confirmation

If everything works, **COMPLETE SUCCESS!** 🎉

---

## 🛑 STEP 7: Stop the Server

When you're done testing:

1. Go back to the PowerShell window
2. Press `Ctrl + C`
3. Type `Y` if asked to terminate
4. Server stops

To start again later, just run `npm run dev` again!

---

## 📊 Installation Checklist

Use this to track your progress:

- [ ] Downloaded Node.js from nodejs.org
- [ ] Installed Node.js (with "Add to PATH" checked)
- [ ] Verified `node --version` works
- [ ] Verified `npm --version` works
- [ ] Navigated to `E:\AIHolidayPlanner`
- [ ] Ran `npm install`
- [ ] Saw `node_modules` folder created
- [ ] Ran `npm run dev`
- [ ] Saw "serving on port 5000" message
- [ ] Opened `http://localhost:5000` in browser
- [ ] Application loaded successfully
- [ ] Entered vacation request
- [ ] Agents animated and worked
- [ ] Results displayed
- [ ] Tested refinement
- [ ] Tested checkout
- [ ] Successfully stopped server with Ctrl+C

---

## 🆘 Common Problems & Solutions

### Problem: "npm is not recognized"
**Cause**: Node.js not installed or not in PATH  
**Solution**:
1. Install Node.js from nodejs.org
2. Make sure "Add to PATH" is checked during installation
3. Restart your computer
4. Open a NEW terminal window

### Problem: "Port 5000 is already in use"
**Cause**: Another application is using port 5000  
**Solution**:
```powershell
$env:PORT=3000
npm run dev
```
Then open `http://localhost:3000` instead

### Problem: "Cannot find module"
**Cause**: Dependencies not installed properly  
**Solution**:
```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Problem: "EACCES: permission denied"
**Cause**: Insufficient permissions  
**Solution**:
1. Right-click PowerShell
2. Select "Run as Administrator"
3. Navigate to project folder
4. Run `npm install` again

### Problem: Application loads but looks broken
**Cause**: Styles not loading  
**Solution**:
1. Stop server (Ctrl+C)
2. Clear browser cache
3. Start server again (`npm run dev`)
4. Hard refresh browser (Ctrl+Shift+R)

### Problem: Agents don't animate
**Cause**: JavaScript error  
**Solution**:
1. Open browser DevTools (F12)
2. Check Console tab for errors
3. Refresh page
4. If errors persist, check `npm run check` for TypeScript errors

---

## 📞 Need More Help?

### Documentation Files
- `README.md` - Full project documentation
- `SETUP_GUIDE.md` - Detailed setup instructions
- `QUICK_START.md` - Quick reference
- `CONFIGURATION_CHECKLIST.md` - Verification checklist
- `PROJECT_STATUS.md` - Current project status

### Check These First
1. Make sure Node.js is installed: `node --version`
2. Make sure you're in the right folder: `dir` should show `package.json`
3. Make sure dependencies are installed: `node_modules` folder should exist
4. Check for error messages in terminal
5. Check browser console (F12) for errors

---

## 🎉 Success!

If you've completed all steps and the application is running:

**CONGRATULATIONS!** 🎊

You've successfully set up the NorthBay AI Vacation Planner!

### What's Next?
1. Explore the codebase in `client/src/`
2. Read `design_guidelines.md` for design principles
3. Check `attached_assets/` for project requirements
4. Customize mock data in `client/src/lib/mock-data.ts`
5. Modify styles in `tailwind.config.ts`
6. Add your own features!

---

## 🔄 Daily Workflow

### Starting Work
1. Open PowerShell in project folder
2. Run `npm run dev`
3. Open `http://localhost:5000`
4. Start coding!

### During Development
- Edit files in `client/src/`
- Browser auto-refreshes on save
- Check terminal for errors
- Check browser console for warnings

### Ending Work
1. Press `Ctrl+C` in terminal
2. Confirm with `Y`
3. Close terminal

### Next Day
Just run `npm run dev` again - no need to reinstall!

---

**Installation Guide Version**: 1.0  
**Last Updated**: November 14, 2025  
**Estimated Time**: 15-20 minutes  
**Difficulty**: Beginner-Friendly
