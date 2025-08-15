export class Timecode {
    public readonly hours: number;
    public readonly minutes: number;
    public readonly seconds: number;
    public readonly millis: number;

    constructor(millis: number) {
        this.millis = millis % 1000;

        this.hours = Math.floor(millis / 3_600_000);
        const remainingMillisAfterHours = millis % 3_600_000;
        this.minutes = Math.floor(remainingMillisAfterHours / 60_000);
        const remainingMillisAfterMinutes = remainingMillisAfterHours % 60_000;
        this.seconds = Math.floor(remainingMillisAfterMinutes / 1000);
    }

    public get hh(): string {
        return String(this.hours).padStart(2, '0');
    }

    public get mm(): string {
        return String(this.minutes).padStart(2, '0');
    }

    public get ss(): string {
        return String(this.seconds).padStart(2, '0');
    }
    public get SSS(): string {
        return String(this.millis).padStart(3, '0');
    }

    public get asString(): string {
        return `${this.hh}:${this.mm}:${this.ss},${this.SSS}`;
    }
}

export function toMillis(timecodes: string | null): number {
    if (!timecodes) {
        throw new Error('Timecode is null or undefined');
    }
    
    const parts = timecodes.split(/[:,]/).map(Number);

    if (parts.length !== 4) {
        throw new Error(`Invalid timecode format: ${timecodes}. Expected format: HH:MM:SS,mmm`);
    }

    const hours = parts[0];
    const minutes = parts[1];
    const seconds = parts[2];
    const milliseconds = parts[3];

    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || isNaN(milliseconds)) {
        throw new Error(`Invalid timecode values: ${timecodes}. All parts must be numbers.`);
    }

    return hours * 3_600_000    // hours to millis
        + minutes * 60_000      // minutes to millis
        + seconds * 1000        // second to millis
        + milliseconds;
}