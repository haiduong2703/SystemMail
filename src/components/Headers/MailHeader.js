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

// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useMailStats, useDetailedStats, useNotificationCounts, usePICOverdueRanking } from "contexts/MailContext.js";
import NewMailBadge from "components/NewMailBadge/NewMailBadge.js";
import { useNewMailLogic } from "hooks/useNewMailLogic.js";

const MailHeader = () => {
  const navigate = useNavigate();
  const mailStats = useMailStats();
  const detailedStats = useDetailedStats();
  const notificationCounts = useNotificationCounts();
  const { showNewBadge, newMailCounts } = useNewMailLogic();
  const picRanking = usePICOverdueRanking();

  // Navigation functions
  const handleTotalMailsClick = () => {
    navigate('/admin/all-mails');
  };

  const handleOnTimeClick = () => {
    navigate('/admin/valid-mails');
  };

  const handleOverdueClick = () => {
    navigate('/admin/expired-mails');
  };

  const handleReviewClick = () => {
    navigate('/admin/review-mails');
  };

  return (
    <>
      <div className="header bg-gradient-info pb-4 pt-3 pt-md-4" style={{ position: 'relative', zIndex: 1 }}>
        <Container fluid>
          <div className="header-body">
            {/* Card stats - 8 cards layout */}
            <Row>
              {/* Card 1: Total Mails */}
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0 cursor-pointer"
                  onClick={handleTotalMailsClick}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Total Mails
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {mailStats.total}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-gradient-info text-white rounded-circle shadow">
                          <i className="ni ni-email-83" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-info mr-2">
                        <i className="ni ni-collection" />
                      </span>
                      <span className="text-nowrap">All mails in system</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* Card 2: On Time */}
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0 cursor-pointer"
                  onClick={handleOnTimeClick}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          On Time
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {mailStats.valid}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                          <i className="ni ni-check-bold" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-success mr-2">
                        <i className="fa fa-arrow-up" /> {mailStats.validPercentage}%
                      </span>
                      <span className="text-nowrap">of all mails</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* Card 3: Overdue */}
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0 cursor-pointer"
                  onClick={handleOverdueClick}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Overdue
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {mailStats.expired}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                          <i className="ni ni-fat-remove" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-danger mr-2">
                        <i className="fas fa-exclamation-triangle" />
                      </span>
                      <span className="text-nowrap">Expired mails</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>

              {/* Card 4: Review */}
              <Col lg="6" xl="3">
                <Card
                  className="card-stats mb-4 mb-xl-0 cursor-pointer"
                  onClick={handleReviewClick}
                  style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Review
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0">
                          {mailStats.reviewMailCount || 0}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon icon-shape bg-primary text-white rounded-circle shadow">
                          <i className="ni ni-archive-2" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-primary mr-2">
                        <i className="fa fa-arrow-up" />
                        {mailStats.total > 0 ? Math.round(((mailStats.reviewMailCount || 0) / mailStats.total) * 100) : 0}%
                      </span>
                      <span className="text-nowrap">needs review</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default MailHeader;
