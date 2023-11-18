require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://127.0.0.1:1338';
const DIRECTORY_PATH = './Strapi_Content_and_structure_example';

// Read JSON data from a file
function readJsonFile(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

// Import data into Strapi
async function importData(data, endpoint) {
  try {
    // Check if data is an array, if not, make it an array
    if (!Array.isArray(data)) {
      data = [data];
    }

    for (const item of data) {
      const payload = { data: item }; // Wrapping the item in a data object
      await axios.post(`${STRAPI_URL}${endpoint}`, payload); // Removed the token header
      console.log(`Imported to ${endpoint}: ${JSON.stringify(item)}`);
    }
    console.log(`Data import to ${endpoint} completed.`);
  } catch (error) {
    console.error('Error importing data:', error);
  }
}



// Execute the script
async function runImport() {
  const fileToEndpointMap = {
    'choice-to-question-map.json': '/api/choice-to-question-maps',
    'question-to-choice-map.json': '/api/question-to-choice-maps',
    'solutions.json': '/api/solutions',
  };

  for (const [filename, endpoint] of Object.entries(fileToEndpointMap)) {
    const filePath = path.join(DIRECTORY_PATH, filename);
    if (fs.existsSync(filePath)) {
      const data = readJsonFile(filePath);
      await importData(data, endpoint);  // Removed the token parameter
    }
  }
}

runImport();
