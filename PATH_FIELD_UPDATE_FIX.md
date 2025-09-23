# Path Field Update Bug Fix Summary

## Issue
Path field in mail detail popup not updating when files are moved between folders.

## Root Cause
Some move APIs were not updating the `filePath` property in mail data when moving files to new locations.

## Fixed APIs

### ✅ `/api/move-to-review` (Line 1599)
- Already had filePath update: `mailForReview.filePath = reviewFilePath;`

### ✅ `/api/move-back-from-review` (Line 1706) 
- Already had filePath update: `restoredMailData.filePath = restoredFilePath;`

### ✅ `/api/move-selected-to-expired` (Line 1878)
- **FIXED**: Added `filePath: expiredFilePath` to `expiredMailData` object
- Now properly updates path when moving mails to expired status

### ✅ `/api/move-selected-to-review` (Line 2002)
- Already had filePath update: `mailForReview.filePath = reviewFilePath;`

## Additional Fix
- **Removed duplicate** `/api/move-back-from-review` endpoint that was missing filePath update
- This prevents confusion and ensures consistent behavior

## Impact
- All move operations now properly update the filePath field
- Mail detail popups will show correct path after file moves
- Consistent file path tracking across all mail operations

## Test Recommendation
Test by:
1. Opening a mail detail popup and noting the path
2. Moving the mail using "Move to Review", "Move to Expired", etc.
3. Re-opening the mail detail popup
4. Verify the path field shows the new location correctly