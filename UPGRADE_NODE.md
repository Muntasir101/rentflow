# Node.js Upgrade Instructions

## Current Status
- Current Node.js version: 18.15.0
- Required version: >=20.9.0

## Option 1: Using nvm-windows (Recommended)

### Step 1: Install nvm-windows
1. Download from: https://github.com/coreybutler/nvm-windows/releases
2. Download `nvm-setup.exe` (latest version)
3. Run the installer
4. **Close and reopen your terminal/PowerShell**

### Step 2: Install Node.js 20
```powershell
# Install Node.js 20 LTS
nvm install 20.11.0

# Or install latest 20.x version
nvm install 20

# Use the installed version
nvm use 20.11.0

# Verify installation
node --version
```

### Step 3: Verify
```powershell
node --version  # Should show v20.x.x
npm --version
```

---

## Option 2: Direct Installation

### Step 1: Download Node.js
1. Go to: https://nodejs.org/
2. Download the **LTS version** (20.x or higher)
3. Run the installer
4. Follow the installation wizard

### Step 2: Verify Installation
```powershell
# Close and reopen terminal, then:
node --version  # Should show v20.x.x
npm --version
```

---

## After Upgrading

1. **Reinstall dependencies** (recommended):
```powershell
# Remove old node_modules
Remove-Item -Recurse -Force node_modules

# Remove package-lock.json (optional, but recommended)
Remove-Item package-lock.json

# Reinstall
npm install
```

2. **Regenerate Prisma Client**:
```powershell
npx prisma generate
```

3. **Run the app**:
```powershell
npm run dev
```

---

## Troubleshooting

### If you get "node is not recognized"
- Close and reopen your terminal
- Restart your IDE/editor
- Check that Node.js is in your PATH

### If npm packages have issues
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

### If Prisma has issues
- Run `npx prisma generate`
- Run `npx prisma migrate dev` if needed

