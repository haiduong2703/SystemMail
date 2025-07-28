import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Table,
  Badge,
  Alert
} from 'reactstrap';
// import Header from 'components/Headers/Header.js'; // Replaced with CompactHeader
import withAdminAuth from 'components/Auth/withAdminAuth.jsx';
import CompactHeader from "components/Headers/CompactHeader.js";
// CSS for avatar
const avatarStyles = `
  .avatar {
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .avatar-sm {
    width: 2rem;
    height: 2rem;
  }
  .avatar-initial {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-weight: 600;
    font-size: 0.875rem;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = avatarStyles;
  document.head.appendChild(styleSheet);
}

// Member Row Component for editing members inline
const MemberRow = ({ memberEmail, index, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editEmail, setEditEmail] = useState(memberEmail);

  const handleSave = () => {
    if (editEmail && editEmail.includes('@')) {
      onEdit(index, editEmail);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditEmail(memberEmail);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <tr>
        <td colSpan="2">
          <Input
            type="email"
            size="sm"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Enter email address"
          />
        </td>
        <td>
          <Button
            color="success"
            size="sm"
            className="mr-1"
            onClick={handleSave}
            disabled={!editEmail || !editEmail.includes('@')}
          >
            <i className="fas fa-check" />
          </Button>
          <Button
            color="secondary"
            size="sm"
            onClick={handleCancel}
          >
            <i className="fas fa-times" />
          </Button>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td colSpan="2">
        <i className="ni ni-email-83 text-primary mr-2" />
        {memberEmail}
      </td>
      <td>
        <Button
          color="warning"
          size="sm"
          className="mr-1"
          onClick={() => setIsEditing(true)}
        >
          <i className="fas fa-edit" />
        </Button>
        <Button
          color="danger"
          size="sm"
          onClick={() => onDelete(index)}
        >
          <i className="fas fa-trash" />
        </Button>
      </td>
    </tr>
  );
};

const Assignment = () => {
  const [activeTab, setActiveTab] = useState('groups');
  const [groups, setGroups] = useState([]);
  const [pics, setPics] = useState([]);
  const [assignedMails, setAssignedMails] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');



  // Modal states
  const [groupModal, setGroupModal] = useState(false);
  const [picModal, setPicModal] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [editingPic, setEditingPic] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // Form states
  const [groupForm, setGroupForm] = useState({
    name: '',
    description: '',
    members: []
  });

  // Member management states
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [picForm, setPicForm] = useState({
    name: '',
    email: '',
    groups: [],
    isLeader: false
  });

  // User form state
  const [userForm, setUserForm] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    isAdmin: false,
    isActive: true
  });

  // Password visibility state
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    loadGroups();
    loadPics();
    if (activeTab === 'users') {
      loadUsers();
    }
  }, [activeTab]);

  const loadGroups = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/groups');
      const data = await response.json();
      setGroups(data);
    } catch (err) {
      setError('Failed to load groups');
    } finally {
      setLoading(false);
    }
  };

  const loadPics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/pics');
      const data = await response.json();
      setPics(data);
    } catch (err) {
      setError('Failed to load PICs');
    } finally {
      setLoading(false);
    }
  };

  const loadAssignedMails = async (groupId = null, picId = null) => {
    try {
      setLoading(true);
      let url = '/api/assigned-mails';
      const params = new URLSearchParams();

      if (groupId && groupId !== 'all') {
        params.append('groupId', groupId);
      } else if (picId && picId !== 'all') {
        params.append('picId', picId);
      } else {
        params.append('groupId', 'all');
      }

      if (params.toString()) {
        url += '?' + params.toString();
      }

      const response = await fetch(url);
      const data = await response.json();
      setAssignedMails(data);
    } catch (err) {
      setError('Failed to load assigned mails');
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');

      if (response.ok) {
        const data = await response.json();
        // API trả về array users trực tiếp
        setUsers(Array.isArray(data) ? data : []);
        console.log('✅ Users loaded from API:', data.length || 0, 'users');
      } else {
        console.warn('⚠️ API not available, using mock data');
        // Mock data for development when API not available (matching real structure)
        setUsers([
          {
            id: '1752222258248nqljnian7',
            username: 'admin',
            email: 'admin@mailsystem.com',
            fullName: 'System Administrator',
            role: 'admin',
            isAdmin: true, // Mapped from role for frontend
            isActive: true,
            createdAt: '2025-07-11T08:24:18.248Z',
            updatedAt: '2025-07-11T08:24:18.248Z',
            lastLogin: '2025-07-11T10:30:00.000Z'
          },
          {
            id: '1752222258249abcdef123',
            username: 'john.doe',
            email: 'john.doe@mailsystem.com',
            fullName: 'John Doe',
            role: 'user',
            isAdmin: false,
            isActive: true,
            createdAt: '2025-07-10T08:24:18.248Z',
            updatedAt: '2025-07-10T08:24:18.248Z',
            lastLogin: '2025-07-11T09:15:00.000Z'
          },
          {
            id: '1752222258250xyz789456',
            username: 'jane.smith',
            email: 'jane.smith@mailsystem.com',
            fullName: 'Jane Smith',
            role: 'user',
            isAdmin: false,
            isActive: true,
            createdAt: '2025-07-09T08:24:18.248Z',
            updatedAt: '2025-07-09T08:24:18.248Z',
            lastLogin: '2025-07-10T14:20:00.000Z'
          }
        ]);
      }
    } catch (err) {
      console.error('❌ Error loading users:', err);
      setError('Failed to load users');
      // Fallback to minimal mock data (matching real structure)
      setUsers([
        {
          id: '1752222258248nqljnian7',
          username: 'admin',
          email: 'admin@mailsystem.com',
          fullName: 'System Administrator',
          role: 'admin',
          isAdmin: true,
          isActive: true,
          createdAt: '2025-07-11T08:24:18.248Z',
          updatedAt: '2025-07-11T08:24:18.248Z',
          lastLogin: null
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      const url = editingGroup ? `/api/groups/${editingGroup.id}` : '/api/groups';
      const method = editingGroup ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(groupForm)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(editingGroup ? 'Group updated successfully' : 'Group created successfully');
        setGroupModal(false);
        setGroupForm({ name: '', description: '', members: [] });
        setEditingGroup(null);
        loadGroups();
      } else {
        setError(result.error || `Failed to ${editingGroup ? 'update' : 'create'} group`);
      }
    } catch (err) {
      setError(`Failed to ${editingGroup ? 'update' : 'create'} group`);
    }
  };

  const handleCreatePic = async () => {
    try {
      const url = editingPic ? `/api/pics/${editingPic.id}` : '/api/pics';
      const method = editingPic ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(picForm)
      });

      const result = await response.json();
      if (result.success) {
        setSuccess(editingPic ? 'PIC updated successfully' : 'PIC created successfully');
        setPicModal(false);
        setPicForm({ name: '', email: '', groups: [], isLeader: false });
        setEditingPic(null);
        loadPics();
      } else {
        setError(result.error || `Failed to ${editingPic ? 'update' : 'create'} PIC`);
      }
    } catch (err) {
      setError(`Failed to ${editingPic ? 'update' : 'create'} PIC`);
    }
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setGroupForm({
      name: group.name,
      description: group.description || '',
      members: group.members || []
    });
    setGroupModal(true);
  };

  // Member management functions
  const handleAddMember = () => {
    if (newMemberEmail && newMemberEmail.includes('@')) {
      // Check if email already exists
      if (!groupForm.members.includes(newMemberEmail)) {
        const updatedMembers = [...groupForm.members, newMemberEmail];
        setGroupForm({ ...groupForm, members: updatedMembers });
        setNewMemberEmail('');
      } else {
        setError('Email already exists in this group');
      }
    } else {
      setError('Please enter a valid email address');
    }
  };

  const handleEditMember = (index, newEmail) => {
    if (newEmail && newEmail.includes('@')) {
      // Check if email already exists (excluding current index)
      const emailExists = groupForm.members.some((email, i) => i !== index && email === newEmail);
      if (!emailExists) {
        const updatedMembers = [...groupForm.members];
        updatedMembers[index] = newEmail;
        setGroupForm({ ...groupForm, members: updatedMembers });
      } else {
        setError('Email already exists in this group');
      }
    }
  };

  const handleDeleteMember = (index) => {
    const updatedMembers = groupForm.members.filter((_, i) => i !== index);
    setGroupForm({ ...groupForm, members: updatedMembers });
  };

  // User management functions
  const handleCreateUser = async () => {
    try {
      // Validation
      if (!userForm.username || !userForm.email) {
        setError('Username and email are required');
        return;
      }

      // Password validation for new users
      if (!editingUser && !userForm.password) {
        setError('Password is required for new users');
        return;
      }

      // Email validation
      if (!userForm.email.includes('@')) {
        setError('Please enter a valid email address');
        return;
      }

      const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
      const method = editingUser ? 'PUT' : 'POST';

      // Prepare data to send
      const userData = { ...userForm };

      // For edit mode, only include password if it's not empty
      if (editingUser && !userData.password) {
        delete userData.password;
      }

      console.log(`${editingUser ? 'Updating' : 'Creating'} user:`, userData);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ User operation successful:', result);

        setSuccess(editingUser ? 'User updated successfully' : 'User created successfully');
        setUserModal(false);
        setShowPassword(false);
        setUserForm({
          username: '',
          email: '',
          fullName: '',
          password: '',
          isAdmin: false,
          isActive: true
        });
        setEditingUser(null);

        // Reload users to get updated data
        await loadUsers();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ User operation failed:', errorData);
        setError(errorData.error || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }
    } catch (err) {
      console.error('❌ Error in user operation:', err);
      setError(`Failed to ${editingUser ? 'update' : 'create'} user: ${err.message}`);
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      password: '', // Leave empty for edit mode
      isAdmin: user.isAdmin,
      isActive: user.isActive
    });
    setUserModal(true);
  };

  const handleDeleteUser = async (userId) => {
    // Find user to check if it's admin
    const userToDelete = users.find(u => u.id === userId);
    if (!userToDelete) {
      setError('User not found');
      return;
    }

    // Check if this is the last admin
    if (userToDelete.isAdmin) {
      const adminCount = users.filter(u => u.isAdmin).length;
      if (adminCount <= 1) {
        setError('Cannot delete the last admin user');
        return;
      }
    }

    if (window.confirm(`Are you sure you want to delete user "${userToDelete.username}"? This action cannot be undone.`)) {
      try {
        console.log('🗑️ Deleting user:', userId);

        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ User deleted successfully:', result);

          setSuccess('User deleted successfully');
          await loadUsers();

          // Clear success message after 3 seconds
          setTimeout(() => setSuccess(''), 3000);
        } else {
          const errorData = await response.json();
          console.error('❌ Delete user failed:', errorData);
          setError(errorData.error || 'Failed to delete user');
        }
      } catch (err) {
        console.error('❌ Error deleting user:', err);
        setError(`Failed to delete user: ${err.message}`);
      }
    }
  };

  const handleToggleUserAdmin = async (userId, isAdmin) => {
    // Check if removing admin from last admin
    if (isAdmin) {
      const adminCount = users.filter(u => u.isAdmin).length;
      if (adminCount <= 1) {
        setError('Cannot remove admin privileges from the last admin user');
        return;
      }
    }

    try {
      const newAdminStatus = !isAdmin;
      console.log(`🔄 Toggling admin status for user ${userId}: ${isAdmin} -> ${newAdminStatus}`);

      const response = await fetch(`/api/users/${userId}/admin`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin: newAdminStatus })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Admin status updated:', result);

        setSuccess(`User ${newAdminStatus ? 'granted' : 'revoked'} admin privileges`);
        await loadUsers();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Toggle admin failed:', errorData);
        setError(errorData.error || 'Failed to update user privileges');
      }
    } catch (err) {
      console.error('❌ Error toggling admin status:', err);
      setError(`Failed to update user privileges: ${err.message}`);
    }
  };

  const handleToggleUserStatus = async (userId, isActive) => {
    try {
      const newActiveStatus = !isActive;
      console.log(`🔄 Toggling active status for user ${userId}: ${isActive} -> ${newActiveStatus}`);

      const response = await fetch(`/api/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: newActiveStatus })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ User status updated:', result);

        setSuccess(`User ${newActiveStatus ? 'activated' : 'deactivated'} successfully`);
        await loadUsers();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else {
        const errorData = await response.json();
        console.error('❌ Toggle status failed:', errorData);
        setError(errorData.error || 'Failed to update user status');
      }
    } catch (err) {
      console.error('❌ Error toggling user status:', err);
      setError(`Failed to update user status: ${err.message}`);
    }
  };

  const handleEditPic = (pic) => {
    setEditingPic(pic);
    setPicForm({
      name: pic.name,
      email: pic.email,
      groups: pic.groups || [],
      isLeader: pic.isLeader || false
    });
    setPicModal(true);
  };

  const handleDeleteGroup = async (groupId) => {
    if (!window.confirm('Are you sure you want to delete this group?')) {
      return;
    }

    try {
      const response = await fetch(`/api/groups/${groupId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('Group deleted successfully');
        loadGroups();
      } else {
        setError(result.error || 'Failed to delete group');
      }
    } catch (err) {
      setError('Failed to delete group');
    }
  };

  const handleDeletePic = async (picId) => {
    if (!window.confirm('Are you sure you want to delete this PIC?')) {
      return;
    }

    try {
      const response = await fetch(`/api/pics/${picId}`, {
        method: 'DELETE'
      });

      const result = await response.json();
      if (result.success) {
        setSuccess('PIC deleted successfully');
        loadPics();
      } else {
        setError(result.error || 'Failed to delete PIC');
      }
    } catch (err) {
      setError('Failed to delete PIC');
    }
  };



  const renderUsersTab = () => (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">User Management</h3>
          </div>
          <div className="col text-right">
            <Button
              color="primary"
              size="sm"
              onClick={() => setUserModal(true)}
            >
              <i className="fas fa-plus mr-1" />
              Add User
            </Button>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">User Info</th>
              <th scope="col">Email</th>
              <th scope="col">Status</th>
              <th scope="col">Admin</th>
              <th scope="col">Last Login</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <div className="avatar avatar-sm rounded-circle mr-3">
                      <div className="avatar-initial bg-primary text-white">
                        {user.fullName?.charAt(0) || user.username?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div>
                      <div className="font-weight-600 text-sm">
                        {user.fullName || user.username}
                      </div>
                      <div className="text-muted text-xs">
                        @{user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="text-sm">
                    <i className="fas fa-envelope mr-1 text-primary" />
                    {user.email}
                  </div>
                </td>
                <td>
                  <Badge
                    color={user.isActive ? 'success' : 'danger'}
                    pill
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleUserStatus(user.id, user.isActive)}
                  >
                    {user.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </td>
                <td>
                  <Badge
                    color={user.isAdmin ? 'warning' : 'secondary'}
                    pill
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleToggleUserAdmin(user.id, user.isAdmin)}
                  >
                    {user.isAdmin ? 'Admin' : 'User'}
                  </Badge>
                </td>
                <td>
                  <div className="text-sm">
                    {user.lastLogin ?
                      new Date(user.lastLogin).toLocaleDateString() :
                      'Never'
                    }
                  </div>
                  <div className="text-xs text-muted">
                    Joined: {user.createdAt ?
                      new Date(user.createdAt).toLocaleDateString() :
                      'N/A'
                    }
                  </div>
                </td>
                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="mr-1"
                    onClick={() => handleEditUser(user)}
                  >
                    <i className="fas fa-edit" />
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={user.isAdmin && users.filter(u => u.isAdmin).length === 1}
                  >
                    <i className="fas fa-trash" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {users.length === 0 && (
          <div className="text-center py-4">
            <p className="text-muted">No users found</p>
          </div>
        )}

        {users.length > 0 && (
          <div className="mt-3 p-3 bg-light rounded">
            <Row>
              <Col md="3">
                <div className="text-center">
                  <h4 className="text-primary">{users.length}</h4>
                  <p className="text-muted mb-0">Total Users</p>
                </div>
              </Col>
              <Col md="3">
                <div className="text-center">
                  <h4 className="text-warning">
                    {users.filter(u => u.isAdmin).length}
                  </h4>
                  <p className="text-muted mb-0">Administrators</p>
                </div>
              </Col>
              <Col md="3">
                <div className="text-center">
                  <h4 className="text-success">
                    {users.filter(u => u.isActive).length}
                  </h4>
                  <p className="text-muted mb-0">Active Users</p>
                </div>
              </Col>
              <Col md="3">
                <div className="text-center">
                  <h4 className="text-danger">
                    {users.filter(u => !u.isActive).length}
                  </h4>
                  <p className="text-muted mb-0">Inactive Users</p>
                </div>
              </Col>
            </Row>
          </div>
        )}
      </CardBody>
    </Card>
  );

  const renderGroupsTab = () => (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">Groups Management</h3>
          </div>
          <div className="col text-right">
            <Button
              color="primary"
              size="sm"
              onClick={() => setGroupModal(true)}
            >
              Add Group
            </Button>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Group Name</th>
              <th scope="col">Description</th>
              <th scope="col">Members</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(groups) && groups.map((group) => (
              <tr key={group.id}>
                <td>
                  <Badge color="info" pill>
                    {group.name}
                  </Badge>
                </td>
                <td>{group.description}</td>
                <td>
                  <div>
                    
                    {group.members && group.members.length > 0 && (
                      <div className="mt-1">
                        {group.members.slice(0, 3).map((memberEmail, idx) => (
                          <div key={idx} className="text-sm text-muted">
                            <i className="ni ni-email-83 text-primary mr-1" />
                            {memberEmail}
                          </div>
                        ))}
                        {group.members.length > 3 && (
                          <small className="text-muted">
                            +{group.members.length - 3} more...
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {new Date(group.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditGroup(group)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeleteGroup(group.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );

  const renderPicsTab = () => (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Row className="align-items-center">
          <div className="col">
            <h3 className="mb-0">PIC Management</h3>
          </div>
          <div className="col text-right">
            <Button
              color="primary"
              size="sm"
              onClick={() => setPicModal(true)}
            >
              Add PIC
            </Button>
          </div>
        </Row>
      </CardHeader>
      <CardBody>
        <Table className="align-items-center table-flush" responsive>
          <thead className="thead-light">
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Groups</th>
              <th scope="col">Created</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(pics) && pics.map((pic) => (
              <tr key={pic.id}>
                <td>{pic.name}</td>
                <td>{pic.email}</td>
                <td>
                  <Badge color={pic.isLeader ? "success" : "info"}>
                    {pic.isLeader ? "Leader" : "Member"}
                  </Badge>
                </td>
                <td>
                  <div>
                    {/* <Badge color="secondary" className="mb-1">
                      {pic.groups?.length || 0} groups
                    </Badge> */}
                    {pic.groups && pic.groups.length > 0 && (
                      <div className="mt-1">
                        {pic.groups.slice(0, 2).map((groupId) => {
                          const group = groups.find(g => g.id === groupId);
                          return group ? (
                            <div key={groupId} className="text-sm">
                              <Badge color="info" className="mr-1 mb-1" style={{ fontSize: '0.7rem' }}>
                                {group.name}
                              </Badge>
                            </div>
                          ) : null;
                        })}
                        {pic.groups.length > 2 && (
                          <small className="text-muted">
                            +{pic.groups.length - 2} more...
                          </small>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  {new Date(pic.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <Button
                    color="warning"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleEditPic(pic)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    onClick={() => handleDeletePic(pic.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );



  return (
    <>
      <CompactHeader
        title="USER MANAGEMENT"
        subtitle="Manage user accounts and permissions"
        icon="ni ni-single-02"
      />
      <Container className="mt--5 compact-layout" fluid>
        {error && (
          <Alert color="danger" toggle={() => setError('')}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert color="success" toggle={() => setSuccess('')}>
            {success}
          </Alert>
        )}
        
        <Row>
          <Col className="mb-5 mb-xl-0" xl="12">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center mb-3">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-badge text-warning mr-2" />
                      Assignment Management
                    </h3>
                    <p className="text-muted mb-0">Manage groups, PICs, and mail assignments</p>
                  </div>
                </Row>
                <Nav tabs>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'groups' ? 'active' : ''}
                      onClick={() => setActiveTab('groups')}
                      style={{ cursor: 'pointer' }}
                    >
                      Groups
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'pics' ? 'active' : ''}
                      onClick={() => setActiveTab('pics')}
                      style={{ cursor: 'pointer' }}
                    >
                      PIC
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={activeTab === 'users' ? 'active' : ''}
                      onClick={() => setActiveTab('users')}
                      style={{ cursor: 'pointer' }}
                    >
                      <i className="fas fa-users mr-1" />
                      Users
                    </NavLink>
                  </NavItem>
                </Nav>
              </CardHeader>
            </Card>
          </Col>
        </Row>

        <Row className="mt-3">
          <Col xl="12">
            <TabContent activeTab={activeTab}>
              <TabPane tabId="groups">
                {renderGroupsTab()}
              </TabPane>
              <TabPane tabId="pics">
                {renderPicsTab()}
              </TabPane>
              <TabPane tabId="users">
                {renderUsersTab()}
              </TabPane>
            </TabContent>
          </Col>
        </Row>

        {/* Group Modal */}
        <Modal isOpen={groupModal} size="lg" toggle={() => {
          setGroupModal(!groupModal);
          if (!groupModal) {
            setEditingGroup(null);
            setGroupForm({ name: '', description: '', members: [] });
            setNewMemberEmail('');
          }
        }}>
          <ModalHeader toggle={() => {
            setGroupModal(!groupModal);
            setEditingGroup(null);
            setGroupForm({ name: '', description: '', members: [] });
            setNewMemberEmail('');
          }}>
            {editingGroup ? 'Edit Group' : 'Create New Group'}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="groupName">Group Name</Label>
                <Input
                  type="text"
                  id="groupName"
                  value={groupForm.name}
                  onChange={(e) => setGroupForm({...groupForm, name: e.target.value})}
                  placeholder="Enter group name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="groupDescription">Description</Label>
                <Input
                  type="textarea"
                  id="groupDescription"
                  value={groupForm.description}
                  onChange={(e) => setGroupForm({...groupForm, description: e.target.value})}
                  placeholder="Enter group description"
                />
              </FormGroup>

              {/* Members Management Section */}
              <hr />
              <h5 className="mb-3">
                <i className="ni ni-single-02 text-primary mr-2" />
                Group Members ({groupForm.members.length})
              </h5>

              {/* Add New Member Form */}
              <Card className="bg-light mb-3">
                <CardBody className="py-3">
                  <h6 className="mb-2">Add New Member</h6>
                  <Row>
                    <Col md="10">
                      <FormGroup className="mb-2">
                        <Input
                          type="email"
                          placeholder="Enter member email address"
                          value={newMemberEmail}
                          onChange={(e) => setNewMemberEmail(e.target.value)}
                        />
                      </FormGroup>
                    </Col>
                    <Col md="2">
                      <Button
                        color="success"
                        size="sm"
                        onClick={handleAddMember}
                        disabled={!newMemberEmail || !newMemberEmail.includes('@')}
                        block
                      >
                        <i className="fas fa-plus mr-1" />
                        Add
                      </Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Current Members List */}
              {groupForm.members.length > 0 && (
                <div className="mb-3">
                  <h6 className="mb-2">Current Members</h6>
                  <Table size="sm" responsive>
                    <thead>
                      <tr>
                        <th colSpan="2">Email Address</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupForm.members.map((memberEmail, index) => (
                        <MemberRow
                          key={index}
                          memberEmail={memberEmail}
                          index={index}
                          onEdit={handleEditMember}
                          onDelete={handleDeleteMember}
                        />
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}

              {groupForm.members.length === 0 && (
                <div className="text-center py-3 text-muted">
                  <i className="ni ni-fat-add text-muted" style={{ fontSize: '2rem' }} />
                  <p className="mb-0 mt-2">No members added yet</p>
                  <small>Use the form above to add members to this group</small>
                </div>
              )}
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleCreateGroup}>
              {editingGroup ? 'Update Group' : 'Create Group'}
            </Button>
            <Button color="secondary" onClick={() => {
              setGroupModal(false);
              setEditingGroup(null);
              setGroupForm({ name: '', description: '', members: [] });
              setNewMemberEmail('');
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* PIC Modal */}
        <Modal isOpen={picModal} size="lg" toggle={() => {
          setPicModal(!picModal);
          if (!picModal) {
            setEditingPic(null);
            setPicForm({ name: '', email: '', groups: [], isLeader: false });
          }
        }}>
          <ModalHeader toggle={() => {
            setPicModal(!picModal);
            setEditingPic(null);
            setPicForm({ name: '', email: '', groups: [], isLeader: false });
          }}>
            {editingPic ? 'Edit PIC' : 'Create New PIC'}
          </ModalHeader>
          <ModalBody>
            <Form>
              <FormGroup>
                <Label for="picName">Name</Label>
                <Input
                  type="text"
                  id="picName"
                  value={picForm.name}
                  onChange={(e) => setPicForm({...picForm, name: e.target.value})}
                  placeholder="Enter PIC name"
                />
              </FormGroup>
              <FormGroup>
                <Label for="picEmail">Email</Label>
                <Input
                  type="email"
                  id="picEmail"
                  value={picForm.email}
                  onChange={(e) => setPicForm({...picForm, email: e.target.value})}
                  placeholder="Enter email address"
                />
              </FormGroup>

              {/* Groups Selection */}
              <FormGroup>
                <Label for="picGroups">Assign to Groups</Label>
                <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  {Array.isArray(groups) && groups.length > 0 ? (
                    groups.map((group) => (
                      <FormGroup check key={group.id} className="mb-2">
                        <Label check className="d-flex align-items-center">
                          <Input
                            type="checkbox"
                            checked={picForm.groups.includes(group.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setPicForm({
                                  ...picForm,
                                  groups: [...picForm.groups, group.id]
                                });
                              } else {
                                setPicForm({
                                  ...picForm,
                                  groups: picForm.groups.filter(id => id !== group.id)
                                });
                              }
                            }}
                            className="mr-2"
                          />
                          <div>
                            <Badge color="info" className="mr-2">{group.name}</Badge>
                            <small className="text-muted">{group.description}</small>
                            <div className="text-xs text-muted mt-1">
                              {group.members?.length || 0} members
                            </div>
                          </div>
                        </Label>
                      </FormGroup>
                    ))
                  ) : (
                    <div className="text-center text-muted py-3">
                      <i className="ni ni-fat-add text-muted" style={{ fontSize: '1.5rem' }} />
                      <p className="mb-0 mt-2">No groups available</p>
                      <small>Create groups first to assign PIC to them</small>
                    </div>
                  )}
                </div>
                {picForm.groups.length > 0 && (
                  <div className="mt-2">
                    <small className="text-success">
                      <i className="fas fa-check mr-1" />
                      Selected {picForm.groups.length} group(s)
                    </small>
                  </div>
                )}
              </FormGroup>

              <FormGroup check>
                <Label check>
                  <Input
                    type="checkbox"
                    checked={picForm.isLeader}
                    onChange={(e) => setPicForm({...picForm, isLeader: e.target.checked})}
                  />
                  Is Leader
                </Label>
              </FormGroup>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleCreatePic}>
              {editingPic ? 'Update PIC' : 'Create PIC'}
            </Button>
            <Button color="secondary" onClick={() => {
              setPicModal(false);
              setEditingPic(null);
              setPicForm({ name: '', email: '', groups: [], isLeader: false });
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>

        {/* User Modal */}
        <Modal isOpen={userModal} size="lg" toggle={() => {
          setUserModal(!userModal);
          if (!userModal) {
            setEditingUser(null);
            setShowPassword(false);
            setUserForm({
              username: '',
              email: '',
              fullName: '',
              password: '',
              isAdmin: false,
              isActive: true
            });
          }
        }}>
          <ModalHeader toggle={() => setUserModal(false)}>
            {editingUser ? 'Edit User' : 'Add New User'}
          </ModalHeader>
          <ModalBody>
            <Form>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="username">Username *</Label>
                    <Input
                      type="text"
                      id="username"
                      value={userForm.username}
                      onChange={(e) => setUserForm({...userForm, username: e.target.value})}
                      placeholder="Enter username"
                      required
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="email">Email *</Label>
                    <Input
                      type="email"
                      id="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                      placeholder="Enter email address"
                      required
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col md="6">
                  <FormGroup>
                    <Label for="fullName">Full Name</Label>
                    <Input
                      type="text"
                      id="fullName"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </FormGroup>
                </Col>
                <Col md="6">
                  <FormGroup>
                    <Label for="password">Password {editingUser ? '(leave blank to keep current)' : '*'}</Label>
                    <div className="input-group">
                      <Input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={userForm.password}
                        onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                        placeholder={editingUser ? "Enter new password" : "Enter password"}
                        required={!editingUser}
                        className="form-control"
                      />
                      <div className="input-group-append">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            border: '1px solid #cad1d7',
                            borderLeft: 'none',
                            backgroundColor: '#f8f9fa',
                            color: '#6c757d'
                          }}
                        >
                          <i className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}></i>
                        </button>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row style={{marginLeft:"10px"}}>
                <Col md="12">
                  <FormGroup>
                    <div className="mt-2">
                      <Label check className="mr-4">
                        <Input
                          type="checkbox"
                          checked={userForm.isActive}
                          onChange={(e) => setUserForm({...userForm, isActive: e.target.checked})}
                        />
                        <span className="ml-2">Active User</span>
                      </Label>
                      
                    </div>
                    <div className="mt-2">
                      <Label check>
                        <Input
                          type="checkbox"
                          checked={userForm.isAdmin}
                          onChange={(e) => setUserForm({...userForm, isAdmin: e.target.checked})}
                        />
                        <span className="ml-2">Administrator</span>
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleCreateUser}>
              {editingUser ? 'Update User' : 'Create User'}
            </Button>
            <Button color="secondary" onClick={() => {
              setUserModal(false);
              setEditingUser(null);
              setShowPassword(false);
              setUserForm({
                username: '',
                email: '',
                fullName: '',
                password: '',
                isAdmin: false,
                isActive: true
              });
            }}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default withAdminAuth(Assignment, {
  title: "Assignment Management Access",
  description: "This section allows you to manage groups, PICs, and mail assignments. Admin privileges are required.",
  allowRequestAccess: true,
  showLoginButton: true
});
