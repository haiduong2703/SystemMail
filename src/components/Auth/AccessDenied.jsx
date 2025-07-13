import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Button,
  Alert
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext.js';
import Header from 'components/Headers/Header.js';

const AccessDenied = ({ 
  title = "Access Denied",
  message = "You don't have permission to access this section.",
  requiredRole = "admin",
  showLoginButton = false,
  onRequestAccess = null
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleGoHome = () => {
    navigate('/admin/index');
  };

  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'manager': return 'warning';
      case 'user': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row className="justify-content-center">
          <Col lg="8" md="10">
            <Card className="shadow border-0">
              <CardBody className="px-lg-5 py-lg-5">
                <div className="text-center">
                  <div className="mb-4">
                    <i className="ni ni-lock-circle-open" style={{ fontSize: '4rem', color: '#f5365c' }}></i>
                  </div>
                  
                  <h2 className="text-danger mb-3">{title}</h2>
                  
                  <Alert color="danger" className="text-left">
                    <div className="d-flex align-items-start">
                      <i className="ni ni-notification-70 mr-3 mt-1"></i>
                      <div>
                        <strong>Access Restricted</strong>
                        <br />
                        {message}
                        <br />
                        <small className="text-muted">
                          Required role: <span className={`badge badge-${getRoleColor(requiredRole)}`}>
                            {requiredRole.toUpperCase()}
                          </span>
                        </small>
                      </div>
                    </div>
                  </Alert>

                  {user && (
                    <Alert color="info" className="text-left">
                      <div className="d-flex align-items-center">
                        <i className="ni ni-single-02 mr-3"></i>
                        <div>
                          <strong>Current User:</strong> {user.fullName || user.username}
                          <br />
                          <small>
                            Role: <span className={`badge badge-${getRoleColor(user.role)}`}>
                              {user.role?.toUpperCase()}
                            </span>
                            {' '}
                            Email: {user.email}
                          </small>
                        </div>
                      </div>
                    </Alert>
                  )}

                  <div className="mt-4">
                    <h5 className="text-muted mb-3">What can you do?</h5>
                    
                    <Row>
                      <Col md="6" className="mb-3">
                        <Button
                          color="primary"
                          size="lg"
                          block
                          onClick={handleGoHome}
                        >
                          <i className="ni ni-tv-2 mr-2"></i>
                          Go to Dashboard
                        </Button>
                      </Col>
                      
                      <Col md="6" className="mb-3">
                        <Button
                          color="default"
                          size="lg"
                          block
                          onClick={handleGoBack}
                        >
                          <i className="ni ni-bold-left mr-2"></i>
                          Go Back
                        </Button>
                      </Col>
                    </Row>

                    {onRequestAccess && (
                      <Row className="mt-3">
                        <Col md="12">
                          <Button
                            color="warning"
                            size="lg"
                            block
                            onClick={onRequestAccess}
                          >
                            <i className="ni ni-key-25 mr-2"></i>
                            Request Admin Access
                          </Button>
                        </Col>
                      </Row>
                    )}

                    {showLoginButton && (
                      <Row className="mt-3">
                        <Col md="12">
                          <Button
                            color="info"
                            size="lg"
                            block
                            onClick={handleLogout}
                          >
                            <i className="ni ni-user-run mr-2"></i>
                            Login as Different User
                          </Button>
                        </Col>
                      </Row>
                    )}
                  </div>

                  <hr className="my-4" />
                  
                  <div className="text-muted">
                    <small>
                      <i className="ni ni-support-16 mr-1"></i>
                      If you believe this is an error, please contact your system administrator.
                    </small>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AccessDenied;
