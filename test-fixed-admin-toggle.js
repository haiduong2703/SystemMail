// Test fixed admin toggle (should only update role, not add isAdmin field)
async function testFixedAdminToggle() {
  const userId = "1759162316916";
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing FIXED admin toggle for user: ${userId}`);
  
  try {
    // Read file before toggle
    const fs = require('fs');
    const filePath = `c:/classifyMail/UserData/${userId}.json`;
    
    console.log(`\n1. File content BEFORE toggle:`);
    const beforeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    console.log(JSON.stringify(beforeData, null, 2));
    
    // Toggle admin status
    console.log(`\n2. Toggling admin status...`);
    const toggleResponse = await fetch(`${baseUrl}/api/users/by-id/${userId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isAdmin: true }), // Make admin
    });
    
    console.log(`📊 Toggle response status: ${toggleResponse.status}`);
    const toggleResult = await toggleResponse.json();
    console.log(`📋 API Response:`, toggleResult);
    
    if (toggleResponse.ok) {
      // Read file after toggle
      console.log(`\n3. File content AFTER toggle:`);
      const afterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(JSON.stringify(afterData, null, 2));
      
      // Check if isAdmin field was added to file (should NOT be)
      if (afterData.hasOwnProperty('isAdmin')) {
        console.log(`❌ PROBLEM: isAdmin field was added to file!`);
      } else {
        console.log(`✅ GOOD: No isAdmin field in file, only role updated`);
      }
      
      // Check role
      console.log(`\n4. Role check:`);
      console.log(`   Before: role = "${beforeData.role}"`);
      console.log(`   After:  role = "${afterData.role}"`);
      console.log(`   API says isAdmin = ${toggleResult.user.isAdmin}`);
      
      if (afterData.role === "admin" && toggleResult.user.isAdmin === true) {
        console.log(`✅ SUCCESS: Role updated correctly and API derived isAdmin properly`);
      } else {
        console.log(`❌ ISSUE: Role or isAdmin mapping incorrect`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testFixedAdminToggle();