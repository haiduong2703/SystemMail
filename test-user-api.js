const fs = require('fs');
const path = require('path');

// Test API call for debugging user not found issue
async function testUserAPI() {
    const API_BASE_URL = 'http://localhost:3002';
    
    console.log("=== Testing User API ===\n");
    
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
            
            // Test updating each user
            console.log("\n2. Testing user updates...");
            for (const user of users) {
                console.log(`\nTesting update for user: ${user.username} (ID: ${user.id})`);
                
                const updateData = {
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName || '',
                    isAdmin: user.isAdmin,
                    isActive: user.isActive
                };
                
                try {
                    const updateResponse = await fetch(`${API_BASE_URL}/api/users/${user.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updateData)
                    });
                    
                    if (updateResponse.ok) {
                        const result = await updateResponse.json();
                        console.log(`   ✅ Update successful for ${user.username}`);
                    } else {
                        const error = await updateResponse.text();
                        console.log(`   ❌ Update failed for ${user.username}:`, error);
                    }
                } catch (err) {
                    console.log(`   ❌ Network error for ${user.username}:`, err.message);
                }
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
  username: 'test.user.api',
  email: 'test.api@company.com',
  fullName: 'Test API User',
  department: 'IT',
  phone: '+84-999-888-777',
  isAdmin: false,
  isActive: true
};

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`🌐 ${finalOptions.method || 'GET'} ${url}`);
    if (finalOptions.body) {
      console.log('📤 Request body:', JSON.parse(finalOptions.body));
    }
    
    const response = await fetch(url, finalOptions);
    const data = await response.json();
    
    console.log(`📥 Response (${response.status}):`, data);
    console.log('');
    
    return { response, data };
  } catch (error) {
    console.error('❌ API call failed:', error);
    return { error };
  }
};

// Test functions
const testGetUsers = async () => {
  console.log('🧪 Testing GET /api/users');
  console.log('========================');
  
  const result = await apiCall('/api/users');
  
  if (result.response && result.response.ok) {
    console.log('✅ GET users successful');
    console.log(`📊 Found ${Array.isArray(result.data) ? result.data.length : 0} users`);
    return result.data;
  } else {
    console.log('❌ GET users failed');
    return [];
  }
};

const testCreateUser = async () => {
  console.log('🧪 Testing POST /api/users');
  console.log('===========================');
  
  const result = await apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify(testUser)
  });
  
  if (result.response && result.response.ok) {
    console.log('✅ Create user successful');
    return result.data.user;
  } else {
    console.log('❌ Create user failed');
    return null;
  }
};

const testUpdateUser = async (userId) => {
  console.log('🧪 Testing PUT /api/users/:id');
  console.log('==============================');
  
  const updatedData = {
    ...testUser,
    fullName: 'Updated Test User',
    department: 'Marketing',
    phone: '+84-111-222-333'
  };
  
  const result = await apiCall(`/api/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updatedData)
  });
  
  if (result.response && result.response.ok) {
    console.log('✅ Update user successful');
    return result.data.user;
  } else {
    console.log('❌ Update user failed');
    return null;
  }
};

const testToggleAdmin = async (userId, currentAdminStatus) => {
  console.log('🧪 Testing PUT /api/users/:id/admin');
  console.log('====================================');
  
  const result = await apiCall(`/api/users/${userId}/admin`, {
    method: 'PUT',
    body: JSON.stringify({ isAdmin: !currentAdminStatus })
  });
  
  if (result.response && result.response.ok) {
    console.log('✅ Toggle admin successful');
    return result.data.user;
  } else {
    console.log('❌ Toggle admin failed');
    return null;
  }
};

const testToggleStatus = async (userId, currentActiveStatus) => {
  console.log('🧪 Testing PUT /api/users/:id/status');
  console.log('=====================================');
  
  const result = await apiCall(`/api/users/${userId}/status`, {
    method: 'PUT',
    body: JSON.stringify({ isActive: !currentActiveStatus })
  });
  
  if (result.response && result.response.ok) {
    console.log('✅ Toggle status successful');
    return result.data.user;
  } else {
    console.log('❌ Toggle status failed');
    return null;
  }
};

