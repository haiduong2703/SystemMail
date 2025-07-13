import { useEffect } from 'react';
import { useMailContext } from 'contexts/MailContext.js';
import { useBlinkingTitle } from 'hooks/useBlinkingTitle.js';

/**
 * A component that doesn't render anything, but controls the blinking title
 * based on the mail context's reloadStatus.
 */
const BlinkingTitleController = () => {
    const { reloadStatus } = useMailContext();
    const { startBlinking, stopBlinking } = useBlinkingTitle('📧 New Mail!');

    useEffect(() => {
        if (reloadStatus) {
            startBlinking();
        } else {
            stopBlinking();
        }
    }, [reloadStatus, startBlinking, stopBlinking]);

    return null; // This component does not render anything
};

export default BlinkingTitleController; 