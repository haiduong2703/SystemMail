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
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";
import { useAuth } from "contexts/AuthContext.js";
import { useState, useEffect } from "react";

const Profile = () => {
  const { user, updateUser, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    aboutMe: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Password change states
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    if (user) {
      const nameParts = user.fullName ? user.fullName.split(' ') : ['', ''];
      setFormData({
        username: user.username || '',
        email: user.email || '',
        fullName: user.fullName || '',
        role: user.role || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        address: user.address || '',
        city: user.city || '',
        country: user.country || '',
        postalCode: user.postalCode || '',
        aboutMe: user.aboutMe || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage('');

    try {
      const updatedData = {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`.trim()
      };

      const result = await updateProfile(updatedData);

      if (result.success) {
        setSaveMessage('Profile updated successfully!');
        setIsEditing(false);
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setSaveMessage(`Error: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Password change handlers
  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePasswordChange = async () => {
    setIsChangingPassword(true);
    setPasswordMessage('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordMessage('All password fields are required');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage('New passwords do not match');
      setIsChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage('New password must be at least 6 characters long');
      setIsChangingPassword(false);
      return;
    }

    try {
      const result = await updateUser({
        username: user.username,
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      if (result.success) {
        setPasswordMessage('Password changed successfully!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setPasswordMessage(''), 3000);
      } else {
        setPasswordMessage(`Error: ${result.error}`);
      }
    } catch (error) {
      setPasswordMessage(`Error: ${error.message}`);
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }
  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <img
                        alt="..."
                        className="rounded-circle"
                        src={require("../../assets/img/theme/team-4-800x800.jpg")}
                      />
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-between">
                  <Button
                    className="mr-4"
                    color={isEditing ? "success" : "info"}
                    onClick={isEditing ? handleSave : () => setIsEditing(true)}
                    size="sm"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <i className="fa fa-spinner fa-spin mr-1"></i>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i className={`ni ${isEditing ? 'ni-check-bold' : 'ni-settings-gear-65'} mr-1`}></i>
                        {isEditing ? 'Save' : 'Edit Profile'}
                      </>
                    )}
                  </Button>
                  <Button
                    className="float-right"
                    color="default"
                    onClick={() => {
                      setIsEditing(false);
                      setSaveMessage('');
                    }}
                    size="sm"
                    disabled={!isEditing || isSaving}
                  >
                    <i className="ni ni-fat-remove mr-1"></i>
                    Cancel
                  </Button>
                </div>
                {saveMessage && (
                  <div className={`alert alert-${saveMessage.includes('Error') ? 'danger' : 'success'} mt-3 mb-0`} role="alert">
                    <small>{saveMessage}</small>
                  </div>
                )}
              </CardHeader>
              <CardBody className="pt-0 pt-md-4" style={{marginTop:"50px"}}>
               
                <div className="text-center">
                  <h3>
                    {user.fullName || user.username}
                    <span className="font-weight-light ml-2">
                      <span className={`badge badge-${user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}`}>
                        {user.role?.toUpperCase()}
                      </span>
                    </span>
                  </h3>
                  <div >
                    <i className="ni ni-email-83 mr-2" />
                    {user.email}
                  </div>
                  <div>
                    <i className="ni ni-single-02 mr-2" />
                    Username: {user.username}
                  </div>
                  <div>
                    <i className="ni ni-calendar-grid-58 mr-2" />
                    Joined: {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                  </div>
                  <hr className="my-4" />
                  <p>
                    {formData.aboutMe || `Welcome to the Mail Management System! You are logged in as ${user.role} with access to ${user.role === 'admin' ? 'all system features' : user.role === 'manager' ? 'mail management and user oversight' : 'basic mail access'}.`}
                  </p>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">My Account</h3>
                    <p className="text-muted mb-0">Manage your profile information</p>
                  </Col>
                  <Col className="text-right" xs="4">
                    <span className={`badge badge-lg badge-${user.role === 'admin' ? 'danger' : user.role === 'manager' ? 'warning' : 'info'}`}>
                      {user.role?.toUpperCase()}
                    </span>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <h6 className="heading-small text-muted mb-4">
                    User information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Username
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.username}
                            id="input-username"
                            placeholder="Username"
                            type="text"
                            name="username"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Email address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.email}
                            id="input-email"
                            placeholder="Email address"
                            type="email"
                            name="email"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            First name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.firstName}
                            id="input-first-name"
                            placeholder="First name"
                            type="text"
                            name="firstName"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Last name
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.lastName}
                            id="input-last-name"
                            placeholder="Last name"
                            type="text"
                            name="lastName"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Address */}
                  <h6 className="heading-small text-muted mb-4">
                    Contact information
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-address"
                          >
                            Address
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.address}
                            id="input-address"
                            placeholder="Home Address"
                            type="text"
                            name="address"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-city"
                          >
                            City
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.city}
                            id="input-city"
                            placeholder="City"
                            type="text"
                            name="city"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Country
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.country}
                            id="input-country"
                            placeholder="Country"
                            type="text"
                            name="country"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="4">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-country"
                          >
                            Postal code
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={formData.postalCode}
                            id="input-postal-code"
                            placeholder="Postal code"
                            type="text"
                            name="postalCode"
                            onChange={handleInputChange}
                            disabled={!isEditing}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  {/* Description */}
                  <h6 className="heading-small text-muted mb-4">About me</h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label>About Me</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="A few words about you ..."
                        rows="4"
                        value={formData.aboutMe}
                        type="textarea"
                        name="aboutMe"
                        onChange={handleInputChange}
                        disabled={!isEditing}
                      />
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>

            {/* Password Change Card */}
            <Card className="bg-secondary shadow mt-4">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0">Change Password</h3>
                    <p className="text-muted mb-0">Update your account password</p>
                  </Col>
                  <Col className="text-right" xs="4">
                    <i className="ni ni-lock-circle-open text-primary" style={{ fontSize: '24px' }}></i>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="12">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="current-password">
                            Current Password
                          </label>
                          <InputGroup>
                            <Input
                              className="form-control-alternative"
                              id="current-password"
                              placeholder="Enter current password"
                              type={showPasswords.current ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordInputChange}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>
                                <i
                                  className={`fas ${showPasswords.current ? 'fa-eye-slash' : 'fa-eye'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => togglePasswordVisibility('current')}
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="new-password">
                            New Password
                          </label>
                          <InputGroup>
                            <Input
                              className="form-control-alternative"
                              id="new-password"
                              placeholder="Enter new password"
                              type={showPasswords.new ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordInputChange}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>
                                <i
                                  className={`fas ${showPasswords.new ? 'fa-eye-slash' : 'fa-eye'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => togglePasswordVisibility('new')}
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                          <small className="text-muted">Password must be at least 6 characters long</small>
                        </FormGroup>
                      </Col>

                      <Col lg="6">
                        <FormGroup>
                          <label className="form-control-label" htmlFor="confirm-password">
                            Confirm New Password
                          </label>
                          <InputGroup>
                            <Input
                              className="form-control-alternative"
                              id="confirm-password"
                              placeholder="Confirm new password"
                              type={showPasswords.confirm ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordInputChange}
                            />
                            <InputGroupAddon addonType="append">
                              <InputGroupText>
                                <i
                                  className={`fas ${showPasswords.confirm ? 'fa-eye-slash' : 'fa-eye'}`}
                                  style={{ cursor: 'pointer' }}
                                  onClick={() => togglePasswordVisibility('confirm')}
                                />
                              </InputGroupText>
                            </InputGroupAddon>
                          </InputGroup>
                        </FormGroup>
                      </Col>
                    </Row>

                    {passwordMessage && (
                      <Row>
                        <Col lg="12">
                          <Alert color={passwordMessage.includes('Error') ? 'danger' : 'success'}>
                            {passwordMessage}
                          </Alert>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col lg="12" className="text-right">
                        <Button
                          color="primary"
                          onClick={handlePasswordChange}
                          disabled={isChangingPassword}
                        >
                          {isChangingPassword ? (
                            <>
                              <i className="fa fa-spinner fa-spin mr-1"></i>
                              Changing Password...
                            </>
                          ) : (
                            <>
                              <i className="ni ni-lock-circle-open mr-1"></i>
                              Change Password
                            </>
                          )}
                        </Button>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
