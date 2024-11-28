import { JSONArray } from "@devvit/public-api";

export type Grid = number[][];
export type LetterGrid = string[][];
export type Vertex = number[];

export interface IslandData extends JSONArray {
    index: number;
    size: number;
    vertices: Vertex[];
}

function getUnvisitedNeighbors(
    row: number,
    col: number,
    n: number,
    visited: Set<string>
): Vertex[] {
    const directions: Vertex[] = [
        [0, 1],  // Right
        [1, 0],  // Down
        [0, -1], // Left
        [-1, 0], // Up
    ];

    return directions
        .map(([dr, dc]) => [row + dr, col + dc] as Vertex)
        .filter(
            ([nr, nc]) =>
                nr >= 0 &&
                nr < n &&
                nc >= 0 &&
                nc < n &&
                !visited.has(`${nr},${nc}`)
        );
}

function randomWalkContinuous(n: number): Vertex[] {
    const path: Vertex[] = [];
    const visited: Set<string> = new Set();

    // Start at the top-left corner
    const start: Vertex = [0, 0];
    let current = start;

    visited.add(`${current[0]},${current[1]}`);
    path.push(current);

    while (path.length < n * n) {
        const neighbors = getUnvisitedNeighbors(current[0], current[1], n, visited);

        if (neighbors.length === 0) {
            // Backtrack if no neighbors are available
            return []; // Return an empty array if the walk cannot complete
        }

        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        visited.add(`${next[0]},${next[1]}`);
        path.push(next);
        current = next;
    }

    return path;
}

function generateGridPath(n: number): { grid: Grid, path: Vertex[] } {
    let path: Vertex[] = [];
    do {
        path = randomWalkContinuous(n);
    } while (path.length === 0); // Ensure a valid walk is generated

    const grid: Grid = Array.from({ length: n }, () => Array(n).fill(-1));
    path.forEach(([row, col], step) => {
        grid[row][col] = step;
    });

    return { grid, path };
}

/**
 * Splits a continuous path into steps and updates the grid with step indices.
 * @param grid - The input grid with a continuous path (each cell has a unique order number).
 * @param path - The continuous path as an array of [row, column] vertices.
 * @param minSize - Minimum size of each segment.
 * @param maxSize - Maximum size of each segment.
 * @returns The updated grid with cells replaced by step indices.
 */
export function splitPathIntoSteps(
    grid: Grid,
    path: Vertex[],
    minSize: number,
    maxSize: number
): Grid {
    if (minSize < 3 || maxSize > path.length || minSize > maxSize) {
        throw new Error("Invalid step size range");
    }

    const n = grid.length;
    const stepGrid: Grid = Array.from({ length: n }, () => Array(n).fill(-1));

    let currentIndex = 0; // Step index
    let pathIndex = 0;    // Path traversal index

    while (pathIndex < path.length) {
        // Randomly determine the size of the next segment
        const remaining = path.length - pathIndex;
        const segmentSize = Math.min(
            Math.floor(Math.random() * (maxSize - minSize + 1)) + minSize,
            remaining
        );

        // Assign step index to the current segment
        for (let i = 0; i < segmentSize; i++) {
            const [row, col] = path[pathIndex];
            stepGrid[row][col] = currentIndex;
            pathIndex++;
        }

        currentIndex++; // Increment the step index
    }

    return stepGrid;
}

/**
 * Generates an n x n grid with contiguous number islands, ensuring no island is smaller than 3 cells.
 * @param n - Size of the grid (n x n)
 * @returns Grid of numbers
 */
export function generateGridUsingRandomWalk(n: number, minSize = 3, maxSize = 7): Grid {
    console.log(`Generating a grid of size ${n}`);
    const { path, grid } = generateGridPath(n);
    return splitPathIntoSteps(grid, path, minSize, maxSize);
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