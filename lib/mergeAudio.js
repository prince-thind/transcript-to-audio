const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const util = require("util");

const readdir = util.promisify(fs.readdir);

async function mergeMP3Files() {
  try {
    // Read the files from the ../temp folder
    const files = await readdir("./temp");
    const mp3Files = files
      .filter((file) => file.endsWith(".mp3"))
      .sort((a, b) => {
        // Extract the numeric part before "audio" and sort by that number
        const numA = parseInt(a.match(/^(\d+)/)[0], 10);
        const numB = parseInt(b.match(/^(\d+)/)[0], 10);
        return numA - numB;
      });

    if (mp3Files.length === 0) {
      console.log("No MP3 files found in the temp folder.");
      return;
    }

    // Construct the input paths for ffmpeg
    const inputPaths = mp3Files.map((file) => path.join("./temp", file));

    // Create an output file path in the ../output folder
    const outputPath = path.join("./output", "output.mp3");

    // Merge the MP3 files using ffmpeg
    ffmpeg()
      .input("concat:" + inputPaths.join("|")) // Using concat demuxer
      .inputOptions("-f mp3")
      .output(outputPath)
      .on("end", () => {
        console.log("MP3 files merged successfully!");
      })
      .on("error", (err) => {
        console.error("Error merging MP3 files:", err);
      })
      .run();
  } catch (error) {
    console.error("Error reading files from temp folder:", error);
  }
}

module.exports = mergeMP3Files;
