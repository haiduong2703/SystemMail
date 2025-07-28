import React, { useState, useEffect } from 'react';
import { Badge, Spinner } from 'reactstrap';
import useDecryption from '../../hooks/useDecryption';

/**
 * Component to display decrypted sender information
 * @param {string} encryptedFrom - The encrypted "From" field
 * @param {string} fallbackText - Text to show if decryption fails
 * @param {boolean} showEncrypted - Whether to show encrypted text as fallback
 */
const DecryptedSender = ({ 
  encryptedFrom, 
  fallbackText = 'Unknown Sender',
  showEncrypted = false,
  className = ''
}) => {
  const [decryptedSender, setDecryptedSender] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [decryptionFailed, setDecryptionFailed] = useState(false);
  
  const { decryptText } = useDecryption();

  useEffect(() => {
    const performDecryption = async () => {
      if (!encryptedFrom) {
        setDecryptedSender(fallbackText);
        return;
      }

      // Check if the text looks encrypted (contains = and is long enough)
      const looksEncrypted = encryptedFrom.includes('=') && encryptedFrom.length > 20;
      
      if (!looksEncrypted) {
        // Not encrypted, use as-is
        setDecryptedSender(encryptedFrom);
        return;
      }

      setIsDecrypting(true);
      setDecryptionFailed(false);

      try {
        const decrypted = await decryptText(encryptedFrom);
        
        if (decrypted && decrypted !== encryptedFrom) {
          setDecryptedSender(decrypted);
        } else {
          // Decryption didn't change the text, might have failed
          setDecryptionFailed(true);
          setDecryptedSender(showEncrypted ? encryptedFrom : fallbackText);
        }
      } catch (error) {
        console.error('Decryption error:', error);
        setDecryptionFailed(true);
        setDecryptedSender(showEncrypted ? encryptedFrom : fallbackText);
      } finally {
        setIsDecrypting(false);
      }
    };

    performDecryption();
  }, [encryptedFrom, decryptText, fallbackText, showEncrypted]);

  if (isDecrypting) {
    return (
      <span className={className}>
        <Spinner size="sm" className="mr-1" />
        Decrypting...
      </span>
    );
  }

  if (decryptionFailed && showEncrypted) {
    return (
      <span className={className}>
        <Badge color="warning" className="mr-1" title="Decryption failed">
          🔒
        </Badge>
        {encryptedFrom.substring(0, 20)}...
      </span>
    );
  }

  return (
    <span className={className} title={decryptionFailed ? 'Decryption failed' : 'Decrypted successfully'}>
      {decryptionFailed && (
        <Badge color="warning" className="mr-1" title="Decryption failed">
          ⚠️
        </Badge>
      )}
      {decryptedSender}
    </span>
  );
};

export default DecryptedSender;
