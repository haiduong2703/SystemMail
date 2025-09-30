// Test updated helper function with actual file paths
console.log('=== Testing Updated Helper Function ===');

// Copy the updated helper function
const getReplyStatusFromMail = (mail) => {
  // For ReviewMail - ALWAYS determine from folder path, never use isReplied field
  if (mail.category === "ReviewMail") {
    if (mail.filePath) {
      return mail.filePath.includes("/processed/") || mail.filePath.includes("\\processed\\");
    }
    // Fallback to status field only if filePath not available
    return mail.status === "processed";
  }
  
  // For other categories, use explicit isReplied field if it matches folder structure
  if (mail.category === "DungHan") {
    // For DungHan, check folder path first, then status field
    if (mail.filePath) {
      return mail.filePath.includes("/rep/") || mail.filePath.includes("\\rep\\");
    }
    return mail.status === "rep"; // DungHan/rep = replied, DungHan/mustRep = not replied
  } else if (mail.category === "QuaHan") {
    // For QuaHan, check folder path first, then status field  
    if (mail.filePath) {
      return mail.filePath.includes("/daRep/") || mail.filePath.includes("\\daRep\\");
    }
    return mail.status === "daRep"; // QuaHan/daRep = replied, QuaHan/chuaRep = not replied
  }
  
  // For other categories, use isReplied field if available
  if (mail.isReplied !== undefined) {
    return mail.isReplied;
  }
  
  // Analyze filePath as final fallback
  if (mail.filePath) {
    return mail.filePath.includes("/rep/") || 
           mail.filePath.includes("\\rep\\") || 
           mail.filePath.includes("/daRep/") || 
           mail.filePath.includes("\\daRep\\") ||
           mail.filePath.includes("/processed/") || 
           mail.filePath.includes("\\processed\\");
  }
  
  return false; // Default to not replied
};

// Test with problematic file in pending folder
const pendingMailWithBadFlag = {
  id: '1756541798416',
  category: 'ReviewMail',
  filePath: 'C:\\classifyMail\\ReviewMail\\pending\\1756541798416.json',
  isReplied: true, // This is WRONG but should be ignored
  status: 'mustRep'
};

console.log('Test 1 - Pending file with wrong isReplied=true:');
console.log('File path:', pendingMailWithBadFlag.filePath);
console.log('isReplied field (SHOULD BE IGNORED):', pendingMailWithBadFlag.isReplied);
console.log('Helper function result:', getReplyStatusFromMail(pendingMailWithBadFlag));
console.log('Expected: false (because it is in pending folder)');
console.log('✅ Correct:', getReplyStatusFromMail(pendingMailWithBadFlag) === false);

// Test with correct file in pending folder  
const pendingMailCorrect = {
  id: '1758251316514',
  category: 'ReviewMail',
  filePath: 'C:\\classifyMail\\ReviewMail\\pending\\1758251316514.json',
  isReplied: false,
  status: 'mustRep'
};

console.log('\nTest 2 - Pending file with correct isReplied=false:');
console.log('File path:', pendingMailCorrect.filePath);
console.log('isReplied field (SHOULD BE IGNORED):', pendingMailCorrect.isReplied);
console.log('Helper function result:', getReplyStatusFromMail(pendingMailCorrect));
console.log('Expected: false (because it is in pending folder)');
console.log('✅ Correct:', getReplyStatusFromMail(pendingMailCorrect) === false);

// Test with processed files
const processedMail = {
  id: '1758251188844',
  category: 'ReviewMail', 
  filePath: 'C:\\classifyMail\\ReviewMail\\processed\\1758251188844.json',
  isReplied: true,
  status: 'mustRep'
};

console.log('\nTest 3 - Processed file:');
console.log('File path:', processedMail.filePath);
console.log('isReplied field (SHOULD BE IGNORED):', processedMail.isReplied);
console.log('Helper function result:', getReplyStatusFromMail(processedMail));
console.log('Expected: true (because it is in processed folder)');
console.log('✅ Correct:', getReplyStatusFromMail(processedMail) === true);

console.log('\n=== Test Summary ===');
console.log('✅ Helper function now uses folder path for ReviewMail, ignoring isReplied field');
console.log('✅ This should fix the display issue in the table');