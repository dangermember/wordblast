import { Devvit } from '@devvit/public-api';
import { LetterGrid } from './BlockGenerationUtils.js';
import Settings from './settings.js';

interface GridProps {
    grid: LetterGrid;
    onCellClick: (Cell: CellProps) => void;
}

interface CellProps {
    letter: string;
    x: number,
    y: number
    onClick: (Cell: CellProps) => void;
    startColor?: string;
    endColor?: string;
    solved?: boolean
}

const GridCell = (Cell: CellProps) => {
    const startColor = Cell.startColor ? Cell.startColor : Settings.GridCellStartBackGroundColor;
    const endColor = Cell.endColor ? Cell.endColor : Settings.GridCellEndBackGroundColor;
    return <zstack alignment="center middle">
        <image imageWidth={50} imageHeight={50} width="40px" height="40px" onPress={() => Cell.onClick(Cell)} url={`data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <!-- Gradient Definition -->
    <defs>
        <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${Cell.solved ? startColor : endColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:${Cell.solved ? endColor : startColor};stop-opacity:1" />
        </linearGradient>
    </defs>
    <!-- Square Block -->
    <rect x="5" y="5" width="40" height="40" rx="5" ry="5" fill="url(#blockGradient)" stroke="#333" stroke-width="2" />
    </svg>
    `}
        />
        <text color="black" weight="bold">{Cell.letter}</text>
    </zstack>;
}

export const GridComponent = ({ grid, onCellClick }: GridProps) => {
    return (
        <vstack backgroundColor={Settings.GridBackGround} padding="small">
            {grid.map((row, rowIndex) => (
                <hstack>
                    {row.map((_, colIndex) => (
                        <GridCell letter={grid[rowIndex][colIndex]} x={rowIndex} y={colIndex} onClick={(cell) => onCellClick(cell)} />
                    ))}
                </hstack>
            ))}
        </vstack>
    );
};