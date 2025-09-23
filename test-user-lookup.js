const fs = require('fs');
const path = require('path');

const USER_DATA_PATH = 'C:\\classifyMail\\userData';

const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
};

console.log("=== Testing User ID Lookup Logic ===\n");

const id = "1755945950357"; // ID from error
console.log("Looking for user id:", id);
console.log("ID type:", typeof id);

if (fs.existsSync(USER_DATA_PATH)) {
  const userFiles = fs.readdirSync(USER_DATA_PATH);
  console.log("Found files:", userFiles);
  
  let userToUpdate = null;
  let userFilePath = null;
  
  for (const file of userFiles) {
    if (file.endsWith(".json")) {
      const filePath = path.join(USER_DATA_PATH, file);
      const userData = readJsonFile(filePath);
      
      console.log(`\nChecking file: ${file}`);
      console.log(`  ID in file: ${userData && userData.id}`);
      console.log(`  ID type: ${typeof (userData && userData.id)}`);
      console.log(`  String comparison: String("${userData && userData.id}") === String("${id}") = ${String(userData && userData.id) === String(id)}`);
      console.log(`  Direct comparison: "${userData && userData.id}" === "${id}" = ${userData && userData.id === id}`);
      
      if (userData && String(userData.id) === String(id)) {
        userToUpdate = userData;
        userFilePath = filePath;
        console.log(`  ✅ MATCH FOUND!`);
        break;
      } else {
        console.log(`  ❌ No match`);
      }
    }
  }
  
  if (userToUpdate) {
    console.log(`\n✅ User found:`, userToUpdate.username);
  } else {
    console.log(`\n❌ User NOT found`);
  }
} else {
  console.log("❌ USER_DATA_PATH does not exist:", USER_DATA_PATH);
}