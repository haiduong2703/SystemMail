const http = require('http');

function createNewMail() {
  console.log('🧪 Testing Create New Mail API...');
  
  const postData = JSON.stringify({
    subject: 'Test mail with special chars: /\\<>|?*',
    from: 'test@example.com',
    type: 'To'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/simulate-new-mail',
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
          console.log('✅ Mail created successfully!');
          console.log(`📧 Filename: ${result.fileName}`);
          console.log(`📝 Subject: ${result.mailData.Subject}`);
          console.log(`👤 From: ${result.mailData.From}`);
          console.log(`🆔 ID: ${result.mailData.id}`);
          console.log(`📄 SummaryContent: ${result.mailData.SummaryContent}`);
          
          // Test getting updated stats
          setTimeout(() => {
            testUpdatedStats();
          }, 2000);
        } else {
          console.error('❌ Failed to create mail:', result.error);
        }
      } catch (error) {
        console.error('❌ Error parsing response:', error);
        console.log('Raw response:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error creating mail:', error.message);
  });

  req.write(postData);
  req.end();
}

function testUpdatedStats() {
  console.log('\n🔄 Testing updated stats after creating new mail...');
  
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
        console.log(`- New Mails: ${stats.newMails}`);
        console.log(`- DungHan Count: ${stats.dungHanCount}`);
        console.log(`- QuaHan Count: ${stats.quaHanCount}`);
        console.log(`- DungHan Unreplied: ${stats.dungHanUnreplied}`);
        console.log(`- QuaHan Unreplied: ${stats.quaHanUnreplied}`);
        
        console.log('\n🎉 Test completed! New mail should appear in the frontend.');
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
createNewMail();
