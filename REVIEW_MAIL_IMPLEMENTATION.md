# 📁 ReviewMail Folder & Screen Implementation

## 🎯 **Yêu cầu đã thực hiện:**

### **1. Thêm folder ReviewMail:**
- ✅ Tạo folder `C:\classifyMail\ReviewMail\`
- ✅ Cập nhật server để scan folder ReviewMail
- ✅ Thêm vào API endpoints và stats

### **2. Tạo màn hình Review Mails:**
- ✅ Component ReviewMails.js giống ValidMails
- ✅ Thêm vào routing và navigation
- ✅ Cập nhật header stats

## 🔧 **Implementation Details:**

### **1. Server Updates (mail-server/server.js):**

#### **Scan ReviewMail Folder:**
```javascript
// Scan ReviewMail (Review mails)
const reviewMailPath = path.join(MAIL_DATA_PATH, 'ReviewMail');
if (fs.existsSync(reviewMailPath)) {
  const files = fs.readdirSync(reviewMailPath).filter(f => f.endsWith('.json'));
  stats.reviewMailCount = files.length;
} else {
  stats.reviewMailCount = 0;
}

stats.totalMails = stats.dungHanCount + stats.quaHanCount + stats.reviewMailCount;
```

#### **Load ReviewMail Data:**
```javascript
// Load ReviewMail
const reviewMailPath = path.join(MAIL_DATA_PATH, 'ReviewMail');
if (fs.existsSync(reviewMailPath)) {
  const files = fs.readdirSync(reviewMailPath).filter(f => f.endsWith('.json'));
  files.forEach(file => {
    const mailData = readJsonFile(path.join(reviewMailPath, file));
    if (mailData) {
      allMails.push({
        id: fileId++,
        fileName: file,
        filePath: path.join(reviewMailPath, file),
        category: 'ReviewMail',
        status: 'review',
        isExpired: false,
        isReplied: false,
        ...mailData
      });
    }
  });
}
```

### **2. Frontend Updates:**

#### **MailContext Hook:**
```javascript
// Custom hook to get review mails (ReviewMail)
export const useReviewMails = () => {
  const { mails } = useMailContext();
  return mails.filter(mail => mail.category === "ReviewMail");
};
```

#### **ReviewMails Component:**
```javascript
// src/views/mail/ReviewMails.js
import { useReviewMails } from "contexts/MailContext.js";

const ReviewMails = () => {
  const reviewMails = useReviewMails();
  
  // Similar structure to ValidMails with:
  // - Search functionality
  // - Date filtering
  // - Pagination
  // - Modal details view
  // - Mark as read functionality
};
```

#### **Routing (routes.js):**
```javascript
{
  path: "/review-mails",
  name: "Mail cần xem xét",
  icon: "ni ni-archive-2 text-primary",
  component: <ReviewMails />,
  layout: "/admin",
}
```

#### **Header Stats (MailHeader.js):**
```javascript
<CardTitle tag="h5" className="text-uppercase text-muted mb-0">
  Mail cần xem xét
</CardTitle>
<span className="h2 font-weight-bold mb-0">
  {mailStats.reviewMailCount || 0}
