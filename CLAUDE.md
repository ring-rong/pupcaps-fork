# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Build and Development
- `npm run build` - Build the project using Rollup (compiles TypeScript for script, player, and editor modules)
- `npm test` - Run tests using Mocha
- `npm install` - Install dependencies
- `npm i -g .` - Install the CLI globally for local development

### Running the Application
- `pupcaps <file.srt>` - Main CLI command to process SRT files and generate MOV overlay files
- `pupcaps --preview <file.srt>` - Launch preview mode in browser without generating video
- `pupcaps <file.srt> --style <custom.css>` - Use custom CSS styles
- `pupcaps <file.srt> --animate` - Enable CSS3 animations (real-time recording mode)

Common options:
- `-o, --output <file>` - Output MOV file path
- `-w, --width <number>` - Video width in pixels (default: 1080)
- `-h, --height <number>` - Video height in pixels (default: 1920)
- `-r, --fps <number>` - Frame rate 1-60 (default: 30)

## Project Architecture

### Core Components
The project has three main modules built with separate Rollup configurations:

1. **Script Module** (`src/script/`) - Node.js CLI application
   - Entry point: `src/script/index.ts`
   - CLI parsing: `src/script/cli.ts`
   - Video recording: `StepRecorder` (step-by-step) vs `RealTimeRecorder` (for animations)
   - Rendering: `StepRenderer` vs `RealTimeRenderer`
   - Puppeteer-based browser automation for caption rendering

2. **Player Module** (`src/player/`) - Browser-based caption playback
   - Entry point: `src/player/index.ts`
   - Vue 3 components for caption display
   - CSS processing for dynamic styling
   - Built as IIFE for browser usage

3. **Editor Module** (`src/editor/`) - Web-based SRT editor
   - Entry point: `src/editor/index.ts`
   - Vue 3 application with Bulma CSS framework
   - Components for editing captions, timecodes, and words
   - Built as IIFE with HTML file copied to dist

### Key Data Structures
- **Caption**: Represents a subtitle with `index`, `startTimeMs`, `endTimeMs`, and `words[]`
- **Word**: Individual word with highlighting states (`isHighlighted`, `isBeforeHighlighted`, `isAfterHighlighted`)
- Captions support karaoke-style highlighting using `[word]` syntax in SRT files

### Rendering Pipeline
1. Parse SRT file into Caption objects
2. Create temporary work directory with HTML/CSS files
3. Launch Puppeteer browser instance
4. For each caption: render HTML, take screenshot, compose video frames
5. Use FFmpeg to create final MOV overlay file

### Dependencies
- **Core**: TypeScript, Vue 3, Puppeteer, FFmpeg (fluent-ffmpeg)
- **CLI**: Commander.js, cli-progress
- **Build**: Rollup with TypeScript, Vue, and copy plugins
- **Testing**: Mocha with Chai
- **UI**: Bulma CSS framework, FontAwesome icons

## File Structure Notes
- `dist/` - Built JavaScript output for all modules
- `assets/` - Default CSS styles and HTML templates
- `test/` - Unit tests with separate tsconfig
- `docs/` - Documentation images and example files
- `pupcaps` - Executable shell script (entry point)

## Development Workflow
1. Make changes to TypeScript source files
2. Run `npm run build` to compile
3. Run `npm test` to verify functionality
4. Test CLI locally with `node dist/script/index.js <file.srt>`
5. For global testing: `npm i -g .` then use `pupcaps` command

The application creates temporary directories during processing and automatically cleans up after completion or errors.