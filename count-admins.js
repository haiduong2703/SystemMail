// Count admin users
async function countAdmins() {
  const baseUrl = "http://127.0.0.1:3002";
  
  console.log(`🧪 Counting admin users...`);
  
  try {
    const response = await fetch(`${baseUrl}/api/users`);
    if (response.ok) {
      const users = await response.json();
      
      console.log(`👥 Total users: ${users.length}`);
      
      const adminUsers = users.filter(u => u.isAdmin);
      console.log(`👑 Admin users: ${adminUsers.length}`);
      
      adminUsers.forEach(admin => {
        console.log(`  - ${admin.username} (${admin.id}) - role: ${admin.role}, isAdmin: ${admin.isAdmin}`);
      });
      
      const activeAdmins = adminUsers.filter(u => u.isActive);
      console.log(`🟢 Active admin users: ${activeAdmins.length}`);
      
    } else {
      console.log(`❌ Failed to get users`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  }
}

countAdmins();