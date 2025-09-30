// Test helper functions with real file
const path = require('path');

// Copy helper functions from utils
const getReviewMailStatus = (filePath) => {
  if (!filePath) return 'unknown';
  
  const normalizedPath = filePath.replace(/\\/g, '/');
  
  if (normalizedPath.includes('ReviewMail/processed')) {
    return 'processed';
  } else if (normalizedPath.includes('ReviewMail/pending')) {
    return 'pending';
  }
  
  return 'unknown';
};

const getReplyStatusFromMail = (mail) => {
  if (!mail) return false;
  
  // For ReviewMail - determine from folder path instead of status field
  if (mail.category === 'ReviewMail') {
    const status = getReviewMailStatus(mail.filePath);
    return status === 'processed';
  }
  
  // For other categories, use existing logic
  return mail.isReplied || false;
};

// Test with the actual file path
console.log('=== Testing Helper Functions ===');

const testFilePath = 'C:\\classifyMail\\ReviewMail\\processed\\clean-no-status-test.json';
const testMail = {
  id: 'clean-no-status-test',
  category: 'ReviewMail',
  filePath: testFilePath,
  isReplied: true // This should be ignored for ReviewMail
};

console.log('File path:', testFilePath);
console.log('Status from getReviewMailStatus():', getReviewMailStatus(testFilePath));
console.log('Reply status from getReplyStatusFromMail():', getReplyStatusFromMail(testMail));

// Test with pending file
const pendingPath = 'C:\\classifyMail\\ReviewMail\\pending\\some-file.json';
const pendingMail = {
  id: 'some-file',
  category: 'ReviewMail', 
  filePath: pendingPath,
  isReplied: false
};

console.log('\nPending file path:', pendingPath);
console.log('Status from getReviewMailStatus():', getReviewMailStatus(pendingPath));
console.log('Reply status from getReplyStatusFromMail():', getReplyStatusFromMail(pendingMail));

console.log('\n=== Test Complete ===');