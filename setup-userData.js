const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// Đường dẫn thư mục user data
const USER_DATA_PATH = 'C:\\classifyMail\\UserData';

// Password hashing utilities
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return { salt, hash };
};

// Tạo thư mục UserData
const createUserDirectory = () => {
  if (!fs.existsSync(USER_DATA_PATH)) {
    fs.mkdirSync(USER_DATA_PATH, { recursive: true });
    console.log(`📁 Created user data directory: ${USER_DATA_PATH}`);
  } else {
    console.log(`📁 User data directory already exists: ${USER_DATA_PATH}`);
  }
};

// Tạo user mặc định
const createDefaultUsers = () => {
  const defaultUsers = [
    {
      username: 'admin',
      email: 'admin@mailsystem.com',
      fullName: 'System Administrator',
      password: 'admin123',
      role: 'admin'
    },
    {
      username: 'manager',
      email: 'manager@mailsystem.com',
      fullName: 'Mail Manager',
      password: 'manager123',
      role: 'manager'
    },
    {
      username: 'user',
      email: 'user@mailsystem.com',
      fullName: 'Regular User',
      password: 'user123',
      role: 'user'
    }
  ];

  defaultUsers.forEach(userData => {
    const userFilePath = path.join(USER_DATA_PATH, `${userData.username}.json`);
    
    // Kiểm tra xem user đã tồn tại chưa
    if (fs.existsSync(userFilePath)) {
      console.log(`👤 User ${userData.username} already exists, skipping...`);
      return;
    }

    // Hash password
    const { salt, hash } = hashPassword(userData.password);

    // Tạo user record
    const userRecord = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      username: userData.username,
      email: userData.email,
      fullName: userData.fullName,
      role: userData.role,
      passwordHash: hash,
      passwordSalt: salt,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true
    };

    try {
      fs.writeFileSync(userFilePath, JSON.stringify(userRecord, null, 2));
      console.log(`✅ Created user: ${userData.username} (${userData.role})`);
      console.log(`   📧 Email: ${userData.email}`);
      console.log(`   🔑 Password: ${userData.password}`);
    } catch (error) {
      console.error(`❌ Error creating user ${userData.username}:`, error.message);
    }
  });
};

// Hiển thị thông tin hệ thống
const displaySystemInfo = () => {
  console.log('\n🎯 MAIL MANAGEMENT SYSTEM - USER SETUP COMPLETE');
  console.log('='.repeat(60));
  console.log(`📁 User Data Directory: ${USER_DATA_PATH}`);
  console.log('\n👥 Default Users Created:');
  console.log('┌─────────────┬─────────────────────────┬─────────────┬─────────┐');
  console.log('│ Username    │ Email                   │ Password    │ Role    │');
  console.log('├─────────────┼─────────────────────────┼─────────────┼─────────┤');
  console.log('│ admin       │ admin@mailsystem.com    │ admin123    │ admin   │');
  console.log('│ manager     │ manager@mailsystem.com  │ manager123  │ manager │');
  console.log('│ user        │ user@mailsystem.com     │ user123     │ user    │');
  console.log('└─────────────┴─────────────────────────┴─────────────┴─────────┘');
  console.log('\n🚀 You can now:');
  console.log('   1. Start the mail server: cd mail-server && npm start');
  console.log('   2. Start the React app: npm start');
  console.log('   3. Navigate to: http://localhost:3000/auth/login');
  console.log('   4. Register new users at: http://localhost:3000/auth/register');
  console.log('\n🔐 Password Security:');
  console.log('   - Passwords are hashed using PBKDF2 with SHA-512');
  console.log('   - Each password has a unique salt');
  console.log('   - Minimum password length: 6 characters');
  console.log('\n📝 User Roles:');
  console.log('   - admin: Full system access');
  console.log('   - manager: Mail management and user oversight');
  console.log('   - user: Basic mail access');
};

// Main setup function
const setupUserData = () => {
  console.log('🔧 Setting up Mail Management System User Data...\n');
  
  try {
    // Tạo thư mục
    createUserDirectory();
    
    // Tạo users mặc định
    createDefaultUsers();
    
    // Hiển thị thông tin
    displaySystemInfo();
    
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
};

// Chạy setup
if (require.main === module) {
  setupUserData();
}

module.exports = {
  setupUserData,
  createUserDirectory,
  createDefaultUsers,
  hashPassword
};
