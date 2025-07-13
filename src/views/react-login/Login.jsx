import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Use AuthContext login function
      const result = await login(formData.username, formData.password);

      if (result.success) {
        // Redirect to dashboard on successful login
        navigate('/admin/index');
      } else {
        setError(result.error || 'Login failed. Please try again.');
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
      

      {/* Page content */}
      <div className="container mt--8 pb-5" style={{ minHeight: '100vh' }}>
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8">
            <div className="card bg-secondary shadow border-0" style={{
              borderRadius: '15px',
              transform: 'scale(1.2)',
              transformOrigin: 'center top'
            }}>


              <div className="card-body px-lg-5 py-lg-5">
                <div className="text-center text-muted mb-4">
                  <small>MAIL SYSTEM LOGIN</small>
                </div>
                <p className="text-center text-muted mb-4">Enter your credentials to access the mail management system</p>
                {error && (
                  <div className="alert alert-danger py-2 mt-3" role="alert">
                    <small>{error}</small>
                  </div>
                )}
                <form role="form" onSubmit={handleSubmit}>
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
                  <div className="custom-control custom-control-alternative custom-checkbox">
                    <input
                      className="custom-control-input"
                      id="customCheckLogin"
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                    />
                    <label className="custom-control-label" htmlFor="customCheckLogin">
                      <span className="text-muted">Remember me</span>
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
                          Signing in...
                        </>
                      ) : (
                        <>
                          <i className="ni ni-key-25 mr-2"></i>
                          Sign in
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center">
                    <small className="text-muted">
                      Don't have an account?
                      <a href="/auth/register" className="text-primary ml-1">Create new account</a>
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

export default Login;