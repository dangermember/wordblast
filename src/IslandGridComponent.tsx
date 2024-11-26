import {Devvit} from '@devvit/public-api';
import { Vertex } from "./BlockGenerationUtils.js";

interface IslandGridProps {
    gridSize: number;
    islandVertices: Vertex[];
}

export const IslandGridComponent = ({ gridSize, islandVertices }: IslandGridProps) => {
    const islandMap = new Set(islandVertices.map(([row, col]) => `${row},${col}`));

    return (
        <vstack>
            {Array.from({ length: gridSize }).map((_, rowIndex) => (
                <hstack>
                    {Array.from({ length: gridSize }).map((_, colIndex) => {
                        const isIslandCell = islandMap.has(`${rowIndex},${colIndex}`);
                        return isIslandCell ? (
                            <hstack backgroundColor="blue" padding="small">
                           <text>
                                {` `}
                            </text>
                            </hstack>
                        ) : (
                            <hstack padding="small" height={1}>
                           <text>
                                {` `}
                            </text>
                            </hstack>
                        );
                    })}
                </hstack>
            ))}
        </vstack>
    );
};