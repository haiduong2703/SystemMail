import React, { createContext, useContext, useState } from 'react';
import { useMailData } from '../hooks/useMailData';
import { useRealtimeMailServer } from 'hooks/useRealtimeMailServer.js';
import { formatDate } from 'utils/mailUtils';
import BlinkingTitleController from 'components/BlinkingTitleController/BlinkingTitleController';

// Tạo Mail Context
const MailContext = createContext();

// Provider component
export const MailProvider = ({ children }) => {
  const { mails, loading, error, totalFiles } = useMailData();
  const { mailStats, reloadStatus, markMailsAsRead } = useRealtimeMailServer();
  const [selectedMail, setSelectedMail] = useState(null);

  const handleSelectMail = (mail) => {
    setSelectedMail(mail);
  };

  // Function to refresh mail data
  const refreshMails = () => {
    // Trigger reload by dispatching custom event
    window.dispatchEvent(new CustomEvent('mailDataReload', {
      detail: { manual: true }
    }));
  };

  const value = {
    // From useMailData
    mails,
    loading,
    error,
    totalFiles,

    // From useRealtimeMailServer
    mailStats,
    reloadStatus,
    markMailsAsRead,

    // Local state
    selectedMail,
    handleSelectMail,

    // Functions
    refreshMails,

    // Utilities
    formatDate,
  };

  return (
    <MailContext.Provider value={value}>
      <BlinkingTitleController />
      {children}
    </MailContext.Provider>
  );
};

// Hook để sử dụng Mail Context
export const useMailContext = () => {
  const context = useContext(MailContext);
  if (!context) {
    throw new Error('useMailContext must be used within a MailProvider');
  }
  return context;
};

// Custom hook to get only valid (dung han) mails - exclude review mails
export const useValidMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail => !mail.isExpired && mail.category !== "ReviewMail");
};

// Custom hook to get only expired (qua han) mails - TẤT CẢ
export const useExpiredMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.isExpired);
};

// Custom hook to get expired mails - CHƯA TRẢ LỜI (QuaHan/chuaRep)
export const useExpiredUnrepliedMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail =>
    mail.category === "QuaHan" &&
    mail.status === "chuaRep"
  );
};

// Custom hook to get expired mails - ĐÃ TRẢ LỜI (QuaHan/daRep)
export const useExpiredRepliedMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail =>
    mail.category === "QuaHan" &&
    mail.status === "daRep"
  );
};

// Custom hook to get review mails (ReviewMail)
export const useReviewMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.category === "ReviewMail");
};

// Helper function to check if mail is expired (over 24 hours) - same logic as ValidMails
const isMailExpiredClientSide = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
    return false;
  }

  try {
    const [date, time] = dateArray;
    let mailDate;

    if (time) {
      mailDate = new Date(`${date}T${time}`);
    } else {
      mailDate = new Date(date);
    }

    if (isNaN(mailDate.getTime())) {
      return false;
    }

    const currentDate = new Date();
    const hoursDiff = (currentDate - mailDate) / (1000 * 60 * 60);

    return hoursDiff > 24;
  } catch (error) {
    console.error('Error checking mail expiry:', error);
    return false;
  }
};

