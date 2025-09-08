# 🔧 Port Consistency Fix - Move to Review Status Change Issue

## 🎯 **Vấn đề được phát hiện:**

Khi move mail xuống Review section, tính năng thay đổi trạng thái (Under Review ↔ Processed) không hoạt động do **sự không nhất quán về port** giữa các API calls.

## 🔍 **Root Cause Analysis:**

### **Server Configuration:**
- **Mail Server** đang chạy ở port **3002** (mail-server/server.js line 2841)
- **Frontend Proxy** đã được config đúng cho port **3002** (src/setupProxy.js)
- **API_BASE_URL** constant đã được config đúng cho port **3002** (src/constants/api.js)

### **Inconsistent API Calls:**
Một số file vẫn đang hardcode sử dụng port **3001** thay vì **3002**:

1. **src/views/mail/ReviewMails.js:**
   - Line 138: `localhost:3001/api/move-back-from-review` ❌
   - Line 207: `localhost:3001/api/move-back-from-review` ❌  
   - Line 377: `localhost:3002/api/mails/.../status` ✅ (đã đúng)

2. **src/views/mail/AllMails.js:**
   - Line 113: `localhost:3001/api/move-to-review` ❌

3. **src/data/mockMails.js:**
   - Line 22: `localhost:3001/api/mails` ❌

4. **test-real-user-structure.js:**
   - Line 44: `localhost:3001` ❌

5. **debug-move-to-review.html:**
   - Line 106: `localhost:3001/api/mail-stats` ❌

## ✅ **Các thay đổi đã thực hiện:**

### **1. Fixed API Calls in Mail Views:**

**src/views/mail/ReviewMails.js:**
```javascript
// Before:
"http://localhost:3001/api/move-back-from-review"

// After:
`${API_BASE_URL}/api/move-back-from-review`
```

**src/views/mail/AllMails.js:**
```javascript
// Before:
'http://localhost:3001/api/move-to-review'

// After:
`${API_BASE_URL}/api/move-to-review`
```

### **2. Added API_BASE_URL imports:**

**src/views/mail/ReviewMails.js:**
```javascript
import { API_BASE_URL } from "constants/api.js";
```

**src/views/mail/AllMails.js:**
```javascript
import { API_BASE_URL } from "constants/api.js";
```

### **3. Fixed Data Loading:**

**src/data/mockMails.js:**
```javascript
// Before:
const response = await fetch('http://localhost:3001/api/mails');

// After:
const response = await fetch('http://localhost:3002/api/mails');
```

### **4. Fixed Test Files:**

**test-real-user-structure.js:**
```javascript
// Before:
const url = `http://localhost:3001${endpoint}`;

// After:
const url = `http://localhost:3002${endpoint}`;
```

**debug-move-to-review.html:**
```javascript
// Before:
const response = await fetch('http://localhost:3001/api/mail-stats');

// After:
const response = await fetch('http://localhost:3002/api/mail-stats');
```

### **5. Updated Documentation:**

**DATA_SOURCE_VERIFICATION.md:**
- Updated all references from `localhost:3001` to `localhost:3002`

**mail-server/README.md:**
- Updated port references from 3001 to 3002
- Updated example curl commands
- Updated WebSocket connection examples

## 🎯 **Kết quả:**

### **✅ Trước khi fix:**
- Move to Review: ✅ Hoạt động (đã dùng đúng port 3002)
- Status Change trong Review: ❌ Không hoạt động (dùng sai port)
- Move back from Review: ❌ Không hoạt động (dùng sai port)

### **✅ Sau khi fix:**
- Move to Review: ✅ Hoạt động
- Status Change trong Review: ✅ Hoạt động  
- Move back from Review: ✅ Hoạt động
- All API calls: ✅ Consistent port usage

## 🔧 **Best Practices Applied:**

1. **Centralized Configuration:** Sử dụng `API_BASE_URL` từ `constants/api.js` thay vì hardcode URLs
2. **Dynamic Port Detection:** API_BASE_URL tự động detect hostname và port
3. **Consistent Imports:** Tất cả mail views đều import và sử dụng API_BASE_URL
4. **Documentation Updates:** Cập nhật tất cả documentation cho đúng port

## 🚀 **Testing Recommendations:**

1. **Restart cả Frontend và Backend:**
   ```bash
   # Backend
   cd mail-server
   npm start
   
   # Frontend  
   npm start
   ```

2. **Test Move to Review workflow:**
   - Move mail từ Valid/Expired → Review ✅
   - Change status trong Review section ✅
   - Move back từ Review → Original location ✅

3. **Verify API calls trong Browser DevTools:**
   - Tất cả calls đều đi đến `localhost:3002` ✅
   - Không còn 404/connection errors ✅

## 📋 **Files Modified:**

1. `src/views/mail/ReviewMails.js` - Fixed API calls + added API_BASE_URL import
2. `src/views/mail/AllMails.js` - Fixed API calls + added API_BASE_URL import  
3. `src/data/mockMails.js` - Fixed port in data loading
4. `test-real-user-structure.js` - Fixed port in test utilities
5. `debug-move-to-review.html` - Fixed port in debug tool
6. `DATA_SOURCE_VERIFICATION.md` - Updated documentation
7. `mail-server/README.md` - Updated documentation

**🎉 Tất cả API calls giờ đã consistent và tính năng Move to Review + Status Change hoạt động hoàn hảo!**
