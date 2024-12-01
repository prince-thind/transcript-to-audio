const fs = require("fs");
const path = require("path");
const convertTextToAudio = require("./textToAudio");

// Async function to read and process the CSV
async function processCSV() {
  try {
    const filePath = path.join(__dirname, "../output/output.csv");
    const data = await fs.promises.readFile(filePath, "utf8"); // Read the CSV file

    // Split the content by newlines
    const rows = data.split("\n");

    // Loop through the rows, skipping the first header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue; // Skip empty rows

      const columns = row.split("$$"); // Split each row by the custom delimiter $$

      const [number, duration, startTime, text] = columns;

      const outputFileName = "./temp/" + number + "audio.mp3";
      if (duration == 0) {
        continue;
      }
      await convertTextToAudio(text, duration, outputFileName);

      //   return;

      // Add your logic here, like translating the text or performing further processing
    }
  } catch (error) {
    console.error("Error processing CSV:", error);
  }
}

module.exports = processCSV;
