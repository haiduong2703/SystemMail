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
  };

  // Handle move mail back to original location
  const handleMoveBack = async (mail) => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/move-back-from-review",
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
            "http://localhost:3001/api/move-back-from-review",
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
      if (replyStatusFilter === "replied") matchesReplyStatus = mail.isReplied;
      if (replyStatusFilter === "not_replied")
        matchesReplyStatus = !mail.isReplied;

      // Review status filter
      let matchesReviewStatus = true;
      if (reviewStatusFilter === "under_review") {
        // Mails that are under review (not replied yet)
        matchesReviewStatus = !mail.isReplied;
      } else if (reviewStatusFilter === "processed") {
        // Mails that are processed (replied)
        matchesReviewStatus = mail.isReplied;
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
      // Call API to update mail status
      const response = await fetch(
        `http://localhost:3002/api/mails/${mailToChangeStatus.id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isReplied: newStatus === "processed",
          }),
        }
      );

      if (response.ok) {
        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
        setStatusModalOpen(false);
        setMailToChangeStatus(null);
      } else {
        console.error("Failed to update mail status");
      }
    } catch (error) {
      console.error("Error updating mail status:", error);
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
                    <Button
                      color="info"
                      size="sm"
                      onClick={refreshGroups}
                      title="Refresh group data"
                      className="mr-2"
                    >
                      <i className="fas fa-sync-alt mr-1" />
                      Refresh Groups
                    </Button>
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
                            return !mail.isReplied;
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
                            return mail.isReplied;
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
          Change Status
        </ModalHeader>
        <ModalBody>
          {mailToChangeStatus && (
            <div>
              <p>
                <strong>Subject:</strong> {mailToChangeStatus.Subject}
              </p>
              <p>
                <strong>Current Status:</strong>{" "}
                {mailToChangeStatus.isReplied ? "Processed" : "Under Review"}
              </p>
              <p>Select new status:</p>
              <div className="d-flex gap-2">
                <Button
                  color="warning"
                  onClick={() => handleStatusChange("under_review")}
                  disabled={!mailToChangeStatus.isReplied}
                >
                  Under Review
                </Button>
                <Button
                  color="success"
                  onClick={() => handleStatusChange("processed")}
                  disabled={mailToChangeStatus.isReplied}
                >
                  Processed
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
