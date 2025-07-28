import { useState, useEffect, useCallback } from 'react';
import useDecryption from './useDecryption';

/**
 * Hook to automatically decrypt mail data
 * @param {Array} mails - Array of mail objects
 * @param {boolean} autoDecrypt - Whether to automatically decrypt on load
 * @returns {Object} - Decrypted mails and utility functions
 */
export const useDecryptedMails = (mails = [], autoDecrypt = true) => {
  const [decryptedMails, setDecryptedMails] = useState([]);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionProgress, setDecryptionProgress] = useState(0);
  const [decryptionErrors, setDecryptionErrors] = useState([]);
  
  const { decryptMails, decryptMail } = useDecryption();

  /**
   * Decrypt all mails in the array
   */
  const decryptAllMails = useCallback(async () => {
    if (!mails || mails.length === 0) {
      setDecryptedMails([]);
      return;
    }

    setIsDecrypting(true);
    setDecryptionProgress(0);
    setDecryptionErrors([]);

    try {
      // Try bulk decryption first
      const bulkDecrypted = await decryptMails(mails);
      if (bulkDecrypted && bulkDecrypted.length === mails.length) {
        setDecryptedMails(bulkDecrypted);
        setDecryptionProgress(100);
        return;
      }

      // Fallback to individual decryption
      const decrypted = [];
      const errors = [];

      for (let i = 0; i < mails.length; i++) {
        try {
          const decryptedMail = await decryptMail(mails[i]);
          decrypted.push(decryptedMail);
        } catch (error) {
          console.error(`Failed to decrypt mail ${i}:`, error);
          errors.push({ index: i, error: error.message, mail: mails[i] });
          // Add original mail if decryption fails
          decrypted.push(mails[i]);
        }
        
        // Update progress
        setDecryptionProgress(Math.round(((i + 1) / mails.length) * 100));
      }

      setDecryptedMails(decrypted);
      setDecryptionErrors(errors);

    } catch (error) {
      console.error('Bulk decryption failed:', error);
      setDecryptionErrors([{ error: error.message }]);
      // Use original mails if decryption fails completely
      setDecryptedMails(mails);
    } finally {
      setIsDecrypting(false);
    }
  }, [mails, decryptMails, decryptMail]);

  /**
   * Decrypt a single mail and update the array
   */
  const decryptSingleMail = useCallback(async (mailIndex) => {
    if (!mails[mailIndex]) return;

    try {
      const decryptedMail = await decryptMail(mails[mailIndex]);
      setDecryptedMails(prev => {
        const updated = [...prev];
        updated[mailIndex] = decryptedMail;
        return updated;
      });
    } catch (error) {
      console.error(`Failed to decrypt mail at index ${mailIndex}:`, error);
      setDecryptionErrors(prev => [...prev, { 
        index: mailIndex, 
        error: error.message, 
        mail: mails[mailIndex] 
      }]);
    }
  }, [mails, decryptMail]);

  /**
   * Clear decryption errors
   */
  const clearErrors = useCallback(() => {
    setDecryptionErrors([]);
  }, []);

  /**
   * Reset to original mails (undecrypted)
   */
  const resetToOriginal = useCallback(() => {
    setDecryptedMails(mails);
    setDecryptionErrors([]);
    setDecryptionProgress(0);
  }, [mails]);

  // Auto-decrypt when mails change
  useEffect(() => {
    if (autoDecrypt && mails && mails.length > 0) {
      decryptAllMails();
    } else {
      setDecryptedMails(mails);
    }
  }, [mails, autoDecrypt, decryptAllMails]);

  return {
    // Data
    decryptedMails,
    originalMails: mails,
    
    // Status
    isDecrypting,
    decryptionProgress,
    decryptionErrors,
    hasErrors: decryptionErrors.length > 0,
    
    // Functions
    decryptAllMails,
    decryptSingleMail,
    clearErrors,
    resetToOriginal,
    
    // Utilities
    isDecrypted: decryptedMails.length > 0 && !isDecrypting,
    totalMails: mails.length,
    decryptedCount: decryptedMails.length,
    errorCount: decryptionErrors.length
  };
};

export default useDecryptedMails;
