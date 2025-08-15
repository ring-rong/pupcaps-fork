import * as tmp from 'tmp';
import * as path from 'path';
import {writeFileSync, copyFileSync, rmSync, mkdirSync, readdirSync} from 'fs';
import {Caption} from '../common/captions';
import {Args} from './cli';
import {indexHtml, indexJs, nodeModules} from './assets';
import {PlayerArgs} from '../common/player-args';

export class WorkDir {
    private readonly workDir = tmp.dirSync({ template: 'pupcaps-XXXXXX' });

    constructor(private readonly captions: Caption[],
                private readonly args: Args) {
    }

    public setup(): string {
        const index = path.join(this.workDir.name, 'index.html');

        this.safeCopy(indexHtml, index);
        this.safeCopy(indexJs, path.join(this.workDir.name, 'index.js'));
        this.safeCopy(this.args.styleFile, path.join(this.workDir.name, 'captions.css'));
        this.copyDirectory(nodeModules, path.join(this.workDir.name, 'node_modules'));

        this.setupCaptions();
        this.setupPlayerArgs();
        this.setupVideoSizeCss();

        mkdirSync(this.screenShotsDir);

        return index;
    }

    public clear() {
        rmSync(this.workDir.name, { recursive: true, force: true });
    }

    public get screenShotsDir(): string {
        return path.join(this.workDir.name, 'screenshots');
    }

    public get rootDir(): string {
        return this.workDir.name;
    }

    private safeCopy(src: string, dest: string): void {
        try {
            // Create the target directory if it doesn't exist
            mkdirSync(path.dirname(dest), { recursive: true });
            
            // Copy with overwrite
            copyFileSync(src, dest);
            console.log(`Copied: ${src} → ${dest}`);
        } catch (err: any) {
            console.error(`Copy failed: ${err.message}`);
            throw new Error(`Failed to copy files from ${src} to ${dest}. Check permissions.`);
        }
    }

    private copyDirectory(src: string, dest: string): void {
        try {
            // Create the target directory
            mkdirSync(dest, { recursive: true });
            
            // Get list of files and directories
            const entries = readdirSync(src, { withFileTypes: true });
            
            for (const entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                
                if (entry.isDirectory()) {
                    this.copyDirectory(srcPath, destPath);
                } else {
                    copyFileSync(srcPath, destPath);
                }
            }
            console.log(`Directory copied: ${src} → ${dest}`);
        } catch (err: any) {
            console.error(`Directory copy failed: ${err.message}`);
            throw new Error(`Failed to copy directory from ${src} to ${dest}. Check permissions.`);
        }
    }

    private setupVideoSizeCss() {
        const css= `#video {
            width: ${this.args.videoWidth}px;
            height: ${this.args.videoHeight}px;
        }`;
        const videoSizeFile = path.join(this.workDir.name, 'video.size.css');

        writeFileSync(videoSizeFile, css);
    }

    private setupCaptions() {
        const captionsJs = 'window.captions = ' + JSON.stringify(this.captions, null, 2);
        const captionsJsFile = path.join(this.workDir.name, 'captions.js');

        writeFileSync(captionsJsFile, captionsJs);
    }

    private setupPlayerArgs() {
        const playerArgs: PlayerArgs = {
            isPreview: this.args.isPreview,
        };
        const argsJs = 'window.playerArgs = ' + JSON.stringify(playerArgs, null, 2);
        const argsJsFile = path.join(this.workDir.name, 'player.args.js');

        writeFileSync(argsJsFile, argsJs);
    }
}