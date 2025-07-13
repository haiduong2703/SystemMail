/**
 * Test script for User Management functionality
 * This script can be used to test the user management features
 */

// Mock user data for testing
const mockUsers = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@company.com',
    fullName: 'System Administrator',
    isAdmin: true,
    isActive: true,
    department: 'IT',
    phone: '+84-123-456-789',
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    username: 'john.doe',
    email: 'john.doe@company.com',
    fullName: 'John Doe',
    isAdmin: false,
    isActive: true,
    department: 'Marketing',
    phone: '+84-987-654-321',
    createdAt: '2024-01-05',
    lastLogin: '2024-01-14 15:45:00'
  },
  {
    id: 3,
    username: 'jane.smith',
    email: 'jane.smith@company.com',
    fullName: 'Jane Smith',
    isAdmin: false,
    isActive: true,
    department: 'Sales',
    phone: '+84-555-123-456',
    createdAt: '2024-01-10',
    lastLogin: '2024-01-13 09:15:00'
  },
  {
    id: 4,
    username: 'mike.wilson',
    email: 'mike.wilson@company.com',
    fullName: 'Mike Wilson',
    isAdmin: true,
    isActive: false,
    department: 'HR',
    phone: '+84-777-888-999',
    createdAt: '2024-01-08',
    lastLogin: '2024-01-10 14:20:00'
  }
];

// Test functions
const testUserManagement = () => {
  console.log('🧪 Testing User Management Features');
  console.log('===================================');
  
  // Test user statistics
  const totalUsers = mockUsers.length;
  const adminUsers = mockUsers.filter(u => u.isAdmin).length;
  const activeUsers = mockUsers.filter(u => u.isActive).length;
  const inactiveUsers = mockUsers.filter(u => !u.isActive).length;
  
  console.log('📊 User Statistics:');
  console.log(`   - Total Users: ${totalUsers}`);
  console.log(`   - Administrators: ${adminUsers}`);
  console.log(`   - Active Users: ${activeUsers}`);
  console.log(`   - Inactive Users: ${inactiveUsers}`);
  console.log('');
  
  // Test user filtering
  console.log('🔍 User Filtering Tests:');
  console.log('   - IT Department:', mockUsers.filter(u => u.department === 'IT').length);
  console.log('   - Marketing Department:', mockUsers.filter(u => u.department === 'Marketing').length);
  console.log('   - Sales Department:', mockUsers.filter(u => u.department === 'Sales').length);
  console.log('   - HR Department:', mockUsers.filter(u => u.department === 'HR').length);
  console.log('');
  
  // Test user validation
  console.log('✅ User Validation Tests:');
  mockUsers.forEach(user => {
    const hasValidEmail = user.email && user.email.includes('@');
    const hasValidUsername = user.username && user.username.length > 0;
    const hasValidName = user.fullName && user.fullName.length > 0;
    
    console.log(`   - ${user.username}: Email(${hasValidEmail}) Username(${hasValidUsername}) Name(${hasValidName})`);
  });
  console.log('');
  
  // Test admin protection
  console.log('🛡️ Admin Protection Test:');
  const adminCount = mockUsers.filter(u => u.isAdmin).length;
  console.log(`   - Admin count: ${adminCount}`);
  console.log(`   - Can delete last admin: ${adminCount > 1 ? 'Yes' : 'No (Protected)'}`);
  console.log('');
  
  return {
    totalUsers,
    adminUsers,
    activeUsers,
    inactiveUsers,
    mockUsers
  };
};

