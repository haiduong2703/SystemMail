import { useState, useCallback } from 'react';

/**
 * Custom hook for handling mail decryption via API
 */
export const useDecryption = () => {
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionError, setDecryptionError] = useState(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  /**
   * Decrypt a single text string
   * @param {string} encryptedText - The encrypted text to decrypt
   * @returns {Promise<string>} - The decrypted text
   */
  const decryptText = useCallback(async (encryptedText) => {
    if (!encryptedText) return encryptedText;

    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/decrypt/text`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ encryptedText }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Decryption failed');
      }

      return data.decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      setDecryptionError(error.message);
      return encryptedText; // Return original if decryption fails
    } finally {
      setIsDecrypting(false);
    }
  }, [API_BASE_URL]);

  /**
   * Decrypt a mail object
   * @param {object} mailData - The mail object with encrypted From field
   * @returns {Promise<object>} - The mail object with decrypted From field
   */
  const decryptMail = useCallback(async (mailData) => {
    if (!mailData) return mailData;

    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/decrypt/mail`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mailData }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mail decryption failed');
      }

      return data.decrypted;
    } catch (error) {
      console.error('Mail decryption error:', error);
      setDecryptionError(error.message);
      return mailData; // Return original if decryption fails
    } finally {
      setIsDecrypting(false);
    }
  }, [API_BASE_URL]);

  /**
   * Decrypt an array of mail objects
   * @param {Array} mailArray - Array of mail objects
   * @returns {Promise<Array>} - Array of mail objects with decrypted From fields
   */
  const decryptMails = useCallback(async (mailArray) => {
    if (!mailArray || !Array.isArray(mailArray)) return mailArray;

    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/decrypt/mails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mailArray }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Mail array decryption failed');
      }

      return data.decrypted;
    } catch (error) {
      console.error('Mail array decryption error:', error);
      setDecryptionError(error.message);
      return mailArray; // Return original if decryption fails
    } finally {
      setIsDecrypting(false);
    }
  }, [API_BASE_URL]);

  /**
   * Test the decryption functionality
   * @returns {Promise<string>} - Test result
   */
  const testDecryption = useCallback(async () => {
    setIsDecrypting(true);
    setDecryptionError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/decrypt/test`, {
        method: 'GET',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Decryption test failed');
      }

      return data.result;
    } catch (error) {
      console.error('Decryption test error:', error);
      setDecryptionError(error.message);
      return null;
    } finally {
      setIsDecrypting(false);
    }
  }, [API_BASE_URL]);

  /**
   * Clear any decryption errors
   */
  const clearError = useCallback(() => {
    setDecryptionError(null);
  }, []);

  return {
    // Functions
    decryptText,
    decryptMail,
    decryptMails,
    testDecryption,
    clearError,
    
    // State
    isDecrypting,
    decryptionError,
  };
};

export default useDecryption;
