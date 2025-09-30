// Test readJsonFile function trực tiếp
const fs = require('fs');
const path = require('path');

// Copy readJsonFile function from server
function readJsonFile(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading JSON file ${filePath}:`, error);
    return null;
  }
}

function testReadJsonFile() {
  const userId = "1759162316916";
  const userFilePath = path.join('C:\\classifyMail\\userData', `${userId}.json`);
  
  console.log(`🧪 Testing readJsonFile with: ${userFilePath}`);
  console.log(`📁 File exists: ${fs.existsSync(userFilePath)}`);
  
  if (fs.existsSync(userFilePath)) {
    // Test với fs.readFileSync trực tiếp
    try {
      const rawData = fs.readFileSync(userFilePath, 'utf8');
      console.log(`✅ Raw file data (first 200 chars): ${rawData.substring(0, 200)}`);
      
      const parsedData = JSON.parse(rawData);
      console.log(`✅ Parsed JSON data:`, parsedData);
    } catch (error) {
      console.error(`❌ Direct read error:`, error);
    }
    
    // Test với readJsonFile function
    const result = readJsonFile(userFilePath);
    console.log(`🔍 readJsonFile result:`, result);
    console.log(`🔍 readJsonFile result type:`, typeof result);
    console.log(`🔍 readJsonFile result is null:`, result === null);
    console.log(`🔍 readJsonFile result is undefined:`, result === undefined);
    console.log(`🔍 readJsonFile result truthy:`, !!result);
  } else {
    console.log(`❌ File does not exist: ${userFilePath}`);
  }
}

testReadJsonFile();