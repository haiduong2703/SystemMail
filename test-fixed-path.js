// Test with fixed file paths
const fs = require('fs');

// Helper function (fixed)
const getReplyStatusFromMail = (mail) => {
  if (mail.category === "ReviewMail") {
    if (mail.filePath) {
      console.log(`Checking filePath: ${mail.filePath}`);
      console.log(`Contains /processed/: ${mail.filePath.includes("/processed/")}`);
      console.log(`Contains \\processed\\: ${mail.filePath.includes("\\processed\\")}`);
      const result = mail.filePath.includes("/processed/") || mail.filePath.includes("\\processed\\");
      console.log(`Result: ${result}`);
      return result;
    }
    return mail.status === "processed";
  }
  return mail.isReplied || false;
};

console.log('=== Fixed Path Test ===');

// Test with one processed file
const processed = JSON.parse(fs.readFileSync('C:\\classifyMail\\ReviewMail\\processed\\1758251188844.json', 'utf8'));
console.log('\\nTesting processed file:');
console.log('ID:', processed.id);
console.log('Category:', processed.category);
console.log('FilePath:', processed.filePath);

const result = getReplyStatusFromMail(processed);
console.log('\\nFinal result:', result);
console.log('Expected: true');
console.log('✅ Correct:', result === true);