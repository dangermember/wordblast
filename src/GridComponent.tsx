import { Devvit, JSONObject } from '@devvit/public-api';
import Settings from './settings.js';

interface GridProps {
    Cells: CellProps[][];
    onCellClick: (Cell: CellProps) => void;
}
interface GridCellProps {
    Cell: CellProps;
    onCellClick: (Cell: CellProps) => void;
}

export interface CellProps extends JSONObject {
    letter: string;
    x: number;
    y: number;
    startColor: string;
    endColor: string;
    startHighlightColor: string;
    endHighlightColor: string;
    solved: boolean
}

const GridCell = ({ Cell, onCellClick }: GridCellProps) => {
    return <zstack alignment="center middle">
        <image imageWidth={50} imageHeight={50} width="40px" height="40px" onPress={() => onCellClick(Cell)} url={`data:image/svg+xml,
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 50 50">
    <!-- Gradient Definition -->
        <defs>
            <linearGradient id="blockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:${Cell.solved ? Cell.startColor : Cell.startHighlightColor};stop-opacity:1" />
                <stop offset="100%" style="stop-color:${Cell.solved ? Cell.endColor : Cell.endHighlightColor};stop-opacity:1" />
            </linearGradient>
        </defs>
        <!-- Square Block -->
        <rect x="5" y="5" width="40" height="40" rx="5" ry="5" fill="url(#blockGradient)" stroke="#333" stroke-width="2" />
        <text x="50%" y="75%" dominant-baseline="auto" text-anchor="middle" font-size="35" fill="${Settings.GridTextColor}">${Cell.letter}</text>
    </svg>
    `}
        />
    </zstack>;
}

export const GridComponent = ({ Cells, onCellClick }: GridProps) => {
    return (
        <vstack backgroundColor={Settings.GridBackGround} padding="small">
            {Cells && Cells.map((row) => (
                <hstack>
                    {row.map((Cell) => (
                        <GridCell Cell={Cell} onCellClick={onCellClick} />
                    ))}
                </hstack>
            ))}
        </vstack>
    );
};