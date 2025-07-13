import React, { createContext, useContext, useState, useEffect } from 'react';
import { defaultGroups, findGroupByEmail, getGroupDisplayName, getGroupColor, getPICForEmail } from 'utils/groupUtils.js';

const GroupContext = createContext();

export const useGroupContext = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroupContext must be used within a GroupProvider');
  }
  return context;
};

export const GroupProvider = ({ children }) => {
  const [groups, setGroups] = useState(defaultGroups);

  // Load groups from API and localStorage on mount
  useEffect(() => {
    const loadGroups = async () => {
      try {
        // Try to load from API first
        const response = await fetch('/api/groups');
        if (response.ok) {
          const apiGroups = await response.json();
          if (apiGroups && apiGroups.length > 0) {
            console.log('Loaded groups from API:', apiGroups);
            setGroups(apiGroups);
            // Save to localStorage as backup
            localStorage.setItem('emailGroups', JSON.stringify(apiGroups));
            return;
          }
        }
      } catch (error) {
        console.error('Error loading groups from API:', error);
      }

      // Fallback to localStorage
      const savedGroups = localStorage.getItem('emailGroups');
      if (savedGroups) {
        try {
          const parsedGroups = JSON.parse(savedGroups);
          console.log('Loaded groups from localStorage:', parsedGroups);
          setGroups(parsedGroups);
        } catch (error) {
          console.error('Error loading groups from localStorage:', error);
          setGroups(defaultGroups);
        }
      } else {
        // Use default groups as last resort
        setGroups(defaultGroups);
      }
    };

    loadGroups();
  }, []);

  // Save groups to localStorage whenever groups change
  useEffect(() => {
    if (groups.length > 0) {
      localStorage.setItem('emailGroups', JSON.stringify(groups));
    }
  }, [groups]);

  // Refresh groups from API
  const refreshGroups = async () => {
    try {
      const response = await fetch('/api/groups');
      if (response.ok) {
        const apiGroups = await response.json();
        console.log('Refreshed groups from API:', apiGroups);
        setGroups(apiGroups);
        localStorage.setItem('emailGroups', JSON.stringify(apiGroups));
        return apiGroups;
      }
    } catch (error) {
      console.error('Error refreshing groups from API:', error);
    }
    return groups;
  };

  // Add new group
  const addGroup = (groupData) => {
    const newGroup = {
      ...groupData,
      id: Math.max(...groups.map(g => g.id), 0) + 1,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setGroups([...groups, newGroup]);
    return newGroup;
  };

  // Update existing group
  const updateGroup = (groupId, groupData) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...groupData, id: groupId }
        : group
    ));
  };

  // Delete group
  const deleteGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  // Find group by email
  const getGroupByEmail = (email) => {
    return findGroupByEmail(email, groups);
  };

  // Get display name for email (group name or email)
  const getDisplayName = (email) => {
    return getGroupDisplayName(email, groups);
  };

  // Get color for email
  const getEmailColor = (email) => {
    return getGroupColor(email, groups);
  };

  // Get PIC for email
  const getPIC = (email) => {
    return getPICForEmail(email, groups);
  };

  // Check if email is in any group
  const isEmailInGroup = (email) => {
    return getGroupByEmail(email) !== null;
  };

  // Get formatted group info for mail display
  const getGroupInfo = (email) => {
    const group = getGroupByEmail(email);
    
    if (!group) {
      return {
        displayName: email,
        isGroup: false,
        color: 'secondary',
        pic: null,
        originalEmail: email
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
      groupId: group.id,
      groupDescription: group.description
    };
  };

  // Get all groups
  const getAllGroups = () => {
    return groups;
  };

  // Get group by ID
  const getGroupById = (groupId) => {
    return groups.find(group => group.id === groupId);
  };

  // Get groups statistics
  const getGroupStats = () => {
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

  // Reset groups to default
  const resetGroups = () => {
    setGroups(defaultGroups);
  };

  // Import groups
  const importGroups = (newGroups) => {
    setGroups(newGroups);
  };

  // Export groups
  const exportGroups = () => {
    return JSON.stringify(groups, null, 2);
  };

  const value = {
    // State
    groups,
    
    // Actions
    addGroup,
    updateGroup,
    deleteGroup,
    resetGroups,
    importGroups,
    exportGroups,
    refreshGroups,
    
    // Getters
    getGroupByEmail,
    getDisplayName,
    getEmailColor,
    getPIC,
    isEmailInGroup,
    getGroupInfo,
    getAllGroups,
    getGroupById,
    getGroupStats
  };

  return (
    <GroupContext.Provider value={value}>
      {children}
    </GroupContext.Provider>
  );
};

export default GroupContext;
