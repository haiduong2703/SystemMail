// Test admin user specifically
async function testAdminUser() {
  const adminUserId = "1753684959632"; // From admin.json
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing admin user: ${adminUserId}`);
  
  try {
    // Get all users and find admin
    console.log(`\n1. Getting all users...`);
    const getUserResponse = await fetch(`${baseUrl}/api/users`);
    if (getUserResponse.ok) {
      const users = await getUserResponse.json();
      const adminUser = users.find(u => u.id === adminUserId);
      
      if (adminUser) {
        console.log(`👤 Admin user found:`, {
          id: adminUser.id,
          username: adminUser.username,
          role: adminUser.role,
          isAdmin: adminUser.isAdmin,
          isActive: adminUser.isActive
        });
        
        // Try to toggle admin (this should fail as it's the last admin)
        console.log(`\n2. Testing admin toggle (should fail - last admin)...`);
        const toggleResponse = await fetch(`${baseUrl}/api/users/by-id/${adminUserId}/admin`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isAdmin: false }),
        });
        
        console.log(`📊 Toggle response status: ${toggleResponse.status}`);
        const toggleResult = await toggleResponse.json();
        console.log(`📋 Toggle result:`, toggleResult);
        
        // Test status toggle
        console.log(`\n3. Testing status toggle...`);
        const statusResponse = await fetch(`${baseUrl}/api/users/by-id/${adminUserId}/status`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isActive: !adminUser.isActive }),
        });
        
        console.log(`📊 Status response status: ${statusResponse.status}`);
        const statusResult = await statusResponse.json();
        console.log(`📋 Status result:`, statusResult);
        
      } else {
        console.log(`❌ Admin user not found`);
        console.log(`📋 Available users:`, users.map(u => ({
          id: u.id,
          username: u.username,
          role: u.role,
          isAdmin: u.isAdmin
        })));
      }
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testAdminUser();