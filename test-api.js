const http = require('http');

function testAPI() {
  console.log('🧪 Testing Mail API...');
  
  // Test mail-stats endpoint
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
        console.log('📊 Mail Stats:');
        console.log(`- Total Mails: ${stats.totalMails}`);
        console.log(`- New Mails: ${stats.newMails}`);
        console.log(`- DungHan Count: ${stats.dungHanCount}`);
        console.log(`- QuaHan Count: ${stats.quaHanCount}`);
        console.log(`- DungHan Unreplied: ${stats.dungHanUnreplied}`);
        console.log(`- QuaHan Unreplied: ${stats.quaHanUnreplied}`);
        console.log(`- Last Update: ${stats.lastUpdate}`);
        
        // Test mails endpoint
        testMailsEndpoint();
      } catch (error) {
        console.error('❌ Error parsing stats:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error connecting to API:', error.message);
  });

  req.end();
}

function testMailsEndpoint() {
  console.log('\n🧪 Testing Mails Endpoint...');
  
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
        console.log(`📧 Total Mails Loaded: ${mails.length}`);
        
        // Count by category and status
        const dungHanMustRep = mails.filter(m => m.category === 'DungHan' && m.status === 'mustRep').length;
        const quaHanChuaRep = mails.filter(m => m.category === 'QuaHan' && m.status === 'chuaRep').length;
        const quaHanDaRep = mails.filter(m => m.category === 'QuaHan' && m.status === 'daRep').length;
        const newFile = mails.filter(m => m.fileName === 'new.json').length;
        
        console.log('📂 Breakdown by Category:');
        console.log(`- DungHan/mustRep: ${dungHanMustRep} files`);
        console.log(`- QuaHan/chuaRep: ${quaHanChuaRep} files`);
        console.log(`- QuaHan/daRep: ${quaHanDaRep} files`);
        console.log(`- new.json: ${newFile} file`);
        
        console.log('\n📋 Sample Mails:');
        mails.slice(0, 3).forEach((mail, index) => {
          console.log(`${index + 1}. ${mail.Subject} (${mail.category}/${mail.status})`);
        });
        
        console.log('\n✅ API Test Completed Successfully!');
        console.log('🎯 Data is being loaded from C:\\classifyMail\\');
        
      } catch (error) {
        console.error('❌ Error parsing mails:', error);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error connecting to mails API:', error.message);
  });

  req.end();
}

// Run test
testAPI();
