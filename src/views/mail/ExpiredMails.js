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
  FormGroup,
  Label,
  Modal, // Added Modal
  ModalHeader, // Added ModalHeader
  ModalBody, // Added ModalBody
  ModalFooter, // Added ModalFooter
  Button, // Added Button for Modal
  ButtonGroup, // Added ButtonGroup
} from "reactstrap";
// core components
import DateFilterNew from "components/DateFilter/DateFilterNew.js";
import { formatDate, filterMailsByDateRange } from "utils/mailUtils.js";
import { useExpiredMails, useExpiredUnrepliedMails, useExpiredRepliedMails } from "contexts/MailContext.js";
import { useMarkMailRead } from "hooks/useMarkMailRead.js";
import CompactHeader from "components/Headers/CompactHeader.js";
import { useMailContext } from 'contexts/MailContext.js';
import { useGroupContext } from 'contexts/GroupContext.js';
import AssignModal from "components/AssignModal.js";
import PaginationControls from "components/PaginationControls/PaginationControls.js";
import MailDetailsModal from "components/MailDetailsModal/MailDetailsModal.js";
import MailTable from "components/MailTable/MailTable.js";

const ExpiredMails = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilterStart, setDateFilterStart] = useState(null);
  const [dateFilterEnd, setDateFilterEnd] = useState(null);
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [replyStatusFilter, setReplyStatusFilter] = useState("all");
  const [expiredTypeFilter, setExpiredTypeFilter] = useState("all"); // all, unreplied, replied
  const [modalOpen, setModalOpen] = useState(false); // State for Modal visibility
  const [selectedMail, setSelectedMail] = useState(null); // State for selected mail details
  const [assignModalOpen, setAssignModalOpen] = useState(false); // State for Assign Modal
  const [mailToAssign, setMailToAssign] = useState(null); // Mail to be assigned

  const allExpiredMails = useExpiredMails();
  const expiredUnrepliedMails = useExpiredUnrepliedMails();
  const expiredRepliedMails = useExpiredRepliedMails();
  const { mails, formatDate: useMailFormatDate, handleSelectMail, selectedMail: useSelectedMail, refreshMails } = useMailContext();
  const { markMailAsRead } = useMarkMailRead();
  const { getGroupInfo, refreshGroups } = useGroupContext();

  // Handle assign mail
  const handleAssignMail = (mail) => {
    setMailToAssign(mail);
    setAssignModalOpen(true);
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
        // Show success message (you can add alert state if needed)
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

  // Chọn dữ liệu dựa trên filter
  const getExpiredMails = () => {
    switch (expiredTypeFilter) {
      case "unreplied":
        return expiredUnrepliedMails;
      case "replied":
        return expiredRepliedMails;
      default:
        return allExpiredMails;
    }
  };

  const expiredMails = getExpiredMails();

  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
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

  // Filter mails based on search term and date range
  const filteredMails = expiredMails.filter(mail => {
    // Search filter
    const matchesSearch = (mail.Subject || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (mail.From || '').toLowerCase().includes(searchTerm.toLowerCase());

    // Date filter
    const matchesDate = dateFilterStart || dateFilterEnd
      ? filterMailsByDateRange([mail], dateFilterStart, dateFilterEnd).length > 0
      : true;

    // Reply status filter
    let matchesReplyStatus = true;
    if (replyStatusFilter === "replied") matchesReplyStatus = mail.isReplied;
    if (replyStatusFilter === "not_replied") matchesReplyStatus = !mail.isReplied;

    return matchesSearch && matchesDate && matchesReplyStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredMails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMails = filteredMails.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    console.log('📄 ExpiredMails Page change:', { from: currentPage, to: page });
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset về trang đầu khi thay đổi số items
  };

  // Handle date filter changes for new DateFilter
  const handleDateChange = (dateRange) => {
    console.log("ExpiredMails - Date range changed:", dateRange); // Debug log
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
    setCurrentPage(1); // Reset về trang đầu khi thay đổi filter
  };

  const handleExpiredTypeChange = (type) => {
    setExpiredTypeFilter(type);
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

  const getDaysExpired = (dateArray) => {
    // Check if dateArray exists and is an array
    if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
      return 0;
    }

    try {
      const [date] = dateArray;
      const mailDate = new Date(date);
      const currentDate = new Date();

      // Check if date is valid
      if (isNaN(mailDate.getTime())) {
        return 0;
      }

      const daysDiff = Math.floor((currentDate - mailDate) / (1000 * 60 * 60 * 24));
      return Math.max(0, daysDiff);
    } catch (error) {
      console.error('Error calculating days expired:', error);
      return 0;
    }
  };

  return (
    <>
      <CompactHeader
        title="EXPIRED MAILS"
        subtitle="Manage mails that have exceeded their deadline"
        icon="ni ni-time-alarm"
      />
      {/* Page content */}
      <Container className="mt--5 mail-page mail-system compact-layout" fluid>


        {/* Date Filter */}
        <Row className="mb-4">
          <Col>
            <Card className="shadow">
              <CardBody>
                <div className=" p-3 ">
                  <DateFilterNew onDateChange={handleDateChange} />
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
                      <i className="ni ni-fat-remove text-danger mr-2" />
                      Expired Mails ({filteredMails.length})
                      {expiredTypeFilter === "unreplied" && <Badge color="warning" className="ml-2">Non-reply</Badge>}
                      {expiredTypeFilter === "replied" && <Badge color="success" className="ml-2">Replied</Badge>}
                    </h3>
                  </div>
                  <div className="col-auto">
                    <Button
                      color="info"
                      size="sm"
                      onClick={refreshGroups}
                      title="Refresh group data"
                    >
                      <i className="fas fa-sync-alt mr-1" />
                      Refresh Groups
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
                        color={expiredTypeFilter === "all" ? "primary" : "secondary"}
                        onClick={() => handleExpiredTypeChange("all")}
                        size="sm"
                      >
                        All ({allExpiredMails.length})
                      </Button>
                      <Button
                        color={expiredTypeFilter === "unreplied" ? "warning" : "secondary"}
                        onClick={() => handleExpiredTypeChange("unreplied")}
                        size="sm"
                      >
                        Non-reply ({expiredUnrepliedMails.length})
                      </Button>
                      <Button
                        color={expiredTypeFilter === "replied" ? "success" : "secondary"}
                        onClick={() => handleExpiredTypeChange("replied")}
                        size="sm"
                      >
                        Replied ({expiredRepliedMails.length})
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
                getDaysExpired={getDaysExpired}
                truncateText={truncateText}
                handleViewDetails={handleViewDetails}
                handleAssignMail={handleAssignMail}
                handleMoveToReview={handleMoveToReview}
                mailType="expired"
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
        getDaysExpired={getDaysExpired}
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

export default ExpiredMails;
