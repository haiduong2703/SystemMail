// Test script to debug filePath update issue
const path = require('path');

const MAIL_DATA_PATH = "C:\\classifyMail";

// Simulate the mail data
const mailData = {
  "id": "1758251316514",
  "fileName": "1758251316514.json",
  "filePath": "C:\\classifyMail\\DungHan\\mustRep\\1758251316514.json",
  "category": "DungHan",
  "status": "mustRep",
  "Subject": "testmail24811"
};

console.log("🔍 Debug filePath update logic:");
console.log("Original mailData.filePath:", mailData.filePath);

// Simulate move-to-review logic
const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
console.log("reviewMailPath:", reviewMailPath);

let fileName = mailData.fileName;
if (!fileName && mailData.filePath) {
  fileName = path.basename(mailData.filePath);
}
if (!fileName) {
  if (mailData.id) {
    fileName = `${mailData.id}.json`;
  } else {
    fileName = `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
  }
}

console.log("fileName:", fileName);
const reviewFilePath = path.join(reviewMailPath, fileName);
console.log("reviewFilePath:", reviewFilePath);

// Create reviewMailData
const reviewMailData = {
  ...mailData,
  category: "ReviewMail",
  filePath: reviewFilePath, // This should update the filePath
};

console.log("Updated reviewMailData.filePath:", reviewMailData.filePath);
console.log("Expected filePath:", "C:\\classifyMail\\ReviewMail\\1758251316514.json");
console.log("Match?", reviewMailData.filePath === "C:\\classifyMail\\ReviewMail\\1758251316514.json");