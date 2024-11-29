// Learn more at developers.reddit.com/docs
import { Devvit, useState } from '@devvit/public-api';
import { GridComponent } from './GridComponent.js';
import { IslandGridComponent } from './IslandGridComponent.js';
import { generateGrid, analyzeGrid, generateLetterGrid, IslandData } from './BlockGenerationUtils.js';
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
    const groupedWords = groupWordsByLength(["apple", "banana", "cherry", "date", "egg", "fig", "grape", "Desktop", "Toy", "Hen", "Paper", "Chair", "Bear", "Egg", "Cat", "Rat", "Chick"]);

    // Example usage: block generation
    const [currentIsland, setCurrentIsland] = useState<IslandData|null>(null);
    const [grid, _setGrid] = useState(generateGrid(Settings.GridSize));
    //console.log("Generated Grid:");
    //console.log(grid.map(row => row.join(' ')).join('\n'));
    const [islands, _setIslands] = useState(analyzeGrid(grid));
    //console.log("\nIsland Data:");
    islands.forEach((island) => {
      console.log(`Island ${island.index}: Size = ${island.size}, Vertices = ${JSON.stringify(island.vertices)}`);
    });


    // Output the map
    //console.log("Grouped Words by Length:");
    /*for (const [length, words] of groupedWords.entries()) {
      console.log(`Length ${length}: ${words}`);
    }*/

    const [sizes, _setSizes] = useState(islands.map(i => i.size));
    const [selectedWords, _setSelectedWords] = useState(selectWordsBySizes(groupedWords, sizes));

    const [letterGrid, _setLetterGrid] = useState(generateLetterGrid(grid, islands, selectedWords));

    //console.log("Generated Letter Grid:");
    //console.log(letterGrid.map(row => row.join(" ")).join("\n"));

    //console.log(JSON.stringify(letterGrid));
    //console.log(JSON.stringify(islands));

    return (
      <vstack alignment='center middle' height='100%' gap='large' backgroundColor={Settings.MainBackGround}>
        <GridComponent grid={letterGrid} onCellClick={(i, j) => currentIsland?.vertices[0][0] == i && currentIsland?.vertices[0][1] == j} />
        <hstack gap='small' backgroundColor={Settings.IslandsBackGround} padding="small">
          {/* <button icon="back" /> */}
          {islands.map((island) => <IslandGridComponent onClick={() => setCurrentIsland(island)} isHighlighted={currentIsland === island} gridSize={5} islandVertices={island.vertices} />)}
          {/* <button icon="forward" /> */}
        </hstack>
      </vstack>
    );
  },
});

export default Devvit;
