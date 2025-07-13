import { useState, useEffect } from 'react';
import { useNewMailLogic } from './useNewMailLogic.js';

// Hook để xử lý title blinking với logic NEW mail mới
export const useTitleBlink = () => {
  const { showNewBadge, newMailCounts } = useNewMailLogic();
  const [originalTitle] = useState(document.title);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isTabVisible, setIsTabVisible] = useState(!document.hidden);

  // Track tab visibility
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsTabVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    let interval;

    if (showNewBadge && newMailCounts.total > 0) {
      setIsBlinking(true);

      // Blink title every 1 second for better visibility
      interval = setInterval(() => {
        if (document.title === originalTitle) {
          document.title = `🔔 (${newMailCounts.total}) NEW MAIL! 📧`;
        } else {
          document.title = originalTitle;
        }
      }, 1000);
    } else {
      setIsBlinking(false);
      document.title = originalTitle;
      if (interval) {
        clearInterval(interval);
      }
    }

    // Cleanup on unmount
    return () => {
      if (interval) {
        clearInterval(interval);
      }
      document.title = originalTitle;
    };
  }, [showNewBadge, newMailCounts.total, originalTitle]);

  // Stop blinking when user returns to tab
  useEffect(() => {
    if (isTabVisible && isBlinking) {
      console.log('👀 User returned to tab, continuing title blink until manually cleared');
    }
  }, [isTabVisible, isBlinking]);

  return {
    isBlinking,
    shouldReload: showNewBadge, // Compatibility với code cũ
    isTabVisible,
    newMailCount: newMailCounts.total
  };
};