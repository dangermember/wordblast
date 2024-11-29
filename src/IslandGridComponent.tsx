import { Devvit } from '@devvit/public-api';
import Settings from './settings.js';
import Vertex from './Types/Vertex.js';

interface IslandGridProps {
    gridSize: number;
    islandVertices: Vertex[];
    onClick:()=>void;
    isHighlighted:boolean;
}

function imageFromColors(startColor = '#4A90E2', endColor = '#003366') {
    return `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <!-- Gradient Definition -->
    <defs>
      <radialGradient id="blueGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
        <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
      </radialGradient>
    </defs>
    <!-- Square Block -->
    <rect x="1" y="1" width="14" height="14" rx="2" ry="2" fill="url(#blueGradient)" stroke="#001F3F" stroke-width="1" />
    </svg>
    `;
};

export const IslandGridComponent = ({ gridSize, isHighlighted: isHighlighted,islandVertices, onClick}: IslandGridProps) => {
    const islandMap = new Set(islandVertices.map(([row, col]) => `${row},${col}`));
    const firstVertex = islandVertices[0];

    // Determine the bounding box of the island
    const minRow = Math.min(...islandVertices.map(([row]) => row));
    const maxRow = Math.max(...islandVertices.map(([row]) => row));
    const minCol = Math.min(...islandVertices.map(([, col]) => col));
    const maxCol = Math.max(...islandVertices.map(([, col]) => col));

    return (
        <vstack onPress={() => onClick()} backgroundColor={isHighlighted?Settings.IslandHeighlightBackGround:Settings.IslandBackGround}>
            {Array.from({ length: maxRow - minRow + 1 }).map((_, rowIndex) => (
                <hstack>
                    {Array.from({ length: maxCol - minCol + 1 }).map((_, colIndex) => {
                        const actualRow = rowIndex + minRow;
                        const actualCol = colIndex + minCol;
                        const isIslandCell = islandMap.has(`${actualRow},${actualCol}`);
                        return isIslandCell ? (
                            <zstack
                                backgroundColor="blue"
                                width="16px"
                                height="16px"
                                alignment="middle center"
                            >
                                <image
                                    imageHeight="16px"
                                    imageWidth="16px"
                                    width="16px"
                                    height="16px"
                                    url={`data:image/svg+xml,
                              ${imageFromColors()}
                              `}
                                />
                                {actualRow === firstVertex[0] && actualCol === firstVertex[1] ? (
                                    <icon name="conversion" size="xsmall" color="white"/>
                                ) : (
                                    ''
                                )}
                            </zstack>
                        ) : (
                            <hstack width="16px" height="16px"></hstack>
                        );
                    })}
                </hstack>
            ))}
        </vstack>
    );
};
