const crypto = require('crypto');

// Fixed key and IV for decryption (same as in your encrypt/decrypt files)
const key = Buffer.from('0123456789abcdef0123456789abcdef', 'utf-8');
const iv = Buffer.from('abcdef9876543210', 'utf-8');

// Test encrypted text from your mail file
const testEncrypted = "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=";

// Hàm giải mã
function decrypt(encText) {
  try {
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('❌ Decryption failed:', error.message);
    return null;
  }
}

// Hàm mã hóa (để test)
function encrypt(text) {
  try {
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error('❌ Encryption failed:', error.message);
    return null;
  }
}

console.log('🔍 Testing Mail Decryption');
console.log('=' * 50);

// Test 1: Decrypt the sample from your mail file
console.log('\n📧 Test 1: Decrypt sample mail "From" field');
console.log('Encrypted:', testEncrypted);
const decrypted = decrypt(testEncrypted);
console.log('Decrypted:', decrypted);

// Test 2: Test round-trip encryption/decryption
console.log('\n🔄 Test 2: Round-trip encryption/decryption');
const testText = "test@example.com";
console.log('Original:', testText);
const encrypted = encrypt(testText);
console.log('Encrypted:', encrypted);
const roundTripDecrypted = decrypt(encrypted);
console.log('Decrypted:', roundTripDecrypted);
console.log('Round-trip success:', testText === roundTripDecrypted);

// Test 3: Test with your mail object
console.log('\n📋 Test 3: Process mail object');
const sampleMail = {
  "Subject": "Equipment request fulfilled",
  "From": "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=",
  "Type": "To",
  "Date": ["2024-09-15", "15:30"],
  "SummaryContent": "Your new laptop has been delivered to your desk. Please confirm receipt",
  "id": "24680"
};

console.log('Original mail object:');
console.log(JSON.stringify(sampleMail, null, 2));

const decryptedMail = {
  ...sampleMail,
  From: decrypt(sampleMail.From),
  EncryptedFrom: sampleMail.From
};

console.log('\nDecrypted mail object:');
console.log(JSON.stringify(decryptedMail, null, 2));

console.log('\n✅ Decryption test completed!');
console.log('\n📝 Next steps:');
console.log('1. Start the mail server: cd mail-server && npm start');
console.log('2. Start the React app: npm start');
console.log('3. Navigate to /admin/decryption-test to test in the UI');
