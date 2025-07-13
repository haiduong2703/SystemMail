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
import { Button, Container, Row, Col } from "reactstrap";
import { useAuth } from "contexts/AuthContext.js";

const UserHeader = () => {
  const { user } = useAuth();
  return (
    <>
      <div
        className="header bg-gradient-info pb-8 pt-5 pt-lg-8 d-flex align-items-center"
        style={{
          minHeight: "600px",
          backgroundImage: "url(" + require("../../assets/img/theme/profile-cover.jpg") + ")",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Mask */}
        <span
          className="mask "
          style={{ opacity: 0.8}}
        />
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <Row>
            <Col lg="7" md="10">
              <h1 className="display-2 text-white">
                Hello {user?.fullName || user?.username || 'User'}
              </h1>
              <p className="text-white mt-0 mb-5">
                This is your profile page. You can see your account information,
                manage your personal details, and update your preferences for the
                Mail Management System.
              </p>
              <div className="d-flex align-items-center">
                <span className={`badge badge-lg badge-${user?.role === 'admin' ? 'danger' : user?.role === 'manager' ? 'warning' : 'info'} mr-3`}>
                  {user?.role?.toUpperCase()}
                </span>
                <small className="text-white" style={{ opacity: 0.8 }}>
                  <i className="ni ni-calendar-grid-58 mr-1"></i>
                  Member since {new Date(user?.createdAt || Date.now()).getFullYear()}
                </small>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
