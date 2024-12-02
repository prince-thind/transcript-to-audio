const fs = require("fs").promises;
const path = require("path");

// Input and output file paths
const inputCsv = path.join(__dirname, "../output/output.csv");
const outputSrt = path.join(__dirname, "../output/subtitles.srt");

// Helper function to format time for SRT
const formatTime = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}:${String(seconds.toFixed(3)).padStart(6, "0").replace(".", ",")}`;
};

// Async function to convert CSV to SRT
const convertCsvToSrt = async () => {
  try {
    // Read the CSV file
    const data = await fs.readFile(inputCsv, "utf-8");

    const lines = data.split("\n");
    lines.shift(); // Remove header line
    const srtLines = [];

    for (const line of lines) {
      if (line.trim() === "") continue; // Skip empty lines
      const [index, durationStr, startTime, text] = line.split("$$");
      const duration = parseInt(durationStr, 10);

      // Calculate start and end times
      const startParts = startTime.split(":").map(Number);
      const startSeconds = startParts[0] * 60 + startParts[1];
      const endSeconds = startSeconds + duration;

      // Add formatted SRT entry
      srtLines.push(
        `${index}\n${formatTime(startSeconds)} --> ${formatTime(
          endSeconds
        )}\n${text}\n`
      );
    }

    // Write to the SRT file
    await fs.writeFile(outputSrt, srtLines.join("\n"), "utf-8");
    console.log(`Conversion complete! File saved as ${outputSrt}`);
  } catch (error) {
    console.error("Error:", error.message);
  }
};

module.exports = convertCsvToSrt;
