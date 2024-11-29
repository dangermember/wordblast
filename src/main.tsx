// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { CellProps, GridComponent } from './GridComponent.js';
import { IslandGridComponent } from './IslandGridComponent.js';
import { generateGrid, analyzeGrid, generateLetterGrid, IslandData, LetterGrid } from './BlockGenerationUtils.js';
import { groupWordsByLength, selectWordsBySizes } from './WordGenerationUtils.js';
import Settings from './settings.js';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Word Blast',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'My devvit post',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading ...</text>
        </vstack>
      ),
    });
    ui.showToast({ text: 'Created post!' });
  },
});
const connectVerticies = () => {

};
// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'regular',
  render: (_context) => {
    const GridToCells = (grid: LetterGrid): CellProps[][] => grid.map((row, rowIndex) => row.map((_, colIndex) => ({
      letter: grid[rowIndex][colIndex],
      x: rowIndex,
      y: colIndex,
      startColor: Settings.GridCellStartBackGroundColor,
      endColor: Settings.GridCellEndBackGroundColor,
      startHighlightColor: Settings.GridCellHeighlightStartBackGroundColor,
      endHighlightColor: Settings.GridCellHeighlightEndBackGroundColor,
      solved: false
    })))
    const SetSolved = (cell: CellProps) => setCells((oldCells) => oldCells.map((row) => row.map((oldCell) => ({ ...oldCell, solved: oldCell.x == cell.x && oldCell.y == cell.y }))))
    const groupedWords = groupWordsByLength(["apple", "banana", "cherry", "date", "egg", "fig", "grape", "Desktop", "Toy", "Hen", "Paper", "Chair", "Bear", "Egg", "Cat", "Rat", "Chick"]);
    const [currentIsland, setCurrentIsland] = useState<IslandData | null>(null);
    // Example usage: block generation
    const [grid, _setGrid] = useState(generateGrid(Settings.GridSize));
    const [islands, _setIslands] = useState(analyzeGrid(grid));
    const [sizes, _setSizes] = useState(islands.map(i => i.size));
    const [selectedWords, _setSelectedWords] = useState(selectWordsBySizes(groupedWords, sizes));
    const [letterGrid, _setLetterGrid] = useState(generateLetterGrid(grid, islands, selectedWords));
    const [cells, setCells] = useState(GridToCells(letterGrid));
    
    
    //console.log("\nIsland Data:");
    // islands.forEach((island) => {
    //   console.log(`Island ${island.index}: Size = ${island.size}, Vertices = ${JSON.stringify(island.vertices)}`);
    // });
    //console.log("Generated Grid:");
    //console.log(grid.map(row => row.join(' ')).join('\n'));
    // Output the map
    //console.log("Grouped Words by Length:");
    /*for (const [length, words] of groupedWords.entries()) {
      console.log(`Length ${length}: ${words}`);
    }*/



    //console.log("Generated Letter Grid:");
    //console.log(letterGrid.map(row => row.join(" ")).join("\n"));

    //console.log(JSON.stringify(letterGrid));
    //console.log(JSON.stringify(islands));

    return (
      <vstack alignment='center middle' height='100%' gap='large' backgroundColor={Settings.MainBackGround}>
        <GridComponent Cells={cells} onCellClick={(Cell) => SetSolved(Cell)} />
        <hstack gap='small' backgroundColor={Settings.IslandsBackGround} padding="small">
          {islands.map((island) => <IslandGridComponent onClick={() => setCurrentIsland(island)} isHighlighted={currentIsland?.index === island.index} gridSize={5} islandVertices={island.vertices} />)}
        </hstack>
      </vstack>
    );
  },
});

export default Devvit;
