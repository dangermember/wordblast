import { Devvit } from '@devvit/public-api';
import { Vertex } from "./BlockGenerationUtils.js";

interface IslandGridProps {
    gridSize: number;
    islandVertices: Vertex[];
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

export const IslandGridComponent = ({ gridSize, islandVertices }: IslandGridProps) => {
    const islandMap = new Set(islandVertices.map(([row, col]) => `${row},${col}`));
    const firstVertex = islandVertices[0];
    return (
        <vstack>
            {Array.from({ length: gridSize }).map((_, rowIndex) => (
                <hstack>
                    {Array.from({ length: gridSize }).map((_, colIndex) => {
                        const isIslandCell = islandMap.has(`${rowIndex},${colIndex}`);
                        return isIslandCell ? (
                            <zstack backgroundColor="blue" width="16px" height="16px" alignment="middle center">
                                <image imageHeight="16px" imageWidth="16px" width="16px" height='16px' url={`data:image/svg+xml,
                                ${imageFromColors()}
                                `} />
                                {rowIndex === firstVertex[0] && colIndex === firstVertex[1] ? <icon name="conversion" size="xsmall" /> : ''}
                            </zstack>
                        ) : (
                            <hstack width="16px" height="16px">
                            </hstack>
                        );
                    })}
                </hstack>
            ))}
        </vstack>
    );
};