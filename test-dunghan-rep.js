// Test script to check DungHan rep folder loading
const API_BASE_URL = 'http://localhost:3002';

// Use built-in fetch for Node 18+

async function testDungHanRep() {
  console.log('🧪 Testing DungHan rep folder loading...');
  
  try {
    // Get all mails
    console.log('\n📋 Step 1: Getting all mails...');
    const response = await fetch(`${API_BASE_URL}/api/mails`);
    
    if (!response.ok) {
      throw new Error(`Failed to get mails: ${response.status}`);
    }
    
    const allMails = await response.json();
    console.log(`✅ Found ${allMails.length} mails total`);
    
    // Filter DungHan mails
    const dungHanMails = allMails.filter(mail => mail.category === 'DungHan');
    console.log(`📧 Found ${dungHanMails.length} DungHan mails`);
    
    // Group by status
    const statusGroups = {};
    dungHanMails.forEach(mail => {
      const status = mail.status || 'unknown';
      if (!statusGroups[status]) {
        statusGroups[status] = [];
      }
      statusGroups[status].push(mail);
    });
    
    console.log('\n📊 DungHan mails by status:');
    Object.keys(statusGroups).forEach(status => {
      const mails = statusGroups[status];
      const repliedCount = mails.filter(m => m.isReplied).length;
      const unrepliedCount = mails.filter(m => !m.isReplied).length;
      
      console.log(`  ${status}: ${mails.length} mails (${repliedCount} replied, ${unrepliedCount} unreplied)`);
      
      // Show sample mails
      if (mails.length > 0) {
        console.log(`    Sample: ${mails[0].Subject} (isReplied: ${mails[0].isReplied})`);
      }
    });
    
    // Check specifically for rep status
    const repMails = dungHanMails.filter(mail => mail.status === 'rep');
    console.log(`\n🎯 DungHan/rep mails: ${repMails.length}`);
    
    if (repMails.length > 0) {
      console.log('✅ SUCCESS: DungHan/rep folder is being loaded!');
      console.log('Sample rep mails:');
      repMails.slice(0, 3).forEach((mail, index) => {
        console.log(`  ${index + 1}. ${mail.Subject} (isReplied: ${mail.isReplied})`);
      });
    } else {
      console.log('❌ PROBLEM: DungHan/rep folder is NOT being loaded!');
    }
    
    // Check mustRep status
    const mustRepMails = dungHanMails.filter(mail => mail.status === 'mustRep');
    console.log(`\n📝 DungHan/mustRep mails: ${mustRepMails.length}`);
    
    if (mustRepMails.length > 0) {
      console.log('Sample mustRep mails:');
      mustRepMails.slice(0, 3).forEach((mail, index) => {
        console.log(`  ${index + 1}. ${mail.Subject} (isReplied: ${mail.isReplied})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDungHanRep();
