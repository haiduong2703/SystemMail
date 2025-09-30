// Test user update API with simplifi    console.log(`🌐 Making PUT request to: http://127.0.0.1:3002/api/users/by-id/${userId}`);d logic
const path = require('path');

async function testUserUpdate() {
  const userId = "1759162316916";
  const updateData = {
    username: "tungden_updated",
    email: "tungden_updated@example.com",
    fullName: "Tùng Đen Updated",
    department: "IT Updated",
    phone: "0987654321",
    isAdmin: false,
    isActive: true
  };

  console.log(`🧪 Testing PUT /api/users/by-id/${userId}`);
  console.log('📝 Update data:', updateData);

  try {
    // First, let's check if the user file exists
    const fs = require('fs');
    const userFilePath = path.join('C:\\classifyMail\\userData', `${userId}.json`);
    
    console.log(`\n🔍 Checking user file: ${userFilePath}`);
    console.log(`📁 File exists: ${fs.existsSync(userFilePath)}`);
    
    if (fs.existsSync(userFilePath)) {
      const userData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
      console.log(`👤 Current user data:`, {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName
      });
    }

    // Make the API call
    console.log(`\n🌐 Making PUT request to: http://localhost:3002/api/users/${userId}`);
    
    const response = await fetch(`http://127.0.0.1:3002/api/users/by-id/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    console.log(`📊 Response status: ${response.status}`);
    console.log(`📊 Response status text: ${response.statusText}`);

    const result = await response.json();
    console.log('📋 Response body:', result);

    if (response.ok) {
      console.log('✅ User update successful!');
      
      // Verify the file was updated
      if (fs.existsSync(userFilePath)) {
        const updatedUserData = JSON.parse(fs.readFileSync(userFilePath, 'utf8'));
        console.log(`\n✅ Updated user data in file:`, {
          id: updatedUserData.id,
          username: updatedUserData.username,
          email: updatedUserData.email,
          fullName: updatedUserData.fullName,
          department: updatedUserData.department,
          phone: updatedUserData.phone,
          isAdmin: updatedUserData.isAdmin,
          isActive: updatedUserData.isActive,
          updatedAt: updatedUserData.updatedAt
        });
      }
    } else {
      console.log('❌ User update failed!');
    }

  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

// Run the test
testUserUpdate();