// Test user form validation
const testUserFormValidation = (formData) => {
  console.log('📝 Testing User Form Validation');
  console.log('===============================');
  
  const errors = [];
  
  // Required field validation
  if (!formData.username || formData.username.trim().length === 0) {
    errors.push('Username is required');
  }
  
  if (!formData.email || formData.email.trim().length === 0) {
    errors.push('Email is required');
  } else if (!formData.email.includes('@')) {
    errors.push('Email must be valid');
  }
  
  // Username format validation
  if (formData.username && !/^[a-zA-Z0-9._-]+$/.test(formData.username)) {
    errors.push('Username can only contain letters, numbers, dots, underscores, and hyphens');
  }
  
  // Phone validation (if provided)
  if (formData.phone && !/^[\+]?[0-9\-\s\(\)]+$/.test(formData.phone)) {
    errors.push('Phone number format is invalid');
  }
  
  console.log('Form Data:', formData);
  console.log('Validation Errors:', errors);
  console.log('Is Valid:', errors.length === 0);
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Test user operations
const testUserOperations = () => {
  console.log('⚙️ Testing User Operations');
  console.log('==========================');
  
  let users = [...mockUsers];
  
  // Test add user
  const newUser = {
    id: 5,
    username: 'test.user',
    email: 'test.user@company.com',
    fullName: 'Test User',
    isAdmin: false,
    isActive: true,
    department: 'IT',
    phone: '+84-111-222-333',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: null
  };
  
  users.push(newUser);
  console.log('✅ Add User: Success');
  console.log(`   - New user count: ${users.length}`);
  
  // Test edit user
  const userToEdit = users.find(u => u.id === 2);
  if (userToEdit) {
    userToEdit.department = 'Sales';
    userToEdit.phone = '+84-999-888-777';
    console.log('✅ Edit User: Success');
    console.log(`   - Updated ${userToEdit.username}'s department to ${userToEdit.department}`);
  }
  
  // Test toggle admin
  const userToToggle = users.find(u => u.id === 3);
  if (userToToggle) {
    userToToggle.isAdmin = !userToToggle.isAdmin;
    console.log('✅ Toggle Admin: Success');
    console.log(`   - ${userToToggle.username} is now ${userToToggle.isAdmin ? 'admin' : 'regular user'}`);
  }
  
  // Test toggle status
  const userToDeactivate = users.find(u => u.id === 5);
  if (userToDeactivate) {
    userToDeactivate.isActive = false;
    console.log('✅ Toggle Status: Success');
    console.log(`   - ${userToDeactivate.username} is now ${userToDeactivate.isActive ? 'active' : 'inactive'}`);
  }
  
  // Test delete user (non-admin)
  const userToDelete = users.find(u => u.id === 5);
  if (userToDelete && !userToDelete.isAdmin) {
    users = users.filter(u => u.id !== 5);
    console.log('✅ Delete User: Success');
    console.log(`   - Deleted ${userToDelete.username}`);
    console.log(`   - User count: ${users.length}`);
  }
  
  return users;
};

// Test sample form data
const sampleFormData = [
  {
    username: 'valid.user',
    email: 'valid@company.com',
    fullName: 'Valid User',
    department: 'IT',
    phone: '+84-123-456-789',
    isAdmin: false,
    isActive: true
  },
  {
    username: '',
    email: 'invalid@company.com',
    fullName: 'Invalid User',
    department: 'IT',
    phone: '+84-123-456-789',
    isAdmin: false,
    isActive: true
  },
  {
    username: 'invalid.user',
    email: 'invalid-email',
    fullName: 'Invalid User',
    department: 'IT',
    phone: 'invalid-phone',
    isAdmin: false,
    isActive: true
  }
];

// Run all tests
const runAllTests = () => {
  console.log('🚀 Running All User Management Tests');
  console.log('=====================================');
  console.log('');
  
  // Test basic functionality
  const stats = testUserManagement();
  console.log('');
  
  // Test form validation
  sampleFormData.forEach((formData, index) => {
    console.log(`📝 Form Test ${index + 1}:`);
    testUserFormValidation(formData);
    console.log('');
  });
  
  // Test operations
  const updatedUsers = testUserOperations();
  console.log('');
  
  console.log('✅ All tests completed!');
  console.log('Final user count:', updatedUsers.length);
  
  return {
    stats,
    updatedUsers
  };
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testUserManagement = testUserManagement;
  window.testUserFormValidation = testUserFormValidation;
  window.testUserOperations = testUserOperations;
  window.runAllTests = runAllTests;
  window.mockUsers = mockUsers;
  
  console.log('🔧 User Management Test Functions Loaded');
  console.log('=========================================');
  console.log('Available functions:');
  console.log('- testUserManagement()');
  console.log('- testUserFormValidation(formData)');
  console.log('- testUserOperations()');
  console.log('- runAllTests()');
  console.log('');
  console.log('💡 Run runAllTests() to execute all tests');
}

// Auto-run if in Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    testUserManagement,
    testUserFormValidation,
    testUserOperations,
    runAllTests,
    mockUsers
  };
  
  // Auto-run tests
  runAllTests();
}
