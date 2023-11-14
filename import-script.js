require('dotenv').config();

const axios = require('axios');
const fs = require('fs');
const path = require('path');

const STRAPI_URL = 'http://127.0.0.1:1338';             //needs to change to avoid showing direct IP add
const DIRECTORY_PATH = './Strapi_Content_and_structure_example'; // directory with JSON files

// Read JSON data from a file
function readJsonFile(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

// Login to Strapi and get token
async function getStrapiToken() {
  try {
    const response = await axios.post(`${STRAPI_URL}/auth/local`, {
      identifier: process.env.STRAPI_IDENTIFIER,
      password: process.env.STRAPI_PASSWORD,
    });
    return response.data.jwt;
  } catch (error) {
    console.error('Error fetching Strapi token:', error);
    return null;
  }
}

// Import data into Strapi
async function importData(data, endpoint, token) {
  try {
    for (const item of data) {
      await axios.post(`${STRAPI_URL}${endpoint}`, { data: item }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log(`Imported to ${endpoint}: ${JSON.stringify(item)}`);
    }
    console.log(`Data import to ${endpoint} completed.`);
  } catch (error) {
    console.error('Error importing data:', error);
  }
}

// Execute the script
async function runImport() {
  const token = await getStrapiToken();
  if (!token) {
    console.error('Failed to retrieve Strapi token. Aborting import.');
    return;
  }

  const fileToEndpointMap = {
    'choice-to-question-map.json': '/api/choice-to-question-maps',
    'question-to-choice-map.json': '/api/question-to-choice-maps',
    'solutions.json': '/api/solutions',
  };

  for (const [filename, endpoint] of Object.entries(fileToEndpointMap)) {
    const filePath = path.join(DIRECTORY_PATH, filename);
    if (fs.existsSync(filePath)) {
      const data = readJsonFile(filePath);
      await importData(data.data, endpoint, token);
    }
  }
}

runImport();
