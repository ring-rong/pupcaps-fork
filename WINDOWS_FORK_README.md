# 🪟 PupCaps Windows Fork

**Version:** 1.0.0-alpha3-windows-fork  
**Status:** ✅ Production Ready  
**Windows Compatibility:** ✅ No Admin Rights Required

## 🚀 What's Fixed

This fork resolves **ALL** critical Windows compatibility issues found in the original PupCaps:

### ✅ Fixed Issues
1. **Symlink Permission Errors** - Replaced with file copying (no admin rights needed)
2. **Null Timecode Parsing Crashes** - Added robust error handling and validation  
3. **CSS Style Parameter Issues** - Added built-in styles and better validation

### 🎯 New Features
- **Built-in Styles**: `--style tiktok-modern`, `--style default`
- **Better Error Messages**: Clear debugging information
- **Robust SRT Parsing**: Handles malformed subtitle files gracefully

## 📦 Installation

```bash
git clone https://github.com/ring-rong/pupcaps-fork.git
cd pupcaps-fork
npm install
npm run build
npm i -g .
```

## 🎬 Usage Examples

```bash
# Basic usage with built-in TikTok style
pupcaps video.srt --style tiktok-modern --width 1080 --height 1920

# Custom CSS file
pupcaps video.srt --style my-custom-style.css

# Preview mode (no video generation)
pupcaps video.srt --style tiktok-modern --preview
```

## 🛠️ Built-in Styles

- `default` - Classic purple highlighting
- `tiktok-modern` - Modern yellow highlighting with large fonts

## 📋 Requirements

- Node.js (any recent version)
- FFmpeg (auto-installed if missing)
- Windows 10/11 (tested) or any other OS

## 🆘 Migration from Original

```bash
# Remove original
npm uninstall -g pupcaps

# Install this fork
git clone https://github.com/ring-rong/pupcaps-fork.git
cd pupcaps-fork
npm install && npm run build && npm i -g .
```

## 📝 Technical Details

See [CHANGELOG.md](./CHANGELOG.md) for complete technical details of all fixes and improvements.

---

**Ready for production use in ShortMaker and other Windows projects! 🎉**