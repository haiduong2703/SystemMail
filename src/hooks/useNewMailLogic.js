import { useState, useEffect } from 'react';
import { useMailContext } from '../contexts/MailContext.js';

// Hook để xử lý logic NEW mail theo yêu cầu mới
export const useNewMailLogic = () => {
  const { mails } = useMailContext();
  const [isBlinking, setIsBlinking] = useState(false);
  const [showNewBadge, setShowNewBadge] = useState(false);

  useEffect(() => {
    // Chỉ đếm DungHan/mustRep chưa đọc là NEW
    // Bỏ QuaHan khỏi logic NEW
    const dungHanMustRepCount = mails.filter(mail =>
      mail.category === "DungHan" &&
      mail.status === "mustRep" &&
      !mail.isRead
    ).length;

    const totalNewMails = dungHanMustRepCount; // Chỉ DungHan

    // Logic NEW badge:
    // - Hiển thị NEW khi có mail trong DungHan/mustRep HOẶC QuaHan/chuaRep
    // - Blink title khi có NEW mail
    const hasNewMails = totalNewMails > 0;
    
    setShowNewBadge(hasNewMails);
    setIsBlinking(hasNewMails);

    // Cập nhật title với blink effect
    if (hasNewMails) {
      document.title = `(${totalNewMails}) NEW MAIL - Mail System`;
      
      // Blink effect cho title
      const blinkInterval = setInterval(() => {
        document.title = document.title.startsWith('★') 
          ? `(${totalNewMails}) NEW MAIL - Mail System`
          : `★ (${totalNewMails}) NEW MAIL - Mail System`;
      }, 1000);

      return () => clearInterval(blinkInterval);
    } else {
      // Không có mail mới, dừng blink
      document.title = 'Mail System';
    }

  }, [mails]);

  return {
    showNewBadge,
    isBlinking,
    newMailCounts: {
      dungHanMustRep: mails.filter(mail =>
        mail.category === "DungHan" && mail.status === "mustRep" && !mail.isRead
      ).length,
      quaHanChuaRep: 0, // Không tính QuaHan là NEW nữa
      total: mails.filter(mail =>
        mail.category === "DungHan" && mail.status === "mustRep" && !mail.isRead
      ).length
    }
  };
};

// Hook để xử lý notification counts cho sidebar
export const useNewMailNotifications = () => {
  const { mails } = useMailContext();

  const dungHanCount = mails.filter(mail =>
    mail.category === "DungHan" && mail.status === "mustRep" && !mail.isRead
  ).length;

  const quaHanCount = 0; // Không tính QuaHan là NEW nữa

  return {
    dungHanCount,
    quaHanCount,
    showDungHanBadge: dungHanCount > 0,
    showQuaHanBadge: quaHanCount > 0,
    totalNewCount: dungHanCount + quaHanCount
  };
};
