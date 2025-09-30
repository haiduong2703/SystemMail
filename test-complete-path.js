// Test both pending and processed
const fs = require('fs');

const getReplyStatusFromMail = (mail) => {
  if (mail.category === "ReviewMail") {
    if (mail.filePath) {
      return mail.filePath.includes("/processed/") || mail.filePath.includes("\\processed\\");
    }
    return mail.status === "processed";
  }
  return mail.isReplied || false;
};

console.log('=== Complete Test ===');

// Test pending
const pending = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\pending\\1756541798416.json', 'utf8'));
console.log('\\nPending file:');
console.log('Path:', pending.filePath);
console.log('Result:', getReplyStatusFromMail(pending));
console.log('Expected: false');

// Test processed  
const processed = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\processed\\1758251188844.json', 'utf8'));
console.log('\\nProcessed file:');
console.log('Path:', processed.filePath);
console.log('Result:', getReplyStatusFromMail(processed));
console.log('Expected: true');

console.log('\\n=== Summary ===');
const pendingResult = getReplyStatusFromMail(pending);
const processedResult = getReplyStatusFromMail(processed);
console.log(`Pending result: ${pendingResult} (should be false)`);
console.log(`Processed result: ${processedResult} (should be true)`);
console.log(`✅ All correct: ${!pendingResult && processedResult}`);