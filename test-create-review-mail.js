const http = require('http');
const fs = require('fs');
const path = require('path');

// Tạo folder ReviewMail nếu chưa có
const reviewMailPath = 'C:\\classifyMail\\ReviewMail';
if (!fs.existsSync(reviewMailPath)) {
  fs.mkdirSync(reviewMailPath, { recursive: true });
  console.log('📁 Created ReviewMail folder');
}

// Tạo một số file test cho ReviewMail
const testMails = [
  {
    id: 'review001',
    Subject: 'Yêu cầu xem xét hợp đồng',
    From: 'legal@company.com',
    Type: 'To',
    Date: [new Date().toISOString().split('T')[0], new Date().toTimeString().slice(0, 5)],
    SummaryContent: 'Cần xem xét và phê duyệt hợp đồng mới với đối tác.',
    Body: '<p>Kính gửi anh/chị,</p><p>Chúng tôi cần anh/chị xem xét và phê duyệt hợp đồng đính kèm.</p>',
    isRead: false
  },
  {
    id: 'review002',
    Subject: 'Đề xuất thay đổi quy trình',
    From: 'hr@company.com',
    Type: 'CC',
    Date: [new Date().toISOString().split('T')[0], new Date().toTimeString().slice(0, 5)],
    SummaryContent: 'Đề xuất cập nhật quy trình làm việc từ xa.',
    Body: '<p>Đề xuất thay đổi quy trình làm việc để phù hợp với tình hình hiện tại.</p>',
    isRead: false
  },
  {
    id: 'review003',
    Subject: 'Báo cáo tài chính Q4',
    From: 'finance@company.com',
    Type: 'To',
    Date: [new Date().toISOString().split('T')[0], new Date().toTimeString().slice(0, 5)],
    SummaryContent: 'Báo cáo tài chính quý 4 cần được xem xét.',
    Body: '<p>Báo cáo tài chính quý 4 đã hoàn thành, cần anh/chị xem xét.</p>',
    isRead: true
  }
];

// Tạo các file JSON
testMails.forEach(mail => {
  const fileName = `${mail.id}.json`;
  const filePath = path.join(reviewMailPath, fileName);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(mail, null, 2), 'utf8');
    console.log(`✅ Created test file: ${fileName}`);
  } catch (error) {
    console.error(`❌ Error creating ${fileName}:`, error);
  }
});

console.log('\n🎉 Test ReviewMail files created successfully!');
console.log(`📁 Location: ${reviewMailPath}`);
console.log(`📧 Created ${testMails.length} test mails`);

// Test API sau khi tạo file
setTimeout(() => {
  console.log('\n🧪 Testing API after creating ReviewMail files...');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/mail-stats',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const stats = JSON.parse(data);
        console.log('📊 Updated Mail Stats:');
        console.log(`- Total Mails: ${stats.totalMails}`);
        console.log(`- DungHan Count: ${stats.dungHanCount}`);
        console.log(`- QuaHan Count: ${stats.quaHanCount}`);
        console.log(`- ReviewMail Count: ${stats.reviewMailCount || 0} ✅`);
        console.log(`- New Mails: ${stats.newMails}`);
      } catch (error) {
        console.error('❌ Error parsing stats:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error getting stats:', error.message);
  });

  req.end();
}, 2000);
