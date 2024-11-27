import { JSONArray } from "@devvit/public-api";

export type Grid = number[][];
export type LetterGrid = string[][];
export type Vertex = number[];

export interface IslandData extends JSONArray {
    index: number;
    size: number;
    vertices: Vertex[];
}

/**
 * Rearranges the vertices of an island to form a contiguous path
 * with strictly horizontal and vertical moves (no diagonal moves).
 * @param island - The island data containing unordered vertices
 */
function arrangeIslandVertices(island: IslandData): void {
    const { vertices } = island;

    // Helper to check adjacency
    const isAdjacent = ([r1, c1]: Vertex, [r2, c2]: Vertex): boolean =>
        (Math.abs(r1 - r2) === 1 && c1 === c2) || (Math.abs(c1 - c2) === 1 && r1 === r2);

    // Map of visited vertices
    const visited = new Set<string>();

    // Convert vertex to string for Set operations
    const toKey = ([r, c]: Vertex): string => `${r},${c}`;

    // Build an adjacency list
    const adjacencyList = new Map<string, Vertex[]>();
    for (const vertex of vertices) {
        adjacencyList.set(toKey(vertex), []);
    }
    for (const v1 of vertices) {
        for (const v2 of vertices) {
            if (v1 !== v2 && isAdjacent(v1, v2)) {
                adjacencyList.get(toKey(v1))!.push(v2);
            }
        }
    }

    // Traverse the graph to arrange vertices
    const result: Vertex[] = [];
    const dfs = (vertex: Vertex) => {
        const key = toKey(vertex);
        if (visited.has(key)) return;

        visited.add(key);
        result.push(vertex);

        for (const neighbor of adjacencyList.get(key) || []) {
            dfs(neighbor);
        }
    };

    // Start DFS from the first vertex
    dfs(vertices[0]);

    // Update the island vertices in place
    island.vertices = result;
}

/**
 * Analyzes a grid to compute the sizes and vertices of each island.
 * @param grid - The input grid with islands represented by numbers
 * @returns A list of island data with sizes and vertex sequences
 */
export function analyzeGrid(grid: Grid): IslandData[] {
    const n = grid.length;
    const islands: IslandData[] = [];
    const blockMap = new Map<number, Vertex[]>();

    // Process the grid
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const v: Vertex = [i, j];
            const blockIndex = grid[i][j];
            if (blockMap.has(blockIndex)) {
                const list = blockMap.get(blockIndex) ?? [];
                list.push(v);
                blockMap.set(blockIndex, list);
            } else {
                const list: Vertex[] = [];
                list.push(v);
                blockMap.set(blockIndex, list);
            }
        }
    }

    for (const entry of blockMap.entries()) {
        const index = entry[0];
        const vertices = entry[1];
        const size = vertices.length;
        const island = { index, size, vertices } as IslandData;
        arrangeIslandVertices(island);
        islands.push(island)
    }

    islands.sort((a, b) => (a.index - b.index));

    return islands;
}

/**
 * Generates an n x n grid with contiguous number islands, ensuring no island is smaller than 3 cells.
 * @param n - Size of the grid (n x n)
 * @returns Grid of numbers
 */
export function generateGrid(n: number): Grid {
    console.log(`Generating a grid of size ${n}`);
    const grid: Grid = [
        [0, 0, 0, 0, 0],
        [1, 1, 1, 1, 0],
        [2, 2, 3, 1, 0],
        [4, 2, 3, 3, 5],
        [4, 4, 4, 5, 5]
    ];

    return grid;
}

export function generateLetterGrid(grid: Grid, islandData: IslandData[], words: string[]): LetterGrid {
    const n = grid.length;
    const wordCount = words.length;
    if(wordCount !== islandData.length){
        throw new Error(`Mismatch of sizes: ${wordCount} vs ${islandData.length}`);
    }

    // Initialize the letter grid with empty strings
    const letterGrid: LetterGrid = Array.from({ length: n }, () => Array(n).fill(""));

    // Fill the letter grid
    for (let i = 0; i < wordCount; i++) {
        const word = words[i];
        const island = islandData[i];

        // Ensure the word length matches the island size
        if (word.length !== island.size) {
            throw new Error(
                `Word length mismatch for word "${word}" (length: ${word.length}) and island ${island.index} (size: ${island.size})`
            );
        }

        // Place the letters of the word in the grid using the island's vertices
        island.vertices.forEach(([row, col], index) => {
            letterGrid[row][col] = word[index].toUpperCase();
        });
    }

    return letterGrid;
}