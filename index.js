const convertToCSV = require("./lib/convertToCSV");
const path = require("path");

const inputFilePath = path.join(__dirname, "./input/transcript.txt");
const outputFilePath = path.join(__dirname, "./output/output.csv");

async function main() {
  //   await convertToCSV(inputFilePath, outputFilePath);
}

main();
