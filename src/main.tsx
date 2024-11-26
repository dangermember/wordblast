// Learn more at developers.reddit.com/docs
import { Devvit } from '@devvit/public-api';
import { GridComponent } from './GridComponent.js';
import { IslandGridComponent } from './IslandGridComponent.js';

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

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'regular',
  render: (_context) => {
    const letterGrid = [["D","E","S","K","T"],["A","P","P","L","O"],["R","A","F","E","P"],["D","T","I","G","E"],["A","T","E","G","G"]];
    const islands = [{"index":0,"size":7,"vertices":[[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4]]},{"index":1,"size":5,"vertices":[[1,0],[1,1],[1,2],[1,3],[2,3]]},{"index":2,"size":3,"vertices":[[2,0],[2,1],[3,1]]},{"index":3,"size":3,"vertices":[[2,2],[3,2],[3,3]]},{"index":4,"size":4,"vertices":[[3,0],[4,0],[4,1],[4,2]]},{"index":5,"size":3,"vertices":[[3,4],[4,4],[4,3]]}];

    return (
      <vstack alignment='center middle' height='100%' gap='large'>
        <GridComponent grid={letterGrid} onCellClick={(i, j) => console.log(`Cell[${i}][${j}] clicked`)} />
        <hstack>
          <button icon="back" />
          <IslandGridComponent gridSize={5} islandVertices={islands[4].vertices} />
          <button icon="forward" />
        </hstack>
      </vstack>
    );
  },
});

export default Devvit;
