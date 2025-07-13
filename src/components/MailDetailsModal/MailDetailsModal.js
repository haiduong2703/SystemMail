import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Badge,
  Alert
} from 'reactstrap';
import { copyWithFeedback } from 'utils/clipboardUtils';

const MailDetailsModal = ({
  isOpen,
  toggle,
  selectedMail,
  formatDate,
  getTypeColor,
  getHoursRemaining,
  getDaysExpired,
  getGroupInfo,
  getStatusBadge,
  truncateText
}) => {
  const [copySuccess, setCopySuccess] = useState(false);

  if (!selectedMail) return null;

  // Copy subject to clipboard with fallback for non-secure contexts
  const handleCopySubject = async () => {
    if (!selectedMail.Subject) return;

    const success = await copyWithFeedback(selectedMail.Subject, {
      onSuccess: () => {
        setCopySuccess(true);
        setTimeout(() => {
          setCopySuccess(false);
        }, 3000);
      },
      onError: (error) => {
        console.error('Failed to copy subject:', error);
      },
      showAlert: true,
      alertPrefix: 'Failed to copy subject'
    });

    if (!success) {
      console.warn('Copy operation was not successful');
    }
  };

  // Open reply link with mail ID
  const handleReply = () => {
    // Extract file ID from fileName or use a fallback
    let mailSeq = '4171'; // Default fallback

    if (selectedMail.fileName) {
      // Extract ID from fileName (e.g., "13579.json" -> "13579")
      const match = selectedMail.fileName.match(/(\d+)\.json$/);
      if (match) {
        mailSeq = match[1];
      }
    } else if (selectedMail.id) {
      // Use mail ID if available
      mailSeq = selectedMail.id.toString();
    } else if (selectedMail.Subject) {
      // Generate a simple hash from subject as fallback
      mailSeq = Math.abs(selectedMail.Subject.split('').reduce((a, b) => {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
      }, 0)).toString();
    }

    // Construct the reply URL
    const replyUrl = `http://uts.net/mailapp/mail-detail?isFromDetail=false&openYN=true&folderID=1&mailSeq=${mailSeq}`;

    // Open in new tab
    window.open(replyUrl, '_blank');
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <ModalHeader toggle={toggle}>
        Email Details
      </ModalHeader>
      <ModalBody>
        {/* Copy Success Alert */}
        {copySuccess && (
          <Alert color="success" className="mb-3">
            <i className="fas fa-check-circle mr-2" />
            Subject copied to clipboard successfully!
          </Alert>
        )}

        <p><strong>Subject:</strong> {selectedMail.Subject}</p>
        <p><strong>Sender:</strong>
          {getGroupInfo ? (
            (() => {
              const groupInfo = getGroupInfo(selectedMail.From);
              return (
                <span>
                  <div>{groupInfo.displayName}</div>
                  {groupInfo.isGroup && (
                    <small className="text-muted">
                      <i className="fas fa-envelope mr-1"></i>
                      Personal Email: {selectedMail.From}
                    </small>
                  )}
                </span>
              );
            })()
          ) : (
            selectedMail.From
          )}
        </p>
        <p><strong>Type:</strong> <Badge color={getTypeColor(selectedMail.Type)} pill>{selectedMail.Type}</Badge></p>

        {/* Mail Status - only for AllMails */}
        {getStatusBadge && (
          <p><strong>Mail Status:</strong> {getStatusBadge(selectedMail.isExpired)}</p>
        )}

        {/* Reply Status */}
        <p><strong>{getStatusBadge ? 'Reply Status' : 'Status'}:</strong>
          {selectedMail.category === "ReviewMail" ? (
            <Badge color={selectedMail.isReplied ? "success" : "info"} pill>
              {selectedMail.isReplied ? "Processed" : "Under Review"}
            </Badge>
          ) : (
            <Badge color={selectedMail.isReplied ? "success" : "warning"} pill>
              {selectedMail.isReplied ? "Replied" : "Pending"}
            </Badge>
          )}
        </p>
        <p><strong>Assigned PIC:</strong>
          {selectedMail.assignedTo ? (
            <Badge color="info" pill className="ml-2">
              {selectedMail.assignedTo.type === 'pic' ?
                `PIC: ${selectedMail.assignedTo.picName || 'Unknown'}` :
                `Group: ${selectedMail.assignedTo.groupName || 'Unknown'}`
              }
            </Badge>
          ) : (
            <Badge color="secondary" pill className="ml-2">Unassigned</Badge>
          )}
        </p>
        <p><strong>Date Sent:</strong> {formatDate(selectedMail.Date)}</p>

        {/* File Information */}
        <p><strong>File Information:</strong>
          <div className="ml-3">
            {selectedMail.id && (
              <div>
                <i className="fas fa-hashtag mr-1 text-muted"></i>
                <small className="text-muted">ID: {selectedMail.id}</small>
              </div>
            )}
            {selectedMail.fileName && (
              <div>
                <i className="fas fa-file mr-1 text-muted"></i>
                <small className="text-muted">File: {selectedMail.fileName}</small>
              </div>
            )}
            {selectedMail.filePath && (
              <div>
                <i className="fas fa-folder mr-1 text-muted"></i>
                <small className="text-muted">Path: {truncateText ? truncateText(selectedMail.filePath, 50) : selectedMail.filePath}</small>
              </div>
            )}
            <div>
              <i className="fas fa-link mr-1 text-muted"></i>
              <small className="text-muted">Mail Sequence ID:
                <Badge color="info" size="sm" className="ml-1">
                  {(() => {
                    if (selectedMail.fileName) {
                      const match = selectedMail.fileName.match(/(\d+)\.json$/);
                      return match ? match[1] : 'N/A';
                    } else if (selectedMail.id) {
                      return selectedMail.id.toString();
                    } else if (selectedMail.Subject) {
                      return Math.abs(selectedMail.Subject.split('').reduce((a, b) => {
                        a = ((a << 5) - a) + b.charCodeAt(0);
                        return a & a;
                      }, 0)).toString();
                    }
                    return '4171';
                  })()}
                </Badge>
              </small>
            </div>
          </div>
        </p>

        {/* Date Move - only show for review mails */}
        {selectedMail.category === "ReviewMail" && selectedMail.dateMoved && (
          <p><strong>Date Moved to Review:</strong> {formatDate(selectedMail.dateMoved)}</p>
        )}

        {/* Reply Deadline - only show for valid mails */}
        {getHoursRemaining && (
          <p><strong>Reply Deadline:</strong>
            {(() => {
              const hoursLeft = getHoursRemaining(selectedMail.Date);
              let badgeColor = "success";
              let displayText = "";

              if (hoursLeft <= 0) {
                badgeColor = "danger";
                displayText = "Expired";
              } else if (hoursLeft <= 2) {
                badgeColor = "danger";
                displayText = `${hoursLeft} hours left`;
              } else if (hoursLeft <= 6) {
                badgeColor = "warning";
                displayText = `${hoursLeft} hours left`;
              } else {
                badgeColor = "success";
                displayText = `${hoursLeft} hours left`;
              }

              return (
                <Badge color={badgeColor} pill className="ml-2">
                  {displayText}
                </Badge>
              );
            })()}
          </p>
        )}

        {/* Days Expired - only show for expired mails */}
        {getDaysExpired && (
          <p><strong>Days Expired:</strong> <Badge color="danger" pill>{getDaysExpired(selectedMail.Date)} days</Badge></p>
        )}

        {/* Summary Content */}
        {selectedMail.SummaryContent && (
          <>
            <h5>Summary Content:</h5>
            <p>{selectedMail.SummaryContent}</p>
          </>
        )}

        {/* Detailed Content */}
        {selectedMail.Body && (
          <>
            <hr />
            <h5>Detailed Content:</h5>
            <div dangerouslySetInnerHTML={{ __html: selectedMail.Body }} />
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="info" onClick={handleCopySubject}>
          <i className="fas fa-copy mr-1" />
          Copy Subject
        </Button>
        <Button color="primary" onClick={handleReply}>
          <i className="fas fa-external-link-alt mr-1" />
          Open in Mail System
        </Button>
        <Button color="secondary" onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default MailDetailsModal;
