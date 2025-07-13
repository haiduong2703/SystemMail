const http = require('http');

function testMarkAsRead() {
  console.log('🧪 Testing Mark Mail as Read API...');
  
  // First get a mail to mark as read
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/mails',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const mails = JSON.parse(data);
        
        // Find a DungHan/mustRep mail that's not read
        const unreadMail = mails.find(mail => 
          mail.category === "DungHan" && 
          mail.status === "mustRep" && 
          !mail.isRead
        );

        if (unreadMail) {
          console.log(`📧 Found unread mail: ${unreadMail.Subject} (ID: ${unreadMail.id})`);
          markMailAsRead(unreadMail);
        } else {
          console.log('❌ No unread DungHan/mustRep mails found');
        }
      } catch (error) {
        console.error('❌ Error parsing mails:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error getting mails:', error.message);
  });

  req.end();
}

function markMailAsRead(mail) {
  console.log(`📖 Marking mail as read: ${mail.Subject}`);
  
  const postData = JSON.stringify({
    mailId: mail.id,
    fileName: mail.fileName,
    category: mail.category,
    status: mail.status
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/mark-mail-read',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        if (result.success) {
          console.log('✅ Mail marked as read successfully!');
          console.log(`📧 Mail ID: ${result.mailId}`);
          
          // Test getting updated stats
          setTimeout(() => {
            testUpdatedStats();
          }, 2000);
        } else {
          console.error('❌ Failed to mark mail as read:', result.error);
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error marking mail as read:', error.message);
  });

  req.write(postData);
  req.end();
}

function testUpdatedStats() {
  console.log('\n🔄 Testing updated stats after marking mail as read...');
  
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
        console.log(`- New Mails: ${stats.newMails} (should be reduced by 1)`);
        console.log(`- DungHan Count: ${stats.dungHanCount}`);
        console.log(`- QuaHan Count: ${stats.quaHanCount}`);
        console.log(`- DungHan Unreplied: ${stats.dungHanUnreplied}`);
        console.log(`- QuaHan Unreplied: ${stats.quaHanUnreplied}`);
        
        console.log('\n🎉 Mark as read test completed!');
        console.log('💡 NEW mail count should decrease when mail is marked as read.');
      } catch (error) {
        console.error('❌ Error parsing updated stats:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error getting updated stats:', error.message);
  });

  req.end();
}

// Run test
testMarkAsRead();
