import { useState } from 'react';

// Hook để mark mail as read
export const useMarkMailRead = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markMailAsRead = async (mail) => {
    if (!mail || !mail.id || !mail.fileName || !mail.category || !mail.status) {
      console.error('Invalid mail data for marking as read:', mail);
      return false;
    }

    // Skip if already read
    if (mail.isRead) {
      console.log('Mail already marked as read:', mail.id);
      return true;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/mark-mail-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mailId: mail.id,
          fileName: mail.fileName,
          category: mail.category,
          status: mail.status
        }),
      });

      const result = await response.json();

      if (result.success) {
        console.log(`✅ Mail marked as read: ${mail.id}`);
        return true;
      } else {
        console.error('Failed to mark mail as read:', result.error);
        setError(result.error);
        return false;
      }
    } catch (error) {
      console.error('Error marking mail as read:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    markMailAsRead,
    loading,
    error
  };
};
