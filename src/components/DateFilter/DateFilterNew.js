import React, { useState } from "react";
import {
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
} from "reactstrap";
import AntdDatePicker from "components/DateInput/AntdDatePicker";
import "./DateFilterNew.css";

const DateFilterNew = ({ onDateChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("None");
  const [customFromDate, setCustomFromDate] = useState("");
  const [customToDate, setCustomToDate] = useState("");

  // Temporary state for date inputs (before apply)
  const [tempFromDate, setTempFromDate] = useState("");
  const [tempToDate, setTempToDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const quickRanges = [
    { label: "None", value: null, unit: null },
    { label: "Last 5 minutes", value: 5, unit: "minutes" },
    { label: "Last 15 minutes", value: 15, unit: "minutes" },
    { label: "Last 30 minutes", value: 30, unit: "minutes" },
    { label: "Last 1 hour", value: 1, unit: "hours" },
    { label: "Last 3 hours", value: 3, unit: "hours" },
    { label: "Last 6 hours", value: 6, unit: "hours" },
    { label: "Last 12 hours", value: 12, unit: "hours" },
    { label: "Last 24 hours", value: 24, unit: "hours" },
    { label: "Last 2 days", value: 2, unit: "days" },
    { label: "Last 7 days", value: 7, unit: "days" },
    { label: "Last 30 days", value: 30, unit: "days" },
    { label: "Last 90 days", value: 90, unit: "days" },
  ];

  const recentlyUsedRanges = [
    "From 02/01/2025 To 06/01/2025",
    "From 14/11/2024 To 20/11/2024",
    "From 29/10/2024 To 29/10/2024",
    "From 30/10/2024 To 30/10/2024",
  ];

  const filteredRanges = quickRanges.filter((range) =>
    range.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = () => setDropdownOpen((prevState) => !prevState);

  const handleQuickRangeSelect = (range) => {
    setSelectedFilter(range.label);
    setDropdownOpen(false);

    // Clear temp dates when selecting quick range
    setTempFromDate("");
    setTempToDate("");
    setCustomFromDate("");
    setCustomToDate("");

    // Handle "None" option - reset filter
    if (range.value === null) {
      if (onDateChange) {
        onDateChange(null);
      }
      return;
    }

    const now = new Date();
    let startDate = new Date(now);

    if (range.unit === "minutes") {
      startDate.setMinutes(startDate.getMinutes() - range.value);
    } else if (range.unit === "hours") {
      startDate.setHours(startDate.getHours() - range.value);
    } else if (range.unit === "days") {
      startDate.setDate(startDate.getDate() - range.value);
    }

    if (onDateChange) {
      onDateChange({
        startDate,
        endDate: now,
        range: range.label,
      });
    }
  };

  // Helper function to convert yyyy-mm-dd to dd/mm/yyyy
  const formatDateDisplay = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleApplyCustomRange = () => {
    // Apply temp dates to actual dates
    setCustomFromDate(tempFromDate);
    setCustomToDate(tempToDate);

    // Allow filter with just from date, just to date, or both
    if (tempFromDate || tempToDate) {
      let startDate = null;
      let endDate = null;
      let displayText = "";

      if (tempFromDate) {
        startDate = new Date(tempFromDate);
        startDate.setHours(0, 0, 0, 0); // Start of day
        displayText += `From ${formatDateDisplay(tempFromDate)}`;
      }

      if (tempToDate) {
        endDate = new Date(tempToDate);
        endDate.setHours(23, 59, 59, 999); // End of day
        if (displayText) displayText += " ";
        displayText += `To ${formatDateDisplay(tempToDate)}`;
      }

      // If only from date is selected, set end date to current date
      if (tempFromDate && !tempToDate) {
        endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
      }

      // If only to date is selected, set start date to beginning of time
      if (!tempFromDate && tempToDate) {
        startDate = new Date("1970-01-01");
        startDate.setHours(0, 0, 0, 0);
      }

      setSelectedFilter(displayText);
      setDropdownOpen(false);

      if (onDateChange) {
        onDateChange({
          startDate,
          endDate,
          range: "custom",
        });
      }
    }
  };

  const handleRecentRangeSelect = (range) => {
    setSelectedFilter(range);
    setDropdownOpen(false);

    // Parse the range string to extract dates in dd/mm/yyyy format
    const matches = range.match(
      /From (\d{2}\/\d{2}\/\d{4}) To (\d{2}\/\d{2}\/\d{4})/
    );
    if (matches) {
      const [, fromDateStr, toDateStr] = matches;

      // Convert dd/mm/yyyy to Date objects
      const [fromDay, fromMonth, fromYear] = fromDateStr.split("/");
      const [toDay, toMonth, toYear] = toDateStr.split("/");

      const startDate = new Date(fromYear, fromMonth - 1, fromDay, 0, 0, 0, 0);
      const endDate = new Date(toYear, toMonth - 1, toDay, 23, 59, 59, 999);

      if (onDateChange) {
        onDateChange({
          startDate,
          endDate,
          range: "recent",
        });
      }
    }
  };

  return (
    <div className="date-filter-container mail-page-dropdown">
      <Dropdown
        isOpen={dropdownOpen}
        toggle={toggle}
        className="d-inline-block"
      >
        <DropdownToggle
          caret
          className={`btn d-flex align-items-center ${
            selectedFilter === "None"
              ? "btn-outline-secondary"
              : "btn-outline-primary"
          }`}
          style={{ minWidth: "200px" }}
        >
          <i
            className={`${
              selectedFilter === "None"
                ? "ni ni-time-alarm"
                : "ni ni-time-alarm"
            } mr-2`}
          />
          {selectedFilter === "None" ? "No Date Filter" : selectedFilter}
        </DropdownToggle>

        <DropdownMenu
          right
          className="dropdown-menu-lg p-0 mail-page-dropdown"
          style={{
            width: "500px",
            maxHeight: "600px",
            overflowY: "auto",
            zIndex: 1080,
          }}
        >
          <div className="d-flex" style={{ height: "500px" }}>
            {/* Left Panel - Custom Range */}
            <div
              className="border-right"
              style={{ width: "250px", padding: "15px" }}
              onClick={(e) => e.stopPropagation()}
            >
              <h6 className="text-primary mb-3">Custom date range</h6>

              <FormGroup>
                <Label className="form-control-label text-sm">From</Label>
                <div className="input-group">
                  <AntdDatePicker
                    value={tempFromDate}
                    onChange={(e) => setTempFromDate(e.target.value)}
                    size="small"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </FormGroup>

              <FormGroup>
                <Label className="form-control-label text-sm">To</Label>
                <div className="input-group">
                  <AntdDatePicker
                    value={tempToDate}
                    onChange={(e) => setTempToDate(e.target.value)}
                    size="small"
                    getPopupContainer={(trigger) => trigger.parentNode}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </FormGroup>

              <Button
                color="primary"
                size="sm"
                block
                onClick={handleApplyCustomRange}
                disabled={!tempFromDate && !tempToDate}
              >
                Apply date range
              </Button>

              <hr className="my-3" />

              <h6 className="text-muted mb-2" style={{ fontSize: "12px" }}>
                Recently used absolute ranges
              </h6>
              <div className="recent-ranges">
                {recentlyUsedRanges.map((range, index) => (
                  <div
                    key={index}
                    className="text-sm text-muted mb-1 cursor-pointer hover-bg-light p-1 rounded"
                    onClick={() => handleRecentRangeSelect(range)}
                    style={{ fontSize: "11px", cursor: "pointer" }}
                  >
                    {range}
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-top">
                <small className="text-muted">
                  <strong>Date Format:</strong> dd/mm/yyyy
                </small>
              </div>
            </div>

            {/* Right Panel - Quick Ranges */}
            <div style={{ width: "250px", padding: "15px" }}>
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="Search quick ranges"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-sm"
                />
              </div>

              <div
                className="quick-ranges"
                style={{ maxHeight: "400px", overflowY: "auto" }}
              >
                {filteredRanges.map((range, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer rounded mb-1 ${
                      selectedFilter === range.label
                        ? range.value === null
                          ? "bg-primary text-whit"
                          : "bg-primary text-white"
                        : "hover-bg-light"
                    } ${range.value === null ? "border border-secondary" : ""}`}
                    onClick={() => handleQuickRangeSelect(range)}
                    style={{
                      cursor: "pointer",
                      fontSize: "14px",
                      // fontWeight: range.value === null ? 'bold' : 'normal',
                      // fontStyle: range.value === null ? 'italic' : 'normal'
                    }}
                  >
                    {range.value === null ? (
                      <>
                        <i className="fas fa-times-circle mr-2"></i>
                        {range.label}
                      </>
                    ) : (
                      range.label
                    )}
                  </div>
                ))}
              </div>

              <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center">
                <small className="text-primary font-weight-bold">
                  Date Filter
                </small>
                <small className="text-muted">dd/mm/yyyy format</small>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default DateFilterNew;
