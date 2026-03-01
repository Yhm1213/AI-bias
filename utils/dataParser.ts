import { WordItem } from '../types';

// Robust CSV Parser that handles newlines inside quotes
function parseRawCSV(text: string): string[][] {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentCell = '';
    let inQuote = false;

    // Clean up input slightly to normalize line endings
    const cleanText = text.replace(/\r\n/g, '\n');

    for (let i = 0; i < cleanText.length; i++) {
        const char = cleanText[i];
        const nextChar = cleanText[i + 1];

        if (char === '"') {
            // Handle escaped quotes ("") if any, though raw data seems simple
            if (inQuote && nextChar === '"') {
                currentCell += '"';
                i++; // skip next quote
            } else {
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            // End of cell
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if (char === '\n' && !inQuote) {
            // End of row
            currentRow.push(currentCell.trim());
            // Only add non-empty rows (ignoring rows that are just separators if desired, but better to keep structure)
            // Check if row has any content
            if (currentRow.some(c => c.length > 0)) {
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
        } else {
            currentCell += char;
        }
    }

    // Push last row
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(c => c.length > 0)) {
            rows.push(currentRow);
        }
    }

    return rows;
}

export function parseCSVData(raw: string, type: 'Male' | 'Female'): { id: string; words: WordItem[] }[] {
    const parsedRows = parseRawCSV(raw);

    // Initialize groups
    const groups: { id: string; words: WordItem[] }[] = [];
    for (let i = 1; i <= 5; i++) {
        groups.push({ id: `GDP${i}`, words: [] });
    }

    // Find the subheader row containing "Word" and "Freq"
    // It should be one of the first few rows
    let dataStartIndex = -1;

    for (let i = 0; i < parsedRows.length; i++) {
        const row = parsedRows[i];
        // Check if this row looks like the header "Word, Freq, Word, Freq..."
        // We check if at least 2 columns contain "Word" or "Freq"
        const matchCount = row.filter(c => {
            const v = c.toLowerCase().replace(/[\n\r"]/g, '').trim();
            return v === 'word' || v.includes('freq');
        }).length;

        if (matchCount >= 2) {
            dataStartIndex = i + 1;
            break;
        }
    }

    if (dataStartIndex === -1) {
        console.warn(`Could not find data headers for ${type}`);
        return groups;
    }

    // Iterate data rows
    for (let i = dataStartIndex; i < parsedRows.length; i++) {
        const row = parsedRows[i];

        // We expect 5 groups, each takes 2 columns (Word, Freq)
        // Group 0: cols 0, 1
        // Group 1: cols 2, 3
        // ...
        for (let g = 0; g < 5; g++) {
            const wordColIdx = g * 2;
            const freqColIdx = g * 2 + 1;

            if (row.length > freqColIdx) {
                let word = row[wordColIdx];
                let freqStr = row[freqColIdx];

                // Clean values (remove inner newlines if the parser kept them from quoted strings)
                word = word.replace(/[\n\r]/g, '').trim();
                freqStr = freqStr.replace(/[\n\r]/g, '').trim();

                if (word && freqStr) {
                    const freq = Number(freqStr);
                    if (!isNaN(freq) && word.toLowerCase() !== 'word' && word.toLowerCase() !== 'freq') {
                        groups[g].words.push({ word, freq });
                    }
                }
            }
        }
    }

    // Post-process: sort and limit
    groups.forEach(g => {
        g.words.sort((a, b) => b.freq - a.freq);
        g.words = g.words.slice(0, 30);
    });

    return groups;
}
