const convertToCSV = require("./lib/convertToCSV");
const path = require("path");
const processCSV = require("./lib/csvToAudio");
const cleanup = require("./lib/cleanup");
const mergeMP3Files = require("./lib/mergeAudio");
const convertCsvToSrt = require("./lib/convertToSRT");
const embedSubtitles = require("./lib/mergeSRTVIdeo");
const replaceAudioInVideo = require("./lib/replaceVideoSound");

const inputFilePath = path.join(__dirname, "./input/transcript.txt");
const outputFilePath = path.join(__dirname, "./output/output.csv");

async function main() {
  await cleanup();
  await convertToCSV(inputFilePath, outputFilePath);
  await processCSV();
  await mergeMP3Files();
  await replaceAudioInVideo();
  await convertCsvToSrt();
  await embedSubtitles();
}

main();
