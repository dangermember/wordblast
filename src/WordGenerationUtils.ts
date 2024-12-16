import Words from './Data/word.js'

/**
 * Splits a list of words into a map where the key is the word length,
 * and the value is an array of words with that length.
 * @param words - The list of words to process
 * @returns A map where keys are word lengths and values are arrays of words
 */
export function groupWordsByLength(words: string[]): Map<number, string[]> {
  const lengthMap = new Map<number, string[]>();
  //console.log("word in groupWordsByLength", words);
  for (const word of words) {
    const length = word.length;

    // Initialize the array if this length is not yet in the map
    if (!lengthMap.has(length)) {
      lengthMap.set(length, []);
    }

    // Add the word to the appropriate array
    const wordList = lengthMap.get(length) ?? [];
    wordList.push(word);
    lengthMap.set(length, wordList);
  }
  //console.log("lengthMap in groupWordsByLength", lengthMap);
  return lengthMap;
}

/**
 * Generates a list of randomly selected unique words from the map
 * that match the given list of word lengths.
 * @param lengthMap - A map where keys are word lengths and values are arrays of words
 * @param sizes - A list of word lengths to match
 * @returns A list of selected words or an error if there are not enough words
 */
export function selectWordsBySizes(sizes: number[]): string[] {
  let lengthMap: Map<number, string[]> = groupWordsByLength(Words);
  const selectedWords: string[] = [];

  for (const size of sizes) {
    const words = lengthMap.get(size);

    if (!words || words.length === 0) {
      throw new Error(`No words available for length ${size}`);
    }

    // Shuffle words to ensure randomness and pick one
    const randomIndex = Math.floor(Math.random() * words.length);
    const selectedWord = words[randomIndex];

    selectedWords.push(selectedWord);

    // Remove the selected word to ensure uniqueness
    words.splice(randomIndex, 1);

    // Update the map with the remaining words
    lengthMap.set(size, words);
  }

  return selectedWords;
}
