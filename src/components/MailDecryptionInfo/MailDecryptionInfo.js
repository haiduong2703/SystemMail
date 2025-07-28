import React, { useState } from 'react';
import { 
  Card, 
  CardBody, 
  Badge, 
  Button, 
  Collapse,
  Table
} from 'reactstrap';

/**
 * Component to show mail decryption information and debug details
 */
const MailDecryptionInfo = ({ 
  originalMails = [], 
  decryptedMails = [],
  decryptionErrors = [],
  isDecrypting = false,
  totalMails = 0,
  decryptedCount = 0
}) => {
  const [isOpen, setIsOpen] = useState(false);

  if (totalMails === 0) {
    return null;
  }

  const successCount = decryptedCount - decryptionErrors.length;
  const errorCount = decryptionErrors.length;
  const pendingCount = totalMails - decryptedCount;

  return (
    <Card className="shadow-sm mb-3">
      <CardBody className="py-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <Badge color="info" className="mr-2">
              🔓 Decryption
            </Badge>
            
            {isDecrypting ? (
              <span className="text-muted">
                Processing {totalMails} mails...
              </span>
            ) : (
              <div className="d-flex align-items-center">
                <Badge color="success" className="mr-1">
                  ✅ {successCount}
                </Badge>
                {errorCount > 0 && (
                  <Badge color="warning" className="mr-1">
                    ⚠️ {errorCount}
                  </Badge>
                )}
                {pendingCount > 0 && (
                  <Badge color="secondary" className="mr-1">
                    ⏳ {pendingCount}
                  </Badge>
                )}
                <span className="text-muted ml-2">
                  of {totalMails} mails
                </span>
              </div>
            )}
          </div>
          
          <Button 
            color="link" 
            size="sm" 
            onClick={() => setIsOpen(!isOpen)}
            className="p-0"
          >
            {isOpen ? '▼' : '▶'} Details
          </Button>
        </div>

        <Collapse isOpen={isOpen}>
          <hr className="my-2" />
          
          {/* Summary Stats */}
          <div className="row mb-3">
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 mb-0 text-success">{successCount}</div>
                <small className="text-muted">Successfully Decrypted</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 mb-0 text-warning">{errorCount}</div>
                <small className="text-muted">Decryption Errors</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 mb-0 text-secondary">{pendingCount}</div>
                <small className="text-muted">Pending</small>
              </div>
            </div>
            <div className="col-md-3">
              <div className="text-center">
                <div className="h4 mb-0 text-info">{totalMails}</div>
                <small className="text-muted">Total Mails</small>
              </div>
            </div>
          </div>

          {/* Sample Decrypted Mails */}
          {decryptedMails.length > 0 && (
            <div className="mb-3">
              <h6 className="text-primary mb-2">📧 Sample Decrypted Mails</h6>
              <Table size="sm" className="mb-0">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Original From</th>
                    <th>Decrypted From</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {decryptedMails.slice(0, 3).map((mail, index) => {
                    const isEncrypted = mail.EncryptedFrom && mail.EncryptedFrom !== mail.From;
                    return (
                      <tr key={index}>
                        <td className="text-truncate" style={{ maxWidth: '150px' }}>
                          {mail.Subject || 'No Subject'}
                        </td>
                        <td className="text-truncate" style={{ maxWidth: '120px' }}>
                          <code className="small">
                            {mail.EncryptedFrom ? 
                              `${mail.EncryptedFrom.substring(0, 15)}...` : 
                              mail.From
                            }
                          </code>
                        </td>
                        <td className="text-truncate" style={{ maxWidth: '120px' }}>
                          {mail.From}
                        </td>
                        <td>
                          {isEncrypted ? (
                            <Badge color="success" size="sm">✅ Decrypted</Badge>
                          ) : (
                            <Badge color="secondary" size="sm">➖ Plain</Badge>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {decryptedMails.length > 3 && (
                <small className="text-muted">
                  ... and {decryptedMails.length - 3} more mails
                </small>
              )}
            </div>
          )}

          {/* Decryption Errors */}
          {decryptionErrors.length > 0 && (
            <div className="mb-3">
              <h6 className="text-warning mb-2">⚠️ Decryption Errors</h6>
              <div className="bg-light p-2 rounded">
                {decryptionErrors.slice(0, 3).map((error, index) => (
                  <div key={index} className="small text-muted mb-1">
                    <strong>Mail {error.index + 1}:</strong> {error.mail?.Subject || 'Unknown'} 
                    <br />
                    <span className="text-danger">Error: {error.error}</span>
                  </div>
                ))}
                {decryptionErrors.length > 3 && (
                  <small className="text-muted">
                    ... and {decryptionErrors.length - 3} more errors
                  </small>
                )}
              </div>
            </div>
          )}

          {/* Debug Info */}
          <div className="small text-muted">
            <strong>Debug Info:</strong> 
            Original mails: {originalMails.length}, 
            Decrypted mails: {decryptedMails.length}, 
            Processing: {isDecrypting ? 'Yes' : 'No'}
          </div>
        </Collapse>
      </CardBody>
    </Card>
  );
};

export default MailDecryptionInfo;
