/**
 * Test script for Real User JSON Structure
 * This script tests the user management with the actual JSON structure from C:\classifyMail\UserData
 */

// Real user structure from the system
const realUserStructure = {
  "id": "1752222258248nqljnian7",
  "username": "admin",
  "email": "admin@mailsystem.com",
  "fullName": "System Administrator",
  "role": "admin",
  "passwordHash": "d93878d6334342d25c4e23b1ae2c9808b344f7a6169d2645b36916e22064df2ae73c8746728f0210fbf5a3868736efe2ab2c6d8876fa9bf5e22236ef514bab6c",
  "passwordSalt": "02d6f46bd6ed3607aed0399711aec1f1",
  "createdAt": "2025-07-11T08:24:18.248Z",
  "updatedAt": "2025-07-11T08:24:18.248Z",
  "isActive": true
};

// Test data for creating new users
const testUsers = [
  {
    username: 'test.user1',
    email: 'test1@mailsystem.com',
    fullName: 'Test User One',
    department: 'IT',
    phone: '+84-111-222-333',
    isAdmin: false,
    isActive: true
  },
  {
    username: 'test.admin',
    email: 'testadmin@mailsystem.com',
    fullName: 'Test Admin User',
    department: 'Management',
    phone: '+84-444-555-666',
    isAdmin: true,
    isActive: true
  }
];

// Helper function to make API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `http://localhost:3002${endpoint}`;
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
    
    return { response, data, success: response.ok };
  } catch (error) {
    console.error('❌ API call failed:', error);
    return { error, success: false };
  }
};

// Test structure mapping
const testStructureMapping = () => {
  console.log('🧪 Testing Structure Mapping');
  console.log('============================');
  
  // Test mapping from real structure to frontend format
  const { passwordHash, passwordSalt, ...safeUserData } = realUserStructure;
  const mappedUser = {
    ...safeUserData,
    isAdmin: realUserStructure.role === 'admin',
    department: realUserStructure.department || '',
    phone: realUserStructure.phone || '',
    lastLogin: realUserStructure.lastLogin || null
  };
  
  console.log('📊 Original structure:', realUserStructure);
  console.log('📊 Mapped for frontend:', mappedUser);
  console.log('✅ Structure mapping test completed');
  console.log('');
  
  return mappedUser;
};

