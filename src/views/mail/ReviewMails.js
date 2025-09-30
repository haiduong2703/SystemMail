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
import React, { useState } from "react";
// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Container,
  Row,
  Col,
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  Label,
  Table,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
// core components
import DateFilterNew from "components/DateFilter/DateFilterNew.js";
import { formatDate, filterMailsByDateRange } from "utils/mailUtils.js";
import { useReviewMails } from "contexts/MailContext.js";
import { useMarkMailRead } from "hooks/useMarkMailRead.js";
import MailListBadge from "components/MailListBadge/MailListBadge.js";
import CompactHeader from "components/Headers/CompactHeader.js";
import PaginationControls from "components/PaginationControls/PaginationControls.js";
import MailDetailsModal from "components/MailDetailsModal/MailDetailsModal.js";
import MailTable from "components/MailTable/MailTable.js";
import { useMailContext } from "contexts/MailContext.js";
import { useGroupContext } from "contexts/GroupContext.js";
import AssignModal from "components/AssignModal.js";
import CompactClock from "components/RealtimeClock/CompactClock.js";
import { API_BASE_URL } from "constants/api.js";
import { isMailReplied, getReviewMailStatus } from "utils/replyStatusUtils";

const ReviewMails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilterStart, setDateFilterStart] = useState(null);
  const [dateFilterEnd, setDateFilterEnd] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [replyStatusFilter, setReplyStatusFilter] = useState("all");
  const [reviewStatusFilter, setReviewStatusFilter] = useState("all"); // all, under_review, processed
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMail, setSelectedMail] = useState(null);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [mailToAssign, setMailToAssign] = useState(null);
  const [selectedMails, setSelectedMails] = useState([]); // Selected mails for bulk actions
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [mailToChangeStatus, setMailToChangeStatus] = useState(null);

  const reviewMails = useReviewMails();
  const {
    mails,
    formatDate: useMailContextFormatDate,
    handleSelectMail: useMailContextSelectMail,
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

  // Handle checkbox selection
  const handleSelectMail = (mailId, isSelected) => {
    console.log("☑️ ReviewMails handleSelectMail called:", {
      mailId,
      isSelected,
    });

    if (isSelected) {
      setSelectedMails((prev) => {
        const newSelection = [...prev, mailId];
        console.log("✅ Added to selection:", newSelection);
        return newSelection;
      });
    } else {
      setSelectedMails((prev) => {
        const newSelection = prev.filter((id) => id !== mailId);
        console.log("❌ Removed from selection:", newSelection);
        return newSelection;
      });
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

  const handleAssignSuccess = (updatedMail) => {
    console.log("Mail assigned successfully:", updatedMail);
    
    // Refresh mail data to show updated assignment
    if (refreshMails) {
      refreshMails();
    }
  };

  // Handle move mail back to original location
  const handleMoveBack = async (mail) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/move-back-from-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mailId: mail.id || `${mail.Subject}-${mail.From}`,
            mailData: mail,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(`Mail "${mail.Subject}" moved back to original location`);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      } else {
        throw new Error("Failed to move mail back");
      }
    } catch (error) {
      console.error("Error moving mail back:", error);
    }
  };

  // Handle move selected mails back to original location
  const handleMoveSelectedReturn = async () => {
    console.log("🔄 handleMoveSelectedReturn called");
    console.log("📧 Selected mails:", selectedMails);
    console.log("📊 Selected count:", selectedMails.length);

    if (selectedMails.length === 0) {
      console.log("❌ No mails selected");
      return;
    }

    try {
      console.log("🚀 Starting to move selected mails back...");

      // Move each selected mail back to original location
      for (const mailId of selectedMails) {
        console.log(`🔍 Looking for mail with ID: ${mailId}`);

        // Try to find mail in filteredMails first, then in all reviewMails
        let mail = filteredMails.find(
          (m) => (m.id || `${m.Subject}-${m.From}`) === mailId
        );

        if (!mail) {
          console.log(
            `📋 Mail not found in filtered mails, searching in all review mails...`
          );
          mail = reviewMails.find(
            (m) => (m.id || `${m.Subject}-${m.From}`) === mailId
          );
        }

        if (mail) {
          console.log(`📧 Found mail: ${mail.Subject}`);
          console.log(`📂 Original category: ${mail.originalCategory}`);
          console.log(`📊 Original status: ${mail.originalStatus}`);
          console.log("📤 Moving back to original location...");

          // Call API to move mail back
          const response = await fetch(
            `${API_BASE_URL}/api/move-back-from-review`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                mailId: mail.id,
                mailData: mail,
              }),
            }
          );

          if (response.ok) {
            const result = await response.json();
            console.log(`✅ Mail "${mail.Subject}" moved back successfully`);
          } else {
            console.error(`❌ Failed to move mail "${mail.Subject}" back`);
          }
        } else {
          console.log(`❌ Mail not found for ID: ${mailId}`);
        }
      }

      // Clear selection
      setSelectedMails([]);

      // Refresh mail data
      if (refreshMails) {
        refreshMails();
      }

      console.log(
        `✅ Successfully moved ${selectedMails.length} mail(s) back to original location`
      );
    } catch (error) {
      console.error("❌ Error moving selected mails back:", error);
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return "";
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  // Calculate time since Date Sent for Review Mails
  const getTimeSinceSent = (dateArray) => {
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
      return "N/A";
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
        return "N/A";
      }

      // Calculate time difference in hours
      const hoursDifference = Math.floor(
        (currentDate - mailDate) / (1000 * 60 * 60)
      );

      if (hoursDifference < 24) {
        // Less than 24 hours - show hours
        if (hoursDifference <= 0) {
          return "Just now";
        } else if (hoursDifference === 1) {
          return "1 hour ago";
        } else {
          return `${hoursDifference} hours ago`;
        }
      } else {
        // 24 hours or more - show days
        const daysDifference = Math.floor(hoursDifference / 24);
        if (daysDifference === 1) {
          return "1 day ago";
        } else {
          return `${daysDifference} days ago`;
        }
      }
    } catch (error) {
      console.error("Error calculating time since sent:", error);
      return "N/A";
    }
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

  // Filter and sort mails based on search term and date range
  const filteredMails = reviewMails
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
      if (replyStatusFilter === "replied") matchesReplyStatus = isMailReplied(mail);
      if (replyStatusFilter === "not_replied")
        matchesReplyStatus = !isMailReplied(mail);

      // Review status filter
      let matchesReviewStatus = true;
      if (reviewStatusFilter === "under_review") {
        // Mails that are under review (in pending folder)
        matchesReviewStatus = getReviewMailStatus(mail) === "pending";
      } else if (reviewStatusFilter === "processed") {
        // Mails that are processed (in processed folder)
        matchesReviewStatus = getReviewMailStatus(mail) === "processed";
      }

      return (
        matchesSearch &&
        matchesDate &&
        matchesReplyStatus &&
        matchesReviewStatus
      );
    })
    .sort((a, b) => {
      // Sort by dateMoved (when moved to review) - newest first
      const getDateMoved = (mail) => {
        if (mail.dateMoved && Array.isArray(mail.dateMoved)) {
          const [date, time] = mail.dateMoved;
          return new Date(`${date}T${time || "00:00"}`);
        }
        // Fallback to regular Date if dateMoved not available
        if (mail.Date && Array.isArray(mail.Date)) {
          const [date, time] = mail.Date;
          return new Date(`${date}T${time || "00:00"}`);
        }
        return new Date(0); // Very old date as fallback
      };

      const dateA = getDateMoved(a);
      const dateB = getDateMoved(b);

      return dateB - dateA; // Newest first (descending order)
    });

  // Pagination
  const totalPages = Math.ceil(filteredMails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMails = filteredMails.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle date filter changes for new DateFilter
  const handleDateChange = (dateRange) => {
    console.log("ReviewMails - Date range changed:", dateRange); // Debug log
    if (dateRange) {
      setDateFilterStart(dateRange.startDate);
      setDateFilterEnd(dateRange.endDate);
    } else {
      setDateFilterStart(null);
      setDateFilterEnd(null);
    }
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  };

  const handleReplyStatusChange = (status) => {
    setReplyStatusFilter(status);
    setCurrentPage(1);
  };

  const handleReviewStatusChange = (status) => {
    setReviewStatusFilter(status);
    setCurrentPage(1);
  };

  const handleStatusClick = (mail) => {
    setMailToChangeStatus(mail);
    setStatusModalOpen(true);
  };

  const handleStatusChange = async (newStatus) => {
    if (!mailToChangeStatus) return;

    try {
      console.log(`🔄 Changing ReviewMail status to: ${newStatus}`);
      console.log(`📧 Mail ID: ${mailToChangeStatus.id}`);
      console.log(`🌐 API URL: ${API_BASE_URL}/api/review-mails/${mailToChangeStatus.id}/status`);
      
      // Call API to update ReviewMail status - API expects status (pending/processed)
      const response = await fetch(
        `${API_BASE_URL}/api/review-mails/${mailToChangeStatus.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      console.log(`📡 Response status: ${response.status}`);
      console.log(`📡 Response ok: ${response.ok}`);

      if (response.ok) {
        const result = await response.json();
        console.log(`✅ Status updated successfully:`, result);
        console.log(`📁 File moved to: ReviewMail/${newStatus}/`);
        
        // Update the mail object locally to reflect new folder path
        const updatedMail = {
          ...mailToChangeStatus,
          filePath: result.newFilePath,
          isReplied: result.isReplied
        };
        
        // Refresh mail data
        if (refreshMails) {
          console.log(`🔄 Calling refreshMails...`);
          refreshMails();
        }
        
        // Wait a bit for data to refresh before closing modal
        setTimeout(() => {
          setStatusModalOpen(false);
          setMailToChangeStatus(null);
        }, 500);
      } else {
        const errorData = await response.json();
        console.error("❌ Failed to update mail status:", errorData);
        alert(`Failed to update status: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("❌ Error updating mail status:", error);
      alert(`Error updating status: ${error.message}`);
    }
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
        title="REVIEW MAILS"
        subtitle="Review and manage mails that need attention"
        icon="ni ni-archive-2"
      />
      {/* Page content */}
      <Container className="mt--5 mail-page mail-system compact-layout" fluid>
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
                      <i className="ni ni-archive-2 text-primary mr-2" />
                      Review Mails ({filteredMails.length})
                    </h3>
                  </div>
                  <div className="col-auto">
                    {/* <Button
                      color="info"
                      size="sm"
                      onClick={refreshGroups}
                      title="Refresh group data"
                      className="mr-2"
                    >
                      <i className="fas fa-sync-alt mr-1" />
                      Refresh Groups
                    </Button> */}
                    <Button
                      color="warning"
                      size="sm"
                      onClick={handleMoveSelectedReturn}
                      disabled={selectedMails.length === 0}
                      title={`Move ${selectedMails.length} selected mail(s) back to original location`}
                    >
                      <i className="fas fa-undo mr-1" />
                      Move Return ({selectedMails.length})
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
                    <div className="btn-group" role="group">
                      <Button
                        color={
                          reviewStatusFilter === "all" ? "primary" : "secondary"
                        }
                        onClick={() => handleReviewStatusChange("all")}
                        size="sm"
                        className="mr-1"
                      >
                        All ({reviewMails.length})
                      </Button>
                      <Button
                        color={
                          reviewStatusFilter === "under_review"
                            ? "warning"
                            : "secondary"
                        }
                        onClick={() => handleReviewStatusChange("under_review")}
                        size="sm"
                        className="mr-1"
                      >
                        Under Review (
                        {
                          reviewMails.filter((mail) => {
                            return getReviewMailStatus(mail) === "pending"; // folder-based check
                          }).length
                        }
                        )
                      </Button>
                      <Button
                        color={
                          reviewStatusFilter === "processed"
                            ? "success"
                            : "secondary"
                        }
                        onClick={() => handleReviewStatusChange("processed")}
                        size="sm"
                      >
                        Processed (
                        {
                          reviewMails.filter((mail) => {
                            return getReviewMailStatus(mail) === "processed"; // folder-based check
                          }).length
                        }
                        )
                      </Button>
                    </div>
                  </div>
                </Row>
                <Row className="align-items-center mt-3">
                  <div className="col-auto">
                    <FormGroup className="mb-0">
                      <Label for="itemsPerPage" className="form-control-label">
                        Show:
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
                getTimeSinceSent={getTimeSinceSent}
                truncateText={truncateText}
                handleViewDetails={handleViewDetails}
                handleAssignMail={handleAssignMail}
                handleMoveBack={handleMoveBack}
                onStatusClick={handleStatusClick}
                mailType="review"
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

      {/* Status Change Modal */}
      <Modal isOpen={statusModalOpen} toggle={() => setStatusModalOpen(false)}>
        <ModalHeader toggle={() => setStatusModalOpen(false)}>
          Change Review Status
        </ModalHeader>
        <ModalBody>
          {mailToChangeStatus && (
            <div>
              <p>
                <strong>Subject:</strong> {mailToChangeStatus.Subject}
              </p>
              <p>
                <strong>From:</strong> {mailToChangeStatus.From}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                <Badge color={getReviewMailStatus(mailToChangeStatus) === "processed" ? "success" : "warning"}>
                  {getReviewMailStatus(mailToChangeStatus) === "processed" ? "Processed" : "Under Review"}
                </Badge>
              </p>
              <p>
                <strong>Current Folder:</strong> ReviewMail/{getReviewMailStatus(mailToChangeStatus)}
              </p>
              <hr />
              <p>Select new status:</p>
              <div className="d-flex gap-2">
                <Button
                  color="warning"
                  onClick={() => handleStatusChange("pending")}
                  disabled={getReviewMailStatus(mailToChangeStatus) === "pending"}
                  className="mr-2"
                >
                  <i className="fas fa-clock mr-1" />
                  Under Review (pending folder)
                </Button>
                <Button
                  color="success"
                  onClick={() => handleStatusChange("processed")}
                  disabled={getReviewMailStatus(mailToChangeStatus) === "processed"}
                >
                  <i className="fas fa-check mr-1" />
                  Processed (processed folder)
                </Button>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setStatusModalOpen(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default ReviewMails;
