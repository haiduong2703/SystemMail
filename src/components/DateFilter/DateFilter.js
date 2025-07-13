import React, { useState, useEffect, useRef } from 'react';
import {
  FormGroup,
  Label,
  Input,
  Row,
  Col,
  Button,
  ButtonGroup,
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  CardHeader
} from 'reactstrap';

const DateFilter = ({
  onDateRangeChange,
  onQuickFilterChange,
  onReplyStatusChange,
  className = ""
}) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeQuickFilter, setActiveQuickFilter] = useState("all");
  const [replyStatusFilter, setReplyStatusFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format current time
  const formatCurrentTime = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  // Quick filter options
  const quickFilters = [
    { key: "all", label: "Tất cả", icon: "ni-bullet-list-67" },
    { key: "today", label: "Hôm nay", icon: "ni-calendar-grid-58" },
    { key: "yesterday", label: "Hôm qua", icon: "ni-time-alarm" },
    { key: "thisWeek", label: "Tuần này", icon: "ni-chart-bar-32" },
    { key: "thisMonth", label: "Tháng này", icon: "ni-chart-pie-35" },
    { key: "last7days", label: "7 ngày qua", icon: "ni-curved-next" },
    { key: "last30days", label: "30 ngày qua", icon: "ni-archive-2" }
  ];

  // Calculate date ranges for quick filters
  const getDateRange = (filterKey) => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

    switch (filterKey) {
      case "today":
        return { start: startOfDay, end: endOfDay };

      case "yesterday":
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const startYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
        const endYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23, 59, 59);
        return { start: startYesterday, end: endYesterday };

      case "thisWeek":
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        return { start: startOfWeek, end: endOfDay };

      case "thisMonth":
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return { start: startOfMonth, end: endOfDay };

      case "last7days":
        const last7Days = new Date(today);
        last7Days.setDate(today.getDate() - 7);
        last7Days.setHours(0, 0, 0, 0);
        return { start: last7Days, end: endOfDay };

      case "last30days":
        const last30Days = new Date(today);
        last30Days.setDate(today.getDate() - 30);
        last30Days.setHours(0, 0, 0, 0);
        return { start: last30Days, end: endOfDay };

      default:
        return null;
    }
  };

  // Handle quick filter selection
  const handleQuickFilter = (filterKey) => {
    setActiveQuickFilter(filterKey);

    if (filterKey === "all") {
      setStartDate("");
      setEndDate("");
      onQuickFilterChange("all");
      onDateRangeChange(null, null);
      console.log("Quick filter applied: all"); // Debug log
    } else {
      const range = getDateRange(filterKey);
      if (range) {
        const startDateStr = range.start.toISOString().split('T')[0];
        const endDateStr = range.end.toISOString().split('T')[0];

        setStartDate(startDateStr);
        setEndDate(endDateStr);
        onQuickFilterChange(filterKey);
        onDateRangeChange(range.start, range.end);
        console.log("Quick filter applied:", filterKey, { start: range.start, end: range.end }); // Debug log
      }
    }
  };

  // Handle custom date range
  const handleCustomDateRange = () => {
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (end) {
        end.setHours(23, 59, 59); // Include the entire end date
      }

      setActiveQuickFilter("custom");
      onQuickFilterChange("custom");
      onDateRangeChange(start, end);

      console.log("Custom date range applied:", { start, end }); // Debug log
    }
  };

  // Handle reply status filter
  const handleReplyStatusChange = (status) => {
    setReplyStatusFilter(status);
    onReplyStatusChange(status);
    console.log("Reply status filter changed:", status); // Debug log
  };

  // Clear filters
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
    setActiveQuickFilter("all");
    setReplyStatusFilter("all");
    onQuickFilterChange("all");
    onDateRangeChange(null, null);
    onReplyStatusChange("all");
  };

  // Get count for active filter
  const getFilterInfo = () => {
    const filters = [];

    // Date filter info
    if (activeQuickFilter !== "all") {
      const filterLabels = {
        today: "hôm nay",
        yesterday: "hôm qua",
        thisWeek: "tuần này",
        thisMonth: "tháng này",
        last7days: "7 ngày qua",
        last30days: "30 ngày qua",
        custom: "tùy chỉnh"
      };
      filters.push(filterLabels[activeQuickFilter] || activeQuickFilter);
    }

    // Reply status filter info
    if (replyStatusFilter !== "all") {
      const statusLabels = {
        replied: "đã trả lời",
        not_replied: "chưa trả lời"
      };
      filters.push(statusLabels[replyStatusFilter]);
    }

    return filters.length > 0 ? filters.join(", ") : null;
  };

  return (
    <div className={`date-filter ${className}`} style={{ marginTop: "100px" }}>
      {/* Quick Filters */}
      <Row className="mb-3">
        <Col>
          <Label className="form-control-label mb-2 d-flex align-items-center justify-content-between">
            <span>
              <i className="ni ni-calendar-grid-58 mr-1"></i>
              Lọc theo thời gian:
            </span>
            <span className="text-primary font-weight-bold ml-2">
              <i className="ni ni-time-alarm mr-1"></i>
              {formatCurrentTime(currentTime)}
            </span>
          </Label>
          <div className="d-flex flex-wrap">
            {quickFilters.map((filter) => (
              <Button
                key={filter.key}
                color={activeQuickFilter === filter.key ? "primary" : "secondary"}
                size="sm"
                className="mr-2 mb-2"
                onClick={() => handleQuickFilter(filter.key)}
              >
                <i className={`ni ${filter.icon} mr-1`}></i>
                {filter.label}
              </Button>
            ))}
          </div>
        </Col>
      </Row>

      {/* Reply Status Filter */}
      <Row className="mb-3">
        <Col>
          <Label className="form-control-label mb-2">
            <i className="ni ni-chat-round mr-1"></i>
            Lọc theo trạng thái trả lời:
          </Label>
          <div className="d-flex flex-wrap">
            <Button
              color={replyStatusFilter === "all" ? "primary" : "secondary"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => handleReplyStatusChange("all")}
            >
              <i className="ni ni-bullet-list-67 mr-1"></i>
              Tất cả
            </Button>
            <Button
              color={replyStatusFilter === "replied" ? "success" : "secondary"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => handleReplyStatusChange("replied")}
            >
              <i className="ni ni-check-bold mr-1"></i>
              Đã trả lời
            </Button>
            <Button
              color={replyStatusFilter === "not_replied" ? "warning" : "secondary"}
              size="sm"
              className="mr-2 mb-2"
              onClick={() => handleReplyStatusChange("not_replied")}
            >
              <i className="ni ni-time-alarm mr-1"></i>
              Chưa trả lời
            </Button>
          </div>
        </Col>
      </Row>

      {/* Custom Date Range */}
      <Row className="mb-3">
        <Col md={4}>
          <FormGroup>
            <Label for="startDate" className="form-control-label">
              Từ ngày:
            </Label>
            <Input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup>
            <Label for="endDate" className="form-control-label">
              Đến ngày:
            </Label>
            <Input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control-sm"
            />
          </FormGroup>
        </Col>
        <Col md={4} className="d-flex align-items-center">
          <FormGroup className="mb-0">
            <Button
              color="info"
              size="sm"
              onClick={handleCustomDateRange}
              disabled={!startDate && !endDate}
              className="mr-2"
            >
              <i className="ni ni-zoom-split-in mr-1"></i>
              Áp dụng
            </Button>
            <Button
              color="secondary"
              size="sm"
              onClick={clearFilters}
            >
              <i className="ni ni-fat-remove mr-1"></i>
              Xóa bộ lọc
            </Button>
          </FormGroup>
        </Col>
      </Row>

      {/* Filter Info */}
      {getFilterInfo() && (
        <Row>
          <Col>
            <Badge color="info" className="mb-3">
              <i className="ni ni-check-bold mr-1"></i>
              Đang lọc: {getFilterInfo()}
              {activeQuickFilter === "custom" && (startDate || endDate) && (
                <span>
                  {startDate && endDate && ` (${startDate} đến ${endDate})`}
                  {startDate && !endDate && ` (từ ${startDate})`}
                  {!startDate && endDate && ` (đến ${endDate})`}
                </span>
              )}
            </Badge>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default DateFilter;
