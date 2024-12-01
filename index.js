const convertToCSV = require("./lib/convertToCSV");
const path = require("path");

const inputFilePath = path.join(__dirname, "./input/transcript.txt");
const outputFilePath = path.join(__dirname, "./output/untranslated.csv");

console.log(inputFilePath, outputFilePath);

convertToCSV(inputFilePath, outputFilePath);
