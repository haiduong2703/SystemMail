// Test script to debug status field deletion
const fs = require('fs');
const path = require('path');

console.log('=== Debug Status Field Deletion ===');

// File path
const filePath = 'C:\\classifyMail\\ReviewMail\\pending\\debug-test-mail.json';

console.log(`Reading file: ${filePath}`);

// Read file
let mailData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

console.log('📋 Original mailData keys:', Object.keys(mailData));
console.log('📋 Has status field:', mailData.hasOwnProperty('status'));
console.log('📋 Status value:', mailData.status);

// Add status field manually
mailData.status = 'pending';
mailData.isReplied = false;

console.log('\n🔄 After adding status field:');
console.log('📋 mailData keys:', Object.keys(mailData));
console.log('📋 Status value:', mailData.status);

// Try to delete status field
console.log('\n🗑️ Attempting to delete status field...');
console.log('🗑️ Before delete - keys:', Object.keys(mailData));
console.log('🗑️ Before delete - has status:', mailData.hasOwnProperty('status'));

delete mailData.status;

console.log('🗑️ After delete - keys:', Object.keys(mailData));
console.log('🗑️ After delete - has status:', mailData.hasOwnProperty('status'));
console.log('🗑️ After delete - status value:', mailData.status);

// Update file path to processed
mailData.filePath = 'C:\\classifyMail\\ReviewMail\\processed\\debug-test-mail.json';
mailData.isReplied = true;

console.log('\n💾 Writing file...');
console.log('📄 Final mailData keys before write:', Object.keys(mailData));

// Write to new location
const newPath = 'C:\\classifyMail\\ReviewMail\\processed\\debug-test-mail.json';
fs.writeFileSync(newPath, JSON.stringify(mailData, null, 2));

console.log(`✅ File written to: ${newPath}`);

// Read back and verify
console.log('\n🔍 Reading back from file...');
const writtenData = JSON.parse(fs.readFileSync(newPath, 'utf8'));
console.log('📋 Keys in written file:', Object.keys(writtenData));
console.log('📋 Has status field in file:', writtenData.hasOwnProperty('status'));
console.log('📋 Status value in file:', writtenData.status);

console.log('\n=== Test Complete ===');