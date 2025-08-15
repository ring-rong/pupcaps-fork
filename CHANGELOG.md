# Changelog

All notable changes to this Windows fork of PupCaps will be documented in this file.

## [1.0.0-alpha3-windows-fork] - 2025-08-15

### 🚀 Added
- Built-in style support for easier usage
  - `--style default` - Classic PupCaps style with purple highlighting
  - `--style tiktok-modern` - Modern TikTok-style captions with yellow highlighting
- Comprehensive error handling and validation for timecode parsing
- Better error messages with detailed debugging information

### 🐛 Fixed
- **CRITICAL**: Fixed Windows symlink permission errors by replacing `fs.symlinkSync()` with file copying
- **CRITICAL**: Fixed null timecode parsing errors that caused crashes when processing SRT files
- **CRITICAL**: Fixed CSS style parameter validation to support both built-in styles and file paths

### 🔧 Changed
- Replaced all symlink operations with cross-platform file copying
- Enhanced CLI parameter validation with better error messages
- Improved SRT parsing with robust error handling and warnings for malformed entries

### 🛠️ Technical Details
- Modified `src/script/work-dir.ts` to use `safeCopy()` and `copyDirectory()` methods
- Updated `src/common/timecodes.ts` with null checking and validation
- Enhanced `src/common/captions.ts` with try-catch blocks and error logging
- Improved `src/script/cli.ts` with built-in style resolution

### 📦 Requirements
- Node.js (any recent version)
- Installation only through GitHub repository cloning (NPM not supported)

### 🔥 Breaking Changes
- This fork is not compatible with NPM installation
- Must be installed via `git clone` and `npm install`

---

## Windows Compatibility Notes

This fork specifically addresses Windows compatibility issues that were present in the original PupCaps:

1. **No Administrator Rights Required**: File copying replaces symlinks
2. **Robust SRT Parsing**: Handles malformed subtitle files gracefully
3. **Built-in Styles**: No need to create CSS files for common use cases
4. **Better Error Handling**: Clear error messages for debugging

### Migration from Original PupCaps

If you're migrating from the original PupCaps:

1. Uninstall the original: `npm uninstall -g pupcaps`
2. Clone this fork: `git clone https://github.com/ring-rong/pupcaps-fork.git`
3. Install: `cd pupcaps-fork && npm install && npm run build && npm i -g .`
4. Use built-in styles: `pupcaps video.srt --style tiktok-modern`