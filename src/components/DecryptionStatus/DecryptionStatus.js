import React from 'react';
import { 
  Alert, 
  Progress, 
  Badge, 
  Button,
  UncontrolledTooltip
} from 'reactstrap';

/**
 * Component to show decryption status and progress
 */
const DecryptionStatus = ({
  isDecrypting,
  decryptionProgress,
  decryptionErrors,
  totalMails,
  decryptedCount,
  onRetryDecryption,
  onClearErrors,
  showProgress = true,
  showErrors = true,
  compact = false
}) => {
  if (!isDecrypting && decryptionErrors.length === 0 && decryptedCount === totalMails) {
    // All good, no need to show anything
    return null;
  }

  if (compact) {
    return (
      <div className="d-flex align-items-center mb-2">
        {isDecrypting && (
          <>
            <Badge color="info" className="mr-2">
              🔓 Decrypting...
            </Badge>
            <Progress 
              value={decryptionProgress} 
              className="flex-grow-1 mr-2"
              style={{ height: '6px' }}
            />
            <small className="text-muted">
              {decryptionProgress}%
            </small>
          </>
        )}
        
        {decryptionErrors.length > 0 && (
          <Badge 
            color="warning" 
            className="mr-2"
            id="decryption-errors-badge"
          >
            ⚠️ {decryptionErrors.length} errors
          </Badge>
        )}
        
        {decryptionErrors.length > 0 && (
          <UncontrolledTooltip target="decryption-errors-badge">
            {decryptionErrors.length} mail(s) failed to decrypt
          </UncontrolledTooltip>
        )}
      </div>
    );
  }

  return (
    <div className="mb-3">
      {/* Decryption Progress */}
      {isDecrypting && showProgress && (
        <Alert color="info" className="mb-2">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span>
              <strong>🔓 Decrypting mail data...</strong>
            </span>
            <Badge color="info">
              {decryptionProgress}%
            </Badge>
          </div>
          <Progress 
            value={decryptionProgress} 
            className="mb-2"
            striped
            animated
          />
          <small className="text-muted">
            Processing {totalMails} mail(s)...
          </small>
        </Alert>
      )}

      {/* Decryption Errors */}
      {decryptionErrors.length > 0 && showErrors && (
        <Alert color="warning" className="mb-2">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <span>
              <strong>⚠️ Decryption Issues</strong>
            </span>
            <div>
              {onRetryDecryption && (
                <Button 
                  color="warning" 
                  size="sm" 
                  outline 
                  className="mr-2"
                  onClick={onRetryDecryption}
                >
                  Retry
                </Button>
              )}
              {onClearErrors && (
                <Button 
                  color="secondary" 
                  size="sm" 
                  outline
                  onClick={onClearErrors}
                >
                  Dismiss
                </Button>
              )}
            </div>
          </div>
          
          <div className="mb-2">
            <Badge color="warning" className="mr-2">
              {decryptionErrors.length} of {totalMails} mails
            </Badge>
            failed to decrypt properly.
          </div>
          
          {decryptionErrors.length <= 3 && (
            <div>
              <small className="text-muted d-block mb-1">
                <strong>Affected mails:</strong>
              </small>
              {decryptionErrors.map((error, index) => (
                <div key={index} className="small text-muted">
                  • {error.mail?.Subject || `Mail ${error.index + 1}`}
                  {error.error && ` (${error.error})`}
                </div>
              ))}
            </div>
          )}
          
          {decryptionErrors.length > 3 && (
            <small className="text-muted">
              Multiple mails affected. Check console for details.
            </small>
          )}
        </Alert>
      )}

      {/* Success Status */}
      {!isDecrypting && decryptionErrors.length === 0 && decryptedCount > 0 && (
        <Alert color="success" className="mb-2">
          <Badge color="success" className="mr-2">
            ✅ {decryptedCount}
          </Badge>
          mail(s) decrypted successfully
        </Alert>
      )}
    </div>
  );
};

export default DecryptionStatus;
