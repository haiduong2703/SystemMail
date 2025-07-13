import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Alert
} from 'reactstrap';
import { useAuth } from 'contexts/AuthContext.js';

const AdminAuthModal = ({
  isOpen,
  onClose,
  onSuccess,
  title = "Admin Authentication Required",
  description = "This section requires admin privileges. Please enter your credentials to continue."
}) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, user, isAuthenticated } = useAuth();

  // Pre-fill username if user is already logged in
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        username: user.username
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // If user is already logged in and is admin, just verify password
      if (isAuthenticated && user && user.role === 'admin') {
        // Re-authenticate to verify password
        const result = await login(formData.username, formData.password);

        if (result.success) {
          onSuccess(result.user);
          setFormData({ username: '', password: '' });
        } else {
          setError('Invalid password. Please try again.');
        }
      } else {
        // Full login process for non-authenticated users
        const result = await login(formData.username, formData.password);

        if (result.success) {
          // Check if user has admin role
          if (result.user.role === 'admin') {
            onSuccess(result.user);
            setFormData({ username: '', password: '' });
          } else {
            setError('Access denied. Admin privileges required.');
          }
        } else {
          setError(result.error || 'Authentication failed');
        }
      }
    } catch (err) {
      setError('An error occurred during authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({ username: '', password: '' });
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} backdrop="static" keyboard={false} centered>
      <ModalHeader>
        <i className="ni ni-lock-circle-open text-danger mr-2" />
        {title}
      </ModalHeader>
      <ModalBody>
        <Alert color="warning">
          <div className="d-flex align-items-center">
            <i className="ni ni-notification-70 mr-2"></i>
            <div>
              <strong>Admin Access Required</strong>
              <br />
              {description}
              {isAuthenticated && user && (
                <>
                  <br />
                  <small className="text-muted">
                    Logged in as: <strong>{user.fullName || user.username}</strong> ({user.role})
                  </small>
                </>
              )}
            </div>
          </div>
        </Alert>

        {error && (
          <Alert color="danger">
            <i className="ni ni-support-16 mr-2"></i>
            {error}
          </Alert>
        )}

        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Label for="admin-username">
              <i className="ni ni-single-02 mr-1"></i>
              Username
            </Label>
            <Input
              type="text"
              id="admin-username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
              disabled={isLoading || (isAuthenticated && user)}
            />
            {isAuthenticated && user && (
              <small className="text-muted">
                <i className="ni ni-check-bold text-success mr-1"></i>
                Already logged in as this user
              </small>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label for="admin-password">
              <i className="ni ni-lock-circle-open mr-1"></i>
              {isAuthenticated && user ? 'Confirm Password' : 'Password'}
            </Label>
            <Input
              type="password"
              id="admin-password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder={isAuthenticated && user ? "Confirm your password to continue" : "Enter your password"}
              required
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(e);
                }
              }}
            />
            {isAuthenticated && user && (
              <small className="text-muted">
                <i className="ni ni-notification-70 mr-1"></i>
                Please re-enter your password to access this admin section
              </small>
            )}
          </FormGroup>
        </Form>
      </ModalBody>
      
      <ModalFooter>
        <Button 
          color="primary" 
          onClick={handleSubmit}
          disabled={isLoading || !formData.username || !formData.password}
        >
          {isLoading ? (
            <>
              <i className="fa fa-spinner fa-spin mr-1"></i>
              Authenticating...
            </>
          ) : (
            <>
              <i className="ni ni-check-bold mr-1" />
              Authenticate
            </>
          )}
        </Button>
        
        <Button 
          color="secondary" 
          onClick={handleClose}
          disabled={isLoading}
        >
          <i className="ni ni-bold-left mr-1" />
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AdminAuthModal;
