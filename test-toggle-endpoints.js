// Test toggle endpoints
async function testToggleEndpoints() {
  const userId = "1759162316916";
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing toggle endpoints for user: ${userId}`);
  
  try {
    // First, get current user data
    console.log(`\n1. Getting current user data...`);
    const debugResponse = await fetch(`${baseUrl}/api/debug/users/${userId}`);
    if (debugResponse.ok) {
      const debugResult = await debugResponse.json();
      const currentUser = debugResult.userFound;
      console.log(`👤 Current user:`, {
        id: currentUser.id,
        username: currentUser.username,
        isAdmin: currentUser.isAdmin,
        isActive: currentUser.isActive
      });
      
      // Test admin toggle
      console.log(`\n2. Testing admin toggle...`);
      const adminToggleResponse = await fetch(`${baseUrl}/api/users/by-id/${userId}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isAdmin: !currentUser.isAdmin }),
      });
      
      console.log(`📊 Admin toggle response status: ${adminToggleResponse.status}`);
      if (adminToggleResponse.ok) {
        const adminResult = await adminToggleResponse.json();
        console.log(`✅ Admin toggle result:`, adminResult);
      } else {
        const adminError = await adminToggleResponse.json();
        console.log(`❌ Admin toggle error:`, adminError);
      }
      
      // Test status toggle
      console.log(`\n3. Testing status toggle...`);
      const statusToggleResponse = await fetch(`${baseUrl}/api/users/by-id/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !currentUser.isActive }),
      });
      
      console.log(`📊 Status toggle response status: ${statusToggleResponse.status}`);
      if (statusToggleResponse.ok) {
        const statusResult = await statusToggleResponse.json();
        console.log(`✅ Status toggle result:`, statusResult);
      } else {
        const statusError = await statusToggleResponse.json();
        console.log(`❌ Status toggle error:`, statusError);
      }
      
      // Get updated user data
      console.log(`\n4. Getting updated user data...`);
      const updatedDebugResponse = await fetch(`${baseUrl}/api/debug/users/${userId}`);
      if (updatedDebugResponse.ok) {
        const updatedDebugResult = await updatedDebugResponse.json();
        const updatedUser = updatedDebugResult.userFound;
        console.log(`👤 Updated user:`, {
          id: updatedUser.id,
          username: updatedUser.username,
          isAdmin: updatedUser.isAdmin,
          isActive: updatedUser.isActive
        });
      }
      
    } else {
      console.log(`❌ Failed to get current user data`);
    }

  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

// Wait for server to start
setTimeout(() => {
  testToggleEndpoints();
}, 3000);