const testDeleteUser = async (userId) => {
  console.log('🧪 Testing DELETE /api/users/:id');
  console.log('=================================');
  
  const result = await apiCall(`/api/users/${userId}`, {
    method: 'DELETE'
  });
  
  if (result.response && result.response.ok) {
    console.log('✅ Delete user successful');
    return true;
  } else {
    console.log('❌ Delete user failed');
    return false;
  }
};

// Test validation errors
const testValidationErrors = async () => {
  console.log('🧪 Testing Validation Errors');
  console.log('=============================');
  
  // Test missing username
  console.log('📝 Testing missing username...');
  await apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify({ email: 'test@example.com' })
  });
  
  // Test missing email
  console.log('📝 Testing missing email...');
  await apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify({ username: 'testuser' })
  });
  
  // Test duplicate username (if exists)
  console.log('📝 Testing duplicate username...');
  await apiCall('/api/users', {
    method: 'POST',
    body: JSON.stringify({ username: 'admin', email: 'new@example.com' })
  });
};

// Run comprehensive test suite
const runAllTests = async () => {
  console.log('🚀 Starting User Management API Tests');
  console.log('======================================');
  console.log('');
  
  try {
    // 1. Get initial users
    const initialUsers = await testGetUsers();
    
    // 2. Test validation errors
    await testValidationErrors();
    
    // 3. Create new user
    const createdUser = await testCreateUser();
    if (!createdUser) {
      console.log('❌ Cannot continue tests - user creation failed');
      return;
    }
    
    // 4. Update user
    const updatedUser = await testUpdateUser(createdUser.id);
    
    // 5. Toggle admin status
    const adminToggled = await testToggleAdmin(createdUser.id, createdUser.isAdmin);
    
    // 6. Toggle active status
    const statusToggled = await testToggleStatus(createdUser.id, createdUser.isActive);
    
    // 7. Get users again to verify changes
    console.log('🔄 Verifying changes...');
    await testGetUsers();
    
    // 8. Delete test user
    const deleted = await testDeleteUser(createdUser.id);
    
    // 9. Final verification
    console.log('🔄 Final verification...');
    const finalUsers = await testGetUsers();
    
    console.log('✅ All tests completed!');
    console.log(`📊 Initial users: ${initialUsers.length}`);
    console.log(`📊 Final users: ${finalUsers.length}`);
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
};

// Test individual endpoints
const testEndpoints = {
  getUsers: testGetUsers,
  createUser: testCreateUser,
  updateUser: testUpdateUser,
  toggleAdmin: testToggleAdmin,
  toggleStatus: testToggleStatus,
  deleteUser: testDeleteUser,
  validationErrors: testValidationErrors,
  runAll: runAllTests
};

// Export for use in browser or Node.js
if (typeof window !== 'undefined') {
  // Browser environment
  window.testUserAPI = testEndpoints;
  console.log('🔧 User API Test Functions Loaded');
  console.log('==================================');
  console.log('Available functions:');
  console.log('- testUserAPI.getUsers()');
  console.log('- testUserAPI.createUser()');
  console.log('- testUserAPI.updateUser(userId)');
  console.log('- testUserAPI.toggleAdmin(userId, currentStatus)');
  console.log('- testUserAPI.toggleStatus(userId, currentStatus)');
  console.log('- testUserAPI.deleteUser(userId)');
  console.log('- testUserAPI.validationErrors()');
  console.log('- testUserAPI.runAll()');
  console.log('');
  console.log('💡 Run testUserAPI.runAll() to execute all tests');
} else if (typeof module !== 'undefined' && module.exports) {
  // Node.js environment
  module.exports = testEndpoints;
  
  // Auto-run if called directly
  if (require.main === module) {
    runAllTests();
  }
}
