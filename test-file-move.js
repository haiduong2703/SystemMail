// Test full move back process with file operations
const fs = require('fs');
const path = require('path');

const writeJsonFile = (filePath, data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return false;
  }
};

console.log('=== Full Move Back Process Test ===');

// Test data
const mailData = {
  id: "test-move-back",
  Subject: "Test Move Back", 
  originalCategory: "DungHan",
  originalStatus: "mustRep",
  filePath: "C:\\classifyMail\\ReviewMail\\processed\\test-move-back.json",
  fileName: "test-move-back.json",
  isReplied: true
};

console.log('📧 Creating test source file...');

// Create test source file in processed folder
const sourceFile = mailData.filePath;
const sourceDir = path.dirname(sourceFile);
if (!fs.existsSync(sourceDir)) {
  fs.mkdirSync(sourceDir, { recursive: true });
}
fs.writeFileSync(sourceFile, JSON.stringify(mailData, null, 2));
console.log('✅ Test source file created:', sourceFile);

// Determine current ReviewMail status from filePath
let currentReviewStatus = "pending"; // default
if (mailData.filePath.includes("/processed/") || mailData.filePath.includes("\\processed\\")) {
  currentReviewStatus = "processed";
} else if (mailData.filePath.includes("/pending/") || mailData.filePath.includes("\\pending\\")) {
  currentReviewStatus = "pending";
}

console.log('🔍 Current ReviewMail status:', currentReviewStatus);

// Determine target status
let targetStatus;
let targetCategory = mailData.originalCategory;

if (targetCategory === "DungHan") {
  targetStatus = currentReviewStatus === "processed" ? "rep" : "mustRep";
} else if (targetCategory === "QuaHan") {
  targetStatus = currentReviewStatus === "processed" ? "daRep" : "chuaRep";
}

console.log('🎯 Target:', targetCategory + '/' + targetStatus);

// Paths
const MAIL_DATA_PATH = "C:\\classifyMail";
const originalFolderPath = path.join(MAIL_DATA_PATH, targetCategory, targetStatus);
const restoredFilePath = path.join(originalFolderPath, mailData.fileName);

console.log('📁 Target folder:', originalFolderPath);
console.log('📄 Target file path:', restoredFilePath);

// Create restored mail data
const restoredMailData = {
  ...mailData,
  category: targetCategory,
  status: targetStatus,
  isReplied: currentReviewStatus === "processed",
  filePath: restoredFilePath
};

delete restoredMailData.dateMoved;
delete restoredMailData.originalCategory;
delete restoredMailData.originalStatus;

console.log('\n📝 Writing restored file...');
const writeSuccess = writeJsonFile(restoredFilePath, restoredMailData);
console.log('Write success:', writeSuccess);

if (writeSuccess) {
  console.log('✅ File written to:', restoredFilePath);
  
  // Remove source file
  console.log('🗑️ Removing source file...');
  if (fs.existsSync(sourceFile)) {
    fs.unlinkSync(sourceFile);
    console.log('✅ Source file removed');
  }
  
  // Verify
  console.log('\n🔍 Verification:');
  console.log('Target file exists:', fs.existsSync(restoredFilePath));
  console.log('Source file exists:', fs.existsSync(sourceFile));
  
  if (fs.existsSync(restoredFilePath)) {
    const content = JSON.parse(fs.readFileSync(restoredFilePath, 'utf8'));
    console.log('Target file content:');
    console.log('  category:', content.category);
    console.log('  status:', content.status);
    console.log('  isReplied:', content.isReplied);
  }
} else {
  console.log('❌ Failed to write file');
}

console.log('\n=== Test Complete ===');