export const useMailStats = () => {
  const { mails } = useMailContext();

  const total = mails.length;

  // Use EXACT same logic as individual hooks for consistency
  // ValidMails logic: !isExpired && category !== "ReviewMail"
  const validMails = mails.filter(mail => !mail.isExpired && mail.category !== "ReviewMail");

  // ExpiredMails logic: isExpired (server-side only, no client-side check)
  const expiredMails = mails.filter(mail => mail.isExpired);

  // ReviewMails logic: category === "ReviewMail"
  const reviewMails = mails.filter(mail => mail.category === "ReviewMail");

  const valid = validMails.length;
  const expired = expiredMails.length;
  const reviewMailCount = reviewMails.length;

  // Valid mails breakdown (using filtered validMails)
  const validReplied = validMails.filter(mail => mail.isReplied).length;
  const validUnreplied = validMails.filter(mail => !mail.isReplied).length;

  // Expired mails breakdown (using filtered expiredMails)
  const expiredReplied = expiredMails.filter(mail => mail.isReplied).length;
  const expiredUnreplied = expiredMails.filter(mail => !mail.isReplied).length;

  // Debug logging
  console.log('📊 Mail Stats Debug (Fixed Logic):', {
    total,
    valid,
    expired,
    reviewMailCount,
    validReplied,
    validUnreplied,
    expiredReplied,
    expiredUnreplied,
    breakdown: {
      validMails: `${valid} (not expired + not review)`,
      expiredMails: `${expired} (server isExpired only)`,
      reviewMails: `${reviewMailCount} (category = ReviewMail)`,
      totalCheck: `${valid + expired + reviewMailCount} should equal or be close to ${total}`
    },
    sampleValidMails: validMails.slice(0, 2).map(m => ({
      subject: m.Subject?.substring(0, 30),
      isExpired: m.isExpired,
      isReplied: m.isReplied,
      category: m.category,
      date: m.Date
    })),
    sampleExpiredMails: expiredMails.slice(0, 2).map(m => ({
      subject: m.Subject?.substring(0, 30),
      isExpired: m.isExpired,
      isReplied: m.isReplied,
      category: m.category,
      date: m.Date
    })),
    sampleReviewMails: reviewMails.slice(0, 2).map(m => ({
      subject: m.Subject?.substring(0, 30),
      isExpired: m.isExpired,
      isReplied: m.isReplied,
      category: m.category,
      date: m.Date
    }))
  });

  return {
    total,
    valid,
    expired,
    validReplied,
    validUnreplied,
    expiredReplied,
    expiredUnreplied,
    reviewMailCount,
    validPercentage: total > 0 ? Math.round((valid / total) * 100) : 0,
    expiredPercentage: total > 0 ? Math.round((expired / total) * 100) : 0
  };
};

export const useMailTypeStats = () => {
  const { mails } = useMailContext();

  const toMails = mails.filter(mail => mail.Type === "To").length;
  const ccMails = mails.filter(mail => mail.Type === "CC").length;
  const bccMails = mails.filter(mail => mail.Type === "BCC").length;
  const total = mails.length;

  return {
    to: toMails,
    cc: ccMails,
    bcc: bccMails,
    toPercentage: total > 0 ? Math.round((toMails / total) * 100) : 0,
    ccPercentage: total > 0 ? Math.round((ccMails / total) * 100) : 0,
    bccPercentage: total > 0 ? Math.round((bccMails / total) * 100) : 0
  };
};

export const useTopSenders = () => {
  const { mails } = useMailContext();

  const senderCount = {};
  mails.forEach(mail => {
    senderCount[mail.From] = (senderCount[mail.From] || 0) + 1;
  });

  return Object.entries(senderCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([sender, count]) => ({
      sender,
      count,
      percentage: mails.length > 0 ? Math.round((count / mails.length) * 100) : 0
    }));
};

export const useRecentMails = (limit = 5) => {
  const { mails } = useMailContext();

  return mails
    .sort((a, b) => {
      const dateA = new Date(a.Date[0] + 'T' + a.Date[1]);
      const dateB = new Date(b.Date[0] + 'T' + b.Date[1]);
      return dateB - dateA;
    })
    .slice(0, limit);
};

export const useMailsByCategory = (category) => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.category === category);
};

export const useMailsByStatus = (status) => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.status === status);
};

export const useMailsByCategoryAndStatus = (category, status) => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.category === category && mail.status === status);
};

