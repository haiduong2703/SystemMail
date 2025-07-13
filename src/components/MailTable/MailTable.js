import React from 'react';
import {
  Table,
  Badge,
  Media,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input
} from 'reactstrap';

const MailTable = ({
  mails,
  getTypeColor,
  getGroupInfo,
  formatDate,
  getHoursRemaining,
  getDaysExpired,
  truncateText,
  handleViewDetails,
  handleAssignMail,
  handleMoveToReview, // New prop for move to review functionality
  handleMoveBack, // New prop for move back from review functionality
  mailType = 'valid', // 'valid', 'expired', 'review', 'all'
  // New props for checkbox functionality
  selectedMails = [],
  onSelectMail,
  onSelectAll,
  showCheckboxes = false
}) => {
  
  const renderReplyDeadline = (mail) => {
    if (mailType === 'expired') {
      // For expired mails, show days expired
      const daysExpired = getDaysExpired ? getDaysExpired(mail.Date) : 0;
      return (
        <Badge color="danger" pill>
          {daysExpired} days expired
        </Badge>
      );
    } else if (mailType === 'valid' && getHoursRemaining) {
      // For valid mails, show hours remaining
      const hoursLeft = getHoursRemaining(mail.Date);
      let badgeColor = "success";
      let displayText = "";

      if (hoursLeft <= 0) {
        badgeColor = "danger";
        displayText = "Expired";
      } else if (hoursLeft <= 2) {
        badgeColor = "danger";
        displayText = `${hoursLeft}h left`;
      } else if (hoursLeft <= 6) {
        badgeColor = "warning";
        displayText = `${hoursLeft}h left`;
      } else {
        badgeColor = "success";
        displayText = `${hoursLeft}h left`;
      }

      return (
        <Badge color={badgeColor} pill>
          {displayText}
        </Badge>
      );
    } else {
      // For review or all mails, show formatted date
      return (
        <span className="text-sm text-muted">
          {formatDate(mail.Date)}
        </span>
      );
    }
  };

  const renderStatus = (mail) => {
    if (mailType === 'review') {
      return (
        <Badge color={mail.isReplied ? "success" : "info"} pill>
          {mail.isReplied ? "Processed" : "Under Review"}
        </Badge>
      );
    } else {
      return (
        <Badge color={mail.isReplied ? "success" : "warning"} pill>
          {mail.isReplied ? "Replied" : "Non-reply"}
        </Badge>
      );
    }
  };

  const getDeadlineColumnTitle = () => {
    switch (mailType) {
      case 'expired':
        return 'Days Expired';
      case 'valid':
        return 'Reply Deadline';
      case 'review':
        return 'Date Sent';
      case 'all':
        return 'Date Sent';
      default:
        return 'Date';
    }
  };

  return (
    <Table className="align-items-center table-flush" responsive>
      <thead className="thead-light">
        <tr>
          {showCheckboxes && (
            <th scope="col" style={{ width: '50px', textAlign: 'center' }}>
              <Input
                type="checkbox"
                onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                checked={selectedMails.length > 0 && selectedMails.length === mails.length}
              />
            </th>
          )}
          <th scope="col">Subject</th>
          <th scope="col">Sender</th>
          <th scope="col">Type</th>
          <th scope="col">Reply Status</th>
          <th scope="col">Assigned PIC</th>
          <th scope="col">Date</th>
          <th scope="col">{getDeadlineColumnTitle()}</th>
          {mailType === 'review' && <th scope="col">Date Move</th>}
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        {mails.map((mail) => {
          const mailId = mail.id || `${mail.Subject}-${mail.From}`;
          const isSelected = selectedMails.includes(mailId);

          return (
            <tr key={mail.id}>
              {showCheckboxes && (
                <td style={{ textAlign: 'center' }}>
                  <Input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => onSelectMail && onSelectMail(mailId, e.target.checked)}
                  />
                </td>
              )}
              <th scope="row">
              <Media className="align-items-center">
                <Media>
                  <span className="mb-0 text-sm font-weight-bold text-muted">
                    {truncateText(mail.Subject, 30)}
                    {(() => {
                      // Show NEW icon for DungHan/mustRep unread mails
                      const shouldShowNew = mail &&
                        mail.category === "DungHan" &&
                        mail.status === "mustRep" &&
                        !mail.isRead;

                      if (shouldShowNew) {
                        return (
                          <Badge
                            color="danger"
                            pill
                            className="ml-2"
                            style={{
                              fontSize: '0.6rem',
                              animation: 'pulse 2s infinite'
                            }}
                          >
                            NEW
                          </Badge>
                        );
                      }
                      return null;
                    })()}
                  </span>
                </Media>
              </Media>
            </th>
            <td>
              {(() => {
                const groupInfo = getGroupInfo(mail.From);
                return (
                  <span
                    className={groupInfo.isGroup ? "font-weight-bold" : "text-muted"}
                    title={groupInfo.isGroup ? `Group: ${groupInfo.displayName}` : 'Individual email'}
                  >
                    {truncateText(groupInfo.displayName, 30)}
                  </span>
                );
              })()}
            </td>
            <td>
              <Badge color={getTypeColor(mail.Type)} pill>
                {mail.Type}
              </Badge>
            </td>
            <td>
              {renderStatus(mail)}
            </td>
            <td>
              {mail.assignedTo ? (
                <div>
                  <div className="text-sm">
                    {mail.assignedTo.type === 'pic' ? (
                      <span className="font-weight-bold text-primary">
                        {mail.assignedTo.picName || 'Unknown PIC'}
                      </span>
                    ) : (
                      <span className="font-weight-bold text-info">
                        {mail.assignedTo.groupName || 'Unknown Group'}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <Badge color="secondary" pill>
                  Unassigned
                </Badge>
              )}
            </td>
            <td>
              <span className="text-sm text-muted">
                {formatDate(mail.Date)}
              </span>
            </td>
            <td>
              {renderReplyDeadline(mail)}
            </td>
            {mailType === 'review' && (
              <td>
                <span className="text-sm text-muted">
                  {mail.dateMoved ? formatDate(mail.dateMoved) : 'N/A'}
                </span>
              </td>
            )}
            <td className="text-right">
              <UncontrolledDropdown>
                <DropdownToggle
                  className="btn-icon-only text-light"
                  href="#pablo"
                  role="button"
                  size="sm"
                  color=""
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="fas fa-ellipsis-v" />
                </DropdownToggle>
                <DropdownMenu className="dropdown-menu-arrow mail-actions-dropdown" right style={{ zIndex: 1080 }}>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleViewDetails(mail);
                    }}
                  >
                    Xem chi tiết
                  </DropdownItem>
                  <DropdownItem
                    href="#pablo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAssignMail(mail);
                    }}
                  >
                    <i className="fas fa-user-plus mr-2" />
                    Phân công
                  </DropdownItem>
                  {(mailType === 'valid' || mailType === 'expired') && handleMoveToReview && (
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveToReview(mail);
                      }}
                    >
                      <i className="fas fa-arrow-down mr-2" />
                      Move to Review
                    </DropdownItem>
                  )}
                  {mailType === 'review' && handleMoveBack && (
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => {
                        e.preventDefault();
                        handleMoveBack(mail);
                      }}
                    >
                      <i className="fas fa-arrow-up mr-2" />
                      Move Back
                    </DropdownItem>
                  )}
                </DropdownMenu>
              </UncontrolledDropdown>
            </td>
          </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default MailTable;
