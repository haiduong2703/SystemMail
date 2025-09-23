const fs = require('fs');
const path = require('path');

// Path to user data folder
const USER_DATA_PATH = 'C:\\classifyMail\\userData';

console.log("=== Testing User Data Structure ===\n");

if (fs.existsSync(USER_DATA_PATH)) {
    const userFiles = fs.readdirSync(USER_DATA_PATH);
    console.log(`Found ${userFiles.length} user files:`);
    
    userFiles.forEach((file, index) => {
        if (file.endsWith('.json')) {
            const filePath = path.join(USER_DATA_PATH, file);
            try {
                const userData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                console.log(`\n${index + 1}. File: ${file}`);
                console.log(`   ID: ${userData.id}`);
                console.log(`   Username: ${userData.username}`);
                console.log(`   Email: ${userData.email}`);
                console.log(`   Full Name: ${userData.fullName || 'Not set'}`);
                console.log(`   Role: ${userData.role}`);
                console.log(`   isAdmin: ${userData.isAdmin}`);
                console.log(`   isActive: ${userData.isActive}`);
                console.log(`   Created: ${userData.createdAt || 'Not set'}`);
                console.log(`   Updated: ${userData.updatedAt || 'Not set'}`);
                
                // Check if isAdmin and isActive exist
                if (userData.isAdmin === undefined) {
                    console.log("   ⚠️  WARNING: isAdmin field is missing!");
                }
                if (userData.isActive === undefined) {
                    console.log("   ⚠️  WARNING: isActive field is missing!");
                }
            } catch (error) {
                console.error(`   ❌ Error reading ${file}:`, error.message);
            }
        }
    });
} else {
    console.log("❌ User data folder not found at:", USER_DATA_PATH);
}

console.log("\n=== Test Complete ===");