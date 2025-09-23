// Helper function to determine reply status from folder structure
// This replaces the isReplied field with folder-based logic

export const getReplyStatusFromMail = (mail) => {
  // If mail has explicit isReplied field that matches folder structure, use it
  if (mail.isReplied !== undefined) {
    return mail.isReplied;
  }
  
  // Determine from category and status
  if (mail.category === "DungHan") {
    return mail.status === "rep"; // DungHan/rep = replied, DungHan/mustRep = not replied
  } else if (mail.category === "QuaHan") {
    return mail.status === "daRep"; // QuaHan/daRep = replied, QuaHan/chuaRep = not replied
  } else if (mail.category === "ReviewMail") {
    // For review mails, use the isReplied field or determine from originalCategory
    if (mail.isReplied !== undefined) {
      return mail.isReplied;
    }
    // Fallback to original category status
    const originalCategory = mail.originalCategory || "DungHan";
    const originalStatus = mail.originalStatus || "mustRep";
    if (originalCategory === "DungHan") {
      return originalStatus === "rep";
    } else if (originalCategory === "QuaHan") {
      return originalStatus === "daRep";
    }
  }
  
  // Analyze filePath as fallback
  if (mail.filePath) {
    return mail.filePath.includes("/rep/") || 
           mail.filePath.includes("\\rep\\") || 
           mail.filePath.includes("/daRep/") || 
           mail.filePath.includes("\\daRep\\");
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