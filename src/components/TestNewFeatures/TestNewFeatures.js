import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Badge,
  Row,
  Col,
  Alert
} from 'reactstrap';
import {
  useNotificationCounts,
  useDetailedStats
} from 'contexts/MailContext.js';
import { useTitleBlink } from 'hooks/useTitleBlink.js';
import { useNewMailLogic } from 'hooks/useNewMailLogic.js';

const TestNewFeatures = () => {
  const [testResults, setTestResults] = useState([]);

  // Get all the new hooks data
  const notificationCounts = useNotificationCounts();
  const { isBlinking, shouldReload, newMailCount } = useTitleBlink();
  const { showNewBadge, newMailCounts } = useNewMailLogic();


  const addTestResult = (test, result, status) => {
    setTestResults(prev => [...prev, {
      id: Date.now(),
      test,
      result,
      status,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testNotificationCounts = () => {
    const { dungHanCount, quaHanCount, showDungHanBadge, showQuaHanBadge } = notificationCounts;
    addTestResult(
      'Notification Counts',
      `Đúng hạn: ${dungHanCount} (${showDungHanBadge ? 'Show' : 'Hide'} badge), Quá hạn: ${quaHanCount} (${showQuaHanBadge ? 'Show' : 'Hide'} badge)`,
      'success'
    );
  };

  const testNewMailLogic = () => {
    addTestResult(
      'New Mail Logic',
      `Show NEW badge: ${showNewBadge}, DungHan: ${newMailCounts.dungHanMustRep}, QuaHan: ${newMailCounts.quaHanChuaRep}, Total: ${newMailCounts.total}`,
      showNewBadge ? 'warning' : 'success'
    );
  };

  const testNewMails = () => {
    addTestResult(
      'New Mails Count',
      `Total NEW mails: ${newMailCount}`,
      newMailCount > 0 ? 'warning' : 'success'
    );
  };

  const testTitleBlink = () => {
    addTestResult(
      'Title Blink',
      `Is blinking: ${isBlinking}, Should reload: ${shouldReload}`,
      isBlinking ? 'warning' : 'success'
    );
  };

  const testBackendReload = () => {
    addTestResult(
      'Backend Reload Test',
      'Backend reload functionality has been removed',
      'info'
    );
  };

  const simulateReloadSignal = () => {
    addTestResult('Reload Signal', 'Reload signal functionality has been removed', 'info');
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <Card>
      <CardHeader>
        <h3 className="mb-0">Test New Features</h3>
        <p className="text-muted mb-0">Test các tính năng mới đã implement</p>
      </CardHeader>
      <CardBody>
        <Row>
          <Col md="6">
            <h4>Current Status</h4>
            <div className="mb-3">
              <Badge color="info" className="mr-2">Notification Counts</Badge>
              <span>Đúng hạn: {notificationCounts.dungHanCount}, Quá hạn: {notificationCounts.quaHanCount}</span>
            </div>
            <div className="mb-3">
              <Badge color="warning" className="mr-2">NEW Badge</Badge>
              <span>{showNewBadge ? 'Show NEW Badge' : 'No NEW Badge'}</span>
            </div>
            <div className="mb-3">
              <Badge color="danger" className="mr-2">New Mails</Badge>
              <span>{newMailCount || 0} new mails found</span>
            </div>
            <div className="mb-3">
              <Badge color="success" className="mr-2">Title Blink</Badge>
              <span>{isBlinking ? 'Blinking Active' : 'Not Blinking'}</span>
            </div>
            <div className="mb-3">
              <Badge color="primary" className="mr-2">Backend Reload</Badge>
              <span>Disabled</span>
            </div>
          </Col>
          <Col md="6">
            <h4>Test Actions</h4>
            <div className="d-flex flex-wrap gap-2">
              <Button color="info" size="sm" onClick={testNotificationCounts} className="mr-2 mb-2">
                Test Notifications
              </Button>
              <Button color="warning" size="sm" onClick={testNewMailLogic} className="mr-2 mb-2">
                Test NEW Logic
              </Button>
              <Button color="danger" size="sm" onClick={testNewMails} className="mr-2 mb-2">
                Test New Mails
              </Button>
              <Button color="success" size="sm" onClick={testTitleBlink} className="mr-2 mb-2">
                Test Title Blink
              </Button>
              <Button color="primary" size="sm" onClick={testBackendReload} className="mr-2 mb-2">
                Test Backend Reload
              </Button>
              <Button color="secondary" size="sm" onClick={simulateReloadSignal} className="mr-2 mb-2">
                Simulate Reload Signal
              </Button>
              <Button color="light" size="sm" onClick={clearResults} className="mr-2 mb-2">
                Clear Results
              </Button>
            </div>
          </Col>
        </Row>

        <hr />

        <h4>Test Results</h4>
        {testResults.length === 0 ? (
          <Alert color="info">No test results yet. Click the test buttons above.</Alert>
        ) : (
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {testResults.map(result => (
              <Alert key={result.id} color={result.status} className="mb-2">
                <strong>[{result.timestamp}] {result.test}:</strong> {result.result}
              </Alert>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default TestNewFeatures;