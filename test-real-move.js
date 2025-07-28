const http = require('http');

// Real mail data from the system
const realMailData = {
  "id": "02468",
  "fileName": "02468.json",
  "filePath": "C:\\classifyMail\\QuaHan\\chuaRep\\02468.json",
  "category": "QuaHan",
  "status": "chuaRep",
  "isExpired": true,
  "isReplied": false,
  "Subject": "Security audit findings",
  "From": "Security Team",
  "Type": "To",
  "Date": ["2024-12-01", "09:15"],
  "SummaryContent": "Critical security vulnerabilities found during audit. Immediate action required",
  "assignedTo": {
    "type": "group",
    "groupId": "2",
    "picId": null,
    "assignedAt": "2024-01-15T16:00:00.000Z",
    "groupName": "QA Team"
  },
  "updatedAt": "2025-06-25T09:32:23.671Z",
  "isRead": true,
  "readAt": "2025-06-29T09:09:33.331Z"
};

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (error) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testMoveRealMail() {
  console.log('🧪 Testing Move to Review with real mail data...');
  console.log('📧 Mail Subject:', realMailData.Subject);
  console.log('📧 Mail ID:', realMailData.id);
  console.log('📧 File Path:', realMailData.filePath);
  
  try {
    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/move-to-review',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const requestData = {
      mailId: realMailData.id,
      mailData: realMailData
    };
    
    console.log('\n📤 Sending request...');
    const result = await makeRequest(options, requestData);
    
    console.log('📥 Response status:', result.status);
    console.log('📥 Response data:', JSON.stringify(result.data, null, 2));
    
    if (result.status === 200 && result.data.success) {
      console.log('\n✅ Move to Review successful!');
      console.log('📁 Check C:\\classifyMail\\ReviewMail\\ for new file');
      
      // Check if file was created
      setTimeout(() => {
        console.log('\n🔍 Checking if file was created...');
        // You can manually check the folder now
      }, 1000);
      
    } else {
      console.log('\n❌ Move to Review failed');
    }
  } catch (error) {
    console.log('\n❌ Error:', error.message);
  }
}

testMoveRealMail();
