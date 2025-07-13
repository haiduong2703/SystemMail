// Hệ thống tự động đọc dữ liệu mail từ file JSON
// Cấu trúc thư mục mới: C:\classifyMail\[DungHan|QuaHan]\[mustRep|chuaRep|daRep]\[Subject].json
// Dữ liệu được load từ API server thay vì đọc trực tiếp file

// Cấu trúc thư mục mới
const FOLDER_STRUCTURE = {
  DungHan: {
    mustRep: [], // Thay thế ChuaTraLoi
    new: null    // File new.json thay thế CheckNewDungHan
  },
  QuaHan: {
    chuaRep: [], // Thay thế ChuaTraLoi
    daRep: []    // Thay thế DaTraLoi
  }
};

// Function để load tất cả mail từ API server
export const loadMailsFromFiles = async () => {
  console.log('🚀 Đang tải dữ liệu mail từ API server...');

  try {
    const response = await fetch('http://localhost:3001/api/mails');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const mails = await response.json();
    console.log(`✅ Đã tải ${mails.length} mail từ C:\\classifyMail\\`);

    return mails;
  } catch (error) {
    console.error('❌ Lỗi khi tải dữ liệu từ API server:', error);
    return [];
  }
};



// Fallback data cho trường hợp không load được file từ C:\classifyMail\
export const mockMails = [
  // Mail đúng hạn - mustRep (chưa trả lời)
  {
    id: 1,
    fileName: "13579.json",
    filePath: "C:\\classifyMail\\DungHan\\mustRep\\13579.json",
    Subject: "test6/12",
    From: "duongg@gmail.com",
    Type: "To",
    Date: ["2025-06-11", "03:41"],
    SummaryContent: "This is a test email with special characters in subject",
    isExpired: false, // DungHan = không hết hạn
    isReplied: false, // mustRep = chưa trả lời
    category: "DungHan",
    status: "mustRep"
  },
  {
    id: 2,
    fileName: "24680.json",
    filePath: "C:\\classifyMail\\DungHan\\mustRep\\24680.json",
    Subject: "Weekly team meeting reminder - Tomorrow 2PM",
    From: "Microsoft Teams",
    Type: "To",
    Date: ["2025-01-20", "14:30"],
    SummaryContent: "Don't forget about our weekly team meeting tomorrow at 2PM in conference room A",
    isExpired: false, // DungHan = không hết hạn
    isReplied: false, // mustRep = chưa trả lời
    category: "DungHan",
    status: "mustRep"
  },
  {
    id: 3,
    fileName: "35791.json",
    filePath: "C:\\classifyMail\\DungHan\\mustRep\\35791.json",
    Subject: "Your Amazon order #123456 has been shipped",
    From: "Amazon",
    Type: "To",
    Date: ["2025-01-19", "09:15"],
    SummaryContent: "Your order containing 1 item has been shipped and will arrive by January 22",
    isExpired: false, // DungHan = không hết hạn
    isReplied: false, // mustRep = chưa trả lời
    category: "DungHan",
    status: "mustRep"
  },
  // Mail quá hạn - chuaRep (chưa trả lời)
  {
    id: 4,
    fileName: "79135.json",
    filePath: "C:\\classifyMail\\QuaHan\\chuaRep\\79135.json",
    Subject: "Budget approval request for Q1 2025",
    From: "Finance Team",
    Type: "To",
    Date: ["2024-11-20", "13:45"],
    SummaryContent: "Please review and approve the budget allocation for Q1 2025 projects",
    isExpired: true, // QuaHan = hết hạn
    isReplied: false, // chuaRep = chưa trả lời
    category: "QuaHan",
    status: "chuaRep"
  },
  {
    id: 5,
    fileName: "80246.json",
    filePath: "C:\\classifyMail\\QuaHan\\chuaRep\\80246.json",
    Subject: "Server migration notice - Action required",
    From: "DevOps Team",
    Type: "CC",
    Date: ["2024-10-15", "08:30"],
    SummaryContent: "Important: All applications need to be migrated to the new server by December 1st",
    isExpired: true, // QuaHan = hết hạn
    isReplied: false, // chuaRep = chưa trả lời
    category: "QuaHan",
    status: "chuaRep"
  },
  // Mail quá hạn - daRep (đã trả lời)
  {
    id: 6,
    fileName: "13579.json",
    filePath: "C:\\classifyMail\\QuaHan\\daRep\\13579.json",
    Subject: "Vacation request approved",
    From: "HR System",
    Type: "To",
    Date: ["2024-10-20", "12:00"],
    SummaryContent: "Your vacation request for December 2024 has been approved",
    isExpired: true, // QuaHan = hết hạn
    isReplied: true, // daRep = đã trả lời
    category: "QuaHan",
    status: "daRep"
  },
  {
    id: 7,
    fileName: "24680.json",
    filePath: "C:\\classifyMail\\QuaHan\\daRep\\24680.json",
    Subject: "Equipment request fulfilled",
    From: "IT Support",
    Type: "To",
    Date: ["2024-09-15", "15:30"],
    SummaryContent: "Your new laptop has been delivered to your desk. Please confirm receipt",
    isExpired: true, // QuaHan = hết hạn
    isReplied: true, // daRep = đã trả lời
    category: "QuaHan",
    status: "daRep"
  }
];

// Utility functions
export const getValidMails = () => {
  return mockMails.filter(mail => !mail.isExpired);
};

export const getExpiredMails = () => {
  return mockMails.filter(mail => mail.isExpired);
};

export const getAllMails = () => {
  return mockMails;
};

