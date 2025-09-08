// Test script for mail status change API
// Using built-in fetch (Node 18+)

const API_BASE_URL = 'http://localhost:3002';

async function testStatusChange() {
  console.log('🧪 Testing Mail Status Change API...');
  
  try {
    // 1. First, get all mails to see what's available
    console.log('\n📋 Step 1: Getting all mails...');
    const mailsResponse = await fetch(`${API_BASE_URL}/api/mails`);
    
    if (!mailsResponse.ok) {
      throw new Error(`Failed to get mails: ${mailsResponse.status}`);
    }
    
    const allMails = await mailsResponse.json();
    console.log(`✅ Found ${allMails.length} mails total`);
    
    // Find ReviewMail mails
    const reviewMails = allMails.filter(mail => mail.category === 'ReviewMail');
    console.log(`📧 Found ${reviewMails.length} mails in ReviewMail category`);
    
    if (reviewMails.length === 0) {
      console.log('❌ No mails in ReviewMail category to test');
      return;
    }
    
    // Pick the first ReviewMail for testing
    const testMail = reviewMails[0];
    console.log(`\n🎯 Testing with mail:`, {
      id: testMail.id,
      subject: testMail.Subject,
      category: testMail.category,
      isReplied: testMail.isReplied,
      filePath: testMail.filePath
    });
    
    // 2. Test status change
    console.log('\n🔄 Step 2: Testing status change...');
    const newStatus = !testMail.isReplied; // Toggle status
    
    const statusResponse = await fetch(`${API_BASE_URL}/api/mails/${testMail.id}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        isReplied: newStatus
      })
    });
    
    if (!statusResponse.ok) {
      const errorText = await statusResponse.text();
      throw new Error(`Status change failed: ${statusResponse.status} - ${errorText}`);
    }
    
    const statusResult = await statusResponse.json();
    console.log('✅ Status change successful:', statusResult);
    
    // 3. Verify the change
    console.log('\n🔍 Step 3: Verifying the change...');
    const verifyResponse = await fetch(`${API_BASE_URL}/api/mails`);
    const updatedMails = await verifyResponse.json();
    const updatedMail = updatedMails.find(m => m.id === testMail.id);
    
    if (updatedMail) {
      console.log('✅ Verification successful:', {
        id: updatedMail.id,
        subject: updatedMail.Subject,
        oldStatus: testMail.isReplied,
        newStatus: updatedMail.isReplied,
        changed: updatedMail.isReplied === newStatus
      });
    } else {
      console.log('❌ Could not find updated mail for verification');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  }
}

// Run the test
testStatusChange();