export const useDetailedStats = () => {
  const { mails } = useMailContext();

  const dungHanMustRep = mails.filter(mail => mail.category === "DungHan" && mail.status === "mustRep").length;
  const quaHanChuaRep = mails.filter(mail => mail.category === "QuaHan" && mail.status === "chuaRep").length;
  const quaHanDaRep = mails.filter(mail => mail.category === "QuaHan" && mail.status === "daRep").length;

  return {
    dungHanMustRep,
    quaHanChuaRep,
    quaHanDaRep,
    totalDungHan: dungHanMustRep,
    totalQuaHan: quaHanChuaRep + quaHanDaRep,
    totalChuaTraLoi: dungHanMustRep + quaHanChuaRep,
    totalDaTraLoi: quaHanDaRep
  };
};

// Hook để lấy số lượng notification cho từng trang (cập nhật cho logic NEW mới)
export const useNotificationCounts = () => {
  const { mails } = useMailContext();

  // Logic mới: NEW badge dựa vào việc có mail trong folder hay không
  const dungHanUnreplied = mails.filter(mail =>
    mail.category === "DungHan" &&
    mail.status === "mustRep"
  ).length;

  const quaHanUnreplied = mails.filter(mail =>
    mail.category === "QuaHan" &&
    mail.status === "chuaRep"
  ).length;

  // NEW logic: Hiển thị badge khi có mail trong các folder này
  const hasNewMails = dungHanUnreplied > 0 || quaHanUnreplied > 0;

  return {
    dungHanCount: dungHanUnreplied,
    quaHanCount: quaHanUnreplied,
    showDungHanBadge: dungHanUnreplied > 0,
    showQuaHanBadge: quaHanUnreplied > 0,
    hasNewMails,
    totalNewCount: dungHanUnreplied + quaHanUnreplied
  };
};

// Hook để lấy reload status (cập nhật cho file new.json)
export const useReloadStatus = () => {
  const { mails } = useMailContext();

  // Tìm file new.json để lấy reload status
  const reloadStatusFile = mails.find(mail =>
    mail.fileName === "new.json" &&
    mail.category === "DungHan"
  );

  return {
    shouldReload: reloadStatusFile?.ReloadStatus || false,
    reloadData: reloadStatusFile
  };
};

// Hook để lấy xếp hạng PIC theo số lượng mail quá hạn chưa trả lời
export const usePICOverdueRanking = () => {
  const { mails } = useMailContext();

  // Lọc mail quá hạn chưa trả lời và có assign PIC
  const overdueUnrepliedMails = mails.filter(mail =>
    (mail.isExpired || isMailExpiredClientSide(mail.Date)) &&
    !mail.isReplied &&
    mail.assignedTo?.type === 'pic' &&
    mail.assignedTo?.picName
  );

  // Đếm số mail theo từng PIC
  const picCounts = {};
  overdueUnrepliedMails.forEach(mail => {
    const picName = mail.assignedTo.picName;
    const picEmail = mail.assignedTo.picEmail || '';
    const picId = mail.assignedTo.picId || '';

    if (!picCounts[picName]) {
      picCounts[picName] = {
        name: picName,
        email: picEmail,
        id: picId,
        count: 0,
        mails: []
      };
    }
    picCounts[picName].count++;
    picCounts[picName].mails.push(mail);
  });

  // Chuyển thành array và sắp xếp theo số lượng mail giảm dần
  const ranking = Object.values(picCounts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5); // Top 5 PICs

  // Tính tổng số mail quá hạn chưa trả lời
  const totalOverdueUnreplied = overdueUnrepliedMails.length;

  // PIC có nhiều mail quá hạn nhất
  const topPIC = ranking.length > 0 ? ranking[0] : null;

  return {
    ranking,
    totalOverdueUnreplied,
    topPIC,
    overdueUnrepliedMails
  };
};

// Hook để lấy mail với status "New"
export const useNewMails = () => {
  const { mails } = useMailContext();

  return mails.filter(mail =>
    mail.category === "DungHan" &&
    mail.Status === "New"
  );
};
