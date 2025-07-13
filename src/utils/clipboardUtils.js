/**
 * Clipboard utilities for handling copy functionality across different environments
 * Supports both secure contexts (HTTPS, localhost) and non-secure contexts (HTTP, IP addresses)
 */

/**
 * Copy text to clipboard with fallback for non-secure contexts
 * @param {string} text - Text to copy to clipboard
 * @param {function} onSuccess - Callback function when copy succeeds
 * @param {function} onError - Callback function when copy fails
 * @returns {Promise<boolean>} - Promise that resolves to true if successful
 */
export const copyToClipboard = async (text, onSuccess = null, onError = null) => {
  if (!text) {
    console.warn('No text provided to copy');
    if (onError) onError('No text provided');
    return false;
  }

  // Modern Clipboard API (works in secure contexts: HTTPS, localhost)
  if (navigator.clipboard && navigator.clipboard.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied using Clipboard API');
      if (onSuccess) onSuccess();
      return true;
    } catch (err) {
      console.error('Clipboard API failed:', err);
      // Fallback to legacy method
      return fallbackCopyTextToClipboard(text, onSuccess, onError);
    }
  } else {
    // Fallback for non-secure contexts (HTTP, IP addresses)
    console.log('Clipboard API not available, using fallback method');
    return fallbackCopyTextToClipboard(text, onSuccess, onError);
  }
};

/**
 * Fallback copy method using document.execCommand (deprecated but necessary for non-secure contexts)
 * @param {string} text - Text to copy
 * @param {function} onSuccess - Success callback
 * @param {function} onError - Error callback
 * @returns {boolean} - Success status
 */
const fallbackCopyTextToClipboard = (text, onSuccess = null, onError = null) => {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  
  // Avoid scrolling to bottom and make invisible
  textArea.style.top = "0";
  textArea.style.left = "0";
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  textArea.style.pointerEvents = "none";
  textArea.style.zIndex = "-1";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    // Note: document.execCommand is deprecated but still necessary for non-secure contexts
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    if (successful) {
      console.log('Text copied using fallback method');
      if (onSuccess) onSuccess();
      return true;
    } else {
      console.error('Fallback copy failed');
      if (onError) onError('Copy operation failed');
      return false;
    }
  } catch (err) {
    console.error('Fallback copy error:', err);
    document.body.removeChild(textArea);
    if (onError) onError(err.message || 'Copy operation failed');
    return false;
  }
};

/**
 * Check if clipboard API is available
 * @returns {boolean} - True if clipboard API is available
 */
export const isClipboardAPIAvailable = () => {
  return !!(navigator.clipboard && navigator.clipboard.writeText);
};

/**
 * Get clipboard support information
 * @returns {object} - Object containing clipboard support details
 */
export const getClipboardSupport = () => {
  return {
    clipboardAPI: isClipboardAPIAvailable(),
    execCommand: !!document.execCommand,
    isSecureContext: window.isSecureContext || false,
    protocol: window.location.protocol,
    hostname: window.location.hostname
  };
};

/**
 * Copy text with user-friendly error handling
 * @param {string} text - Text to copy
 * @param {object} options - Options object
 * @param {function} options.onSuccess - Success callback
 * @param {function} options.onError - Error callback
 * @param {boolean} options.showAlert - Whether to show alert on failure (default: true)
 * @param {string} options.alertPrefix - Prefix for alert message (default: 'Copy failed')
 * @returns {Promise<boolean>} - Success status
 */
export const copyWithFeedback = async (text, options = {}) => {
  const {
    onSuccess = null,
    onError = null,
    showAlert = true,
    alertPrefix = 'Copy failed'
  } = options;

  const success = await copyToClipboard(
    text,
    onSuccess,
    (error) => {
      if (showAlert) {
        alert(`${alertPrefix}. Please copy manually: ${text}`);
      }
      if (onError) onError(error);
    }
  );

  return success;
};

export default {
  copyToClipboard,
  isClipboardAPIAvailable,
  getClipboardSupport,
  copyWithFeedback
};
