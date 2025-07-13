# 🚀 Hướng dẫn Setup Hệ thống Mail với C:\classifyMail\

## 📋 Tổng quan thay đổi

Hệ thống đã được cập nhật để đọc dữ liệu mail từ `C:\classifyMail\` thay vì `src/data/`.

### 🔄 Cấu trúc thư mục mới:

```
C:\classifyMail\
├── DungHan\
│   ├── mustRep\              # Mail đúng hạn chưa trả lời (thay thế ChuaTraLoi)
│   │   ├── sampleMail.json
│   │   └── ...
│   └── new.json              # File trạng thái reload (thay thế CheckNewDungHan/)
└── QuaHan\
    ├── chuaRep\              # Mail quá hạn chưa trả lời (thay thế ChuaTraLoi)
    │   ├── mail1.json
    │   └── ...
    └── daRep\                # Mail quá hạn đã trả lời (thay thế DaTraLoi)
        ├── mail2.json
        └── ...
```

## 🛠️ Cách Setup

### Bước 1: Tạo cấu trúc thư mục tự động

Chạy script setup để tạo thư mục và file mẫu:

```bash
node setup-classifyMail.js
```

Script này sẽ:
- Tạo thư mục `C:\classifyMail\` và các thư mục con
- Tạo file `new.json` trong `DungHan\`
- Tạo một số file mail mẫu để test

### Bước 2: Khởi động Mail Server

```bash
cd mail-server
npm start
```

Server sẽ:
- Monitor thư mục `C:\classifyMail\`
- Cung cấp API để frontend lấy dữ liệu
- Theo dõi thay đổi file real-time

### Bước 3: Khởi động Frontend

```bash
npm start
```

Frontend sẽ:
- Kết nối với mail server qua API
- Hiển thị dữ liệu từ `C:\classifyMail\`
- Cập nhật real-time khi có thay đổi

## 📁 Format File JSON

### Mail thông thường:
```json
{
  "Subject": "Tiêu đề email",
  "From": "Người gửi",
  "Type": "To|CC|BCC",
  "Date": ["YYYY-MM-DD", "HH:MM"],
  "Check rep": false,
  "Status": "New|Read"
}
```

### File new.json:
```json
{
  "Reload status": false,
  "Status": "Read"
}
```

## 🔧 Thay đổi chính

### Backend (mail-server/server.js):
- Đường dẫn: `../src/data` → `C:\classifyMail`
- Thư mục: `ChuaTraLoi` → `mustRep`, `chuaRep`
- Thư mục: `DaTraLoi` → `daRep`
- File: `CheckNewDungHan/CheckNewDungHan.json` → `DungHan/new.json`

### Frontend:
- Sử dụng API thay vì `require.context`
- Cập nhật các hook và context
- Thay đổi status mapping

## 🧪 Test hệ thống

1. **Kiểm tra kết nối:**
   - Mở `http://localhost:3000`
   - Xem console có log "Đã load X mail từ C:\classifyMail\"

2. **Test thêm mail mới:**
   - Tạo file JSON mới trong `C:\classifyMail\DungHan\mustRep\`
   - Hệ thống sẽ tự động detect và cập nhật

3. **Test real-time:**
   - Sửa file existing
   - Xóa file
   - Kiểm tra giao diện cập nhật tự động

## ⚠️ Lưu ý

1. **Quyền truy cập:** Đảm bảo ứng dụng có quyền đọc/ghi `C:\classifyMail\`

2. **Backup dữ liệu:** Backup dữ liệu cũ từ `src/data/` trước khi chuyển

3. **Server phải chạy:** Mail server phải chạy trước frontend để API hoạt động

4. **Format file:** Đảm bảo file JSON đúng format để tránh lỗi parse

## 🔍 Troubleshooting

### Lỗi "Failed to fetch":
- Kiểm tra mail server có chạy không
- Kiểm tra port 3001 có bị block không

### Không hiển thị dữ liệu:
- Kiểm tra thư mục `C:\classifyMail\` có tồn tại không
- Kiểm tra file JSON có đúng format không
- Xem console log để debug

### Real-time không hoạt động:
- Kiểm tra WebSocket connection
- Restart cả server và frontend
- Kiểm tra firewall settings

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console log của browser (F12)
2. Console log của mail server
3. File structure trong `C:\classifyMail\`
4. Network tab để xem API calls
