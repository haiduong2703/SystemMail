// Group management utilities

// Default groups data
export const defaultGroups = [
  {
    id: 1,
    name: 'Marketing Team',
    description: 'Marketing and Communications',
    members: ['marketing@company.com', 'a@gmail.com', 'b@gmail.com'],
    pic: 'John Doe',
    picEmail: 'john.doe@company.com',
    color: 'primary',
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    name: 'Sales Team',
    description: 'Sales and Business Development',
    members: ['sales@company.com', 'c@gmail.com', 'd@gmail.com'],
    pic: 'Jane Smith',
    picEmail: 'jane.smith@company.com',
    color: 'success',
    createdAt: '2024-01-20'
  },
  {
    id: 3,
    name: 'Support Team',
    description: 'Customer Support',
    members: ['support@company.com', 'help@company.com'],
    pic: 'Mike Johnson',
    picEmail: 'mike.johnson@company.com',
    color: 'info',
    createdAt: '2024-01-25'
  }
];

// Find group by email address
export const findGroupByEmail = (email, groups = defaultGroups) => {
  if (!email) return null;
  
  return groups.find(group => 
    group.members.some(member => 
      member.toLowerCase().trim() === email.toLowerCase().trim()
    )
  );
};

// Get group display name for email
export const getGroupDisplayName = (email, groups = defaultGroups) => {
  const group = findGroupByEmail(email, groups);
  return group ? group.name : email;
};

// Get group color for email
export const getGroupColor = (email, groups = defaultGroups) => {
  const group = findGroupByEmail(email, groups);
  return group ? group.color : 'secondary';
};

// Get PIC for email
export const getPICForEmail = (email, groups = defaultGroups) => {
  const group = findGroupByEmail(email, groups);
  return group ? {
    name: group.pic,
    email: group.picEmail
  } : null;
};

// Get all members of a group
export const getGroupMembers = (groupId, groups = defaultGroups) => {
  const group = groups.find(g => g.id === groupId);
  return group ? group.members : [];
};

// Check if email belongs to any group
export const isEmailInGroup = (email, groups = defaultGroups) => {
  return findGroupByEmail(email, groups) !== null;
};

// Get group statistics
export const getGroupStats = (groups = defaultGroups) => {
  return {
    totalGroups: groups.length,
    totalMembers: groups.reduce((sum, group) => sum + group.members.length, 0),
    totalPICs: groups.filter(group => group.pic).length,
    groupsByColor: groups.reduce((acc, group) => {
      acc[group.color] = (acc[group.color] || 0) + 1;
      return acc;
    }, {})
  };
};

// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Parse member emails from string
export const parseMemberEmails = (emailString) => {
  if (!emailString) return [];
  
  return emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email && isValidEmail(email));
};

// Check for duplicate members across groups
export const findDuplicateMembers = (groups = defaultGroups) => {
  const allMembers = [];
  const duplicates = [];
  
  groups.forEach(group => {
    group.members.forEach(member => {
      const lowerMember = member.toLowerCase();
      if (allMembers.includes(lowerMember)) {
        if (!duplicates.includes(lowerMember)) {
          duplicates.push(lowerMember);
        }
      } else {
        allMembers.push(lowerMember);
      }
    });
  });
  
  return duplicates;
};

// Get groups that contain a specific member
export const getGroupsForMember = (email, groups = defaultGroups) => {
  return groups.filter(group =>
    group.members.some(member =>
      member.toLowerCase().trim() === email.toLowerCase().trim()
    )
  );
};

// Format group for display in mail list
export const formatGroupForMail = (email, groups = defaultGroups) => {
  const group = findGroupByEmail(email, groups);
  
  if (!group) {
    return {
      displayName: email,
      isGroup: false,
      color: 'secondary',
      pic: null
    };
  }
  
  return {
    displayName: group.name,
    isGroup: true,
    color: group.color,
    pic: {
      name: group.pic,
      email: group.picEmail
    },
    originalEmail: email,
    groupId: group.id
  };
};

// Export groups to JSON
export const exportGroups = (groups = defaultGroups) => {
  return JSON.stringify(groups, null, 2);
};

// Import groups from JSON
export const importGroups = (jsonString) => {
  try {
    const groups = JSON.parse(jsonString);
    
    // Validate structure
    if (!Array.isArray(groups)) {
      throw new Error('Invalid format: expected array');
    }
    
    groups.forEach((group, index) => {
      if (!group.id || !group.name || !Array.isArray(group.members)) {
        throw new Error(`Invalid group at index ${index}`);
      }
    });
    
    return groups;
  } catch (error) {
    throw new Error(`Import failed: ${error.message}`);
  }
};
