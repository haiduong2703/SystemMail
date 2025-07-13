const fs = require('fs');
const path = require('path');

// Đường dẫn thư mục gốc
const BASE_PATH = 'C:\\classifyMail';

// Xóa dữ liệu cũ và tạo dữ liệu mới với format ID
function clearOldData() {
  const folders = [
    path.join(BASE_PATH, 'DungHan', 'mustRep'),
    path.join(BASE_PATH, 'QuaHan', 'chuaRep'),
    path.join(BASE_PATH, 'QuaHan', 'daRep')
  ];

  folders.forEach(folder => {
    if (fs.existsSync(folder)) {
      const files = fs.readdirSync(folder).filter(f => f.endsWith('.json'));
      files.forEach(file => {
        fs.unlinkSync(path.join(folder, file));
      });
      console.log(`🗑️ Đã xóa ${files.length} files cũ từ ${folder}`);
    }
  });
}

// Dữ liệu mẫu mới với format ID
const newFormatMails = {
  'DungHan\\mustRep': [
    {
      id: '13579',
      data: {
        "Subject": "test6/12",
        "From": "duongg@gmail.com",
        "Type": "To",
        "Date": ["2025-06-11", "03:41"],
        "SummaryContent": "This is a test email with special characters in subject",
        "id": "13579"
      }
    },
    {
      id: '24680',
      data: {
        "Subject": "Weekly team meeting reminder - Tomorrow 2PM",
        "From": "Microsoft Teams",
        "Type": "To",
        "Date": ["2025-01-20", "14:30"],
        "SummaryContent": "Don't forget about our weekly team meeting tomorrow at 2PM in conference room A",
        "id": "24680"
      }
    },
    {
      id: '35791',
      data: {
        "Subject": "Your Amazon order #123456 has been shipped",
        "From": "Amazon",
        "Type": "To",
        "Date": ["2025-01-19", "09:15"],
        "SummaryContent": "Your order containing 1 item has been shipped and will arrive by January 22",
        "id": "35791"
      }
    },
    {
      id: '46802',
      data: {
        "Subject": "Security alert: New device signed in",
        "From": "Google Security",
        "Type": "To",
        "Date": ["2025-01-18", "16:45"],
        "SummaryContent": "We noticed a new sign-in to your Google Account from a Windows device",
        "id": "46802"
      }
    },
    {
      id: '57913',
      data: {
        "Subject": "Code review request for PR #456",
        "From": "GitHub",
        "Type": "CC",
        "Date": ["2025-01-17", "11:30"],
        "SummaryContent": "Please review the pull request for the new authentication feature",
        "id": "57913"
      }
    },
    {
      id: '68024',
      data: {
        "Subject": "Project deadline reminder",
        "From": "Project Manager",
        "Type": "To",
        "Date": ["2025-01-16", "08:00"],
        "SummaryContent": "Reminder that the Q1 project deliverables are due next Friday",
        "id": "68024"
      }
    }
  ],
  'QuaHan\\chuaRep': [
    {
      id: '79135',
      data: {
        "Subject": "Budget approval request for Q1 2025",
        "From": "Finance Team",
        "Type": "To",
        "Date": ["2024-11-20", "13:45"],
        "SummaryContent": "Please review and approve the budget allocation for Q1 2025 projects",
        "id": "79135"
      }
    },
    {
      id: '80246',
      data: {
        "Subject": "Server migration notice - Action required",
        "From": "DevOps Team",
        "Type": "CC",
        "Date": ["2024-10-15", "08:30"],
        "SummaryContent": "Important: All applications need to be migrated to the new server by December 1st",
        "id": "80246"
      }
    },
    {
      id: '91357',
      data: {
        "Subject": "Software license renewal reminder",
        "From": "Procurement",
        "Type": "To",
        "Date": ["2024-09-30", "16:00"],
        "SummaryContent": "Annual software licenses are expiring soon. Please submit renewal requests",
        "id": "91357"
      }
    },
    {
      id: '02468',
      data: {
        "Subject": "Security audit findings",
        "From": "Security Team",
        "Type": "To",
        "Date": ["2024-12-01", "09:15"],
        "SummaryContent": "Critical security vulnerabilities found during audit. Immediate action required",
        "id": "02468"
      }
    }
  ],
  'QuaHan\\daRep': [
    {
      id: '13579',
      data: {
        "Subject": "Vacation request approved",
        "From": "HR System",
        "Type": "To",
        "Date": ["2024-10-20", "12:00"],
        "SummaryContent": "Your vacation request for December 2024 has been approved",
        "id": "13579"
      }
    },
    {
      id: '24680',
      data: {
        "Subject": "Equipment request fulfilled",
        "From": "IT Support",
        "Type": "To",
        "Date": ["2024-09-15", "15:30"],
        "SummaryContent": "Your new laptop has been delivered to your desk. Please confirm receipt",
        "id": "24680"
      }
    },
    {
      id: '35791',
      data: {
        "Subject": "Conference registration confirmed",
        "From": "Event Organizer",
        "Type": "To",
        "Date": ["2024-08-25", "11:15"],
        "SummaryContent": "Your registration for TechConf 2024 has been confirmed. Event details attached",
        "id": "35791"
      }
    }
  ]
};

