import { useEffect, useRef } from 'react';

export const useBlinkingTitle = (blinkMessage = '📧 New Mail!') => {
    const intervalRef = useRef(null);
    const originalTitleRef = useRef(document.title);

    const stopBlinking = () => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            document.title = originalTitleRef.current;
        }
    };

    const startBlinking = () => {
        if (intervalRef.current) return; // Already blinking

        originalTitleRef.current = document.title;

        intervalRef.current = setInterval(() => {
            document.title = document.title === blinkMessage ? originalTitleRef.current : blinkMessage;
        }, 1000);
    };

    useEffect(() => {
        const handleFocus = () => {
            stopBlinking();
        };

        window.addEventListener('focus', handleFocus);

        // Cleanup function
        return () => {
            window.removeEventListener('focus', handleFocus);
            stopBlinking();
        };
    }, []); // Empty dependency array ensures this runs only once

    return { startBlinking, stopBlinking };
}; 