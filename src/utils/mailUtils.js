// Encryption/Decryption utilities
// Note: In a real React app, crypto operations should be done on the server side
// This is for demonstration purposes only

// Fixed key and IV for decryption (same as in your encrypt/decrypt files)
const ENCRYPTION_KEY = "0123456789abcdef0123456789abcdef";
const ENCRYPTION_IV = "abcdef9876543210";

/**
 * Decrypt encrypted text using AES-256-CBC (Browser compatible version)
 * @param {string} encryptedText - Base64 encoded encrypted text
 * @returns {string} - Decrypted text or original text if decryption fails
 */
export const decryptText = async (encryptedText) => {
  try {
    if (!encryptedText || typeof encryptedText !== "string") {
      return encryptedText; // Return as-is if not encrypted
    }

    // Check if the text looks like base64 encrypted data
    if (!encryptedText.includes("=") && encryptedText.length < 20) {
      return encryptedText; // Probably not encrypted
    }

    // For browser environment, we'll use Web Crypto API
    if (
      typeof window !== "undefined" &&
      window.crypto &&
      window.crypto.subtle
    ) {
      try {
        // Convert key and IV to ArrayBuffer
        const keyBuffer = new TextEncoder().encode(ENCRYPTION_KEY);
        const ivBuffer = new TextEncoder().encode(ENCRYPTION_IV);

        // Import the key
        const cryptoKey = await window.crypto.subtle.importKey(
          "raw",
          keyBuffer,
          { name: "AES-CBC" },
          false,
          ["decrypt"]
        );

        // Convert base64 to ArrayBuffer
        const encryptedBuffer = Uint8Array.from(atob(encryptedText), (c) =>
          c.charCodeAt(0)
        );

        // Decrypt
        const decryptedBuffer = await window.crypto.subtle.decrypt(
          { name: "AES-CBC", iv: ivBuffer },
          cryptoKey,
          encryptedBuffer
        );

        // Convert back to string
        return new TextDecoder().decode(decryptedBuffer);
      } catch (webCryptoError) {
        console.warn(
          "Web Crypto API decryption failed:",
          webCryptoError.message
        );
        return encryptedText;
      }
    }

    // Fallback: return original text if no crypto available
    console.warn("Crypto API not available, returning original text");
    return encryptedText;
  } catch (error) {
    console.warn("Failed to decrypt text:", encryptedText, error.message);
    return encryptedText; // Return original if decryption fails
  }
};

/**
 * Simple synchronous decryption fallback (for demonstration)
 * In production, this should be handled by the backend
 * @param {string} encryptedText - Base64 encoded encrypted text
 * @returns {string} - Decrypted text or original text
 */
export const decryptTextSync = (encryptedText) => {
  // This is a simplified version - in real app, send to backend for decryption
  if (!encryptedText || typeof encryptedText !== "string") {
    return encryptedText;
  }

  // For the demo, we'll just return a placeholder indicating it's encrypted
  if (encryptedText.includes("=") && encryptedText.length > 20) {
    return `[ENCRYPTED: ${encryptedText.substring(0, 10)}...]`;
  }

  return encryptedText;
};

/**
 * Decrypt the "From" field in mail data
 * @param {object} mailData - Mail object with potentially encrypted "From" field
 * @returns {object} - Mail object with decrypted "From" field
 */
export const decryptMailFrom = async (mailData) => {
  if (!mailData || typeof mailData !== "object") {
    return mailData;
  }

  const decryptedFrom = await decryptText(mailData.From);

  return {
    ...mailData,
    From: decryptedFrom,
    // Keep original encrypted value for reference if needed
    EncryptedFrom: mailData.From,
  };
};

/**
 * Synchronous version of decryptMailFrom for immediate use
 * @param {object} mailData - Mail object with potentially encrypted "From" field
 * @returns {object} - Mail object with decrypted "From" field
 */
export const decryptMailFromSync = (mailData) => {
  if (!mailData || typeof mailData !== "object") {
    return mailData;
  }

  return {
    ...mailData,
    From: decryptTextSync(mailData.From),
    EncryptedFrom: mailData.From,
  };
};

/**
 * Formats a date array or string into a "DD/MM/YYYY HH:mm" string.
 * @param {Array<string>|string} dateInput - The date input, can be an array [YYYY-MM-DD, HH:mm] or an ISO string.
 * @returns {string} - The formatted date string.
 */
export const formatDate = (dateInput) => {
  if (!dateInput) return "N/A";

  let date;
  if (Array.isArray(dateInput)) {
    // Handles format ["YYYY-MM-DD", "HH:mm"]
    date = new Date(`${dateInput[0]}T${dateInput[1]}:00`);
  } else {
    // Handles standard ISO string or other date string formats
    date = new Date(dateInput);
  }

  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

/**
 * Filters an array of mails by a given date range.
 * @param {Array<Object>} mails - The array of mail objects to filter.
 * @param {Date|string|null} startDate - The start of the date range.
 * @param {Date|string|null} endDate - The end of the date range.
 * @returns {Array<Object>} - The filtered array of mails.
 */
export const filterMailsByDateRange = (mails, startDate, endDate) => {
  if (!startDate && !endDate) {
    return mails;
  }

  // Giữ nguyên giờ phút giây để lọc chính xác theo từng phút
  const start = startDate ? new Date(startDate) : null;
  const end = endDate ? new Date(endDate) : null;

  return mails.filter((mail) => {
    if (!mail.Date) return false;

    let mailDate;
    if (Array.isArray(mail.Date)) {
      mailDate = new Date(`${mail.Date[0]}T${mail.Date[1]}:00`);
    } else {
      mailDate = new Date(mail.Date);
    }

    if (isNaN(mailDate.getTime())) return false;

    if (start && mailDate < start) {
      return false;
    }
    if (end && mailDate > end) {
      return false;
    }
    return true;
  });
};
