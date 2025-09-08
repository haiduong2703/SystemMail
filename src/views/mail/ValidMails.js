/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect } from "react";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Progress,
  Table,
  Container,
  Row,
  Col,
  UncontrolledTooltip,
  Button, // Button is already here
  ButtonGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
  Alert, // Added Alert
} from "reactstrap";
import io from "socket.io-client";
// core components
import DateFilterNew from "components/DateFilter/DateFilterNew.js";
import { formatDate, filterMailsByDateRange } from "utils/mailUtils.js";
import { useValidMails } from "contexts/MailContext.js";
import { useMarkMailRead } from "hooks/useMarkMailRead.js";
import MailListBadge from "components/MailListBadge/MailListBadge.js";
import CompactHeader from "components/Headers/CompactHeader.js";
import { useMailContext } from "contexts/MailContext.js";
import { useGroupContext } from "contexts/GroupContext.js";
import AssignModal from "components/AssignModal.js";
import CompactClock from "components/RealtimeClock/CompactClock.js";
import PaginationControls from "components/PaginationControls/PaginationControls.js";
import MailDetailsModal from "components/MailDetailsModal/MailDetailsModal.js";
import MailTable from "components/MailTable/MailTable.js";
import { API_BASE_URL } from "constants/api";

const ValidMails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilterStart, setDateFilterStart] = useState(null);
  const [dateFilterEnd, setDateFilterEnd] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [replyStatusFilter, setReplyStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false); // State for Modal visibility
  const [selectedMail, setSelectedMail] = useState(null); // State for selected mail details
  const [assignModalOpen, setAssignModalOpen] = useState(false); // State for Assign Modal
  const [mailToAssign, setMailToAssign] = useState(null); // Mail to be assigned
  const [expiredMovedAlert, setExpiredMovedAlert] = useState(null); // Alert for moved mails
  const [selectedMails, setSelectedMails] = useState([]); // Selected mails for bulk actions

  const validMails = useValidMails();
  const {
    mails,
    formatDate: useMailContextFormatDate,
    selectedMail: useMailContextSelectedMail,
    refreshMails,
  } = useMailContext();
  const { markMailAsRead } = useMarkMailRead();
  const { getGroupInfo, refreshGroups } = useGroupContext();

  // Handle assign mail
  const handleAssignMail = (mail) => {
    setMailToAssign(mail);
    setAssignModalOpen(true);
  };

  const handleAssignSuccess = (updatedMail) => {
    console.log("Mail assigned successfully:", updatedMail);

    // Refresh mail data to show updated assignment
    if (refreshMails) {
      refreshMails();
    }

    // Show success message
    setExpiredMovedAlert({
      type: "success",
      message: `Mail assigned successfully to ${
        updatedMail.assignedTo?.picName ||
        updatedMail.assignedTo?.groupName ||
        "assignee"
      }`,
      timestamp: new Date(),
    });

    // Auto-hide alert after 3 seconds
    setTimeout(() => {
      setExpiredMovedAlert(null);
    }, 3000);
  };

  // Handle checkbox selection
  const handleSelectMail = (mailId, isSelected) => {
    if (isSelected) {
      setSelectedMails((prev) => [...prev, mailId]);
    } else {
      setSelectedMails((prev) => prev.filter((id) => id !== mailId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allMailIds = currentMails.map(
        (mail) => mail.id || `${mail.Subject}-${mail.From}`
      );
      setSelectedMails(allMailIds);
    } else {
      setSelectedMails([]);
    }
  };

  // Handle move mail to review
  const handleMoveToReview = async (mail) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/move-to-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mailId: mail.id || `${mail.Subject}-${mail.From}`,
          mailData: mail,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setExpiredMovedAlert({
          type: "success",
          message: `Mail "${mail.Subject}" has been moved to Review section.`,
          timestamp: new Date(),
        });

        // Auto-hide alert after 3 seconds
        setTimeout(() => {
          setExpiredMovedAlert(null);
        }, 3000);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      } else {
        throw new Error("Failed to move mail to review");
      }
    } catch (error) {
      console.error("Error moving mail to review:", error);
      setExpiredMovedAlert({
        type: "danger",
        message: "Failed to move mail to review section. Please try again.",
        timestamp: new Date(),
      });

      // Auto-hide alert after 3 seconds
      setTimeout(() => {
        setExpiredMovedAlert(null);
      }, 3000);
    }
  };

  // Handle move selected mails to expired
  const handleMoveSelectedToExpired = async () => {
    if (selectedMails.length === 0) {
      setExpiredMovedAlert({
        type: "warning",
        message: "Please select mails to move to expired section.",
        timestamp: new Date(),
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/move-selected-to-expired`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedMailIds: selectedMails,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Selected mails moved successfully:", result);

        // Show success alert
        setExpiredMovedAlert({
          type: "success",
          message: `Successfully moved ${selectedMails.length} mail(s) to Expired section`,
          timestamp: new Date(),
        });

        // Clear selection
        setSelectedMails([]);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      } else {
        console.error("Failed to move selected mails");
        setExpiredMovedAlert({
          type: "danger",
          message: "Failed to move selected mails. Please try again.",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error moving selected mails:", error);
      setExpiredMovedAlert({
        type: "danger",
        message:
          "Error occurred while moving selected mails. Please try again.",
        timestamp: new Date(),
      });
    }
  };

  // Handle move selected mails to review
  const handleMoveSelectedToReview = async () => {
    if (selectedMails.length === 0) {
      setExpiredMovedAlert({
        type: "warning",
        message: "Please select mails to move to review section.",
        timestamp: new Date(),
      });
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/move-selected-to-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            selectedMailIds: selectedMails,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("Selected mails moved to review successfully:", result);

        // Show success alert
        setExpiredMovedAlert({
          type: "success",
          message: `Successfully moved ${selectedMails.length} mail(s) to Review section`,
          timestamp: new Date(),
        });

        // Clear selection
        setSelectedMails([]);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      } else {
        console.error("Failed to move selected mails to review");
        setExpiredMovedAlert({
          type: "danger",
          message: "Failed to move selected mails to review. Please try again.",
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error("Error moving selected mails to review:", error);
      setExpiredMovedAlert({
        type: "danger",
        message:
          "Error occurred while moving selected mails to review. Please try again.",
        timestamp: new Date(),
      });
    }
  };

  const handleRefreshPics = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/refresh-pics`, { method: "POST" });
      setExpiredMovedAlert({
        type: "success",
        message: "PIC data refresh initiated.",
        timestamp: new Date(),
      });
      setTimeout(() => setExpiredMovedAlert(null), 3000);
    } catch (error) {
      console.error("Error refreshing PICs:", error);
      setExpiredMovedAlert({
        type: "danger",
        message: "Failed to refresh PIC data.",
        timestamp: new Date(),
      });
      setTimeout(() => setExpiredMovedAlert(null), 3000);
    }
  };

  // Socket connection for real-time updates
  useEffect(() => {
    const socket = io(API_BASE_URL);

    socket.on("picsUpdated", () => {
      if (refreshMails) {
        refreshMails();
      }
    });

    // Listen for mail updates
    socket.on("mailsUpdated", (data) => {
      if (data.type === "expired_moved" && data.count > 0) {
        setExpiredMovedAlert({
          type: "info",
          message: `${data.count} mail(s) đã quá hạn và được chuyển sang phần "Expired Mails"`,
          timestamp: new Date(),
        });

        // Auto-hide alert after 5 seconds
        setTimeout(() => {
          setExpiredMovedAlert(null);
        }, 5000);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      }
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, [refreshMails]);

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  // Toggle Modal
  const toggleModal = () => {
    setModalOpen(!modalOpen);
  };

  const handleViewDetails = async (mail) => {
    setSelectedMail(mail);
    toggleModal();

    // Mark mail as read when viewing details
    await markMailAsRead(mail);
  };

  // Calculate hours remaining with weekend deadline logic
  const getHoursRemaining = (dateArray) => {
    // Check if dateArray exists and is an array
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
      return 0;
    }

    try {
      const [date, time] = dateArray;
      let mailDate;

      if (time) {
        // If time is provided, combine date and time
        mailDate = new Date(`${date}T${time}`);
      } else {
        // If only date is provided, use date
        mailDate = new Date(date);
      }

      const currentDate = new Date();

      // Check if date is valid
      if (isNaN(mailDate.getTime())) {
        return 0;
      }

      // Calculate deadline based on when mail was sent
      let deadlineDate;
      const dayOfWeek = mailDate.getDay(); // 0 = Sunday, 6 = Saturday

      if (dayOfWeek === 6 || dayOfWeek === 0) {
        // If sent on Saturday (6) or Sunday (0), deadline is end of next Monday
        const daysUntilMonday = dayOfWeek === 6 ? 2 : 1; // Saturday: 2 days, Sunday: 1 day
        deadlineDate = new Date(mailDate);
        deadlineDate.setDate(mailDate.getDate() + daysUntilMonday);
        deadlineDate.setHours(23, 59, 59, 999); // End of Monday
      } else {
        // For weekdays (Monday-Friday), use 24-hour deadline
        deadlineDate = new Date(mailDate.getTime() + 24 * 60 * 60 * 1000);
      }

      const hoursRemaining = Math.ceil(
        (deadlineDate - currentDate) / (1000 * 60 * 60)
      );
      return hoursRemaining > 0 ? hoursRemaining : 0;
    } catch (error) {
      console.error("Error calculating hours remaining:", error);
      return 0;
    }
  };

  // Check if mail is expired (over 24 hours)
  const isMailExpired = (dateArray) => {
    return getHoursRemaining(dateArray) === 0;
  };

  // Filter and sort mails based on search term and date range
  const filteredMails = validMails
    .filter((mail) => {
      // Search filter
      const matchesSearch =
        (mail.Subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mail.From || "").toLowerCase().includes(searchTerm.toLowerCase());

      // Date filter
      const matchesDate =
        dateFilterStart || dateFilterEnd
          ? filterMailsByDateRange([mail], dateFilterStart, dateFilterEnd)
              .length > 0
          : true;

      // Reply status filter
      let matchesReplyStatus = true;
      if (replyStatusFilter === "replied") matchesReplyStatus = mail.isReplied;
      if (replyStatusFilter === "not_replied")
        matchesReplyStatus = !mail.isReplied;

      // Note: Removed automatic expiry filter - mails stay in valid section until manually moved
      // const withinDeadline = !isMailExpired(mail.Date);

      return matchesSearch && matchesDate && matchesReplyStatus;
    })
    .sort((a, b) => {
      // Sort by Date field - newest first
      const getMailDate = (mail) => {
        if (mail.Date && Array.isArray(mail.Date)) {
          const [date, time] = mail.Date;
          return new Date(`${date}T${time || "00:00"}`);
        }
        return new Date(0); // Very old date as fallback
      };

      const dateA = getMailDate(a);
      const dateB = getMailDate(b);

      return dateB - dateA; // Newest first (descending order)
    });

  // Pagination
  const totalPages = Math.ceil(filteredMails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMails = filteredMails.slice(startIndex, endIndex);

  // Debug logging
  console.log("🔍 Pagination state:", {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    filteredMailsLength: filteredMails.length,
    currentMailsLength: currentMails.length,
    currentMailsIds: currentMails.map((m) => m.id).slice(0, 3), // First 3 IDs
  });

  const handlePageChange = (page) => {
    console.log("📄 Page change:", { from: currentPage, to: page });
    console.log("📊 Pagination debug:", {
      totalItems: filteredMails.length,
      itemsPerPage,
      totalPages,
      newStartIndex: (page - 1) * itemsPerPage,
      newEndIndex: (page - 1) * itemsPerPage + itemsPerPage,
    });
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi số items
  };

  // Helper function to get filtered count for buttons
  const getFilteredCount = (replyFilter = null) => {
    return validMails.filter((mail) => {
      const matchesSearch =
        (mail.Subject || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mail.From || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDate =
        dateFilterStart || dateFilterEnd
          ? filterMailsByDateRange([mail], dateFilterStart, dateFilterEnd)
              .length > 0
          : true;
      const matchesReply =
        replyFilter === null
          ? true
          : replyFilter === "replied"
          ? mail.isReplied
          : !mail.isReplied;
      return matchesSearch && matchesDate && matchesReply;
    }).length;
  };

  // Handle date filter changes for new DateFilter
  const handleDateChange = (dateRange) => {
    console.log("ValidMails - Date range changed:", dateRange); // Debug log
    if (dateRange) {
      setDateFilterStart(dateRange.startDate);
      setDateFilterEnd(dateRange.endDate);
    } else {
      setDateFilterStart(null);
      setDateFilterEnd(null);
    }
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "To":
        return "success";
      case "CC":
        return "warning";
      case "BCC":
        return "info";
      default:
        return "secondary";
    }
  };

  return (
    <>
      <CompactHeader
        title="VALID MAILS"
        subtitle="Manage mails within their deadline"
        icon="ni ni-check-bold"
      />
      {/* Page content */}
      <Container className="mt--5 mail-page mail-system compact-layout" fluid>
        {/* Alert for expired mails moved */}
        {expiredMovedAlert && (
          <Row className="mb-3">
            <Col>
              <Alert
                color={expiredMovedAlert.type}
                className="alert-dismissible fade show"
              >
                <span className="alert-inner--icon">
                  <i className="ni ni-notification-70" />
                </span>
                <span className="alert-inner--text">
                  <strong>Thông báo:</strong> {expiredMovedAlert.message}
                </span>
                <button
                  type="button"
                  className="close"
                  onClick={() => setExpiredMovedAlert(null)}
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </Alert>
            </Col>
          </Row>
        )}

        {/* Date Filter */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody>
                <div className="d-flex justify-content-between align-items-center p-3">
                  <div className="flex-grow-1">
                    <DateFilterNew onDateChange={handleDateChange} />
                  </div>
                  <div className="ml-4">
                    <CompactClock />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Table */}
        <Row>
          <div className="col">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-check-bold text-success mr-2" />
                      Valid Mails ({filteredMails.length})
                    </h3>
                  </div>
                  <div className="col-auto">
                    {/* <Button
                      color="info"
                      size="sm"
                      onClick={refreshGroups}
                      title="Refresh group data"
                    >
                      <i className="fas fa-sync-alt mr-1" />
                      Refresh Groups
                    </Button>
                    <Button
                      color="primary"
                      size="sm"
                      onClick={handleRefreshPics}
                      title="Refresh PIC data"
                      className="ml-2"
                    >
                      <i className="fas fa-user-sync mr-1" />
                      Refresh PICs
                    </Button>
                    <Button
                      color="warning"
                      size="sm"
                      onClick={handleMoveSelectedToExpired}
                      className="ml-2"
                      disabled={selectedMails.length === 0}
                      title={`Move ${selectedMails.length} selected mail(s) to Expired section`}
                    >
                      <i className="fas fa-arrow-down mr-1" />
                      Move Selected ({selectedMails.length})
                    </Button> */}
                    <Button
                      color="info"
                      size="sm"
                      onClick={handleMoveSelectedToReview}
                      className="ml-2"
                      disabled={selectedMails.length === 0}
                      title={`Move ${selectedMails.length} selected mail(s) to Review section`}
                    >
                      <i className="fas fa-share-square mr-1" />
                      Move to Review ({selectedMails.length})
                    </Button>
                  </div>
                  <div className="col-lg-6 col-5">
                    <InputGroup>
                      <Input
                        placeholder="Search by subject or sender..."
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <InputGroupAddon addonType="append">
                        <InputGroupText>
                          <i className="fas fa-search" />
                        </InputGroupText>
                      </InputGroupAddon>
                    </InputGroup>
                  </div>
                </Row>
                <Row className="align-items-center mt-3">
                  <div className="col">
                    <ButtonGroup>
                      <Button
                        color={
                          replyStatusFilter === "all" ? "primary" : "secondary"
                        }
                        onClick={() => setReplyStatusFilter("all")}
                        size="sm"
                      >
                        All ({getFilteredCount()})
                      </Button>
                      <Button
                        color={
                          replyStatusFilter === "not_replied"
                            ? "warning"
                            : "secondary"
                        }
                        onClick={() => setReplyStatusFilter("not_replied")}
                        size="sm"
                      >
                        Non-Reply ({getFilteredCount("not_replied")})
                      </Button>
                      <Button
                        color={
                          replyStatusFilter === "replied"
                            ? "success"
                            : "secondary"
                        }
                        onClick={() => setReplyStatusFilter("replied")}
                        size="sm"
                      >
                        Replied ({getFilteredCount("replied")})
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className="col-auto">
                    <FormGroup className="mb-0">
                      <Label for="itemsPerPage" className="form-control-label">
                        Hiển thị:
                      </Label>
                      <Input
                        type="select"
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) =>
                          handleItemsPerPageChange(parseInt(e.target.value))
                        }
                        className="form-control-sm"
                        style={{
                          width: "auto",
                          display: "inline-block",
                          marginLeft: "10px",
                        }}
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                      </Input>
                      <span className="ml-2 text-muted">items/page</span>
                    </FormGroup>
                  </div>
                  <div className="col-auto">
                    <small className="text-muted">
                      Showing {startIndex + 1}-
                      {Math.min(endIndex, filteredMails.length)} of{" "}
                      {filteredMails.length} items
                    </small>
                  </div>
                </Row>
              </CardHeader>
              <MailTable
                key={`${currentPage}-${itemsPerPage}-${filteredMails.length}`}
                mails={currentMails}
                getTypeColor={getTypeColor}
                getGroupInfo={getGroupInfo}
                formatDate={formatDate}
                getHoursRemaining={getHoursRemaining}
                truncateText={truncateText}
                handleViewDetails={handleViewDetails}
                handleAssignMail={handleAssignMail}
                handleMoveToReview={handleMoveToReview}
                mailType="valid"
                // Checkbox functionality
                showCheckboxes={true}
                selectedMails={selectedMails}
                onSelectMail={handleSelectMail}
                onSelectAll={handleSelectAll}
              />
              <CardFooter className="py-4">
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredMails.length}
                  startIndex={startIndex}
                  endIndex={endIndex}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                  showItemsPerPage={false}
                />
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>

      {/* Mail Details Modal */}
      <MailDetailsModal
        isOpen={modalOpen}
        toggle={toggleModal}
        selectedMail={selectedMail}
        formatDate={formatDate}
        getTypeColor={getTypeColor}
        getHoursRemaining={getHoursRemaining}
        getGroupInfo={getGroupInfo}
        truncateText={truncateText}
      />

      {/* Assign Modal */}
      <AssignModal
        isOpen={assignModalOpen}
        toggle={() => setAssignModalOpen(!assignModalOpen)}
        mailData={mailToAssign}
        onAssignSuccess={handleAssignSuccess}
      />
    </>
  );
};

export default ValidMails;
