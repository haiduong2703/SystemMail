import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Alert
} from 'reactstrap';
import Header from 'components/Headers/Header.js';
import DateFilterNew from 'components/DateFilter/DateFilterNew.js';

const DateFilterDemo = () => {
  const [selectedDateRange, setSelectedDateRange] = useState(null);

  const handleDateChange = (dateRange) => {
    setSelectedDateRange(dateRange);
    console.log('Date range changed:', dateRange);
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-time-alarm text-primary mr-2" />
                      
                    </h3>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Row className="mb-4">
                  <Col md="12">
                    <h5 className="mb-3">New Date Filter Component</h5>
                    <p className="text-muted mb-3">
                      This is the new date filter component with dropdown interface similar to monitoring tools.
                    </p>
                    
                    <div className="mb-4">
                      <DateFilterNew onDateChange={handleDateChange} />
                    </div>
                    
                    {selectedDateRange && (
                      <Alert color="info">
                        <h6 className="alert-heading">Selected Date Range:</h6>
                        <p className="mb-1">
                          <strong>Range:</strong> {selectedDateRange.range}
                        </p>
                        {selectedDateRange.startDate && (
                          <p className="mb-1">
                            <strong>From:</strong> {selectedDateRange.startDate.toLocaleString()}
                          </p>
                        )}
                        {selectedDateRange.endDate && (
                          <p className="mb-0">
                            <strong>To:</strong> {selectedDateRange.endDate.toLocaleString()}
                          </p>
                        )}
                      </Alert>
                    )}
                  </Col>
                </Row>
                
                <Row>
                  <Col md="12">
                    <Card className="bg-gradient-secondary shadow">
                      <CardBody>
                        <h6 className="text-white mb-3">Features:</h6>
                        <ul className="text-white">
                          <li>Quick time ranges (5 minutes to 90 days)</li>
                          <li>Custom absolute time range picker</li>
                          <li>Recently used ranges history</li>
                          <li>Search functionality for quick ranges</li>
                          <li>UTC timezone display</li>
                          <li>Responsive dropdown interface</li>
                        </ul>
                      </CardBody>
                    </Card>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DateFilterDemo;
