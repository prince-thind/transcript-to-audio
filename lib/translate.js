const path = require("path");
const translate = require("google-translate-api-x"); // Alternative translation library
const config = require("../config"); // Import target language from config

// Function to translate text
async function translateText(inputText) {
  try {
    const { text: translatedText } = await translate(inputText, {
      to: config.targetLanguage,
    }); // Translate using config target language
    console.log(`Translated text: "${translatedText}"`);
    return translatedText;
  } catch (err) {
    console.error(`Error translating text "${inputText}":`, err.message);
    return inputText; // Fallback to original text on error
  }
}

module.exports = translateText;