// Test user creation with real structure
const testCreateUserWithRealStructure = async () => {
  console.log('🧪 Testing User Creation with Real Structure');
  console.log('============================================');
  
  for (const testUser of testUsers) {
    console.log(`📝 Creating user: ${testUser.username}`);
    
    const result = await apiCall('/api/users', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    
    if (result.success) {
      console.log('✅ User created successfully');
      console.log('📊 Created user structure:', result.data.user);
      
      // Verify the structure matches expectations
      const user = result.data.user;
      const hasRequiredFields = user.id && user.username && user.email && user.role && user.createdAt;
      const hasCorrectRole = user.role === (testUser.isAdmin ? 'admin' : 'user');
      const hasIsAdminMapped = user.isAdmin === testUser.isAdmin;
      
      console.log('🔍 Structure validation:');
      console.log(`   - Has required fields: ${hasRequiredFields}`);
      console.log(`   - Correct role: ${hasCorrectRole}`);
      console.log(`   - isAdmin mapped: ${hasIsAdminMapped}`);
      
      if (hasRequiredFields && hasCorrectRole && hasIsAdminMapped) {
        console.log('✅ Structure validation passed');
      } else {
        console.log('❌ Structure validation failed');
      }
    } else {
      console.log('❌ User creation failed');
    }
    console.log('');
  }
};

// Test loading users and structure
const testLoadUsersStructure = async () => {
  console.log('🧪 Testing Load Users Structure');
  console.log('===============================');
  
  const result = await apiCall('/api/users');
  
  if (result.success) {
    console.log('✅ Users loaded successfully');
    console.log(`📊 Found ${result.data.length} users`);
    
    // Analyze structure of each user
    result.data.forEach((user, index) => {
      console.log(`👤 User ${index + 1}: ${user.username}`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role: ${user.role}`);
      console.log(`   - isAdmin: ${user.isAdmin}`);
      console.log(`   - isActive: ${user.isActive}`);
      console.log(`   - Has passwordHash: ${user.passwordHash ? 'Yes (SECURITY ISSUE!)' : 'No (Good)'}`);
      console.log(`   - Has passwordSalt: ${user.passwordSalt ? 'Yes (SECURITY ISSUE!)' : 'No (Good)'}`);
      console.log(`   - Department: ${user.department || 'Not set'}`);
      console.log(`   - Phone: ${user.phone || 'Not set'}`);
      console.log(`   - Created: ${user.createdAt}`);
      console.log(`   - Updated: ${user.updatedAt}`);
      console.log(`   - Last Login: ${user.lastLogin || 'Never'}`);
      console.log('');
    });
  } else {
    console.log('❌ Failed to load users');
  }
  
  return result.data || [];
};

// Test role-based operations
const testRoleBasedOperations = async () => {
  console.log('🧪 Testing Role-Based Operations');
  console.log('================================');
  
  // First, get current users
  const usersResult = await apiCall('/api/users');
  if (!usersResult.success) {
    console.log('❌ Cannot test role operations - failed to load users');
    return;
  }
  
  const users = usersResult.data;
  const testUser = users.find(u => u.username.includes('test') && u.role === 'user');
  
  if (!testUser) {
    console.log('⚠️ No test user found for role operations');
    return;
  }
  
  console.log(`🔄 Testing with user: ${testUser.username} (current role: ${testUser.role})`);
  
  // Test toggle to admin
  console.log('📝 Toggling to admin...');
  const toggleResult = await apiCall(`/api/users/${testUser.id}/admin`, {
    method: 'PUT',
    body: JSON.stringify({ isAdmin: true })
  });
  
  if (toggleResult.success) {
    console.log('✅ Successfully toggled to admin');
    console.log('📊 Updated user:', toggleResult.data.user);
    
    // Verify the role was updated
    const updatedUser = toggleResult.data.user;
    if (updatedUser.role === 'admin' && updatedUser.isAdmin === true) {
      console.log('✅ Role update validation passed');
    } else {
      console.log('❌ Role update validation failed');
      console.log(`   Expected: role='admin', isAdmin=true`);
      console.log(`   Got: role='${updatedUser.role}', isAdmin=${updatedUser.isAdmin}`);
    }
  } else {
    console.log('❌ Failed to toggle to admin');
  }
  
  console.log('');
};

// Cleanup test users
const cleanupTestUsers = async () => {
  console.log('🧹 Cleaning up test users');
  console.log('=========================');
  
  const usersResult = await apiCall('/api/users');
  if (!usersResult.success) {
    console.log('❌ Cannot cleanup - failed to load users');
    return;
  }
  
  const users = usersResult.data;
  const testUsersToDelete = users.filter(u => u.username.includes('test'));
  
  for (const user of testUsersToDelete) {
    console.log(`🗑️ Deleting test user: ${user.username}`);
    
    const deleteResult = await apiCall(`/api/users/${user.id}`, {
      method: 'DELETE'
    });
    
    if (deleteResult.success) {
      console.log('✅ Test user deleted successfully');
    } else {
      console.log('❌ Failed to delete test user');
    }
  }
  
  console.log('🧹 Cleanup completed');
  console.log('');
};

// Run comprehensive test
const runRealStructureTests = async () => {
  console.log('🚀 Starting Real User Structure Tests');
  console.log('======================================');
  console.log('');
  
  try {
    // 1. Test structure mapping
    testStructureMapping();
    
    // 2. Test loading existing users
    await testLoadUsersStructure();
    
    // 3. Test creating users with real structure
    await testCreateUserWithRealStructure();
    
    // 4. Test role-based operations
    await testRoleBasedOperations();
    
    // 5. Test loading users again to see changes
    console.log('🔄 Final verification...');
    await testLoadUsersStructure();
    
    // 6. Cleanup test users
    await cleanupTestUsers();
    
    console.log('✅ All real structure tests completed!');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
};

// Export for use
if (typeof window !== 'undefined') {
  window.testRealStructure = {
    runAll: runRealStructureTests,
    testMapping: testStructureMapping,
    testLoad: testLoadUsersStructure,
    testCreate: testCreateUserWithRealStructure,
    testRoles: testRoleBasedOperations,
    cleanup: cleanupTestUsers
  };
  
  console.log('🔧 Real Structure Test Functions Loaded');
  console.log('=======================================');
  console.log('Available functions:');
  console.log('- testRealStructure.runAll()');
  console.log('- testRealStructure.testMapping()');
  console.log('- testRealStructure.testLoad()');
  console.log('- testRealStructure.testCreate()');
  console.log('- testRealStructure.testRoles()');
  console.log('- testRealStructure.cleanup()');
  console.log('');
  console.log('💡 Run testRealStructure.runAll() to execute all tests');
} else if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runRealStructureTests,
    testStructureMapping,
    testLoadUsersStructure,
    testCreateUserWithRealStructure,
    testRoleBasedOperations,
    cleanupTestUsers,
    realUserStructure
  };
  
  // Auto-run if called directly
  if (require.main === module) {
    runRealStructureTests();
  }
}
