// Test GET /api/users endpoint
async function testGetUsers() {
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing GET /api/users`);
  
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    
    console.log(`📊 Response status: ${response.status}`);
    
    if (response.ok) {
      const users = await response.json();
      console.log(`✅ Found ${users.length} users`);
      
      // Find our test user
      const testUser = users.find(u => u.id === "1759162316916");
      if (testUser) {
        console.log(`👤 Test user found:`, {
          id: testUser.id,
          username: testUser.username,
          email: testUser.email,
          fullName: testUser.fullName,
          role: testUser.role,
          isAdmin: testUser.isAdmin,
          isActive: testUser.isActive,
          updatedAt: testUser.updatedAt
        });
      } else {
        console.log(`❌ Test user not found in users list`);
        console.log(`📋 Available users:`, users.map(u => ({
          id: u.id,
          username: u.username,
          isAdmin: u.isAdmin,
          isActive: u.isActive
        })));
      }
    } else {
      const error = await response.json();
      console.log(`❌ GET /api/users failed:`, error);
    }

  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testGetUsers();