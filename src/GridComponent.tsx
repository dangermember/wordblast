import { Devvit } from '@devvit/public-api';
import { LetterGrid } from './BlockGenerationUtils.js';

interface GridProps {
    grid: LetterGrid;
    onCellClick: (row: number, col: number) => void;
}

interface CellProps {
    letter: string;
    x: number,
    y: number
    onClick: (row: number, col: number) => void;
    startColor?: string;
    endColor?: string;
}

const GridCell = ({ letter, startColor = "#FF5733", endColor = "#FFC300", x, y, onClick }: CellProps) => {
    return <zstack alignment="center middle">
        <image imageWidth={50} imageHeight={50} width="40px" height="40px" onPress={() => onClick(x, y)} url={`data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <!-- Gradient Definition -->
    <defs>
        <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${startColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${endColor};stop-opacity:1" />
        </linearGradient>
    </defs>
    <!-- Square Block -->
    <rect x="5" y="5" width="40" height="40" rx="5" ry="5" fill="url(#blockGradient)" stroke="#333"
        stroke-width="2" />
    </svg>
    `}
        />
        <text color="black" weight="bold">{letter}</text>
    </zstack>;
}

export const GridComponent = ({ grid, onCellClick }: GridProps) => {
    return (
        <vstack>
            {grid.map((row, rowIndex) => (
                <hstack>
                    {row.map((_, colIndex) => (
                        <GridCell letter={grid[rowIndex][colIndex]} x={rowIndex} y={colIndex} onClick={() => onCellClick(rowIndex, colIndex)} />
                    ))}
                </hstack>
            ))}
        </vstack>
    );
};