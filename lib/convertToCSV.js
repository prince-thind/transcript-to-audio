const fs = require("fs");

// Function to convert text into CSV
function convertToCSV(inputFile, outputFile) {
  fs.readFile(inputFile, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

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
    csvData.push(`0$$${firstTimestamp}$$0:00$$ `);

    matches.forEach((match, i) => {
      const time = match[1]; // Time code
      const text = match[2].trim().replace(/\n+/g, " "); // Consolidate multiline text
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

      csvData.push(
        `${i + 1}$$${duration}$$${time}$$${text.replace(/"/g, '""')}`
      ); // Escape double quotes in text
    });

    if (csvData.length === 0) {
      console.error(
        "No valid matches found. Ensure the input contains timestamps."
      );
      return;
    }

    // Add header row and join rows with a newline
    const csvContent =
      "Number$$Duration in Seconds$$Start Time$$Text\n" + csvData.join("\n");
    fs.writeFile(outputFile, csvContent, "utf8", (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("CSV file created successfully:", outputFile);
      }
    });
  });
}

module.exports = convertToCSV;
