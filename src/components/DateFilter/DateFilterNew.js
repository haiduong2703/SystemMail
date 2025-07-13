import React, { useState } from 'react';
import {
  FormGroup,
  Label,
  Input,
  Button,
  Dropdown,
  DropdownToggle,
  DropdownMenu
} from 'reactstrap';
import './DateFilterNew.css';

const DateFilterNew = ({ onDateChange }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('None');
  const [customFromDate, setCustomFromDate] = useState('');
  const [customToDate, setCustomToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const quickRanges = [
    { label: 'None', value: null, unit: null },
    { label: 'Last 5 minutes', value: 5, unit: 'minutes' },
    { label: 'Last 15 minutes', value: 15, unit: 'minutes' },
    { label: 'Last 30 minutes', value: 30, unit: 'minutes' },
    { label: 'Last 1 hour', value: 1, unit: 'hours' },
    { label: 'Last 3 hours', value: 3, unit: 'hours' },
    { label: 'Last 6 hours', value: 6, unit: 'hours' },
    { label: 'Last 12 hours', value: 12, unit: 'hours' },
    { label: 'Last 24 hours', value: 24, unit: 'hours' },
    { label: 'Last 2 days', value: 2, unit: 'days' },
    { label: 'Last 7 days', value: 7, unit: 'days' },
    { label: 'Last 30 days', value: 30, unit: 'days' },
    { label: 'Last 90 days', value: 90, unit: 'days' }
  ];

  const recentlyUsedRanges = [
    '2025-01-02 00:00:00 to 2025-01-06 23:59:59',
    '2024-11-14 00:00:00 to 2024-11-20 23:59:59',
    '2024-10-29 00:00:00 to 2024-10-29 23:59:59',
    '2024-10-30 00:00:00 to 2024-10-30 23:59:59'
  ];

  const filteredRanges = quickRanges.filter(range =>
    range.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggle = () => setDropdownOpen(prevState => !prevState);

  const handleQuickRangeSelect = (range) => {
    setSelectedFilter(range.label);
    setDropdownOpen(false);

    // Handle "None" option - reset filter
    if (range.value === null) {
      if (onDateChange) {
        onDateChange(null);
      }
      return;
    }

    const now = new Date();
    let startDate = new Date(now);

    if (range.unit === 'minutes') {
      startDate.setMinutes(startDate.getMinutes() - range.value);
    } else if (range.unit === 'hours') {
      startDate.setHours(startDate.getHours() - range.value);
    } else if (range.unit === 'days') {
      startDate.setDate(startDate.getDate() - range.value);
    }

    if (onDateChange) {
      onDateChange({
        startDate,
        endDate: now,
        range: range.label
      });
    }
  };

  const handleApplyCustomRange = () => {
    if (customFromDate && customToDate) {
      const startDate = new Date(customFromDate);
      const endDate = new Date(customToDate);
      endDate.setHours(23, 59, 59, 999);
      
      setSelectedFilter(`${customFromDate} to ${customToDate}`);
      setDropdownOpen(false);
      
      if (onDateChange) {
        onDateChange({
          startDate,
          endDate,
          range: 'custom'
        });
      }
    }
  };

  const handleRecentRangeSelect = (range) => {
    setSelectedFilter(range);
    setDropdownOpen(false);
    
    // Parse the range string to extract dates
    const matches = range.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}) to (\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})/);
    if (matches) {
      const startDate = new Date(matches[1]);
      const endDate = new Date(matches[2]);
      
      if (onDateChange) {
        onDateChange({
          startDate,
          endDate,
          range: 'recent'
        });
      }
    }
  };

  return (
    <div className="date-filter-container mail-page-dropdown">
      <Dropdown isOpen={dropdownOpen} toggle={toggle} className="d-inline-block">
        <DropdownToggle
          caret
          className={`btn d-flex align-items-center ${selectedFilter === 'None' ? 'btn-outline-secondary' : 'btn-outline-primary'}`}
          style={{ minWidth: '200px' }}
        >
          <i className={`${selectedFilter === 'None' ? 'ni ni-fat-remove' : 'ni ni-time-alarm'} mr-2`} />
          {selectedFilter === 'None' ? 'No Date Filter' : selectedFilter}
          {selectedFilter !== 'None' && <span className="text-muted ml-1">UTC</span>}
        </DropdownToggle>

        <DropdownMenu
          right
          className="dropdown-menu-lg p-0 mail-page-dropdown"
          style={{ width: '500px', maxHeight: '600px', overflowY: 'auto', zIndex: 1080 }}
        >
          <div className="d-flex" style={{ height: '500px' }}>
            {/* Left Panel - Custom Range */}
            <div className="border-right" style={{ width: '250px', padding: '15px' }}>
              <h6 className="text-primary mb-3">Absolute time range</h6>
              
              <FormGroup>
                <Label className="form-control-label text-sm">From</Label>
                <div className="input-group">
                  <Input
                    type="datetime-local"
                    value={customFromDate}
                    onChange={(e) => setCustomFromDate(e.target.value)}
                    className="form-control-sm"
                  />
                </div>
              </FormGroup>
              
              <FormGroup>
                <Label className="form-control-label text-sm">To</Label>
                <div className="input-group">
                  <Input
                    type="datetime-local"
                    value={customToDate}
                    onChange={(e) => setCustomToDate(e.target.value)}
                    className="form-control-sm"
                  />
                </div>
              </FormGroup>
              
              <Button 
                color="primary" 
                size="sm" 
                block
                onClick={handleApplyCustomRange}
                disabled={!customFromDate || !customToDate}
              >
                Apply time range
              </Button>
              
              <hr className="my-3" />
              
              <h6 className="text-muted mb-2" style={{ fontSize: '12px' }}>Recently used absolute ranges</h6>
              <div className="recent-ranges">
                {recentlyUsedRanges.map((range, index) => (
                  <div 
                    key={index}
                    className="text-sm text-muted mb-1 cursor-pointer hover-bg-light p-1 rounded"
                    onClick={() => handleRecentRangeSelect(range)}
                    style={{ fontSize: '11px', cursor: 'pointer' }}
                  >
                    {range}
                  </div>
                ))}
              </div>
              
              <div className="mt-3 pt-2 border-top">
                <small className="text-muted">
                  <strong>Coordinated Universal Time</strong> UTC, GMT
                </small>
              </div>
            </div>
            
            {/* Right Panel - Quick Ranges */}
            <div style={{ width: '250px', padding: '15px' }}>
              <div className="mb-3">
                <Input
                  type="text"
                  placeholder="Search quick ranges"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-control-sm"
                />
              </div>
              
              <div className="quick-ranges" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {filteredRanges.map((range, index) => (
                  <div
                    key={index}
                    className={`p-2 cursor-pointer rounded mb-1 ${
                      selectedFilter === range.label
                        ? (range.value === null ? 'bg-secondary text-white' : 'bg-primary text-white')
                        : 'hover-bg-light'
                    } ${range.value === null ? 'border border-secondary' : ''}`}
                    onClick={() => handleQuickRangeSelect(range)}
                    style={{
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: range.value === null ? 'bold' : 'normal',
                      fontStyle: range.value === null ? 'italic' : 'normal'
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
                <small className="text-primary font-weight-bold">UTC</small>
                <small className="text-muted cursor-pointer">Change time settings</small>
              </div>
            </div>
          </div>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default DateFilterNew;
