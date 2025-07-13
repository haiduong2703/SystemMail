import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext.js';
import AccessDenied from './AccessDenied.jsx';
import AdminAuthModal from './AdminAuthModal.jsx';

const withAdminAuth = (WrappedComponent, options = {}) => {
  const {
    title = "Admin Authentication Required",
    description = "This section requires admin privileges.",
    allowRequestAccess = true,
    showLoginButton = true
  } = options;

  return (props) => {
    const { user, isAuthenticated, loading } = useAuth();
    const [showAuthModal, setShowAuthModal] = useState(true); // Always show modal initially
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    useEffect(() => {
      // Always require authentication modal, even for admin users
      if (isAuthenticated && user) {
        // Check if already authenticated for this session
        const sessionKey = `adminAuth_${user.username}`;
        const sessionAuth = sessionStorage.getItem(sessionKey);

        if (sessionAuth === 'true') {
          setIsAdminAuthenticated(true);
          setShowAuthModal(false);
        } else {
          setIsAdminAuthenticated(false);
          setShowAuthModal(true);
        }
      } else {
        setIsAdminAuthenticated(false);
        setShowAuthModal(true);
      }
    }, [isAuthenticated, user]);

    // Show loading spinner while checking authentication
    if (loading) {
      return (
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      );
    }

    // If not authenticated at all, redirect to login
    if (!isAuthenticated) {
      return <Navigate to="/auth/login" replace />;
    }

    // Handle authentication modal and access control
    if (!isAdminAuthenticated) {
      const handleAuthSuccess = (adminUser) => {
        // Store session authentication
        const sessionKey = `adminAuth_${adminUser.username}`;
        sessionStorage.setItem(sessionKey, 'true');

        setIsAdminAuthenticated(true);
        setShowAuthModal(false);
      };

      const handleAuthClose = () => {
        // Redirect back if user cancels
        window.history.back();
      };

      // If user is not admin, show access denied
      if (isAuthenticated && user && user.role !== 'admin') {
        return (
          <>
            <AccessDenied
              title="Admin Access Required"
              message={`This section requires administrator privileges. Your current role (${user.role?.toUpperCase()}) does not have access to this area.`}
              requiredRole="admin"
              showLoginButton={showLoginButton}
              onRequestAccess={null} // Don't allow request access for non-admin users
            />
          </>
        );
      }

      // Show authentication modal for admin users or unauthenticated users
      return (
        <>
          <AdminAuthModal
            isOpen={showAuthModal}
            onClose={handleAuthClose}
            onSuccess={handleAuthSuccess}
            title={title}
            description={description}
          />
        </>
      );
    }

    // If admin authenticated, render the wrapped component
    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