</span>
```

### **3. Test Data Created:**

#### **ReviewMail Files:**
```
C:\classifyMail\ReviewMail\
├── review001.json - "Yêu cầu xem xét hợp đồng"
├── review002.json - "Đề xuất thay đổi quy trình"  
└── review003.json - "Báo cáo tài chính Q4"
```

#### **File Structure:**
```json
{
  "id": "review001",
  "Subject": "Yêu cầu xem xét hợp đồng",
  "From": "legal@company.com",
  "Type": "To",
  "Date": ["2025-06-25", "11:44"],
  "SummaryContent": "Cần xem xét và phê duyệt hợp đồng mới với đối tác.",
  "Body": "<p>Kính gửi anh/chị,</p><p>Chúng tôi cần anh/chị xem xét và phê duyệt hợp đồng đính kèm.</p>",
  "isRead": false
}
```

## 📊 **Current Data Status:**

### **API Stats:**
```json
{
  "totalMails": 25,
  "newMails": 3,
  "dungHanCount": 15,
  "quaHanCount": 7,
  "reviewMailCount": 3,
  "dungHanUnreplied": 15,
  "quaHanUnreplied": 4
}
```

### **Mail Breakdown:**
- **DungHan/mustRep:** 15 files (mail đúng hạn)
- **QuaHan/chuaRep:** 4 files (mail quá hạn chưa rep)
- **QuaHan/daRep:** 3 files (mail quá hạn đã rep)
- **ReviewMail:** 3 files ✅ (mail cần xem xét)

## 🎨 **UI Features:**

### **ReviewMails Screen:**
- **Header:** "Mail cần xem xét" với icon archive
- **Search:** Tìm kiếm theo tiêu đề và người gửi
- **Filters:** Date range, reply status
- **Table:** Hiển thị Subject, From, Type, Status, Date
- **Status Badge:** "Cần xem xét" (info) / "Đã xử lý" (success)
- **Actions:** "Xem chi tiết" với modal popup

### **Navigation:**
- **Sidebar:** "Mail cần xem xét" với icon ni-archive-2
- **Header Stats:** Card hiển thị số lượng ReviewMail
- **Route:** `/admin/review-mails`

### **Integration:**
- **Mark as Read:** Click "Xem chi tiết" → mark as read
- **Real-time:** WebSocket updates khi có thay đổi
- **Consistent:** Cùng style với ValidMails và ExpiredMails

## 🔄 **Logic Flow:**

```
1. Mail được tạo trong ReviewMail folder:
   ├── category: "ReviewMail"
   ├── status: "review"
   ├── isExpired: false
   ├── isReplied: false
   └── Xuất hiện trong Review Mails screen

2. User access Review Mails:
   ├── useReviewMails() hook lấy data
   ├── Filter: mail.category === "ReviewMail"
   ├── Display trong table với status badges
   └── Pagination và search working

3. User click "Xem chi tiết":
   ├── Modal mở với full details
   ├── markMailAsRead() được gọi
   ├── isRead: true, readAt: timestamp
   └── Real-time update stats
```

## ✅ **Features Working:**

### **Backend:**
- ✅ **Folder Scanning:** ReviewMail folder được scan
- ✅ **API Integration:** reviewMailCount trong stats
- ✅ **Data Loading:** ReviewMail files được load vào mails array
- ✅ **File Watcher:** Detect changes trong ReviewMail folder

### **Frontend:**
- ✅ **Hook:** useReviewMails() filter đúng data
- ✅ **Component:** ReviewMails.js hoạt động
- ✅ **Routing:** /review-mails accessible
- ✅ **Navigation:** Sidebar link working
- ✅ **Header Stats:** ReviewMail count hiển thị

### **UI/UX:**
- ✅ **Consistent Design:** Giống ValidMails layout
- ✅ **Search & Filter:** Full functionality
- ✅ **Pagination:** Working properly
- ✅ **Modal Details:** Full mail content view
- ✅ **Mark as Read:** Auto mark when view details

## 🚀 **Ready to Use:**

**Test Commands:**
```bash
# Create test ReviewMail files
node test-create-review-mail.js

# Check API stats
curl http://localhost:3001/api/mail-stats

# Check mails data
curl http://localhost:3001/api/mails | grep -i review
```

**Access Points:**
- **URL:** http://localhost:3000/admin/review-mails
- **Sidebar:** "Mail cần xem xét"
- **Header:** ReviewMail stats card

**Current Status:**
- **Total ReviewMails:** 3
- **Unread:** 2 (review001, review002)
- **Read:** 1 (review003)

🎉 **ReviewMail folder và màn hình Review Mails đã hoàn thành và hoạt động!**
