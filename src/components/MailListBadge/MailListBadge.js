import React from 'react';
import { Badge } from 'reactstrap';

// Component để hiển thị NEW badge trong danh sách mail
const MailListBadge = ({ mail, className = "" }) => {
  // Chỉ hiển thị NEW cho DungHan/mustRep chưa đọc
  const shouldShowNew = mail && 
    mail.category === "DungHan" && 
    mail.status === "mustRep" && 
    !mail.isRead;

  if (!shouldShowNew) {
    return null;
  }

  return (
    <Badge 
      color="danger" 
      pill 
      className={`ml-2 ${className}`}
      style={{
        fontSize: '0.7rem',
        animation: 'pulse 2s infinite'
      }}
    >
      NEW
    </Badge>
  );
};

export default MailListBadge;
