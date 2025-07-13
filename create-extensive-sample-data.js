const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục gốc
const BASE_PATH = 'C:\\classifyMail';

// Tạo nhiều dữ liệu mẫu hơn
const extensiveMails = {
  'DungHan\\mustRep': [
    {
      fileName: 'Project deadline reminder.json',
      data: {
        "Subject": "Project deadline reminder - Due next Friday",
        "From": "Project Manager",
        "Type": "To",
        "Date": ["2025-01-21", "09:00"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Code review request.json',
      data: {
        "Subject": "Code review request for PR #456",
        "From": "GitHub",
        "Type": "CC",
        "Date": ["2025-01-20", "16:30"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Client meeting invitation.json',
      data: {
        "Subject": "Client meeting invitation - Tomorrow 3PM",
        "From": "Sales Team",
        "Type": "To",
        "Date": ["2025-01-19", "11:45"],
        "Check rep": false,
        "Status": "Read"
      }
    },
    {
      fileName: 'System update notification.json',
      data: {
        "Subject": "System update scheduled for this weekend",
        "From": "IT Department",
        "Type": "BCC",
        "Date": ["2025-01-18", "14:15"],
        "Check rep": false,
        "Status": "New"
      }
    },
    {
      fileName: 'Training session reminder.json',
      data: {
        "Subject": "Training session reminder - React Advanced Patterns",
        "From": "HR Department",
        "Type": "To",
        "Date": ["2025-01-17", "10:30"],
        "Check rep": false,
        "Status": "Read"
      }
    }
  ],
  'QuaHan\\chuaRep': [
    {
      fileName: 'Budget approval request.json',
      data: {
        "Subject": "Budget approval request for Q1 2025",
        "From": "Finance Team",
        "Type": "To",
        "Date": ["2024-11-20", "13:45"],
        "Check rep": false
      }
    },
    {
      fileName: 'Server migration notice.json',
      data: {
        "Subject": "Server migration notice - Action required",
        "From": "DevOps Team",
        "Type": "CC",
        "Date": ["2024-10-15", "08:30"],
        "Check rep": false
      }
    },
    {
      fileName: 'License renewal reminder.json',
      data: {
        "Subject": "Software license renewal reminder",
        "From": "Procurement",
        "Type": "To",
        "Date": ["2024-09-30", "16:00"],
        "Check rep": false
      }
    },
    {
      fileName: 'Security audit findings.json',
      data: {
        "Subject": "Security audit findings - Immediate attention required",
        "From": "Security Team",
        "Type": "To",
        "Date": ["2024-12-01", "09:15"],
        "Check rep": false
      }
    },
    {
      fileName: 'Performance review schedule.json',
      data: {
        "Subject": "Performance review schedule for Q4 2024",
        "From": "HR Manager",
        "Type": "BCC",
        "Date": ["2024-11-10", "14:30"],
        "Check rep": false
      }
    }
  ],
  'QuaHan\\daRep': [
    {
      fileName: 'Vacation request approved.json',
      data: {
        "Subject": "Vacation request approved - December 2024",
        "From": "HR System",
        "Type": "To",
        "Date": ["2024-10-20", "12:00"],
        "Check rep": true
      }
    },
    {
      fileName: 'Equipment request fulfilled.json',
      data: {
        "Subject": "Equipment request fulfilled - New laptop delivered",
        "From": "IT Support",
        "Type": "To",
        "Date": ["2024-09-15", "15:30"],
        "Check rep": true
      }
    },
    {
      fileName: 'Conference registration confirmed.json',
      data: {
        "Subject": "Conference registration confirmed - TechConf 2024",
        "From": "Event Organizer",
        "Type": "To",
        "Date": ["2024-08-25", "11:15"],
        "Check rep": true
      }
    },
    {
      fileName: 'Expense report approved.json',
      data: {
        "Subject": "Expense report approved - September 2024",
        "From": "Finance System",
        "Type": "To",
        "Date": ["2024-10-05", "16:45"],
        "Check rep": true
      }
    }
  ]
};

function createExtensiveData() {
  console.log('🚀 Tạo thêm dữ liệu mẫu mở rộng cho C:\\classifyMail\\...');

  try {
    // Tạo các file mail mẫu mở rộng
    Object.entries(extensiveMails).forEach(([folder, mails]) => {
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

    console.log('\n🎉 Hoàn thành! Đã tạo thêm dữ liệu mẫu mở rộng.');
    
    // Đếm tổng số file
    const dungHanMustRepPath = path.join(BASE_PATH, 'DungHan', 'mustRep');
    const quaHanChuaRepPath = path.join(BASE_PATH, 'QuaHan', 'chuaRep');
    const quaHanDaRepPath = path.join(BASE_PATH, 'QuaHan', 'daRep');
    
    const dungHanCount = fs.readdirSync(dungHanMustRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanChuaRepCount = fs.readdirSync(quaHanChuaRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanDaRepCount = fs.readdirSync(quaHanDaRepPath).filter(f => f.endsWith('.json')).length;
    
    console.log('\n📊 Thống kê dữ liệu sau khi mở rộng:');
    console.log(`- DungHan/mustRep: ${dungHanCount} files`);
    console.log(`- QuaHan/chuaRep: ${quaHanChuaRepCount} files`);
    console.log(`- QuaHan/daRep: ${quaHanDaRepCount} files`);
    console.log(`- Tổng cộng: ${dungHanCount + quaHanChuaRepCount + quaHanDaRepCount} files`);

    console.log('\n📁 Cấu trúc hoàn chỉnh:');
    console.log('C:\\classifyMail\\');
    console.log('├── DungHan\\');
    console.log(`│   ├── mustRep\\ (${dungHanCount} files)`);
    console.log('│   └── new.json');
    console.log('└── QuaHan\\');
    console.log(`    ├── chuaRep\\ (${quaHanChuaRepCount} files)`);
    console.log(`    └── daRep\\ (${quaHanDaRepCount} files)`);

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu mở rộng:', error.message);
    process.exit(1);
  }
}

// Chạy script
createExtensiveData();
