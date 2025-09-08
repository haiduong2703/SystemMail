// Test script to check date filtering behavior
const API_BASE_URL = 'http://localhost:3002';

// Simulate the filterMailsByDateRange function
const filterMailsByDateRange = (mails, startDate, endDate) => {
  if (!startDate && !endDate) {
    return mails;
  }

  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  // Set time to 00:00:00 for start date and 23:59:59 for end date for inclusive filtering
  if (start) start.setHours(0, 0, 0, 0);
  if (end) end.setHours(23, 59, 59, 999);

  return mails.filter((mail) => {
    if (!mail.Date) return false;

    let mailDate;
    if (Array.isArray(mail.Date)) {
      mailDate = new Date(`${mail.Date[0]}T${mail.Date[1]}:00`);
    } else {
      mailDate = new Date(mail.Date);
    }

    if (isNaN(mailDate.getTime())) return false;

    if (start && mailDate < start) {
      return false;
    }
    if (end && mailDate > end) {
      return false;
    }
    return true;
  });
};

async function testDateFilter() {
  console.log('🧪 Testing date filter behavior...');
  
  try {
    // Get all mails
    console.log('\n📋 Step 1: Getting all mails...');
    const response = await fetch(`${API_BASE_URL}/api/mails`);
    
    if (!response.ok) {
      throw new Error(`Failed to get mails: ${response.status}`);
    }
    
    const allMails = await response.json();
    console.log(`✅ Found ${allMails.length} mails total`);
    
    // Show sample mail dates
    console.log('\n📅 Sample mail dates:');
    allMails.slice(0, 5).forEach((mail, index) => {
      console.log(`  ${index + 1}. ${mail.Subject}`);
      console.log(`     Date: ${JSON.stringify(mail.Date)}`);
      if (Array.isArray(mail.Date)) {
        const mailDate = new Date(`${mail.Date[0]}T${mail.Date[1]}:00`);
        console.log(`     Parsed: ${mailDate.toISOString()}`);
      }
      console.log(`     readAt: ${mail.readAt || 'N/A'}`);
      console.log('');
    });
    
    // Test filter with today's date
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    console.log(`\n🔍 Testing filter for today (${todayStr}):`);
    const todayMails = filterMailsByDateRange(allMails, todayStr, todayStr);
    console.log(`  Found ${todayMails.length} mails for today`);
    
    if (todayMails.length > 0) {
      console.log('  Sample today mails:');
      todayMails.slice(0, 3).forEach((mail, index) => {
        console.log(`    ${index + 1}. ${mail.Subject} - Date: ${JSON.stringify(mail.Date)}`);
      });
    }
    
    // Test filter with July 31, 2025 (date from sample mail)
    const july31 = '2025-07-31';
    console.log(`\n🔍 Testing filter for July 31, 2025 (${july31}):`);
    const july31Mails = filterMailsByDateRange(allMails, july31, july31);
    console.log(`  Found ${july31Mails.length} mails for July 31, 2025`);
    
    if (july31Mails.length > 0) {
      console.log('  Sample July 31 mails:');
      july31Mails.slice(0, 3).forEach((mail, index) => {
        console.log(`    ${index + 1}. ${mail.Subject} - Date: ${JSON.stringify(mail.Date)}`);
      });
    }
    
    // Test filter with a range
    const startDate = '2025-07-30';
    const endDate = '2025-08-01';
    console.log(`\n🔍 Testing filter for range ${startDate} to ${endDate}:`);
    const rangeMails = filterMailsByDateRange(allMails, startDate, endDate);
    console.log(`  Found ${rangeMails.length} mails in range`);
    
    // Check for mails with invalid dates
    console.log('\n⚠️ Checking for mails with invalid dates:');
    const invalidDateMails = allMails.filter(mail => {
      if (!mail.Date) return true;
      
      let mailDate;
      if (Array.isArray(mail.Date)) {
        mailDate = new Date(`${mail.Date[0]}T${mail.Date[1]}:00`);
      } else {
        mailDate = new Date(mail.Date);
      }
      
      return isNaN(mailDate.getTime());
    });
    
    console.log(`  Found ${invalidDateMails.length} mails with invalid dates`);
    if (invalidDateMails.length > 0) {
      invalidDateMails.slice(0, 3).forEach((mail, index) => {
        console.log(`    ${index + 1}. ${mail.Subject} - Date: ${JSON.stringify(mail.Date)}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testDateFilter();
