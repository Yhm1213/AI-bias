export interface WordItem {
    word: string;
    freq: number;
}

export interface GDPGroup {
    id: string; // e.g., "GDP1"
    label: string;
    femaleWords: WordItem[];
    maleWords: WordItem[];
    color: string;
}

export interface ParsedData {
    groups: GDPGroup[];
}

// Internal types for the graph nodes
export interface NodeData {
    id: string;
    type: 'root' | 'word';
    side?: 'left' | 'right'; // left = female, right = male
    text: string;
    size: number;
    groupIndex: number;
    color: string;
    x?: number;
    y?: number;
    originalFreq?: number;
    index?: number; // Added for animation timing
    rotation?: number; // Added for radial text alignment
}

export interface LinkData {
    source: NodeData;
    target: NodeData;
    groupIndex: number;
    color: string;
}
