Here’s the **English version** of the updated guide for replacing symlinks with file copying in PupCaps (no admin rights required):

---

### **Updated Guide: Replacing Symlinks with File Copying in PupCaps (No Admin Rights Needed)**

---

#### **1. Locate Problematic Code**
Find all instances of `fs.symlink` or `fs.symlinkSync` in the project:
```bash
# In PowerShell:
Select-String -Path ".\src\*.js" -Pattern "symlink(Sync)?" -CaseSensitive

# Or manually check:
# - `src/WorkDir.js` (or similar file-handling module)
# - The main executable file (`index.js`/`main.js`)
```

---

#### **2. Replace Symlinks with File Copying**
**Before (problematic for Windows):**
```javascript
const fs = require('fs');
fs.symlinkSync(originalPath, targetPath);  // Causes issues on Windows
```

**After (Windows-friendly):**
```javascript
const fs = require('fs');
const path = require('path');

function safeCopy(src, dest) {
  // Create the target directory if it doesn’t exist
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  
  // Copy with overwrite
  fs.copyFileSync(src, dest);
  console.log(`Copied: ${src} → ${dest}`);  // Debug logging
}

// Usage:
safeCopy(originalPath, targetPath);
```

---

#### **3. Improve Temp File Handling**
Replace hardcoded `L:\Temp` with the system’s standard temp folder:
```javascript
const os = require('os');
const tempDir = path.join(os.tmpdir(), 'pupcaps');  // C:\Users\USER\AppData\Local\Temp\pupcaps\
fs.mkdirSync(tempDir, { recursive: true });
```

---

#### **4. Add Error Handling**
```javascript
try {
  safeCopy(originalPath, targetPath);
} catch (err) {
  console.error(`Copy failed: ${err.message}`);
  throw new Error('Failed to copy files. Check permissions.');
}
```

---

#### **5. Test the Changes**
1. Rebuild the project (if needed):
   ```bash
   npm run build
   ```

2. Run a test:
   ```bash
   npx pupcaps test.srt
   ```

3. Verify:
   - Files appear in `%TEMP%\pupcaps\` (instead of `L:\Temp`)
   - No `EPERM` errors
   - Subtitles process correctly

---

#### **6. Publish the Updated Version**
1. Update the version in `package.json`:
   ```json
   "version": "3.0.2-windows-no-admin"
   ```

2. Commit the changes:
   ```bash
   git commit -am "Replace symlinks with copy for Windows support"
   git push
   ```

3. Publish to npm (if needed):
   ```bash
   npm publish
   ```

---

### **Benefits**
✅ **No admin rights required**  
✅ **Works reliably on all Windows versions**  
✅ **Easier debugging** (explicit copy errors instead of cryptic `EPERM`)  

### **Optional Improvements**
1. **Logging** – Add detailed file operation logs.  
2. **Temp file cleanup** – Automatically delete old files in `os.tmpdir()`.  
3. **Fallback system** – If copying fails, attempt hard links (for advanced users).  

Example implementation:  
[Link to relevant commit in your repo]() (add later)  

Now PupCaps will work on **any Windows PC without admin rights!** 🚀  

--- 

Let me know if you'd like any part refined further!