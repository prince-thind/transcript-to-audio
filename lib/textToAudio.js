const gTTS = require("gtts");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const path = require("path");

// Path to your 1-second silence file
const silenceFilePath = path.join(__dirname, "../assets/silence.wav");

// Helper function to concatenate audio with silence
function concatAudioWithSilence(
  audioFile,
  duration,
  outputFile,
  audioDuration
) {
  return new Promise((resolve, reject) => {
    // const audioDuration = fs.statSync(audioFile).size; // Get audio size (duration calculation may differ based on file format)

    const silenceDuration = duration - audioDuration;

    // If silence is needed
    if (silenceDuration > 0) {
      console.log(`Adding ${silenceDuration} seconds of silence to the audio.`);

      ffmpeg()
        .input(audioFile)
        // Generate silence using aevalsrc
        .input("anullsrc=channel_layout=stereo:sample_rate=44100")
        .inputFormat("lavfi")
        .complexFilter([
          // Trim the generated silence to desired duration
          `[1:a]atrim=0:${silenceDuration}[silence]`,
          // Concatenate original audio with silence
          "[0:a][silence]concat=n=2:v=0:a=1[out]",
        ])
        .map("[out]")
        .output(outputFile)
        .on("end", () => resolve())
        .on("error", reject)
        .run();
    } else {
      // If duration is already correct, just return the audio file
      fs.rename(audioFile, outputFile, (err) => {
        if (err) reject(err);
        resolve();
      });
    }
  });
}

// Helper function to speed up the audio
function speedUpAudio(inputFilePath, duration, outputFilePath, audioDuration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .audioFilters(`atempo=${audioDuration / duration}`)
      .output(outputFilePath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}

// Main function to create an audio file with the specified duration
async function convertTextToAudio(text, duration, outputFile) {
  try {
    // if (duration === 0) {
    //   // Create a 1-second silence file
    //   console.log("Creating 1-second silence file...");
    //   await addSilence(1, outputFile);
    //   console.log("Silent file created successfully");
    //   return;
    // }

    // Convert text to speech using gTTS
    const tempAudioFile = path.join(__dirname, "temp_audio.mp3");
    const gtts = new gTTS(text, "en");

    gtts.save(tempAudioFile, async (err) => {
      if (err) {
        throw new Error("Error generating speech: " + err);
      }
      console.log("Audio file created from text");

      // Get the duration of the generated audio
      const audioDuration = await new Promise((resolve, reject) => {
        ffmpeg(tempAudioFile).ffprobe((err, metadata) => {
          if (err) reject(err);
          else resolve(metadata.format.duration);
        });
      });

      console.log(`Generated audio duration: ${audioDuration}s`);

      if (audioDuration < duration) {
        // Add silence if the audio is too short
        console.log("Adding silence...");
        await concatAudioWithSilence(
          tempAudioFile,
          duration,
          outputFile,
          audioDuration
        );
      } else if (audioDuration > duration) {
        // Speed up the audio if it's too long
        console.log("Speeding up the audio...");
        await speedUpAudio(tempAudioFile, duration, outputFile, audioDuration);
      } else {
        // No modification needed, just return the original audio
        fs.renameSync(tempAudioFile, outputFile);
        console.log("Audio file duration matches the required duration");
      }

      // Cleanup temp file after processing
      if (fs.existsSync(tempAudioFile)) {
        fs.unlinkSync(tempAudioFile);
        console.log("Temporary audio file deleted");
      }
    });
  } catch (err) {
    console.error("Error processing audio:", err);
  }
}

module.exports = convertTextToAudio;
