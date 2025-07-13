import React, { useState, useMemo } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Input,
  Label,
  FormGroup,
  Button
} from 'reactstrap';
import { useMailContext } from 'contexts/MailContext';
import './MailStatisticsChart.css';

const MailStatisticsChart = () => {
  const { mails } = useMailContext();

  // State for date filtering
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter mails based on date range
  const filteredMails = useMemo(() => {
    if (!startDate && !endDate) {
      return mails;
    }

    return mails.filter(mail => {
      if (!mail.Date || !Array.isArray(mail.Date) || mail.Date.length < 2) {
        return false;
      }

      try {
        const [dateStr, timeStr] = mail.Date;
        const mailDate = new Date(`${dateStr}T${timeStr}`);

        // Check start date
        if (startDate) {
          const filterStartDate = new Date(startDate);
          filterStartDate.setHours(0, 0, 0, 0);
          if (mailDate < filterStartDate) {
            return false;
          }
        }

        // Check end date
        if (endDate) {
          const filterEndDate = new Date(endDate);
          filterEndDate.setHours(23, 59, 59, 999);
          if (mailDate > filterEndDate) {
            return false;
          }
        }

        return true;
      } catch (error) {
        console.error('Error parsing mail date:', error);
        return false;
      }
    });
  }, [mails, startDate, endDate]);

  // Clear filters function
  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  // Calculate filtered statistics
  const filteredStats = useMemo(() => {
    const stats = {
      validReplied: 0,
      validUnreplied: 0,
      expiredReplied: 0,
      expiredUnreplied: 0,
      reviewMailCount: 0,
      total: filteredMails.length,
      valid: 0,
      expired: 0
    };

    filteredMails.forEach(mail => {
      if (mail.category === "ReviewMail") {
        stats.reviewMailCount++;
      } else if (mail.isExpired || mail.category === "QuaHan") {
        stats.expired++;
        if (mail.status === "daRep") {
          stats.expiredReplied++;
        } else {
          stats.expiredUnreplied++;
        }
      } else {
        stats.valid++;
        if (mail.status === "daRep") {
          stats.validReplied++;
        } else {
          stats.validUnreplied++;
        }
      }
    });

    return stats;
  }, [filteredMails]);

  // All 5 chart data items in one chart
  const chartData = [
    {
      label: 'Reply (on-time)',
      value: filteredStats.validReplied || 0,
      color: '#5e72e4', // Blue
    },
    {
      label: 'Non-reply (on-time)',
      value: filteredStats.validUnreplied || 0,
      color: '#2dce89', // Green
    },
    {
      label: 'Reply (Overdue)',
      value: filteredStats.expiredReplied || 0,
      color: '#fb6340', // Red
    },
    {
      label: 'Non-reply (overdue)',
      value: filteredStats.expiredUnreplied || 0,
      color: '#ffd600', // Orange
    },
    {
      label: 'Review',
      value: filteredStats.reviewMailCount || 0,
      color: '#8965e0', // Purple
    }
  ];

  const maxValue = Math.max(...chartData.map(item => item.value));

  return (
    <Card className="bg-gradient-default shadow">
      <CardHeader className="bg-transparent">
        <Row className="align-items-center">
          <div className="col">
            <h6 className="text-uppercase text-light ls-1 mb-1">
              Overview
            </h6>
            <h2 className="text-white mb-0">
              Summary Chart
              {(startDate || endDate) && (
                <small className="text-light ml-2">
                  (Filtered: {filteredStats.total} mails)
                </small>
              )}
            </h2>
          </div>
          <div className="col-auto">
            <Row className="align-items-center">
              <Col xs="auto">
                <FormGroup className="mb-0">
                  <Label className="text-light text-sm mb-1">From:</Label>
                  <Input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="form-control-sm"
                    style={{ width: '140px' }}
                  />
                </FormGroup>
              </Col>
              <Col xs="auto">
                <FormGroup className="mb-0">
                  <Label className="text-light text-sm mb-1">To:</Label>
                  <Input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="form-control-sm"
                    style={{ width: '140px' }}
                  />
                </FormGroup>
              </Col>
              <Col xs="auto">
                <Button
                  color="secondary"
                  size="sm"
                  onClick={clearFilters}
                  disabled={!startDate && !endDate}
                  className="mt-3"
                >
                  <i className="ni ni-fat-remove"></i>
                </Button>
              </Col>
            </Row>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        {/* Custom Horizontal Bar Chart - All 5 values */}
        <div className="chart-container" style={{ minHeight: '400px' }}>
          <div className="chart-bars">
            {chartData.map((item, index) => (
              <div key={index} className="chart-bar-item mb-3">
                <Row className="align-items-center">
                  <Col xs="3" className="text-right pr-3">
                    <span className="text-light font-weight-bold" style={{ fontSize: '13px' }}>
                      {item.label}
                    </span>
                  </Col>
                  <Col xs="7">
                    <div className="progress-wrapper chart-grid">
                      <div className="progress" style={{
                        height: '25px',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '3px'
                      }}>
                        <div
                          className="progress-bar"
                          role="progressbar"
                          title={`${item.label}: ${item.value} mails`}
                          style={{
                            width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`,
                            backgroundColor: item.color,
                            transition: 'width 0.6s ease',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            '--target-width': `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%`
                          }}
                        />
                      </div>
                    </div>
                  </Col>
                  <Col xs="2" className="text-left pl-3">
                    <span className="text-light font-weight-bold text-sm">
                      {item.value}
                    </span>
                  </Col>
                </Row>
              </div>
            ))}
          </div>

          {/* X-axis scale */}
          <div className="mt-4">
            <Row>
              <Col xs="3"></Col>
              <Col xs="7">
                <div className="d-flex justify-content-between text-light text-xs">
                  {(() => {
                    // Calculate appropriate scale based on maxValue
                    const scaleMax = Math.ceil(maxValue / 5) * 5; // Round up to nearest 5
                    const adjustedMax = Math.max(scaleMax, 10); // Minimum scale of 10
                    const step = Math.max(Math.ceil(adjustedMax / 10), 1); // Show ~10 ticks
                    const ticks = [];

                    for (let i = 0; i <= adjustedMax; i += step) {
                      ticks.push(i);
                    }

                    return ticks.map((tick, index) => (
                      <span key={index} style={{ fontSize: '10px' }}>{tick}</span>
                    ));
                  })()}
                </div>
                <div style={{
                  height: '1px',
                  backgroundColor: '#ffd600',
                  marginTop: '5px',
                  border: '1px solid #ffd600'
                }}></div>
              </Col>
              <Col xs="2"></Col>
            </Row>
          </div>

          {/* Summary */}
          <div className="mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Row>
              <Col xs="4">
                <div className="text-center">
                  <span className="text-light text-sm">Total On-time</span>
                  <div className="h4 text-white font-weight-bold">
                    {filteredStats.valid}
                  </div>
                </div>
              </Col>
              <Col xs="4">
                <div className="text-center">
                  <span className="text-light text-sm">Total Overdue</span>
                  <div className="h4 text-white font-weight-bold">
                    {filteredStats.expired}
                  </div>
                </div>
              </Col>
              <Col xs="4">
                <div className="text-center">
                  <span className="text-light text-sm">Total Mails</span>
                  <div className="h4 text-white font-weight-bold">
                    {filteredStats.total}
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default MailStatisticsChart;
