// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { GridComponent } from './GridComponent.js';
import { IslandGridComponent } from './IslandGridComponent.js';
import { generateGrid, analyzeGrid, generateLetterGrid } from './Helpers/BlockGenerationUtils.js';
import { selectWordsBySizes } from './WordGenerationUtils.js';
import Settings from './settings.js';
import { IslandData } from './Interfaces/IslandData.js';
import CellProps from './Interfaces/CellProps.js';
import GridToCells from './Helpers/GridToCells.js';

Devvit.configure({
  redditAPI: true,
});

// Add a menu item to the subreddit menu for instantiating the new experience post
Devvit.addMenuItem({
  label: 'Word Blast',
  location: 'subreddit',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'Word Blast',
      subredditName: subreddit.name,
      // The preview appears while the post loads
      preview: (
        <vstack height="100%" width="100%" alignment="middle center" backgroundColor={Settings.GameBackGround}>
          <text color={Settings.GameTextColor} size="large">Waiting For the fun to begin!</text>
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
  name: 'WordBlast',
  height: 'tall',
  render: (_context) => {
    const [currentIsland, setCurrentIsland] = useState<IslandData | null>(null);
    // Example usage: block generation
    const [grid, setGrid] = useState(generateGrid(Settings.GridSize));
    const [islands, setIslands] = useState(analyzeGrid(grid));
    const [sizes, setSizes] = useState(islands.map(i => i.size));
    const [selectedWords, setSelectedWords] = useState(selectWordsBySizes(sizes));
    const [completedWordsCount, setCompletedWordsCount] = useState(0);
    const [letterGrid, setLetterGrid] = useState(generateLetterGrid(grid, islands, selectedWords));
    const [cells, setCells] = useState(GridToCells(letterGrid));
    const SetSolved = (cell: CellProps) => {
      let isFirstCell = cell.x == currentIsland?.vertices[0][0] && cell.y == currentIsland?.vertices[0][1]
      if (isFirstCell) {
        let newcells = cells;
        if (currentIsland?.vertices) {
          for (let [x, y] of currentIsland?.vertices) {
            newcells[x][y].solved = true;
          }
          setCells(newcells)
          setCompletedWordsCount(old => old + 1)
        }
      }
    }
    //console.log("grid",JSON.stringify(grid));
    const resetGame = () => {
      let newGrid, newIslands, newSizes, newSelectedWords, newLetterGrid, newCells;
      newGrid = generateGrid(Settings.GridSize);
      //console.log("grid",JSON.stringify(grid));
      newIslands = analyzeGrid(newGrid);
      newSizes = newIslands.map(i => i.size);
      //console.log("newSizes",newSizes)
      newSelectedWords = selectWordsBySizes(newSizes);
      //console.log("newSelectedWords",newSelectedWords)
      newLetterGrid = generateLetterGrid(newGrid, newIslands, newSelectedWords);
      newCells = GridToCells(newLetterGrid);
      setGrid(newGrid)
      setIslands(newIslands)
      setSizes(newSizes)
      setSelectedWords(newSelectedWords)
      setLetterGrid(newLetterGrid)
      setCells(newCells)
      setCompletedWordsCount(0)
      setCurrentIsland(null)
    }

    //console.log("\nIsland Data:");
    // islands.forEach((island) => {
    //   console.log(`Island ${island.index}: Size = ${island.size}, Vertices = ${JSON.stringify(island.vertices)}`);
    // });
    //console.log("Generated Grid:");
    //console.log(grid.map(row => row.join(' ')).join('\n'));
    // Output the map
    //console.log("Grouped Words by Length:");
    /*for (const [length, words] of groupedWords.entries()) {
      //console.log(`Length ${length}: ${words}`);
    }*/



    //console.log("Generated Letter Grid:");
    //console.log(letterGrid.map(row => row.join(" ")).join("\n"));

    //console.log(JSON.stringify(letterGrid));
    //console.log(JSON.stringify(islands));

    return (
      <vstack alignment='center middle' height='100%' gap='large' backgroundColor={Settings.GameBackGround}>
        <hstack alignment='center middle' gap="medium"> <button
          appearance='success'
          onPress={() => resetGame()}
        >
          New Game
        </button> <text size="medium" color={Settings.GameTextColor}>Found Words {completedWordsCount} / {selectedWords.length}</text></hstack>
        <GridComponent Cells={cells} onCellClick={(Cell) => SetSolved(Cell)} />
        <hstack gap='small' backgroundColor={Settings.IslandsBackGround}>
          {islands.map((island) => <IslandGridComponent onClick={() => setCurrentIsland(island)} isHighlighted={currentIsland?.index === island.index} gridSize={5} islandVertices={island.vertices} />)}
        </hstack>
      </vstack>
    );
  },
});

export default Devvit;

