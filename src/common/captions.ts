import {toMillis} from './timecodes';

const indexLinePattern = /^\d+$/;
const timecodesLinePattern = /^(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})$/;
const highlightedWordPattern = /^\[(.+)](?:\((\w+)\))?$/;

export interface Word {
    rawWord: string;
    isHighlighted: boolean;
    isBeforeHighlighted: boolean;
    isAfterHighlighted: boolean;
    highlightClass?: string;
}

export interface Caption {
    index: number;
    startTimeMs: number;
    endTimeMs: number;
    words: Word[];
}

/**
 * Groups captions with same words into groups.
 * @param captions captions
 * @returns groups of captions with same words
 */
export function captionGroups(captions: Caption[]): Caption[][] {
    const groups: Caption[][] = [];
    let lastCaption: Caption | null = null;
    let lastGroup: Caption[] = [];

    for (const caption of captions) {
        if (lastCaption && !haveSameWords(caption, lastCaption!)) {
            groups.push(lastGroup);
            lastGroup = [];
        }

        lastGroup.push(caption);
        lastCaption = caption;
    }

    if (lastGroup.length) {
        groups.push(lastGroup);
    }

    return groups;
}

export function haveSameWords(caption1: Caption, caption2: Caption): boolean {
    if (caption1.words.length != caption2.words.length) {
        return false;
    }

    for (let i =0; i < caption1.words.length; i++) {
        if (caption1.words[i].rawWord != caption2.words[i].rawWord) {
            return false;
        }
    }

    return true;
}

export function readCaptions(srtContent: string): Caption[] {
    const lines = srtContent.split('\n');
    const captions: Caption[] = [];

    let index: number = 0;
    let timecodesStart: string | null = null;
    let timecodesEnd: string | null = null;

    for (const line of lines) {
        let match;
        if ((match = line.match(indexLinePattern))) {
            index = Number(line);
        } else if ((match = line.match(timecodesLinePattern))) {
            timecodesStart = match[1];
            timecodesEnd = match[2];
        } else if (line.length) {
            if (!timecodesStart || !timecodesEnd) {
                console.warn(`Skipping caption at index ${index}: Missing timecodes. Line: "${line}"`);
                continue;
            }

            try {
                const start = toMillis(timecodesStart);
                const end = toMillis(timecodesEnd);

                const words = readWords(line);

                captions.push({
                    index,
                    words,
                    startTimeMs: start,
                    endTimeMs: end,
                });
            } catch (error) {
                console.error(`Error parsing timecodes for caption ${index}: ${error instanceof Error ? error.message : String(error)}`);
                console.warn(`Skipping caption. Start: "${timecodesStart}", End: "${timecodesEnd}", Line: "${line}"`);
            }
        }
    }

    return captions;
}

export function readWords(text: string): Word[] {
    const words = splitText(text);
    const highlightedIndex = words.findIndex(word => word.match(highlightedWordPattern));

    const res: Word[] = [];

    for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const match = word.match(highlightedWordPattern);
        const rawWord = match ? match[1] : word;
        const highlightClass = match && match[2] ? match[2] : null;

        const isHighlighted = Boolean(match);
        const isBeforeHighlighted = Boolean(~highlightedIndex && !isHighlighted && i < highlightedIndex);
        const isAfterHighlighted = Boolean(~highlightedIndex && !isHighlighted && i > highlightedIndex);

        const wordObject: Word = {
            rawWord,
            isHighlighted,
            isBeforeHighlighted,
            isAfterHighlighted,
        };

        if (highlightClass) {
            wordObject.highlightClass = highlightClass;
        }

        res.push(wordObject);
    }

    return res;
}

export function splitText(text: string): string[] {
    const words: string[] = [];

    let currentWord = '';
    let isCurrentHighlighted = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const isWhitespace = /^\s$/.test(char);
        const isPunctuation = /[,.!?]/.test(char);

        if (!isWhitespace) {
            if (!isPunctuation) {
                currentWord += char;
                switch (char) {
                    case '[':
                    case '(':
                        isCurrentHighlighted = true;
                        break;
                    case ']':
                    case ')':
                        isCurrentHighlighted = false;
                        break;
                }
            } else {
                if (currentWord) {
                    currentWord += char;
                } else {
                    // Attach punctuation mark to the previous word
                    words[words.length - 1] += ' ' + char;
                }
            }
        } else {
            // char is a whitespace
            if (isCurrentHighlighted) {
                currentWord += char;
            } else if (currentWord) {
                words.push(currentWord);
                currentWord = '';
            }
        }
    }

    if (currentWord) {
        words.push(currentWord);
    }

    return words;
}