# ⚡ Quick Start - Hệ thống Mail với C:\classifyMail\

## 🚀 Setup nhanh (3 bước)

### 1️⃣ Tạo cấu trúc thư mục
```bash
npm run setup:classifyMail
```

### 2️⃣ Khởi động hệ thống
```bash
# Terminal 1: Khởi động mail server
cd mail-server
npm start

# Terminal 2: Khởi động frontend  
npm start
```

### 3️⃣ Truy cập ứng dụng
Mở trình duyệt: `http://localhost:3000`

## 📁 Cấu trúc được tạo

```
C:\classifyMail\
├── DungHan\
│   ├── mustRep\              # Mail đúng hạn chưa trả lời
│   │   ├── LinkedIn notification.json
│   │   └── Medium weekly digest.json
│   └── new.json              # File trạng thái
└── QuaHan\
    ├── chuaRep\              # Mail quá hạn chưa trả lời  
    │   ├── GitHub verification.json
    │   └── Spotify invoice.json
    └── daRep\                # Mail quá hạn đã trả lời
        └── Facebook password reset.json
```

## ✅ Kiểm tra hoạt động

1. **Dashboard hiển thị thống kê mail**
2. **Console log: "Đã load X mail từ C:\classifyMail\"**
3. **Thêm file mới vào thư mục → Tự động cập nhật**

## 🔧 Thêm mail mới

Tạo file JSON trong thư mục tương ứng:

```json
{
  "Subject": "Tiêu đề email",
  "From": "Người gửi", 
  "Type": "To",
  "Date": ["2025-01-21", "10:30"],
  "Check rep": false,
  "Status": "New"
}
```

## 📞 Hỗ trợ

- Chi tiết: `SETUP_GUIDE.md`
- Tài liệu đầy đủ: `MAIL_SYSTEM_README.md`
