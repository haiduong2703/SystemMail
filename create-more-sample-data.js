const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục gốc
const BASE_PATH = 'C:\\classifyMail';

// Thêm nhiều dữ liệu mẫu
const additionalMails = {
  'DungHan\\mustRep': [
    {
      fileName: 'Weekly team meeting reminder.json',
      data: {
        "Subject": "Weekly team meeting reminder - Tomorrow 2PM",
        "From": "Microsoft Teams",
        "Type": "To",
        "Date": ["2025-01-20", "14:30"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Your Amazon order update.json',
      data: {
        "Subject": "Your Amazon order #123456 has been shipped",
        "From": "Amazon",
        "Type": "To",
        "Date": ["2025-01-19", "09:15"],
        "Check rep": false,
        "Status": "Read"
      }
    },
    {
      fileName: 'Security alert from Google.json',
      data: {
        "Subject": "Security alert: New device signed in to your account",
        "From": "Google Security",
        "Type": "To",
        "Date": ["2025-01-18", "16:45"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Newsletter from TechCrunch.json',
      data: {
        "Subject": "TechCrunch Daily: Latest tech news and updates",
        "From": "TechCrunch",
        "Type": "CC",
        "Date": ["2025-01-17", "07:00"],
        "Check rep": false,
        "Status": "Read"
      }
    },
    {
      fileName: 'Invoice from Spotify.json',
      data: {
        "Subject": "Your Spotify Premium subscription invoice",
        "From": "Spotify",
        "Type": "To",
        "Date": ["2025-01-16", "12:30"],
        "Check rep": false,
        "Status": "New"
      }
    }
  ],
  'QuaHan\\chuaRep': [
    {
      fileName: 'Password reset from Facebook.json',
      data: {
        "Subject": "Password reset request for your Facebook account",
        "From": "Facebook Security",
        "Type": "To",
        "Date": ["2024-11-15", "10:20"],
        "Check rep": false
      }
    },
    {
      fileName: 'Welcome email from Discord.json',
      data: {
        "Subject": "Welcome to Discord! Verify your email address",
        "From": "Discord",
        "Type": "To",
        "Date": ["2024-10-28", "18:45"],
        "Check rep": false
      }
    },
    {
      fileName: 'System maintenance notification.json',
      data: {
        "Subject": "Scheduled system maintenance tonight 11PM-2AM",
        "From": "IT Support",
        "Type": "BCC",
        "Date": ["2024-12-05", "15:30"],
        "Check rep": false
      }
    },
    {
      fileName: 'Monthly report from Analytics.json',
      data: {
        "Subject": "Monthly analytics report - November 2024",
        "From": "Google Analytics",
        "Type": "CC",
        "Date": ["2024-11-30", "23:59"],
        "Check rep": false
      }
    }
  ],
  'QuaHan\\daRep': [
    {
      fileName: 'Meeting confirmation.json',
      data: {
        "Subject": "Meeting confirmation: Project review session",
        "From": "Calendar Assistant",
        "Type": "To",
        "Date": ["2024-10-15", "14:00"],
        "Check rep": true
      }
    },
    {
      fileName: 'Order confirmation from Apple.json',
      data: {
        "Subject": "Your Apple Store order confirmation #AP789012",
        "From": "Apple Store",
        "Type": "To",
        "Date": ["2024-09-22", "11:30"],
        "Check rep": true
      }
    },
    {
      fileName: 'Welcome to GitHub Enterprise.json',
      data: {
        "Subject": "Welcome to GitHub Enterprise - Setup your account",
        "From": "GitHub Enterprise",
        "Type": "To",
        "Date": ["2024-08-10", "09:45"],
        "Check rep": true
      }
    }
  ]
};

function createAdditionalData() {
  console.log('🚀 Tạo thêm dữ liệu mẫu cho C:\\classifyMail\\...');

  try {
    // Tạo các file mail mẫu bổ sung
    Object.entries(additionalMails).forEach(([folder, mails]) => {
      mails.forEach(mail => {
        const filePath = path.join(BASE_PATH, folder, mail.fileName);
        
        // Kiểm tra file đã tồn tại chưa
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, JSON.stringify(mail.data, null, 2));
          console.log(`✅ Đã tạo file mail: ${filePath}`);
        } else {
          console.log(`⚠️ File đã tồn tại: ${filePath}`);
        }
      });
    });

    console.log('\n🎉 Hoàn thành! Đã tạo thêm dữ liệu mẫu.');
    
    // Đếm tổng số file
    const dungHanMustRepPath = path.join(BASE_PATH, 'DungHan', 'mustRep');
    const quaHanChuaRepPath = path.join(BASE_PATH, 'QuaHan', 'chuaRep');
    const quaHanDaRepPath = path.join(BASE_PATH, 'QuaHan', 'daRep');
    
    const dungHanCount = fs.readdirSync(dungHanMustRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanChuaRepCount = fs.readdirSync(quaHanChuaRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanDaRepCount = fs.readdirSync(quaHanDaRepPath).filter(f => f.endsWith('.json')).length;
    
    console.log('\n📊 Thống kê dữ liệu:');
    console.log(`- DungHan/mustRep: ${dungHanCount} files`);
    console.log(`- QuaHan/chuaRep: ${quaHanChuaRepCount} files`);
    console.log(`- QuaHan/daRep: ${quaHanDaRepCount} files`);
    console.log(`- Tổng cộng: ${dungHanCount + quaHanChuaRepCount + quaHanDaRepCount} files`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', error.message);
    process.exit(1);
  }
}

// Chạy script
createAdditionalData();
