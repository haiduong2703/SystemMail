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
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Media,
  Table,
  Container,
  Row,
  Col,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  ButtonGroup,
  Button,
  FormGroup,
  Label,
  Modal, // Added Modal
  ModalHeader, // Added ModalHeader
  ModalBody, // Added ModalBody
  ModalFooter, // Added ModalFooter
} from "reactstrap";
// core components
import DateFilterNew from "components/DateFilter/DateFilterNew.js";
import { formatDate, filterMailsByDateRange } from "utils/mailUtils.js";
import { useMailContext } from "contexts/MailContext.js";
import { useMarkMailRead } from "hooks/useMarkMailRead.js";
import { useGroupContext } from "contexts/GroupContext.js";
import MailListBadge from "components/MailListBadge/MailListBadge.js";
import CompactHeader from "components/Headers/CompactHeader.js";
import AssignModal from "components/AssignModal.js";
import PaginationControls from "components/PaginationControls/PaginationControls.js";
import MailDetailsModal from "components/MailDetailsModal/MailDetailsModal.js";
import MailTable from "components/MailTable/MailTable.js";
import CompactClock from "components/RealtimeClock/CompactClock.js";

const AllMails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all"); // all, valid, expired, review
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilterStart, setDateFilterStart] = useState(null);
  const [dateFilterEnd, setDateFilterEnd] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [replyStatusFilter, setReplyStatusFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false); // State for Modal visibility
  const [selectedMail, setSelectedMail] = useState(null); // State for selected mail details
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [mailToAssign, setMailToAssign] = useState(null);
  const [selectedMails, setSelectedMails] = useState([]); // Selected mails for bulk actions

  const { mails, loading, error, selectedMail: contextSelectedMail, handleSelectMail: useMailContextSelectMail, formatDate, refreshMails } = useMailContext();
  const { markMailAsRead } = useMarkMailRead();
  const { getGroupInfo, refreshGroups } = useGroupContext();

  // Handle assign mail
  const handleAssignMail = (mail) => {
    setMailToAssign(mail);
    setAssignModalOpen(true);
  };

  // Handle checkbox selection
  const handleSelectMail = (mailId, isSelected) => {
    if (isSelected) {
      setSelectedMails(prev => [...prev, mailId]);
    } else {
      setSelectedMails(prev => prev.filter(id => id !== mailId));
    }
  };

  // Handle select all checkbox
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allMailIds = currentMails.map(mail => mail.id || `${mail.Subject}-${mail.From}`);
      setSelectedMails(allMailIds);
    } else {
      setSelectedMails([]);
    }
  };

  const handleAssignSuccess = (updatedMail) => {
    console.log('Mail assigned successfully:', updatedMail);
  };

  // Handle move mail to review
  const handleMoveToReview = async (mail) => {
    try {
      const response = await fetch('http://localhost:3001/api/move-to-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mailId: mail.id || `${mail.Subject}-${mail.From}`,
          mailData: mail
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log(`Mail "${mail.Subject}" moved to Review section`);

        // Refresh mail data
        if (refreshMails) {
          refreshMails();
        }
      } else {
        throw new Error('Failed to move mail to review');
      }
    } catch (error) {
      console.error('Error moving mail to review:', error);
    }
  };

  // Handle move selected mails to review
  const handleMoveSelectedToReview = async () => {
    if (selectedMails.length === 0) {
      console.log('No mails selected');
      return;
    }

    try {
      // Move each selected mail to review
      for (const mailId of selectedMails) {
        const mail = filteredMails.find(m => (m.id || `${m.Subject}-${m.From}`) === mailId);
        if (mail && mail.category !== "ReviewMail") { // Only move non-review mails
          await handleMoveToReview(mail);
        }
      }

      // Clear selection
      setSelectedMails([]);

      console.log(`Successfully moved ${selectedMails.length} mail(s) to Review section`);
    } catch (error) {
      console.error('Error moving selected mails to review:', error);
    }
  };

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (!text) return '';
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

  // Filter mails based on search term, status, and date range
  const filteredMails = mails.filter(mail => {
    const matchesSearch = (mail.Subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mail.From || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    let matchesStatus = true;
    if (filterStatus === "valid") matchesStatus = !mail.isExpired && mail.category !== "ReviewMail";
    if (filterStatus === "expired") matchesStatus = mail.isExpired;
    if (filterStatus === "review") matchesStatus = mail.category === "ReviewMail";

    // Date filter
    const matchesDate = dateFilterStart || dateFilterEnd
      ? filterMailsByDateRange([mail], dateFilterStart, dateFilterEnd).length > 0
      : true;

    // Reply status filter
    let matchesReplyStatus = true;
    if (replyStatusFilter === "replied") matchesReplyStatus = mail.isReplied;
    if (replyStatusFilter === "not_replied") matchesReplyStatus = !mail.isReplied;

    // Debug log for first mail to see filtering logic
    if (mail === mails[0]) {
      console.log("Filtering first mail:", {
        mail: mail.Subject,
        dateFilterStart,
        dateFilterEnd,
        matchesDate,
        replyStatusFilter,
        matchesReplyStatus,
        isReplied: mail.isReplied,
        mailDate: mail.Date
      });
    }

    return matchesSearch && matchesStatus && matchesDate && matchesReplyStatus;
  }).sort((a, b) => {
    // Sort by appropriate date field based on mail type
    const getRelevantDate = (mail) => {
      // For review mails, use dateMoved if available
      if (mail.category === "ReviewMail" && mail.dateMoved && Array.isArray(mail.dateMoved)) {
        const [date, time] = mail.dateMoved;
        return new Date(`${date}T${time || '00:00'}`);
      }

      // For other mails, use Date field
      if (mail.Date && Array.isArray(mail.Date)) {
        const [date, time] = mail.Date;
        return new Date(`${date}T${time || '00:00'}`);
      }

      return new Date(0); // Very old date as fallback
    };

    const dateA = getRelevantDate(a);
    const dateB = getRelevantDate(b);

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
    setCurrentPage(1); // Reset về trang đầu khi thay đổi số items
  };

  // Handle date filter changes for new DateFilter
  const handleDateChange = (dateRange) => {
    console.log("AllMails - Date range changed:", dateRange); // Debug log
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
      case "To": return "success";
      case "CC": return "warning";
      case "BCC": return "info";
      default: return "secondary";
    }
  };

  const getStatusBadge = (isExpired) => {
    return isExpired ? (
      <Badge color="danger" pill>Hết hạn</Badge>
    ) : (
      <Badge color="success" pill>Đúng hạn</Badge>
    );
  };

  return (
    <>
      <CompactHeader
        title="ALL MAILS"
        subtitle="View and manage all mail messages"
        icon="ni ni-email-83"
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
                      <i className="ni ni-email-83 text-info mr-2" />
                      All Mails ({filteredMails.length})
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
                      onClick={handleMoveSelectedToReview}
                      disabled={selectedMails.length === 0}
                      title={`Move ${selectedMails.length} selected mail(s) to Review section`}
                    >
                      <i className="fas fa-arrow-down mr-1" />
                      Move Selected ({selectedMails.length})
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
                <Row className="mt-3">
                  <div className="col">
                    <ButtonGroup>
                      <Button
                        color={filterStatus === "all" ? "primary" : "secondary"}
                        onClick={() => setFilterStatus("all")}
                        size="sm"
                      >
                        All
                      </Button>
                      <Button
                        color={filterStatus === "valid" ? "success" : "secondary"}
                        onClick={() => setFilterStatus("valid")}
                        size="sm"
                      >
                        Valid
                      </Button>
                      <Button
                        color={filterStatus === "expired" ? "danger" : "secondary"}
                        onClick={() => setFilterStatus("expired")}
                        size="sm"
                      >
                        Expired
                      </Button>
                      <Button
                        color={filterStatus === "review" ? "info" : "secondary"}
                        onClick={() => setFilterStatus("review")}
                        size="sm"
                      >
                        Review
                      </Button>
                    </ButtonGroup>
                  </div>
                  <div className="col-auto">
                    <FormGroup className="mb-0">
                      <Label for="itemsPerPage" className="form-control-label">
                        Show:
                      </Label>
                      <Input
                        type="select"
                        id="itemsPerPage"
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))}
                        className="form-control-sm"
                        style={{ width: 'auto', display: 'inline-block', marginLeft: '10px' }}
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
                      Showing {startIndex + 1}-{Math.min(endIndex, filteredMails.length)} of {filteredMails.length} items
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
                handleMoveToReview={handleMoveToReview}
                mailType="all"
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
                  showItemsPerPage={false} // Hide items per page selector since it's already in header
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
        getStatusBadge={getStatusBadge}
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

export default AllMails;
