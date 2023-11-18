const axios = require('axios');
const fs = require('fs');
const path = require('path');

//const API_URL = 'http://localhost:1338'; 
const API_URL = 'http://127.0.0.1:1338'; 
const dataDirectory = './Strapi_Content_and_structure_example';

// Collection types to fetch
const collectionTypes = [
  'choice-to-question-maps',
  'first-entries',
  'question-to-choice-maps',
  'solutions',
  'tree-levels',
  'users'
];

async function fetchData(endpoint) {
    try {
        console.log(`Requesting: ${API_URL}/api/${endpoint}`);
        const response = await axios.get(`${API_URL}/api/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${endpoint}:`, error);
        return null;
    }
}
  


function saveDataToFile(data, filename) {
  fs.writeFile(path.join(dataDirectory, `${filename}.json`), JSON.stringify(data, null, 2), (err) => {
    if (err) {
      console.error(`Error writing file ${filename}:`, err);
    } else {
      console.log(`${filename}.json saved.`);
    }
  });
}

// Ensure the directory exists
if (!fs.existsSync(dataDirectory)){
  fs.mkdirSync(dataDirectory, { recursive: true });
}

// Fetch and save data for each collection type
collectionTypes.forEach(type => {
  fetchData(type)
    .then(data => {
      if (data) saveDataToFile(data, type);
    });
});
