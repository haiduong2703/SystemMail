const fetch = require('node-fetch');

async function testReviewMailStatusChange() {
  console.log('🧪 Testing ReviewMail Status Change API');
  
  try {
    // Test changing from pending to processed
    const response = await fetch('http://localhost:3002/api/review-mails/test-review-pending/status', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status: 'processed'
      })
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result);
    } else {
      const error = await response.json();
      console.error('❌ Error:', error);
    }
    
  } catch (error) {
    console.error('❌ Request failed:', error.message);
  }
}

testReviewMailStatusChange();