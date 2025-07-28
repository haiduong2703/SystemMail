const crypto = require('crypto');

// Fixed key and IV for decryption (same as in your encrypt/decrypt files)
const ENCRYPTION_KEY = Buffer.from('0123456789abcdef0123456789abcdef', 'utf-8');
const ENCRYPTION_IV = Buffer.from('abcdef9876543210', 'utf-8');

/**
 * Decrypt encrypted text using AES-256-CBC
 * @param {string} encryptedText - Base64 encoded encrypted text
 * @returns {string} - Decrypted text
 */
function decryptText(encryptedText) {
  try {
    if (!encryptedText || typeof encryptedText !== 'string') {
      return encryptedText; // Return as-is if not encrypted
    }
    
    // Check if the text looks like base64 encrypted data
    if (!encryptedText.includes('=') && encryptedText.length < 20) {
      return encryptedText; // Probably not encrypted
    }
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.warn('Failed to decrypt text:', encryptedText, error.message);
    return encryptedText; // Return original if decryption fails
  }
}

/**
 * Encrypt text using AES-256-CBC
 * @param {string} text - Plain text to encrypt
 * @returns {string} - Base64 encoded encrypted text
 */
function encryptText(text) {
  try {
    if (!text || typeof text !== 'string') {
      return text;
    }
    
    const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, ENCRYPTION_IV);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  } catch (error) {
    console.error('Failed to encrypt text:', text, error.message);
    return text;
  }
}

/**
 * Decrypt the "From" field in mail data
 * @param {object} mailData - Mail object with potentially encrypted "From" field
 * @returns {object} - Mail object with decrypted "From" field
 */
function decryptMailFrom(mailData) {
  if (!mailData || typeof mailData !== 'object') {
    return mailData;
  }
  
  return {
    ...mailData,
    From: decryptText(mailData.From),
    // Keep original encrypted value for reference if needed
    EncryptedFrom: mailData.From
  };
}

/**
 * Decrypt multiple mail objects
 * @param {Array} mailArray - Array of mail objects
 * @returns {Array} - Array of mail objects with decrypted "From" fields
 */
function decryptMailArray(mailArray) {
  if (!Array.isArray(mailArray)) {
    return mailArray;
  }
  
  return mailArray.map(mail => decryptMailFrom(mail));
}

/**
 * Test the decryption with the provided sample
 */
function testDecryption() {
  const testEncrypted = "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=";
  console.log('🔍 Testing decryption...');
  console.log('Encrypted:', testEncrypted);
  
  try {
    const decrypted = decryptText(testEncrypted);
    console.log('Decrypted:', decrypted);
    return decrypted;
  } catch (error) {
    console.error('❌ Test decryption failed:', error.message);
    return null;
  }
}

module.exports = {
  decryptText,
  encryptText,
  decryptMailFrom,
  decryptMailArray,
  testDecryption
};
