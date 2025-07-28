import React from "react";
import {
  Table,
  Badge,
  Media,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
} from "reactstrap";
import DecryptedSender from "../DecryptedSender/DecryptedSender";

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
  mailType = "valid", // 'valid', 'expired', 'review', 'all'
  // New props for checkbox functionality
  selectedMails = [],
  onSelectMail,
  onSelectAll,
  showCheckboxes = false,
}) => {
  // Debug log to check props
  console.log("🔧 MailTable props:", {
    mailType,
    handleMoveToReview: typeof handleMoveToReview,
    handleMoveBack: typeof handleMoveBack,
    mailsCount: mails?.length,
  });

  const renderReplyDeadline = (mail) => {
    if (mailType === "expired") {
      // For expired mails, show days expired
      const daysExpired = getDaysExpired ? getDaysExpired(mail.Date) : 0;
      return (
        <Badge color="danger" pill>
          {daysExpired} days expired
        </Badge>
      );
    } else if (mailType === "valid" && getHoursRemaining) {
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
        <span className="text-sm text-muted">{formatDate(mail.Date)}</span>
      );
    }
  };

  const renderStatus = (mail) => {
    if (mailType === "review") {
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
      case "expired":
        return "Days Expired";
      case "valid":
        return "Reply Deadline";
      case "review":
        return "Date Sent";
      case "all":
        return "Date Sent";
      default:
        return "Date";
    }
  };

  return (
    <Table className="align-items-center table-flush" responsive>
      <thead className="thead-light">
        <tr>
          {showCheckboxes && (
            <th
              scope="col"
              style={{
                width: "50px",
                textAlign: "center",
                verticalAlign: "middle",
              }}
            >
              <Input
                type="checkbox"
                onChange={(e) => onSelectAll && onSelectAll(e.target.checked)}
                checked={
                  selectedMails.length > 0 &&
                  selectedMails.length === mails.length
                }
                style={{ margin: "0 auto" }}
              />
            </th>
          )}
          <th scope="col">Subject</th>
          <th scope="col">Sender</th>
          <th scope="col">Type</th>
          <th scope="col">Reply Status</th>
          <th scope="col">Assigned PIC</th>
          {mailType !== "review" && mailType !== "all" && (
            <th scope="col">Date</th>
          )}
          {mailType === "review" && <th scope="col">Date Move</th>}
          <th scope="col">{getDeadlineColumnTitle()}</th>
          {mailType === "review" && <th scope="col">Original Status</th>}
          <th scope="col" />
        </tr>
      </thead>
      <tbody>
        {mails.map((mail, index) => {
          const mailId = mail.id || `${mail.Subject}-${mail.From}`;
          const isSelected = selectedMails.includes(mailId);
          // Create unique key using index, fileName and filePath to ensure uniqueness
          const uniqueKey = `${index}-${mail.fileName || mailId}-${
            mail.filePath || ""
          }`.replace(/[^a-zA-Z0-9-_]/g, "-");

          return (
            <tr key={uniqueKey}>
              {showCheckboxes && (
                <td style={{ textAlign: "center", verticalAlign: "middle" }}>
                  <Input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) =>
                      onSelectMail && onSelectMail(mailId, e.target.checked)
                    }
                    style={{ margin: "0 auto" }}
                  />
                </td>
              )}
              <th scope="row">
                <Media className="align-items-center">
                  <Media>
                    <span
                      className="mb-0 text-sm font-weight-bold text-primary cursor-pointer"
                      onClick={() =>
                        handleViewDetails && handleViewDetails(mail)
                      }
                      style={{ cursor: "pointer" }}
                      title="Click to view details"
                    >
                      {truncateText(mail.Subject, 30)}
                      {(() => {
                        // Show NEW icon for DungHan/mustRep unread mails
                        const shouldShowNew =
                          mail &&
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
                                fontSize: "0.6rem",
                                animation: "pulse 2s infinite",
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
                  if (groupInfo.isGroup) {
                    return (
                      <span
                        className="font-weight-bold"
                        title={`Group: ${groupInfo.displayName}`}
                      >
                        {truncateText(groupInfo.displayName, 30)}
                      </span>
                    );
                  } else {
                    return (
                      <DecryptedSender
                        encryptedFrom={mail.From}
                        fallbackText="Unknown Sender"
                        showEncrypted={false}
                        className="text-muted"
                      />
                    );
                  }
                })()}
              </td>
              <td>
                <Badge color={getTypeColor(mail.Type)} pill>
                  {mail.Type}
                </Badge>
              </td>
              <td>{renderStatus(mail)}</td>
              <td>
                {mail.assignedTo ? (
                  <div
                    onClick={() => handleAssignMail && handleAssignMail(mail)}
                    style={{ cursor: "pointer" }}
                    title="Click to reassign"
                  >
                    <div className="text-sm">
                      {mail.assignedTo.type === "pic" ? (
                        <span className="font-weight-bold text-primary">
                          {mail.assignedTo.picName || "Unknown PIC"}
                        </span>
                      ) : (
                        <span className="font-weight-bold text-info">
                          {mail.assignedTo.groupName || "Unknown Group"}
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <Badge
                    color="secondary"
                    pill
                    onClick={() => handleAssignMail && handleAssignMail(mail)}
                    style={{ cursor: "pointer" }}
                    title="Click to assign"
                  >
                    Unassigned
                  </Badge>
                )}
              </td>
              {mailType !== "review" && mailType !== "all" && (
                <td>
                  <span className="text-sm text-muted">
                    {formatDate(mail.Date)}
                  </span>
                </td>
              )}
              {mailType === "review" && (
                <td>
                  <span className="text-sm text-muted">
                    {mail.dateMoved ? formatDate(mail.dateMoved) : "N/A"}
                  </span>
                </td>
              )}
              <td>{renderReplyDeadline(mail)}</td>
              {mailType === "review" && (
                <td>
                  {(() => {
                    // Determine original status based on mail data
                    const getOriginalStatus = (mail) => {
                      // Check originalCategory first (set when moved to review)
                      if (mail.originalCategory) {
                        if (mail.originalCategory === "DungHan") {
                          return { text: "Valid", color: "success" };
                        } else if (mail.originalCategory === "QuaHan") {
                          return { text: "Expired", color: "danger" };
                        }
                      }

                      // Fallback: check current mail properties
                      if (
                        mail.isExpired === true ||
                        mail.category === "QuaHan"
                      ) {
                        return { text: "Expired", color: "danger" };
                      } else if (
                        mail.isExpired === false ||
                        mail.category === "DungHan"
                      ) {
                        return { text: "Valid", color: "success" };
                      }

                      // Default fallback
                      return { text: "Unknown", color: "secondary" };
                    };

                    const status = getOriginalStatus(mail);

                    return (
                      <Badge color={status.color} pill>
                        {status.text}
                      </Badge>
                    );
                  })()}
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
                  <DropdownMenu
                    className="dropdown-menu-arrow mail-actions-dropdown"
                    right
                    style={{ zIndex: 1080 }}
                  >
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
                    {(() => {
                      const shouldShowMoveToReview =
                        (mailType === "valid" || mailType === "expired") &&
                        handleMoveToReview &&
                        mail.Subject &&
                        mail.From;

                      console.log("🔍 Move to Review button check:", {
                        mailType,
                        hasHandler: !!handleMoveToReview,
                        hasSubject: !!mail.Subject,
                        hasFrom: !!mail.From,
                        shouldShow: shouldShowMoveToReview,
                        mailId: mail.id,
                      });

                      return shouldShowMoveToReview ? (
                        <DropdownItem
                          href="#pablo"
                          onClick={(e) => {
                            e.preventDefault();
                            console.log(
                              "🔄 Move to Review clicked for mail:",
                              mail.Subject
                            );
                            console.log("📧 Mail data:", mail);
                            console.log(
                              "🎯 handleMoveToReview function:",
                              typeof handleMoveToReview
                            );
                            try {
                              handleMoveToReview(mail);
                            } catch (error) {
                              console.error(
                                "❌ Error in handleMoveToReview:",
                                error
                              );
                            }
                          }}
                        >
                          <i className="fas fa-arrow-down mr-2" />
                          Move to Review
                        </DropdownItem>
                      ) : null;
                    })()}
                    {mailType === "review" && handleMoveBack && (
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
