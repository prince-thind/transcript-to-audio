const fs = require("fs").promises; // Use fs.promises for async file operations
const config = require("../config");
const translate = require("./translate"); // Assuming your translation module is async

// Function to convert text into CSV
async function convertToCSV(inputFile, outputFile) {
  try {
    const data = await fs.readFile(inputFile, "utf8"); // Asynchronous read
    console.log("Input file read successfully.");

    // Match time codes and their corresponding text
    const regex = /(\d{1,2}:\d{2})(?:\s+([\s\S]*?))(?=\d{1,2}:\d{2}|$)/g;
    const matches = [...data.matchAll(regex)];
    const csvData = [];

    function timeToSeconds(time) {
      const [minutes, seconds] = time.split(":").map(Number);
      return minutes * 60 + seconds;
    }

    // Calculate the duration for the top row based on the first timestamp
    const firstTimestamp = matches[0] ? timeToSeconds(matches[0][1]) : 0;
    csvData.push(`0$$${firstTimestamp}$$0:00$$Starting`);

    // Process each match asynchronously
    for (let i = 0; i < matches.length; i++) {
      const match = matches[i];
      const time = match[1]; // Time code
      const rawText = match[2].trim().replace(/\n+/g, " "); // Consolidate multiline text

      // Translate the text asynchronously
      const text = config.translate ? await translate(rawText) : rawText;

      const startSeconds = timeToSeconds(time);

      // Calculate duration
      let duration = "-";
      if (i < matches.length - 1) {
        const nextTime = matches[i + 1][1];
        const nextSeconds = timeToSeconds(nextTime);
        duration = nextSeconds - startSeconds;
      } else {
        duration = 10; // Assume 10 seconds for the last entry
      }

      // Push the formatted data into csvData
      csvData.push(
        `${i + 1}$$${duration}$$${time}$$${text.replace(/"/g, '""')}`
      ); // Escape double quotes in text
    }

    if (csvData.length === 0) {
      console.error(
        "No valid matches found. Ensure the input contains timestamps."
      );
      return;
    }

    // Add header row and join rows with a newline
    const csvContent =
      "Number$$Duration in Seconds$$Start Time$$Text\n" + csvData.join("\n");

    // Asynchronous write
    await fs.writeFile(outputFile, csvContent, "utf8");
    console.log("CSV file created successfully:", outputFile);
  } catch (err) {
    console.error("Error processing the file:", err);
  }
}

module.exports = convertToCSV;
