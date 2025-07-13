import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user',
    agreeTerms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      return 'All fields are required';
    }

    if (formData.password.length < 6) {
      return 'Password must be at least 6 characters long';
    }

    if (formData.password !== formData.confirmPassword) {
      return 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      return 'You must agree to the terms and conditions';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return 'Please enter a valid email address';
    }

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }

    try {
      // Use AuthContext register function
      const result = await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role
      });

      if (result.success) {
        setSuccess('Account created successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/auth/login');
        }, 2000);
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Header Section */}
      <div className="header bg-gradient-primary py-7 py-lg-8" style={{ minHeight: '100vh' }}>
        
        <div className="separator separator-bottom separator-skew zindex-100">
          <svg x="0" y="0" viewBox="0 0 2560 100" preserveAspectRatio="none" version="1.1" xmlns="http://www.w3.org/2000/svg">
            <polygon className="fill-default" points="2560 0 2560 100 0 100"></polygon>
          </svg>
        </div>
      </div>
      
      {/* Page content */}
      <div className="container mt--8 pb-5" style={{ minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card bg-secondary shadow border-0" style={{ 
              borderRadius: '15px',
              transform: 'scale(1.1)',
              transformOrigin: 'center top'
            }}>
              <div className="card-header bg-transparent pb-5">
                <div className="text-muted text-center mt-2 mb-3">
                  <small>
                    <i className="ni ni-circle-08 mr-2"></i>
                    Create New Account
                  </small>
                </div>
                <div className="btn-wrapper text-center">
                  <p className="text-muted mb-0">Fill in the information below to create your account</p>
                </div>
              </div>
              
              <div className="card-body px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>REGISTER FOR MAIL SYSTEM</small>
                </div>
                
                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    <small><i className="ni ni-support-16 mr-2"></i>{error}</small>
                  </div>
                )}
                
                {success && (
                  <div className="alert alert-success py-2 mt-3" role="alert">
                    <small><i className="ni ni-check-bold mr-2"></i>{success}</small>
                  </div>
                )}

                <form role="form" onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-hat-3"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Full Name"
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-single-02"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Username"
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-email-83"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-settings-gear-65"></i>
                        </span>
                      </div>
                      <select
                        className="form-control"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="manager">Manager</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-lock-circle-open"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Password"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group mb-3">
                    <div className="input-group input-group-alternative">
                      <div className="input-group-prepend">
                        <span className="input-group-text">
                          <i className="ni ni-lock-circle-open"></i>
                        </span>
                      </div>
                      <input
                        className="form-control"
                        placeholder="Confirm Password"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckRegister"
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                    />
                    <label className="custom-control-label" htmlFor="customCheckRegister">
                      <span className="text-muted">I agree to the terms and conditions</span>
                    </label>
                  </div>
                  
                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary my-4"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <i className="fa fa-spinner fa-spin mr-2"></i>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <i className="ni ni-check-bold mr-2"></i>
                          Create Account
                        </>
                      )}
                    </button>
                  </div>
                  
                  <div className="text-center">
                    <small className="text-muted">
                      Already have an account? 
                      <a href="/auth/login" className="text-primary ml-1">Sign in here</a>
                    </small>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
