const http = require('http');

function testMailFormat() {
  console.log('🧪 Testing Mail Format and Date Arrays...');
  
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
        console.log(`📧 Total Mails: ${mails.length}`);
        
        // Test first few mails
        console.log('\n📋 Testing Date Format for first 3 mails:');
        mails.slice(0, 3).forEach((mail, index) => {
          console.log(`\n${index + 1}. Mail ID: ${mail.id || 'N/A'}`);
          console.log(`   Subject: ${mail.Subject}`);
          console.log(`   From: ${mail.From}`);
          console.log(`   Date: ${JSON.stringify(mail.Date)}`);
          console.log(`   Date Type: ${Array.isArray(mail.Date) ? 'Array' : typeof mail.Date}`);
          console.log(`   Date Length: ${Array.isArray(mail.Date) ? mail.Date.length : 'N/A'}`);
          console.log(`   SummaryContent: ${mail.SummaryContent || 'N/A'}`);
          console.log(`   Category: ${mail.category}`);
          console.log(`   Status: ${mail.status}`);
          console.log(`   FileName: ${mail.fileName}`);
          
          // Test date parsing
          if (Array.isArray(mail.Date) && mail.Date.length >= 2) {
            try {
              const [date, time] = mail.Date;
              const dateObj = new Date(date + 'T' + time);
              console.log(`   Parsed Date: ${dateObj.toISOString()}`);
              console.log(`   Is Valid Date: ${!isNaN(dateObj.getTime())}`);
            } catch (error) {
              console.log(`   Date Parse Error: ${error.message}`);
            }
          } else {
            console.log(`   ⚠️ Date format issue: Not a valid array`);
          }
        });
        
        // Check for any mails with invalid date format
        const invalidDates = mails.filter(mail => 
          !mail.Date || !Array.isArray(mail.Date) || mail.Date.length < 2
        );
        
        if (invalidDates.length > 0) {
          console.log(`\n⚠️ Found ${invalidDates.length} mails with invalid date format:`);
          invalidDates.forEach(mail => {
            console.log(`   - ${mail.Subject}: ${JSON.stringify(mail.Date)}`);
          });
        } else {
          console.log('\n✅ All mails have valid date format!');
        }
        
        // Test specific mail with special characters
        const testMail = mails.find(mail => mail.Subject && mail.Subject.includes('test6/12'));
        if (testMail) {
          console.log('\n🎯 Found test mail with special characters:');
          console.log(`   Subject: ${testMail.Subject}`);
          console.log(`   FileName: ${testMail.fileName}`);
          console.log(`   ID: ${testMail.id || testMail.mailId || 'N/A'}`);
          console.log(`   Date: ${JSON.stringify(testMail.Date)}`);
          console.log(`   SummaryContent: ${testMail.SummaryContent || 'N/A'}`);
        }
        
        console.log('\n🎉 Mail format test completed!');
        
      } catch (error) {
        console.error('❌ Error parsing mails:', error);
        console.log('Raw response length:', data.length);
        console.log('First 500 chars:', data.substring(0, 500));
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error connecting to API:', error.message);
  });

  req.end();
}

// Run test
testMailFormat();
