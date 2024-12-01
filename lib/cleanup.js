const fs = require("fs").promises;
const path = require("path");

const cleanup = async () => {
  const folderPath = "./temp";
  try {
    await fs.rm(folderPath, { recursive: true, force: true });
    await fs.mkdir(folderPath, { recursive: true });
    console.log(`Folder ${folderPath} deleted successfully.`);
  } catch (err) {
    console.error(`Error deleting folder ${folderPath}:`, err);
  }
};

module.exports = cleanup;
