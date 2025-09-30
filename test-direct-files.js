// Test with real file data to debug the issue
const fs = require('fs');
const path = require('path');

console.log('=== Direct File Test ===');

// Read actual files and test helper logic
const pending1 = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\pending\\1756541798416.json', 'utf8'));
const pending2 = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\pending\\1758251316514.json', 'utf8'));
const processed1 = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\processed\\1758251188844.json', 'utf8'));
const processed2 = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\processed\\1758717963732.json', 'utf8'));

// Helper function (copied from utils)
const getReplyStatusFromMail = (mail) => {
  // For ReviewMail - ALWAYS determine from folder path, never use isReplied field
  if (mail.category === "ReviewMail") {
    if (mail.filePath) {
      return mail.filePath.includes("/processed/") || mail.filePath.includes("\\\\processed\\\\");
    }
    // Fallback to status field only if filePath not available
    return mail.status === "processed";
  }
  
  // For other categories...
  return mail.isReplied || false;
};

console.log('\\n--- PENDING Files ---');
console.log('File 1:', pending1.id);
console.log('  filePath:', pending1.filePath);
console.log('  isReplied:', pending1.isReplied);
console.log('  Helper result:', getReplyStatusFromMail(pending1));

console.log('\\nFile 2:', pending2.id);
console.log('  filePath:', pending2.filePath);
console.log('  isReplied:', pending2.isReplied);
console.log('  Helper result:', getReplyStatusFromMail(pending2));

console.log('\\n--- PROCESSED Files ---');
console.log('File 1:', processed1.id);
console.log('  filePath:', processed1.filePath);
console.log('  isReplied:', processed1.isReplied);
console.log('  Helper result:', getReplyStatusFromMail(processed1));

console.log('\\nFile 2:', processed2.id);
console.log('  filePath:', processed2.filePath);
console.log('  isReplied:', processed2.isReplied);
console.log('  Helper result:', getReplyStatusFromMail(processed2));

console.log('\\n=== Summary ===');
console.log('Expected: 2 pending = false, 2 processed = true');
const results = [
  getReplyStatusFromMail(pending1),
  getReplyStatusFromMail(pending2),
  getReplyStatusFromMail(processed1),
  getReplyStatusFromMail(processed2)
];
console.log('Actual results:', results);
console.log('✅ All correct:', 
  !getReplyStatusFromMail(pending1) && 
  !getReplyStatusFromMail(pending2) && 
  getReplyStatusFromMail(processed1) && 
  getReplyStatusFromMail(processed2)
);