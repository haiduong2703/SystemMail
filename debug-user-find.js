const fs = require('fs');
const path = require('path');

// Simulate the exact logic from server
const USER_DATA_PATH = "C:\\classifyMail\\userData";
const targetId = "1759162316916";

console.log('🔍 Debug user finding logic...');
console.log(`Target ID: "${targetId}" (type: ${typeof targetId})`);
console.log(`USER_DATA_PATH: ${USER_DATA_PATH}`);
console.log(`Path exists: ${fs.existsSync(USER_DATA_PATH)}`);

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
};

if (fs.existsSync(USER_DATA_PATH)) {
  const userFiles = fs.readdirSync(USER_DATA_PATH);
  console.log(`Found files: ${userFiles.length}`);
  
  for (const file of userFiles) {
    if (file.endsWith(".json")) {
      console.log(`\n📄 Checking file: ${file}`);
      const filePath = path.join(USER_DATA_PATH, file);
      const userData = readJsonFile(filePath);
      
      if (userData) {
        console.log(`   ID in file: "${userData.id}" (type: ${typeof userData.id})`);
        console.log(`   String comparison: String("${userData.id}") === String("${targetId}") = ${String(userData.id) === String(targetId)}`);
        console.log(`   Direct comparison: "${userData.id}" === "${targetId}" = ${userData.id === targetId}`);
        console.log(`   Username: ${userData.username}`);
        
        if (String(userData.id) === String(targetId)) {
          console.log(`   ✅ MATCH FOUND!`);
        } else {
          console.log(`   ❌ No match`);
        }
      } else {
        console.log(`   ❌ Failed to read file`);
      }
    }
  }
} else {
  console.log("❌ USER_DATA_PATH does not exist!");
}