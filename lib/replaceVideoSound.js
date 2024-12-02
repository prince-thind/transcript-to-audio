const { spawn } = require("child_process");
const path = require("path");

// Paths to input and output files
const inputVideo = path.join(__dirname, "../input/input.mp4");
const inputAudio = path.join(__dirname, "../output/output.mp3");
const outputVideo = path.join(__dirname, "../output/unsubtitled.mp4");

// Function to replace the sound of a video with audio
async function replaceAudioInVideo() {
  return new Promise((resolve, reject) => {
    const ffmpegCommand = [
      "-y", // Overwrite output file without asking
      "-i",
      inputVideo, // Input video
      "-i",
      inputAudio, // Input audio
      "-map",
      "0:v:0", // Select the video stream from input 0 (video file)
      "-map",
      "1:a:0", // Select the audio stream from input 1 (audio file)
      "-c:v",
      "copy", // Copy video codec (no re-encoding)
      "-c:a",
      "aac", // Set audio codec to AAC
      "-shortest", // Match the shortest duration between video and audio
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
        console.log("Audio replaced successfully!");
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
module.exports = replaceAudioInVideo;
