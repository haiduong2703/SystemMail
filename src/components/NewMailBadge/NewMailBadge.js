import React from 'react';
import { Badge } from 'reactstrap';
import { useNewMailLogic } from '../../hooks/useNewMailLogic.js';
import './NewMailBadge.css';

const NewMailBadge = ({ 
  className = "",
  size = "sm",
  showCount = false,
  position = "top-right" 
}) => {
  const { showNewBadge, newMailCounts } = useNewMailLogic();

  if (!showNewBadge) {
    return null;
  }

  return (
    <Badge 
      color="danger" 
      pill 
      className={`new-mail-badge ${className} position-${position} blink-animation`}
      style={{
        fontSize: size === 'sm' ? '0.75rem' : '0.875rem',
        animation: 'blink 1s infinite'
      }}
    >
      {showCount ? newMailCounts.total : 'NEW'}
    </Badge>
  );
};

export default NewMailBadge;
