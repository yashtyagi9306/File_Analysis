const fs = require("fs");
const path = require("path");

const args = process.argv.slice(2);

function showHelp() {
  console.log("Text File Analyzer");
  console.log("Usage: node count.js <file.txt> [options]");
  console.log("\nOptions");
  console.log("  -h, --help    Show help");
  console.log("  -s, --summary Show only summary (total counts)");
  console.log("  -d, --detail  Show detailed statistics");
  console.log("\nExample");
  console.log("  node count.js sample.txt");
  console.log("  node count.js sample.txt --detail");
  process.exit(0);
}

if (args.length === 0 || args.includes("--help") || args.includes("-h")) {
  showHelp();
}

const filePath = args[0];
const showDetail = args.includes("--detail") || args.includes("-d");

if (!filePath.endsWith(".txt")) {
  console.log("Error: Please enter a text file.");
  process.exit(1);
}

if (!fs.existsSync(filePath)) {
  console.log(`Error: File ${filePath} does not exist.`);
  process.exit(1);
}

function countStatistics(buffer) {
  const content = buffer.toString();

  const charCount = content.length;
  const lines = content.split(/\r?\n/);
  const lineCount = lines.length;
  const words = content.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;
  const byteSize = buffer.byteLength;

  let stats = {
    charCount,
    lineCount,
    wordCount,
    byteSize,
  };

  if (showDetail) {
    
    const nonWhitespaceCharCount = content.replace(/\s/g, "").length;

   
    const wordLengths = words.map((word) => word.length);
    const averageWordLength =
      wordLengths.reduce((sum, length) => sum + length, 0) / wordCount || 0;

    
    const paragraphCount = content
      .split(/\r?\n\s*\r?\n/)
      .filter((para) => para.trim().length > 0).length;

    
    const wordFrequency = {};
    words.forEach((word) => {
      const normalizedWord = word.toLowerCase().replace(/[^\w]/g, "");
      if (normalizedWord.length > 0) {
        wordFrequency[normalizedWord] =
          (wordFrequency[normalizedWord] || 0) + 1;
      }
    });

    
    const topWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    stats = {
      ...stats,
      nonWhitespaceCharCount,
      averageWordLength: averageWordLength.toFixed(2),
      paragraphCount,
      topWords,
    };
  }

  return stats;
}

fs.readFile(filePath, (err, buffer) => {
  if (err) {
    console.error("Error reading file:", err.message);
    return;
  }

  const result = countStatistics(buffer);

  console.log("\n===== Analysis Result =====");
  console.log(result);
});




function formatBytes(bytes, decimal = 2){
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ['Bytes','KB','MB','GB','TB','PB'];
    const i = Math.floor(Math.log(bytes)/Math.log(k));
    return (bytes/Math.pow(k,i)).toFixed(decimal) + ' ' + sizes[i];
};






function displayStatistics(stats) {
  console.log("\n=== Text File Statistics ===\n");

 
  console.log(`File: ${path.basename(filePath)}`);
  console.log(`Size: ${formatBytes(stats.byteSize)}`);
  console.log(`Characters: ${stats.charCount}`);
  console.log(`Words: ${stats.wordCount}`);
  console.log(`Lines: ${stats.lineCount}`);

  if (showDetail) {
    console.log("\n=== Detailed Statistics ===\n");

    console.log(`Non-whitespace characters: ${stats.nonWhitespaceCharCount}`);
    console.log(`Average word length: ${stats.averageWordLength}`);
    console.log(`Paragraphs: ${stats.paragraphCount}`);

    console.log("\nTop 10 Most Frequent Words:");
    stats.topWords.forEach(([word, count]) => {
      console.log(`  ${word}: ${count}`);
    });
  }
}