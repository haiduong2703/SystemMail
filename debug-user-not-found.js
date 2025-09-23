const fs = require('fs');
const path = require('path');

// Test API call for debugging user not found issue
async function testUserAPI() {
    const API_BASE_URL = 'http://localhost:3002';
    
    console.log("=== Testing User API Debug ===\n");
    
    // First get all users
    try {
        console.log("1. Getting all users...");
        const response = await fetch(`${API_BASE_URL}/api/users`);
        
        if (response.ok) {
            const users = await response.json();
            console.log(`✅ Found ${users.length} users from API:`);
            
            users.forEach((user, index) => {
                console.log(`   ${index + 1}. ID: ${user.id} | Username: ${user.username} | isAdmin: ${user.isAdmin} | isActive: ${user.isActive}`);
            });
            
            // Test updating the user that's failing
            const problemUserId = '1755945950357';  // ID from error
            const problemUser = users.find(u => u.id == problemUserId);
            
            if (problemUser) {
                console.log(`\n2. Testing update for problem user ID: ${problemUserId}`);
                console.log(`   User data:`, problemUser);
                
                const updateData = {
                    username: problemUser.username,
                    email: problemUser.email,
                    fullName: problemUser.fullName || '',
                    isAdmin: problemUser.isAdmin,
                    isActive: problemUser.isActive
                };
                
                console.log(`   Update data:`, updateData);
                
                try {
                    const updateResponse = await fetch(`${API_BASE_URL}/api/users/${problemUserId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateData)
                    });
                    
                    console.log(`   Response status: ${updateResponse.status}`);
                    
                    if (updateResponse.ok) {
                        const result = await updateResponse.json();
                        console.log(`   ✅ Update successful:`, result);
                    } else {
                        const error = await updateResponse.text();
                        console.log(`   ❌ Update failed:`, error);
                    }
                } catch (err) {
                    console.log(`   ❌ Network error:`, err.message);
                }
            } else {
                console.log(`\n❌ Problem user ID ${problemUserId} not found in API response!`);
            }
            
        } else {
            console.log("❌ Failed to get users:", await response.text());
        }
    } catch (error) {
        console.log("❌ Network error:", error.message);
        console.log("💡 Make sure backend server is running on port 3002");
    }
}

testUserAPI();