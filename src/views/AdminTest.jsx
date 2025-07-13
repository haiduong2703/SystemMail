import React from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  Alert,
  Badge
} from 'reactstrap';
import Header from 'components/Headers/Header.js';
import withAdminAuth from 'components/Auth/withAdminAuth.jsx';
import { useAuth } from 'contexts/AuthContext.js';

const AdminTest = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <Col lg="12">
            <Card className="shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-lock-circle-open text-success mr-2"></i>
                      Admin Access Test Page
                    </h3>
                    <p className="text-muted mb-0">This page is only accessible to admin users</p>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <Alert color="success">
                  <div className="d-flex align-items-center">
                    <i className="ni ni-check-bold mr-3"></i>
                    <div>
                      <strong>Access Granted!</strong>
                      <br />
                      You have successfully accessed this admin-only section.
                    </div>
                  </div>
                </Alert>

                <div className="mb-4">
                  <h4>Current User Information:</h4>
                  <div className="pl-3">
                    <p><strong>Name:</strong> {user?.fullName || user?.username}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Username:</strong> {user?.username}</p>
                    <p>
                      <strong>Role:</strong> 
                      <Badge color="danger" className="ml-2">
                        {user?.role?.toUpperCase()}
                      </Badge>
                    </p>
                    <p><strong>User ID:</strong> {user?.id}</p>
                    <p><strong>Member Since:</strong> {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>

                <Alert color="info">
                  <h5>Admin Privileges Include:</h5>
                  <ul className="mb-0">
                    <li>Access to Assignment Management</li>
                    <li>Access to Server Management</li>
                    <li>User Management (view all users)</li>
                    <li>System Configuration</li>
                    <li>Mail System Administration</li>
                  </ul>
                </Alert>

                <Alert color="warning">
                  <strong>Security Note:</strong> This page demonstrates the admin authentication system. 
                  Only users with admin role can access this content.
                </Alert>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withAdminAuth(AdminTest, {
  title: "Admin Test Page Access",
  description: "This is a test page to demonstrate admin-only access control.",
  allowRequestAccess: true,
  showLoginButton: true
});
