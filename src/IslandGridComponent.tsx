import { Devvit } from '@devvit/public-api';
import { Vertex } from "./BlockGenerationUtils.js";

interface IslandGridProps {
    gridSize: number;
    islandVertices: Vertex[];
}

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
                            <hstack backgroundColor="blue" width="16px" height="16px" alignment="middle">
                                {rowIndex === firstVertex[0] && colIndex === firstVertex[1] ? <icon name="conversion" size="xsmall" /> : ''}
                            </hstack>
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