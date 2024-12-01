const convertToCSV = require("./lib/convertToCSV");
const path = require("path");
const processCSV = require("./lib/csvToAudio");

const inputFilePath = path.join(__dirname, "./input/transcript.txt");
const outputFilePath = path.join(__dirname, "./output/output.csv");

async function main() {
  //do cleanup of temp
  //await convertToCSV(inputFilePath, outputFilePath);
  // await processCSV();
}

main();
