# 📧 ExpiredMails Page Update - Phân biệt "Chưa Rep" và "Đã Rep"

## 🎯 **Vấn đề:**
Trang ExpiredMails hiển thị tất cả mail quá hạn trong một bảng, không phân biệt giữa:
- **QuaHan/chuaRep** (chưa trả lời)
- **QuaHan/daRep** (đã trả lời)

## ✅ **Giải pháp đã implement:**

### **1. Thêm hooks mới trong MailContext.js:**

```javascript
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
```

### **2. Cập nhật ExpiredMails.js:**

#### **Filter State:**
```javascript
const [expiredTypeFilter, setExpiredTypeFilter] = useState("all");

const allExpiredMails = useExpiredMails();
const expiredUnrepliedMails = useExpiredUnrepliedMails();
const expiredRepliedMails = useExpiredRepliedMails();
```

#### **Dynamic Data Selection:**
```javascript
const getExpiredMails = () => {
  switch (expiredTypeFilter) {
    case "unreplied":
      return expiredUnrepliedMails;
    case "replied":
      return expiredRepliedMails;
    default:
      return allExpiredMails;
  }
};
```

#### **Filter UI:**
```jsx
<ButtonGroup>
  <Button
    color={expiredTypeFilter === "all" ? "primary" : "secondary"}
    onClick={() => handleExpiredTypeChange("all")}
    size="sm"
  >
    Tất cả ({allExpiredMails.length})
  </Button>
  <Button
    color={expiredTypeFilter === "unreplied" ? "warning" : "secondary"}
    onClick={() => handleExpiredTypeChange("unreplied")}
    size="sm"
  >
    Chưa trả lời ({expiredUnrepliedMails.length})
  </Button>
  <Button
    color={expiredTypeFilter === "replied" ? "success" : "secondary"}
    onClick={() => handleExpiredTypeChange("replied")}
    size="sm"
  >
    Đã trả lời ({expiredRepliedMails.length})
  </Button>
</ButtonGroup>
```

#### **Header Badge:**
```jsx
<h3 className="mb-0">
  <i className="ni ni-fat-remove text-danger mr-2" />
  Mail hết hạn ({filteredMails.length})
  {expiredTypeFilter === "unreplied" && <Badge color="warning" className="ml-2">Chưa trả lời</Badge>}
  {expiredTypeFilter === "replied" && <Badge color="success" className="ml-2">Đã trả lời</Badge>}
</h3>
```

## 📊 **Current Data Status:**

### **API Response:**
```
📂 Breakdown by Category:
- QuaHan/chuaRep: 4 files ✅ (Chưa trả lời)
- QuaHan/daRep: 3 files ✅ (Đã trả lời)
- Total QuaHan: 7 files
```

### **Filter Options:**
1. **Tất cả (7):** Hiển thị tất cả mail quá hạn
2. **Chưa trả lời (4):** Chỉ hiển thị QuaHan/chuaRep
3. **Đã trả lời (3):** Chỉ hiển thị QuaHan/daRep

## 🎨 **UI Features:**

### **Button Colors:**
- **Tất cả:** Primary (blue) khi active
- **Chưa trả lời:** Warning (yellow) khi active
- **Đã trả lời:** Success (green) khi active

### **Header Badges:**
- **Chưa trả lời:** Warning badge
- **Đã trả lời:** Success badge

### **Count Display:**
- Mỗi button hiển thị số lượng mail tương ứng
- Header title hiển thị số lượng mail được filter

## 🔄 **Logic Flow:**

```
1. User clicks filter button:
   ├── "Tất cả" → Show all expired mails (chuaRep + daRep)
   ├── "Chưa trả lời" → Show only QuaHan/chuaRep mails
   └── "Đã trả lời" → Show only QuaHan/daRep mails

2. Data filtering:
   ├── useExpiredMails() → All expired mails
   ├── useExpiredUnrepliedMails() → QuaHan/chuaRep only
   └── useExpiredRepliedMails() → QuaHan/daRep only

3. UI updates:
   ├── Button colors change based on active filter
   ├── Header badge shows current filter type
   └── Table shows filtered data
```

## ✅ **Benefits:**

1. **Clear Separation:** Phân biệt rõ ràng mail chưa rep và đã rep
2. **Easy Navigation:** User có thể nhanh chóng switch giữa các loại
3. **Visual Feedback:** Button colors và badges cho biết trạng thái hiện tại
4. **Count Display:** Hiển thị số lượng mail cho mỗi category
5. **Consistent UX:** Giữ nguyên layout và functionality hiện tại

## 🚀 **Ready to Use:**

- ✅ **Hooks:** useExpiredUnrepliedMails, useExpiredRepliedMails
- ✅ **UI:** Filter buttons với count display
- ✅ **Logic:** Dynamic data filtering
- ✅ **Visual:** Color-coded buttons và badges
- ✅ **Data:** 4 chưa rep + 3 đã rep = 7 total

**Trang ExpiredMails giờ đây có thể phân biệt rõ ràng giữa mail "chưa rep" và "đã rep"!** 🎯
