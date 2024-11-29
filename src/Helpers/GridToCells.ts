import CellProps from "../Interfaces/CellProps.js";
import Settings from "../settings.js";
import LetterGrid from "../Types/LetterGrid.js";

const GridToCells = (grid: LetterGrid): CellProps[][] =>
  grid.map((row, rowIndex) =>
    row.map((_, colIndex) => ({
      letter: grid[rowIndex][colIndex],
      x: rowIndex,
      y: colIndex,
      startColor: Settings.GridCellStartBackGroundColor,
      endColor: Settings.GridCellEndBackGroundColor,
      startHighlightColor: Settings.GridCellHeighlightStartBackGroundColor,
      endHighlightColor: Settings.GridCellHeighlightEndBackGroundColor,
      solved: false,
    }))
  );

export default GridToCells;
