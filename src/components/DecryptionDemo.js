import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  FormGroup,
  Label,
  Alert,
  Spinner,
  Row,
  Col,
  Badge
} from 'reactstrap';
import useDecryption from '../hooks/useDecryption';

const DecryptionDemo = () => {
  const [encryptedInput, setEncryptedInput] = useState('jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=');
  const [decryptedResult, setDecryptedResult] = useState('');
  const [testResult, setTestResult] = useState('');
  
  const {
    decryptText,
    decryptMail,
    testDecryption,
    isDecrypting,
    decryptionError,
    clearError
  } = useDecryption();

  // Sample mail data for testing
  const sampleMailData = {
    "Subject": "Equipment request fulfilled",
    "From": "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=",
    "Type": "To",
    "Date": ["2024-09-15", "15:30"],
    "SummaryContent": "Your new laptop has been delivered to your desk. Please confirm receipt",
    "id": "24680"
  };

  const handleDecryptText = async () => {
    clearError();
    const result = await decryptText(encryptedInput);
    setDecryptedResult(result);
  };

  const handleDecryptMail = async () => {
    clearError();
    const result = await decryptMail(sampleMailData);
    setDecryptedResult(JSON.stringify(result, null, 2));
  };

  const handleTestDecryption = async () => {
    clearError();
    const result = await testDecryption();
    setTestResult(result || 'Test failed');
  };

  const handleClearResults = () => {
    setDecryptedResult('');
    setTestResult('');
    clearError();
  };

  return (
    <div className="container-fluid mt-4">
      <Row>
        <Col lg="12">
          <Card className="shadow">
            <CardHeader className="bg-gradient-primary">
              <h3 className="text-white mb-0">
                🔓 Mail Decryption Demo
              </h3>
              <p className="text-white-50 mb-0">
                Test the mail decryption functionality with AES-256-CBC
              </p>
            </CardHeader>
            <CardBody>
              {decryptionError && (
                <Alert color="danger" className="mb-4">
                  <strong>Decryption Error:</strong> {decryptionError}
                </Alert>
              )}

              {/* Test Section */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <Badge color="info" className="mr-2">1</Badge>
                  Test Decryption Service
                </h5>
                <Button
                  color="info"
                  onClick={handleTestDecryption}
                  disabled={isDecrypting}
                  className="mb-3"
                >
                  {isDecrypting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Testing...
                    </>
                  ) : (
                    'Run Decryption Test'
                  )}
                </Button>
                
                {testResult && (
                  <Alert color="success">
                    <strong>Test Result:</strong> {testResult}
                  </Alert>
                )}
              </div>

              <hr />

              {/* Single Text Decryption */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <Badge color="warning" className="mr-2">2</Badge>
                  Decrypt Single Text
                </h5>
                <FormGroup>
                  <Label for="encryptedInput">Encrypted Text (Base64):</Label>
                  <Input
                    type="textarea"
                    id="encryptedInput"
                    value={encryptedInput}
                    onChange={(e) => setEncryptedInput(e.target.value)}
                    placeholder="Enter encrypted text here..."
                    rows="3"
                  />
                </FormGroup>
                <Button
                  color="warning"
                  onClick={handleDecryptText}
                  disabled={isDecrypting || !encryptedInput.trim()}
                  className="mb-3"
                >
                  {isDecrypting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Decrypting...
                    </>
                  ) : (
                    'Decrypt Text'
                  )}
                </Button>
              </div>

              <hr />

              {/* Mail Object Decryption */}
              <div className="mb-4">
                <h5 className="mb-3">
                  <Badge color="success" className="mr-2">3</Badge>
                  Decrypt Mail Object
                </h5>
                <p className="text-muted mb-3">
                  Test with the sample mail data from your file:
                </p>
                <pre className="bg-light p-3 rounded mb-3">
                  <code>{JSON.stringify(sampleMailData, null, 2)}</code>
                </pre>
                <Button
                  color="success"
                  onClick={handleDecryptMail}
                  disabled={isDecrypting}
                  className="mb-3"
                >
                  {isDecrypting ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Decrypting Mail...
                    </>
                  ) : (
                    'Decrypt Mail Object'
                  )}
                </Button>
              </div>

              <hr />

              {/* Results Section */}
              {decryptedResult && (
                <div className="mb-4">
                  <h5 className="mb-3">
                    <Badge color="primary" className="mr-2">📋</Badge>
                    Decryption Result
                  </h5>
                  <pre className="bg-dark text-light p-3 rounded">
                    <code>{decryptedResult}</code>
                  </pre>
                </div>
              )}

              {/* Action Buttons */}
              <div className="text-center">
                <Button
                  color="secondary"
                  outline
                  onClick={handleClearResults}
                  className="mr-2"
                >
                  Clear Results
                </Button>
                <Button
                  color="primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </Button>
              </div>

              {/* Instructions */}
              <div className="mt-5 p-4 bg-light rounded">
                <h6 className="text-primary mb-3">📝 Instructions:</h6>
                <ol className="mb-0">
                  <li className="mb-2">
                    <strong>Test Service:</strong> Click "Run Decryption Test" to verify the backend service is working
                  </li>
                  <li className="mb-2">
                    <strong>Decrypt Text:</strong> Enter any encrypted Base64 text and click "Decrypt Text"
                  </li>
                  <li className="mb-2">
                    <strong>Decrypt Mail:</strong> Click "Decrypt Mail Object" to decrypt the sample mail data
                  </li>
                  <li>
                    <strong>Integration:</strong> Use the <code>useDecryption</code> hook in your mail components
                  </li>
                </ol>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DecryptionDemo;
