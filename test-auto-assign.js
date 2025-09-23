const fetch = require('node-fetch');

const SERVER_URL = 'http://localhost:3002';

// Test auto-assign với email thuộc group
const testAutoAssign = async () => {
  console.log('🧪 Testing auto-assign feature...\n');
  
  try {
    // Test 1: Mail từ email thuộc group (huan.tran@samsung.com)
    console.log('📧 Test 1: Creating mail from huan.tran@samsung.com (should auto-assign to Marketing Leader)');
    const response1 = await fetch(`${SERVER_URL}/api/simulate-new-mail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Test Auto-Assign from Group Member',
        from: 'huan.tran@samsung.com',
        type: 'To'
      }),
    });

    const result1 = await response1.json();
    console.log('✅ Result 1:', result1);
    
    if (result1.success && result1.mailData.assignedTo) {
      console.log(`🎯 AUTO-ASSIGNED to: ${result1.mailData.assignedTo.picName} (${result1.mailData.assignedTo.picEmail})`);
      console.log(`📋 Group: ${result1.mailData.assignedTo.groupName}`);
    } else {
      console.log('❌ No auto-assignment found');
    }
    console.log('');

    // Test 2: Mail từ email KHÔNG thuộc group
    console.log('📧 Test 2: Creating mail from unknown@example.com (should NOT auto-assign)');
    const response2 = await fetch(`${SERVER_URL}/api/simulate-new-mail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Test No Auto-Assign from Unknown',
        from: 'unknown@example.com',
        type: 'To'
      }),
    });

    const result2 = await response2.json();
    console.log('✅ Result 2:', result2);
    
    if (result2.success && result2.mailData.assignedTo) {
      console.log(`🎯 AUTO-ASSIGNED to: ${result2.mailData.assignedTo.picName} (${result2.mailData.assignedTo.picEmail})`);
    } else {
      console.log('ℹ️ No auto-assignment (expected behavior)');
    }
    console.log('');

    // Test 3: Mail từ email khác thuộc group (a@gmail.com)
    console.log('📧 Test 3: Creating mail from a@gmail.com (should auto-assign to Marketing Leader)');
    const response3 = await fetch(`${SERVER_URL}/api/simulate-new-mail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subject: 'Test Auto-Assign from Another Group Member',
        from: 'a@gmail.com',
        type: 'To'
      }),
    });

    const result3 = await response3.json();
    console.log('✅ Result 3:', result3);
    
    if (result3.success && result3.mailData.assignedTo) {
      console.log(`🎯 AUTO-ASSIGNED to: ${result3.mailData.assignedTo.picName} (${result3.mailData.assignedTo.picEmail})`);
      console.log(`📋 Group: ${result3.mailData.assignedTo.groupName}`);
    } else {
      console.log('❌ No auto-assignment found');
    }

    console.log('\n🎉 Auto-assign test completed!');
    console.log('💡 Check your mail UI to see if mails appeared automatically with PIC assigned!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
};

// Run test
testAutoAssign();