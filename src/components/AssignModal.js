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
  Alert,
  Badge,
  Card,
  CardBody
} from 'reactstrap';
import { useGroupContext } from 'contexts/GroupContext.js';

const AssignModal = ({ isOpen, toggle, mailData, onAssignSuccess }) => {
  const [groups, setGroups] = useState([]);
  const [pics, setPics] = useState([]);
  const [selectedPicId, setSelectedPicId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Use GroupContext to get sender's group info
  const { getGroupInfo } = useGroupContext();

  // Get sender's group information
  const senderGroupInfo = mailData ? getGroupInfo(mailData.From) : null;
  const senderGroupId = senderGroupInfo?.groupId;

  // Filter PICs based on sender's group - only show PICs from sender's group
  const getFilteredPics = () => {
    if (!senderGroupId) {
      return []; // Show no PICs if sender is not in any group
    }

    // Only show PICs that belong to the sender's group
    return pics.filter(pic =>
      pic.groups && pic.groups.includes(senderGroupId)
    );
  };

  const filteredPics = getFilteredPics();

  useEffect(() => {
    if (isOpen) {
      loadGroups();
      loadPics();
    }
  }, [isOpen]);

  const loadGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
    }
  };

  const loadPics = async () => {
    try {
      const response = await fetch('/api/pics');
      const data = await response.json();
      setPics(data);
    } catch (err) {
      setError('Failed to load PICs');
    }
  };

  const handleAssign = async () => {
    if (!selectedPicId) {
      setError('Please select a PIC');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/assign-mail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mailId: mailData.id,
          groupId: null,
          picId: selectedPicId,
          assignmentType: 'pic'
        })
      });

      const result = await response.json();
      if (result.success) {
        onAssignSuccess && onAssignSuccess(result.mail);
        handleClose();
      } else {
        setError(result.error || 'Failed to assign mail');
      }
    } catch (err) {
      setError('Failed to assign mail');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedPicId('');
    setError('');
    toggle();
  };

  const getSelectedAssignee = () => {
    if (selectedPicId) {
      const pic = pics.find(p => p.id === selectedPicId);
      return pic ? `PIC: ${pic.name}` : '';
    }
    return '';
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <ModalHeader toggle={handleClose}>
        Assign Mail
      </ModalHeader>
      <ModalBody>
        {error && (
          <Alert color="danger" toggle={() => setError('')}>
            {error}
          </Alert>
        )}

        {mailData && (
          <div className="mb-4">
            <h5>Mail Details:</h5>
            <div className="border p-3 rounded">
              <p><strong>Subject:</strong> {mailData.Subject || 'No Subject'}</p>
              <p><strong>From:</strong>
                <span className="ml-2">
                  {mailData.From}
                  {senderGroupInfo?.isGroup && (
                    <Badge color={senderGroupInfo.color} className="ml-2">
                      Group: {senderGroupInfo.displayName}
                    </Badge>
                  )}
                </span>
              </p>
              <p><strong>Date:</strong> {new Date(mailData.Date).toLocaleString()}</p>
              {mailData.assignedTo && (
                <div>
                  <strong>Currently Assigned To:</strong>
                  <Badge color="info" className="ml-2">
                    {mailData.assignedTo.type === 'group' ?
                      `Group: ${groups.find(g => g.id === mailData.assignedTo.groupId)?.name || 'Unknown'}` :
                      `PIC: ${pics.find(p => p.id === mailData.assignedTo.picId)?.name || 'Unknown'}`
                    }
                  </Badge>
                </div>
              )}
            </div>

            {/* Smart Assignment Info */}
            {senderGroupInfo?.isGroup && (
              <Card className="bg-light mt-3">
                <CardBody className="py-3">
                  <div className="d-flex align-items-center">
                    <i className="ni ni-bulb-61 text-warning mr-2"></i>
                    <div>
                      <strong className="text-primary">Group Assignment:</strong>
                      <p className="mb-0 text-sm text-muted">
                        This email is from <strong>{senderGroupInfo.displayName}</strong> group.
                        {filteredPics.length > 0 ? (
                          <span> Showing {filteredPics.length} PIC(s) from this group.</span>
                        ) : (
                          <span> No PICs found in this group. Please add PICs to this group first.</span>
                        )}
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}

            {/* No Group Warning */}
            {!senderGroupInfo?.isGroup && (
              <Card className="bg-warning mt-3">
                <CardBody className="py-3">
                  <div className="d-flex align-items-center">
                    <i className="ni ni-fat-remove text-white mr-2"></i>
                    <div>
                      <strong className="text-white">No Group Found:</strong>
                      <p className="mb-0 text-sm text-white">
                        This email sender is not assigned to any group. Please add the sender to a group first to enable assignment.
                      </p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            )}
          </div>
        )}

        <Form>
          {/* Only show PIC selection if sender is in a group and has PICs */}
          {senderGroupInfo?.isGroup && filteredPics.length > 0 ? (
            <FormGroup>
              <Label>
                Select PIC
                {senderGroupInfo?.isGroup && filteredPics.length > 0 && (
                  <Badge color="success" className="ml-2" style={{ fontSize: '0.7rem' }}>
                    {filteredPics.length} from {senderGroupInfo.displayName}
                  </Badge>
                )}
              </Label>
              <Input
                type="select"
                value={selectedPicId}
                onChange={(e) => setSelectedPicId(e.target.value)}
              >
                <option value="">-- Select PIC --</option>

                {/* Show only PICs from sender's group */}
                {filteredPics.map(pic => (
                  <option key={pic.id} value={pic.id}>
                    {pic.name} ({pic.email}) {pic.isLeader ? '- Leader' : ''}
                  </option>
                ))}
              </Input>

              {/* Show additional info for selected PIC */}
              {selectedPicId && (
                <div className="mt-2">
                  {(() => {
                    const selectedPic = pics.find(p => p.id === selectedPicId);
                    if (!selectedPic) return null;

                    const isFromSenderGroup = selectedPic.groups?.includes(senderGroupId);

                    return (
                      <div className="text-sm">
                        <Badge
                          color={isFromSenderGroup ? "success" : "secondary"}
                          className="mr-2"
                        >
                          {isFromSenderGroup ? "✅ Same Group" : "📋 Different Group"}
                        </Badge>
                        {selectedPic.groups && selectedPic.groups.length > 0 && (
                          <span className="text-muted">
                            Groups: {selectedPic.groups.map(groupId => {
                              const group = groups.find(g => g.id === groupId);
                              return group?.name;
                            }).filter(Boolean).join(', ')}
                          </span>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </FormGroup>
          ) : (
            /* Show message when no PICs available or sender not in group */
            <div className="text-center py-4">
              <i className="ni ni-fat-remove text-muted" style={{ fontSize: '2rem' }}></i>
              <h5 className="text-muted mt-3">Cannot Assign</h5>
              <p className="text-muted">
                {!senderGroupInfo?.isGroup ? (
                  <>This email sender is not assigned to any group.<br />Please add the sender to a group first.</>
                ) : (
                  <>No PICs found in the <strong>{senderGroupInfo.displayName}</strong> group.<br />Please add PICs to this group first.</>
                )}
              </p>
            </div>
          )}

          {getSelectedAssignee() && (
            <div className="mt-3">
              <strong>Will be assigned to:</strong>
              <Badge color="success" className="ml-2">
                {getSelectedAssignee()}
              </Badge>
            </div>
          )}
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={handleAssign}
          disabled={loading || !selectedPicId || filteredPics.length === 0}
        >
          {loading ? 'Assigning...' : 'Assign to PIC'}
        </Button>
        <Button color="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AssignModal;
