import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Table,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import Header from 'components/Headers/Header.js';

const GroupManagement = () => {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'Group 1',
      description: 'Marketing Team',
      members: ['a@gmail.com', 'b@gmail.com', 'marketing@company.com'],
      pic: 'John Doe',
      picEmail: 'john.doe@company.com',
      color: 'primary',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Group 2', 
      description: 'Sales Team',
      members: ['sales@company.com', 'c@gmail.com', 'd@gmail.com'],
      pic: 'Jane Smith',
      picEmail: 'jane.smith@company.com',
      color: 'success',
      createdAt: '2024-01-20'
    }
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    members: '',
    pic: '',
    picEmail: '',
    color: 'primary'
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  const colors = [
    { value: 'primary', label: 'Blue', color: '#007bff' },
    { value: 'success', label: 'Green', color: '#28a745' },
    { value: 'warning', label: 'Yellow', color: '#ffc107' },
    { value: 'danger', label: 'Red', color: '#dc3545' },
    { value: 'info', label: 'Cyan', color: '#17a2b8' },
    { value: 'secondary', label: 'Gray', color: '#6c757d' }
  ];

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (!modalOpen) {
      setEditingGroup(null);
      setFormData({
        name: '',
        description: '',
        members: '',
        pic: '',
        picEmail: '',
        color: 'primary'
      });
    }
  };

  const handleEdit = (group) => {
    setEditingGroup(group);
    setFormData({
      name: group.name,
      description: group.description,
      members: group.members.join(', '),
      pic: group.pic,
      picEmail: group.picEmail,
      color: group.color
    });
    setModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.members.trim() || !formData.pic.trim()) {
      showAlert('Please fill in all required fields', 'danger');
      return;
    }

    // Parse members
    const members = formData.members.split(',').map(email => email.trim()).filter(email => email);
    
    if (members.length === 0) {
      showAlert('Please add at least one member email', 'danger');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const invalidEmails = members.filter(email => !emailRegex.test(email));
    if (invalidEmails.length > 0) {
      showAlert(`Invalid email format: ${invalidEmails.join(', ')}`, 'danger');
      return;
    }

    const groupData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      members: members,
      pic: formData.pic.trim(),
      picEmail: formData.picEmail.trim(),
      color: formData.color,
      createdAt: editingGroup ? editingGroup.createdAt : new Date().toISOString().split('T')[0]
    };

    if (editingGroup) {
      // Update existing group
      setGroups(groups.map(group => 
        group.id === editingGroup.id 
          ? { ...groupData, id: editingGroup.id }
          : group
      ));
      showAlert('Group updated successfully!', 'success');
    } else {
      // Add new group
      const newGroup = {
        ...groupData,
        id: Math.max(...groups.map(g => g.id), 0) + 1
      };
      setGroups([...groups, newGroup]);
      showAlert('Group created successfully!', 'success');
    }

    toggleModal();
  };

  const handleDelete = (groupId) => {
    if (window.confirm('Are you sure you want to delete this group?')) {
      setGroups(groups.filter(group => group.id !== groupId));
      showAlert('Group deleted successfully!', 'success');
    }
  };

  const showAlert = (message, type) => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  // Function to find group by email
  const findGroupByEmail = (email) => {
    return groups.find(group => 
      group.members.some(member => member.toLowerCase() === email.toLowerCase())
    );
  };

  return (
    <>
      <Header />
      <Container className="mt-4" fluid>
        {alert.show && (
          <Alert color={alert.type} className="mb-4">
            {alert.message}
          </Alert>
        )}

        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-collection text-primary mr-2" />
                      Group Management
                    </h3>
                    <p className="text-muted mb-0">
                      Manage email groups and assign PIC (Person In Charge) for each group
                    </p>
                  </div>
                  <div className="col text-right">
                    <Button color="primary" size="sm" onClick={toggleModal}>
                      <i className="ni ni-fat-add mr-1" />
                      Add New Group
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="table-responsive">
                  <Table className="align-items-center table-flush" responsive>
                    <thead className="thead-light">
                      <tr>
                        <th scope="col">Group</th>
                        <th scope="col">Description</th>
                        <th scope="col">Members</th>
                        <th scope="col">PIC</th>
                        <th scope="col">Created</th>
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groups.map((group) => (
                        <tr key={group.id}>
                          <td>
                            <Badge color={group.color} className="mr-2">
                              {group.name}
                            </Badge>
                          </td>
                          <td>{group.description}</td>
                          <td>
                            <div className="d-flex flex-wrap">
                              {group.members.map((member, index) => (
                                <Badge 
                                  key={index}
                                  color="light" 
                                  className="mr-1 mb-1"
                                  style={{ fontSize: '10px' }}
                                >
                                  {member}
                                </Badge>
                              ))}
                            </div>
                            <small className="text-muted">
                              {group.members.length} member(s)
                            </small>
                          </td>
                          <td>
                            <div>
                              <strong>{group.pic}</strong>
                              <br />
                              <small className="text-muted">{group.picEmail}</small>
                            </div>
                          </td>
                          <td>
                            <small>{group.createdAt}</small>
                          </td>
                          <td>
                            <UncontrolledDropdown>
                              <DropdownToggle
                                className="btn-icon-only text-light"
                                href="#pablo"
                                role="button"
                                size="sm"
                                color=""
                                onClick={(e) => e.preventDefault()}
                              >
                                <i className="fas fa-ellipsis-v" />
                              </DropdownToggle>
                              <DropdownMenu className="dropdown-menu-arrow" right>
                                <DropdownItem onClick={() => handleEdit(group)}>
                                  <i className="ni ni-settings mr-2" />
                                  Edit
                                </DropdownItem>
                                <DropdownItem 
                                  onClick={() => handleDelete(group.id)}
                                  className="text-danger"
                                >
                                  <i className="ni ni-fat-remove mr-2" />
                                  Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledDropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>

                {groups.length === 0 && (
                  <div className="text-center py-4">
                    <i className="ni ni-collection" style={{ fontSize: '3rem', color: '#dee2e6' }} />
                    <h4 className="text-muted mt-3">No groups found</h4>
                    <p className="text-muted">Create your first email group to get started</p>
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Add/Edit Group Modal */}
        <Modal isOpen={modalOpen} toggle={toggleModal} size="lg">
          <ModalHeader toggle={toggleModal}>
            {editingGroup ? 'Edit Group' : 'Add New Group'}
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="groupName">Group Name *</Label>
                    <Input
                      type="text"
                      id="groupName"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g., Marketing Team"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="groupColor">Group Color</Label>
                    <Input
                      type="select"
                      id="groupColor"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                    >
                      {colors.map(color => (
                        <option key={color.value} value={color.value}>
                          {color.label}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label for="groupDescription">Description</Label>
                <Input
                  type="textarea"
                  id="groupDescription"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this group"
                  rows="2"
                />
              </FormGroup>

              <FormGroup>
                <Label for="groupMembers">Member Emails *</Label>
                <Input
                  type="textarea"
                  id="groupMembers"
                  value={formData.members}
                  onChange={(e) => setFormData({...formData, members: e.target.value})}
                  placeholder="Enter email addresses separated by commas&#10;e.g., a@gmail.com, b@gmail.com, marketing@company.com"
                  rows="3"
                  required
                />
                <small className="text-muted">
                  Enter multiple email addresses separated by commas
                </small>
              </FormGroup>

              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="picName">PIC Name *</Label>
                    <Input
                      type="text"
                      id="picName"
                      value={formData.pic}
                      onChange={(e) => setFormData({...formData, pic: e.target.value})}
                      placeholder="Person In Charge name"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="picEmail">PIC Email</Label>
                    <Input
                      type="email"
                      id="picEmail"
                      value={formData.picEmail}
                      onChange={(e) => setFormData({...formData, picEmail: e.target.value})}
                      placeholder="PIC email address"
                    />
                  </FormGroup>
                </Col>
              </Row>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                {editingGroup ? 'Update Group' : 'Create Group'}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default GroupManagement;
