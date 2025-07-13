const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục gốc
const BASE_PATH = 'C:\\classifyMail';

// Cấu trúc thư mục mới
const FOLDER_STRUCTURE = [
  'DungHan\\mustRep',
  'QuaHan\\chuaRep',
  'QuaHan\\daRep'
];

// Sample mail data
const sampleMails = {
  'DungHan\\mustRep': [
    {
      fileName: 'LinkedIn notification.json',
      data: {
        "Subject": "Jitender Girdhar and others share their thoughts on LinkedIn",
        "From": "LinkedIn",
        "Type": "To",
        "Date": ["2025-01-14", "19:31"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Medium weekly digest.json',
      data: {
        "Subject": "Your weekly digest from Medium",
        "From": "Medium",
        "Type": "To",
        "Date": ["2025-01-13", "08:00"],
        "Check rep": false,
        "Status": "Read"
      }
    }
  ],
  'QuaHan\\chuaRep': [
    {
      fileName: 'GitHub verification.json',
      data: {
        "Subject": "Welcome to GitHub - Verify your email",
        "From": "GitHub",
        "Type": "To",
        "Date": ["2024-12-20", "10:30"],
        "Check rep": false
      }
    },
    {
      fileName: 'Spotify invoice.json',
      data: {
        "Subject": "Your invoice from Spotify Premium",
        "From": "Spotify",
        "Type": "To",
        "Date": ["2024-12-15", "14:20"],
        "Check rep": false
      }
    }
  ],
  'QuaHan\\daRep': [
    {
      fileName: 'Facebook password reset.json',
      data: {
        "Subject": "Password reset request for your account",
        "From": "Facebook",
        "Type": "To",
        "Date": ["2024-11-28", "09:15"],
        "Check rep": true
      }
    }
  ]
};

// File new.json cho DungHan
const newJsonData = {
  "Reload status": false,
  "Status": "Read"
};

function createDirectoryStructure() {
  console.log('🚀 Tạo cấu trúc thư mục C:\\classifyMail\\...');

  try {
    // Tạo thư mục gốc
    if (!fs.existsSync(BASE_PATH)) {
      fs.mkdirSync(BASE_PATH, { recursive: true });
      console.log(`✅ Đã tạo thư mục gốc: ${BASE_PATH}`);
    }

    // Tạo các thư mục con
    FOLDER_STRUCTURE.forEach(folder => {
      const fullPath = path.join(BASE_PATH, folder);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Đã tạo thư mục: ${fullPath}`);
      }
    });

    // Tạo file new.json
    const newJsonPath = path.join(BASE_PATH, 'DungHan', 'new.json');
    fs.writeFileSync(newJsonPath, JSON.stringify(newJsonData, null, 2));
    console.log(`✅ Đã tạo file: ${newJsonPath}`);

    // Tạo các file mail mẫu
    Object.entries(sampleMails).forEach(([folder, mails]) => {
      mails.forEach(mail => {
        const filePath = path.join(BASE_PATH, folder, mail.fileName);
        fs.writeFileSync(filePath, JSON.stringify(mail.data, null, 2));
        console.log(`✅ Đã tạo file mail: ${filePath}`);
      });
    });

    console.log('\n🎉 Hoàn thành! Cấu trúc thư mục đã được tạo thành công.');
    console.log('\n📁 Cấu trúc được tạo:');
    console.log('C:\\classifyMail\\');
    console.log('├── DungHan\\');
    console.log('│   ├── mustRep\\');
    console.log('│   │   ├── LinkedIn notification.json');
    console.log('│   │   └── Medium weekly digest.json');
    console.log('│   └── new.json');
    console.log('└── QuaHan\\');
    console.log('    ├── chuaRep\\');
    console.log('    │   ├── GitHub verification.json');
    console.log('    │   └── Spotify invoice.json');
    console.log('    └── daRep\\');
    console.log('        └── Facebook password reset.json');

  } catch (error) {
    console.error('❌ Lỗi khi tạo cấu trúc thư mục:', error.message);
    process.exit(1);
  }
}

// Chạy script
createDirectoryStructure();
