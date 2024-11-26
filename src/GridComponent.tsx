import {Devvit} from '@devvit/public-api';
import { LetterGrid } from './BlockGenerationUtils.js';


interface GridProps {
    grid: LetterGrid; 
    onCellClick: (row: number, col: number) => void;
}

export const GridComponent = ({ grid, onCellClick }: GridProps) => {
    return (
        <vstack>
            {grid.map((row, rowIndex) => (
                <hstack>
                    {row.map((_, colIndex) => (
                        <button
                            onPress={() => onCellClick(rowIndex, colIndex)}
                            size="small"
                        >
                          {grid[rowIndex][colIndex]}
                        </button>
                    ))}
                </hstack>
            ))}
        </vstack>
    );
};