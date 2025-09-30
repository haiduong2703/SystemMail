// Test toggle admin to user
async function testAdminToUser() {
  const userId = "1759162316916";
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing admin → user toggle for: ${userId}`);
  
  try {
    // Toggle to user
    console.log(`\n1. Toggling admin to user...`);
    const toggleResponse = await fetch(`${baseUrl}/api/users/by-id/${userId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isAdmin: false }), // Remove admin
    });
    
    console.log(`📊 Toggle response status: ${toggleResponse.status}`);
    const toggleResult = await toggleResponse.json();
    console.log(`📋 API Response:`, toggleResult);
    
    if (toggleResponse.ok) {
      // Read file after toggle
      const fs = require('fs');
      const filePath = `c:/classifyMail/UserData/${userId}.json`;
      
      console.log(`\n2. File content after admin → user:`);
      const afterData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      console.log(`   role: "${afterData.role}"`);
      console.log(`   isAdmin field exists: ${afterData.hasOwnProperty('isAdmin')}`);
      console.log(`   API says isAdmin: ${toggleResult.user.isAdmin}`);
      
      if (afterData.role === "user" && toggleResult.user.isAdmin === false && !afterData.hasOwnProperty('isAdmin')) {
        console.log(`✅ SUCCESS: Admin removed correctly, role = "user", no isAdmin field in file`);
      } else {
        console.log(`❌ ISSUE: Something went wrong`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testAdminToUser();