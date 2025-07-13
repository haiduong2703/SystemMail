import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  Table,
  Badge,
  Progress
} from 'reactstrap';
import CompactHeader from 'components/Headers/CompactHeader.js';
import withAdminAuth from 'components/Auth/withAdminAuth.jsx';
import RealtimeMailMonitor from "components/RealtimeMailMonitor/RealtimeMailMonitor.js";
// Import server fullwidth styles
import "assets/css/server-fullwidth.css";

const Server = () => {
  const [serverStats, setServerStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadServerStats();
  }, []);

  const loadServerStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/server-stats');
      if (response.ok) {
        const data = await response.json();
        setServerStats(data);
      }
    } catch (err) {
      console.error('Failed to load server stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRestartServer = async () => {
    if (window.confirm('Bạn có chắc chắn muốn khởi động lại server?')) {
      try {
        const response = await fetch('/api/server-restart', { method: 'POST' });
        if (response.ok) {
          alert('Server đang được khởi động lại...');
          setTimeout(() => {
            window.location.reload();
          }, 3000);
        }
      } catch (err) {
        alert('Lỗi khi khởi động lại server');
      }
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa cache?')) {
      try {
        const response = await fetch('/api/clear-cache', { method: 'POST' });
        if (response.ok) {
          alert('Cache đã được xóa thành công');
          loadServerStats();
        }
      } catch (err) {
        alert('Lỗi khi xóa cache');
      }
    }
  };



  return (
    <>
      <CompactHeader
        title="SERVER MONITORING"
        subtitle="Monitor mail server status and performance"
        icon="ni ni-settings-gear-65"
      />
      <Container className="mt--5 pb-5 compact-layout server-fullwidth" fluid>
        <Row>
          <Col xs="12">
            <RealtimeMailMonitor />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default withAdminAuth(Server, {
  title: "Server Management Access",
  description: "This section provides server monitoring and management tools. Admin privileges are required.",
  allowRequestAccess: true,
  showLoginButton: true
});
