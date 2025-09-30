// Restore admin user to admin role
async function restoreAdmin() {
  const adminUserId = "1753684959632"; // admin.json
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🔧 Restoring admin user: ${adminUserId}`);
  
  try {
    // Toggle admin back to true
    const adminResponse = await fetch(`${baseUrl}/api/users/by-id/${adminUserId}/admin`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isAdmin: true }),
    });
    
    console.log(`📊 Admin restore status: ${adminResponse.status}`);
    if (adminResponse.ok) {
      const adminResult = await adminResponse.json();
      console.log(`✅ Admin restored:`, adminResult.user);
    }
    
    // Toggle status back to active
    const statusResponse = await fetch(`${baseUrl}/api/users/by-id/${adminUserId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isActive: true }),
    });
    
    console.log(`📊 Status restore status: ${statusResponse.status}`);
    if (statusResponse.ok) {
      const statusResult = await statusResponse.json();
      console.log(`✅ Status restored:`, statusResult.user);
    }
    
  } catch (error) {
    console.error('💥 Error restoring admin:', error);
  }
}

restoreAdmin();