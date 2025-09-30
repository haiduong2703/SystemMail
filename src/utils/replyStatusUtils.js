// Helper function to determine reply status from folder structure
// This replaces the isReplied field with folder-based logic

export const getReplyStatusFromMail = (mail) => {
  // For ReviewMail - ALWAYS determine from folder path, never use isReplied field
  if (mail.category === "ReviewMail") {
    if (mail.filePath) {
      return mail.filePath.includes("/processed/") || mail.filePath.includes("\\processed\\");
    }
    // Fallback to status field only if filePath not available
    return mail.status === "processed";
  }
  
  // For other categories, use explicit isReplied field if it matches folder structure
  if (mail.category === "DungHan") {
    // For DungHan, check folder path first, then status field
    if (mail.filePath) {
      return mail.filePath.includes("/rep/") || mail.filePath.includes("\\rep\\");
    }
    return mail.status === "rep"; // DungHan/rep = replied, DungHan/mustRep = not replied
  } else if (mail.category === "QuaHan") {
    // For QuaHan, check folder path first, then status field  
    if (mail.filePath) {
      return mail.filePath.includes("/daRep/") || mail.filePath.includes("\\daRep\\");
    }
    return mail.status === "daRep"; // QuaHan/daRep = replied, QuaHan/chuaRep = not replied
  }
  
  // For other categories, use isReplied field if available
  if (mail.isReplied !== undefined) {
    return mail.isReplied;
  }
  
  // Analyze filePath as final fallback
  if (mail.filePath) {
    return mail.filePath.includes("/rep/") || 
           mail.filePath.includes("\\rep\\") || 
           mail.filePath.includes("/daRep/") || 
           mail.filePath.includes("\\daRep\\") ||
           mail.filePath.includes("/processed/") || 
           mail.filePath.includes("\\processed\\");
  }
  
  return false; // Default to not replied
};

// Helper function to get folder status from reply status
export const getFolderStatusFromReply = (category, isReplied) => {
  if (category === "DungHan") {
    return isReplied ? "rep" : "mustRep";
  } else if (category === "QuaHan") {
    return isReplied ? "daRep" : "chuaRep";
  }
  return "mustRep"; // Default fallback
};

// Helper to determine if mail should be considered "replied" for filtering
export const isMailReplied = (mail) => {
  return getReplyStatusFromMail(mail);
};

// Helper to get ReviewMail status from folder path
export const getReviewMailStatus = (mail) => {
  if (mail.category !== "ReviewMail") {
    return null;
  }
  
  if (mail.filePath) {
    if (mail.filePath.includes("/processed/") || mail.filePath.includes("\\processed\\")) {
      return "processed";
    } else if (mail.filePath.includes("/pending/") || mail.filePath.includes("\\pending\\")) {
      return "pending";
    }
  }
  
  // Fallback to status field if available
  return mail.status || "pending";
};