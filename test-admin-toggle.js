// Test admin toggle specifically
async function testAdminToggle() {
  const userId = "1759162316916";
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Testing admin toggle for user: ${userId}`);
  
  try {
    // Get current user info first
    console.log(`\n1. Getting current user info...`);
    const getUserResponse = await fetch(`${baseUrl}/api/users`);
    if (getUserResponse.ok) {
      const users = await getUserResponse.json();
      const currentUser = users.find(u => u.id === userId);
      
      if (currentUser) {
        console.log(`👤 Current user status:`, {
          username: currentUser.username,
          role: currentUser.role,
          isAdmin: currentUser.isAdmin,
          isActive: currentUser.isActive
        });
        
        // Toggle admin status
        console.log(`\n2. Toggling admin status...`);
        const newAdminStatus = !currentUser.isAdmin;
        console.log(`🔄 Changing isAdmin from ${currentUser.isAdmin} to ${newAdminStatus}`);
        
        const toggleResponse = await fetch(`${baseUrl}/api/users/by-id/${userId}/admin`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ isAdmin: newAdminStatus }),
        });
        
        console.log(`📊 Toggle response status: ${toggleResponse.status}`);
        const toggleResult = await toggleResponse.json();
        console.log(`📋 Toggle result:`, toggleResult);
        
        if (toggleResponse.ok) {
          console.log(`✅ Toggle successful`);
          
          // Verify the change
          console.log(`\n3. Verifying the change...`);
          const verifyResponse = await fetch(`${baseUrl}/api/users`);
          if (verifyResponse.ok) {
            const updatedUsers = await verifyResponse.json();
            const updatedUser = updatedUsers.find(u => u.id === userId);
            
            if (updatedUser) {
              console.log(`👤 Updated user status:`, {
                username: updatedUser.username,
                role: updatedUser.role,
                isAdmin: updatedUser.isAdmin,
                isActive: updatedUser.isActive,
                updatedAt: updatedUser.updatedAt
              });
              
              if (updatedUser.isAdmin === newAdminStatus) {
                console.log(`✅ Admin status change verified successfully!`);
              } else {
                console.log(`❌ Admin status was not updated properly`);
                console.log(`Expected: ${newAdminStatus}, Got: ${updatedUser.isAdmin}`);
              }
            }
          }
        } else {
          console.log(`❌ Toggle failed:`, toggleResult);
        }
        
      } else {
        console.log(`❌ User not found in users list`);
      }
    }
    
  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testAdminToggle();