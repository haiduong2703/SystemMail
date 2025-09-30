// Test move back logic directly without server
const fs = require('fs');
const path = require('path');

console.log('=== Direct Move Back Logic Test ===');

// Test data
const mailData = {
  id: "1758251188844",
  Subject: "testmail19911", 
  originalCategory: "DungHan",
  originalStatus: "mustRep",
  filePath: "C:\\classifyMail\\ReviewMail\\processed\\1758251188844.json",
  fileName: "1758251188844.json"
};

console.log('📧 Mail data:', mailData);

// Determine current ReviewMail status from filePath
let currentReviewStatus = "pending"; // default
if (mailData.filePath) {
  if (mailData.filePath.includes("/processed/") || mailData.filePath.includes("\\processed\\")) {
    currentReviewStatus = "processed";
  } else if (mailData.filePath.includes("/pending/") || mailData.filePath.includes("\\pending\\")) {
    currentReviewStatus = "pending";
  }
}

console.log('🔍 Current ReviewMail status:', currentReviewStatus);

// Determine target status based on original category and current review status
let targetStatus;
let targetCategory = mailData.originalCategory;

if (targetCategory === "DungHan") {
  // Valid mails: processed -> rep, pending -> mustRep
  targetStatus = currentReviewStatus === "processed" ? "rep" : "mustRep";
} else if (targetCategory === "QuaHan") {
  // Expired mails: processed -> daRep, pending -> chuaRep  
  targetStatus = currentReviewStatus === "processed" ? "daRep" : "chuaRep";
} else {
  // Fallback: determine by isExpired
  if (mailData.isExpired) {
    targetCategory = "QuaHan";
    targetStatus = currentReviewStatus === "processed" ? "daRep" : "chuaRep";
  } else {
    targetCategory = "DungHan";
    targetStatus = currentReviewStatus === "processed" ? "rep" : "mustRep";
  }
}

console.log('🎯 Target category:', targetCategory, 'Target status:', targetStatus);

// Determine paths
const MAIL_DATA_PATH = "C:\\classifyMail";
const originalFolderPath = path.join(MAIL_DATA_PATH, targetCategory, targetStatus);
const restoredFilePath = path.join(originalFolderPath, mailData.fileName);

console.log('📁 Target folder:', originalFolderPath);
console.log('📄 Target file path:', restoredFilePath);

// Check if target directory exists
console.log('🔍 Target directory exists:', fs.existsSync(originalFolderPath));
if (!fs.existsSync(originalFolderPath)) {
  console.log('📁 Creating target directory...');
  fs.mkdirSync(originalFolderPath, { recursive: true });
  console.log('✅ Directory created');
}

// Create restored mail data
const restoredMailData = {
  ...mailData,
  category: targetCategory,
  status: targetStatus,
  isReplied: currentReviewStatus === "processed",
  filePath: restoredFilePath
};

// Remove review-specific fields
delete restoredMailData.dateMoved;
delete restoredMailData.originalCategory;
delete restoredMailData.originalStatus;

console.log('📝 Restored mail data:', restoredMailData);

// Test file operations
console.log('\\n=== File Operations ===');
console.log('Source file exists:', fs.existsSync(mailData.filePath));
console.log('Target file exists (before):', fs.existsSync(restoredFilePath));

console.log('\\n=== Logic Test Complete ===');
console.log('Expected result: DungHan + processed -> DungHan/rep');
console.log('Actual result:', targetCategory + '/' + targetStatus);
console.log('✅ Correct:', targetCategory === 'DungHan' && targetStatus === 'rep');