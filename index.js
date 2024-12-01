const convertToCSV = require("./lib/convertToCSV");
const path = require("path");

const inputFilePath = path.join(__dirname, "./input/transcript.txt");
const outputFilePath = path.join(__dirname, "./output/output.csv");

console.log(inputFilePath, outputFilePath);

async function main() {
  await convertToCSV(inputFilePath, outputFilePath);
  console.log("done converting to csv");
}

main();