// Thống kê
export const getMailStats = () => {
  const total = mockMails.length;
  const valid = getValidMails().length;
  const expired = getExpiredMails().length;

  return {
    total,
    valid,
    expired,
    validPercentage: Math.round((valid / total) * 100),
    expiredPercentage: Math.round((expired / total) * 100)
  };
};

// Thống kê theo loại mail
export const getMailTypeStats = () => {
  const toMails = mockMails.filter(mail => mail.Type === "To").length;
  const ccMails = mockMails.filter(mail => mail.Type === "CC").length;
  const bccMails = mockMails.filter(mail => mail.Type === "BCC").length;

  return {
    to: toMails,
    cc: ccMails,
    bcc: bccMails,
    toPercentage: Math.round((toMails / mockMails.length) * 100),
    ccPercentage: Math.round((ccMails / mockMails.length) * 100),
    bccPercentage: Math.round((bccMails / mockMails.length) * 100)
  };
};

// Thống kê theo người gửi
export const getTopSenders = () => {
  const senderCount = {};
  mockMails.forEach(mail => {
    senderCount[mail.From] = (senderCount[mail.From] || 0) + 1;
  });

  return Object.entries(senderCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([sender, count]) => ({
      sender,
      count,
      percentage: Math.round((count / mockMails.length) * 100)
    }));
};

// Mail mới nhất
export const getRecentMails = (limit = 5) => {
  return mockMails
    .sort((a, b) => {
      const dateA = new Date(a.Date[0] + 'T' + a.Date[1]);
      const dateB = new Date(b.Date[0] + 'T' + b.Date[1]);
      return dateB - dateA;
    })
    .slice(0, limit);
};

// Lọc theo category và status
export const getMailsByCategory = (category) => {
  return mockMails.filter(mail => mail.category === category);
};

export const getMailsByStatus = (status) => {
  return mockMails.filter(mail => mail.status === status);
};

export const getMailsByCategoryAndStatus = (category, status) => {
  return mockMails.filter(mail => mail.category === category && mail.status === status);
};

// Thống kê chi tiết theo category và status (cập nhật cho cấu trúc mới)
export const getDetailedStats = () => {
  const dungHanMustRep = getMailsByCategoryAndStatus("DungHan", "mustRep").length;
  const quaHanChuaRep = getMailsByCategoryAndStatus("QuaHan", "chuaRep").length;
  const quaHanDaRep = getMailsByCategoryAndStatus("QuaHan", "daRep").length;

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

// Format date cho hiển thị
export const formatDate = (dateArray) => {
  // Check if dateArray exists and is an array
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 2) {
    return 'N/A';
  }

  try {
    const [date, time] = dateArray;
    const dateObj = new Date(date + 'T' + time);

    // Check if date is valid
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date';
    }

    return dateObj.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Error';
  }
};

// Kiểm tra mail có hết hạn không (dựa trên ngày hiện tại)
export const checkIfExpired = (dateArray) => {
  // Check if dateArray exists and is an array
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
    return false;
  }

  try {
    const [date] = dateArray;
    const mailDate = new Date(date);
    const currentDate = new Date();

    // Check if date is valid
    if (isNaN(mailDate.getTime())) {
      return false;
    }

    const daysDiff = Math.floor((currentDate - mailDate) / (1000 * 60 * 60 * 24));

    // Mail hết hạn nếu quá 30 ngày
    return daysDiff > 30;
  } catch (error) {
    console.error('Error checking if expired:', error);
    return false;
  }
};

// Utility functions cho date filtering
export const parseMailDate = (dateArray) => {
  // Check if dateArray exists and is an array
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 2) {
    return new Date(); // Return current date as fallback
  }

  try {
    const [date, time] = dateArray;
    const parsedDate = new Date(date + 'T' + time);

    // Check if date is valid
    if (isNaN(parsedDate.getTime())) {
      return new Date(); // Return current date as fallback
    }

    return parsedDate;
  } catch (error) {
    console.error('Error parsing mail date:', error);
    return new Date(); // Return current date as fallback
  }
};

export const isDateInRange = (mailDate, startDate, endDate) => {
  if (!startDate && !endDate) return true;

  const mailDateTime = parseMailDate(mailDate);

  // Handle case where only startDate is provided
  if (startDate && !endDate) {
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    console.log("Date comparison (start only):", {
      mailDateTime,
      start,
      inRange: mailDateTime >= start
    });

    return mailDateTime >= start;
  }

  // Handle case where only endDate is provided
  if (!startDate && endDate) {
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    console.log("Date comparison (end only):", {
      mailDateTime,
      end,
      inRange: mailDateTime <= end
    });

    return mailDateTime <= end;
  }

  // Handle case where both dates are provided
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  console.log("Date comparison (both):", {
    mailDateTime,
    start,
    end,
    inRange: mailDateTime >= start && mailDateTime <= end
  });

  return mailDateTime >= start && mailDateTime <= end;
};

export const filterMailsByDateRange = (mails, startDate, endDate) => {
  if (!startDate && !endDate) return mails;

  console.log("Filtering mails by date range:", { startDate, endDate, totalMails: mails.length });

  const filtered = mails.filter(mail => isDateInRange(mail.Date, startDate, endDate));

  console.log("Filtered result:", { filteredCount: filtered.length });

  return filtered;
};

export const getMailsInDateRange = (mails, days) => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  return filterMailsByDateRange(mails, startDate, endDate);
};

export const getMailsToday = (mails) => {
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return filterMailsByDateRange(mails, startOfDay, endOfDay);
};

export const getMailsThisWeek = (mails) => {
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return filterMailsByDateRange(mails, startOfWeek, endOfDay);
};

export const getMailsThisMonth = (mails) => {
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

  return filterMailsByDateRange(mails, startOfMonth, endOfDay);
};
