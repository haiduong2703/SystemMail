# Move to Review Bug Fix Summary

## Problem Description
**Bug**: Ở tab Valid Mails và Expired Mails, khi click "Move to Review", mail chuyển xuống Review nhưng không được gắn tag "PROCESSED".

**Expected Behavior**: Mail phải được gắn tag "PROCESSED" khi move to Review vì đây là case không cần trả lời.

## Root Cause Analysis
- API `/api/move-to-review` và `/api/move-selected-to-review` đã chuyển mail từ folder gốc sang `ReviewMail` folder
- Nhưng không có logic set `isReplied: true` để đánh dấu mail đã được xử lý
- Frontend `MailTable` component có sẵn logic hiển thị "Processed" badge khi `mail.isReplied === true`

## Solution Implemented

### 1. Backend Changes (server.js)

#### Single Mail Move (`/api/move-to-review`):
```javascript
// BEFORE:
const reviewMailData = {
  ...mailData,
  category: "ReviewMail",
  dateMoved: [dateStr, timeStr],
  originalCategory: mailData.originalCategory || mailData.category || "Unknown",
  originalStatus: mailData.originalStatus || mailData.status || "Unknown",
};

// AFTER:
const reviewMailData = {
  ...mailData,
  category: "ReviewMail", 
  dateMoved: [dateStr, timeStr],
  originalCategory: mailData.originalCategory || mailData.category || "Unknown",
  originalStatus: mailData.originalStatus || mailData.status || "Unknown",
  isReplied: true, // ✅ Auto-mark as processed when moved to review
  processedDate: now.toISOString(), // ✅ Add timestamp when processed
};
```

#### Multiple Mails Move (`/api/move-selected-to-review`):
```javascript
// BEFORE:
const reviewMailData = {
  ...mailData,
  category: "ReviewMail",
  dateMoved: [dateStr, timeStr],
  originalCategory: mailData.category || "Unknown", 
  originalStatus: mailData.status || "Unknown",
};

// AFTER:
const reviewMailData = {
  ...mailData,
  category: "ReviewMail",
  dateMoved: [dateStr, timeStr],
  originalCategory: mailData.category || "Unknown",
  originalStatus: mailData.status || "Unknown", 
  isReplied: true, // ✅ Auto-mark as processed when moved to review
  processedDate: now.toISOString(), // ✅ Add timestamp when processed
};
```

### 2. Frontend Logic (Already Implemented)
The frontend `MailTable` component already has proper logic to display "PROCESSED" tag:

```javascript
// In MailTable.js - renderStatus function
if (mailType === "review") {
  return (
    <Badge
      color={mail.isReplied ? "success" : "info"}
      pill
      style={{ cursor: onStatusClick ? "pointer" : "default" }}
      onClick={() => onStatusClick && onStatusClick(mail)}
    >
      {mail.isReplied ? "Processed" : "Under Review"} // ✅ Shows "Processed" when isReplied=true
    </Badge>
  );
}
```

## Files Modified:
- `d:\CodeThue\SystemMail\mail-server\server.js` (2 locations)
  - Line ~1635: `/api/move-to-review` endpoint
  - Line ~2143: `/api/move-selected-to-review` endpoint

## New Data Fields Added:
- `isReplied: true` - Marks mail as processed/replied
- `processedDate: ISO timestamp` - Records when mail was processed

## Test File Created:
- `d:\CodeThue\SystemMail\test-move-to-review-fix.html` - For testing the fix

## Impact:
✅ **Fixed**: Mails moved from Valid/Expired to Review now properly show "PROCESSED" tag
✅ **Consistent**: Both single and batch move operations work the same way
✅ **User-Friendly**: Clear visual indication that mails don't need replies
✅ **Filterable**: Processed mails can be filtered separately in Review tab

## Status: ✅ RESOLVED
The bug has been fixed. Mails moved to Review section now automatically receive the "PROCESSED" tag as expected.