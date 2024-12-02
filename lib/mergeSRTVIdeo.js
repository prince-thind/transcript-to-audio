const { spawn } = require("child_process");
const path = require("path");

// Paths to input and output files
const inputVideo = path.join(__dirname, "../output/unsubtitled.mp4");
const inputSubtitles = path.join(__dirname, "../output/subtitles.srt");
const outputVideo = path.join(__dirname, "../output/output.mp4");

// Function to run the ffmpeg command
async function embedSubtitles() {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = [
      "-y",
      "-i",
      inputVideo,
      "-i",
      inputSubtitles,
      "-c:v",
      "copy",
      "-c:a",
      "copy",
      "-c:s",
      "mov_text",
      outputVideo,
    ];

    const ffmpeg = spawn("ffmpeg", ffmpegCommand);

    ffmpeg.stdout.on("data", (data) => {
      console.log(`FFmpeg stdout: ${data}`);
    });

    ffmpeg.stderr.on("data", (data) => {
      console.error(`FFmpeg stderr: ${data}`);
    });

    ffmpeg.on("close", (code) => {
      if (code === 0) {
        console.log("Subtitles embedded successfully!");
        resolve();
      } else {
        reject(new Error(`FFmpeg process exited with code ${code}`));
      }
    });

    ffmpeg.on("error", (err) => {
      reject(err);
    });
  });
}

// Export the function
module.exports = embedSubtitles;