// File new.json mới
const newJsonData = {
  "Reload status": false
};

function createNewFormatData() {
  console.log('🚀 Tạo dữ liệu mẫu mới với format ID...');

  try {
    // Xóa dữ liệu cũ
    clearOldData();

    // Tạo các file mail mẫu mới
    Object.entries(newFormatMails).forEach(([folder, mails]) => {
      mails.forEach(mail => {
        const fileName = `${mail.id}.json`;
        const filePath = path.join(BASE_PATH, folder, fileName);
        
        fs.writeFileSync(filePath, JSON.stringify(mail.data, null, 2));
        console.log(`✅ Đã tạo file: ${filePath}`);
      });
    });

    // Cập nhật file new.json
    const newJsonPath = path.join(BASE_PATH, 'DungHan', 'new.json');
    fs.writeFileSync(newJsonPath, JSON.stringify(newJsonData, null, 2));
    console.log(`✅ Đã cập nhật file: ${newJsonPath}`);

    console.log('\n🎉 Hoàn thành! Đã tạo dữ liệu mẫu mới với format ID.');
    
    // Đếm tổng số file
    const dungHanMustRepPath = path.join(BASE_PATH, 'DungHan', 'mustRep');
    const quaHanChuaRepPath = path.join(BASE_PATH, 'QuaHan', 'chuaRep');
    const quaHanDaRepPath = path.join(BASE_PATH, 'QuaHan', 'daRep');
    
    const dungHanCount = fs.readdirSync(dungHanMustRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanChuaRepCount = fs.readdirSync(quaHanChuaRepPath).filter(f => f.endsWith('.json')).length;
    const quaHanDaRepCount = fs.readdirSync(quaHanDaRepPath).filter(f => f.endsWith('.json')).length;
    
    console.log('\n📊 Thống kê dữ liệu mới:');
    console.log(`- DungHan/mustRep: ${dungHanCount} files`);
    console.log(`- QuaHan/chuaRep: ${quaHanChuaRepCount} files`);
    console.log(`- QuaHan/daRep: ${quaHanDaRepCount} files`);
    console.log(`- Tổng cộng: ${dungHanCount + quaHanChuaRepCount + quaHanDaRepCount} files`);

    console.log('\n📝 Format mới:');
    console.log('- Filename: [ID].json (VD: 13579.json)');
    console.log('- Bỏ "Check rep" và "Status" fields');
    console.log('- Thêm "SummaryContent" và "id" fields');
    console.log('- Subject có thể chứa ký tự đặc biệt');

  } catch (error) {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu mới:', error.message);
    process.exit(1);
  }
}

// Chạy script
createNewFormatData();
