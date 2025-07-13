# 📧 Hướng dẫn thêm mail mới vào hệ thống

## 🎯 Tổng quan

Hệ thống sẽ **TỰ ĐỘNG** quét và đọc tất cả file JSON trong thư mục `src/data/`. Để thêm mail mới, bạn chỉ cần:

1. **Tạo file JSON** với tên = Subject mail
2. **Đặt vào thư mục phù hợp** theo phân loại
3. **Restart ứng dụng** - Hệ thống sẽ tự động nhận diện!

## 📁 Cấu trúc thư mục

```
src/data/
├── DungHan/                    # Mail đúng hạn (< 30 ngày)
│   ├── ChuaTraLoi/            # Chưa trả lời
│   └── DaTraLoi/              # Đã trả lời
└── QuaHan/                    # Mail quá hạn (> 30 ngày)
    ├── ChuaTraLoi/            # Chưa trả lời
    └── DaTraLoi/              # Đã trả lời
```

## 🔧 Cách thêm mail mới

### Bước 1: Tạo file JSON

**Tên file:** `[Subject của mail].json`

**Nội dung file:**

```json
{
  "Subject": "Tiêu đề email chính xác",
  "From": "Tên người/tổ chức gửi",
  "Type": "To|CC|BCC",
  "Date": ["YYYY-MM-DD", "HH:MM"]
}
```

### Bước 2: Chọn thư mục phù hợp

**Quy tắc phân loại:**

- **DungHan**: Mail gửi trong vòng 30 ngày gần đây
- **QuaHan**: Mail gửi cách đây hơn 30 ngày
- **ChuaTraLoi**: Mail chưa được phản hồi
- **DaTraLoi**: Mail đã được phản hồi

**Ví dụ đường dẫn:**

- `src/data/DungHan/ChuaTraLoi/New email notification.json`
- `src/data/QuaHan/DaTraLoi/Password reset confirmation.json`

### Bước 3: Restart ứng dụng

**Chỉ cần restart ứng dụng!** Hệ thống sẽ tự động:

- 🔍 Quét tất cả thư mục con
- 📄 Tìm tất cả file `.json`
- 📂 Phân loại theo đường dẫn thư mục
- ✅ Load vào hệ thống

```bash
# Restart ứng dụng
npm start
```

**Không cần cấu hình thủ công nữa!**

## 📝 Ví dụ thực tế

### Thêm mail mới: "Welcome to our newsletter"

**1. Tạo file:** `src/data/DungHan/ChuaTraLoi/Welcome to our newsletter.json`

```json
{
  "Subject": "Welcome to our newsletter",
  "From": "Newsletter Team",
  "Type": "To",
  "Date": ["2025-01-16", "09:30"]
}
```

**2. Restart ứng dụng:**

```bash
npm start
```

**3. Kiểm tra console:**

```
🚀 Bắt đầu quét tự động tất cả file JSON...
📁 Đang quét thư mục: DungHan/ChuaTraLoi
🔍 Tìm thấy 4 file trong ./DungHan/ChuaTraLoi/
✅ Loaded: Welcome to our newsletter.json
🎉 Hoàn thành! Đã load 12 mail từ file JSON
```

**Xong! Mail mới đã tự động xuất hiện trong hệ thống.**

## ⚡ Tự động hóa (Tương lai)

Trong tương lai có thể phát triển:

- **File watcher**: Tự động phát hiện file mới
- **Auto-categorization**: Tự động phân loại dựa trên ngày
- **Bulk import**: Import nhiều file cùng lúc
- **API endpoint**: Thêm mail qua REST API

## 🔍 Kiểm tra

Sau khi thêm mail mới:

1. **Restart** ứng dụng (`npm start`)
2. **Kiểm tra console** xem có lỗi load file không
3. **Xem Dashboard** để confirm mail đã xuất hiện
4. **Test các trang** Valid/Expired/All Mails

## 🚨 Lưu ý quan trọng

- **Tên file phải chính xác** = Subject trong JSON
- **Đường dẫn file** phải đúng trong cấu hình
- **Format JSON** phải hợp lệ (kiểm tra syntax)
- **Date format** phải đúng: `["YYYY-MM-DD", "HH:MM"]`
- **Type** chỉ được: `"To"`, `"CC"`, hoặc `"BCC"`

## 🛠️ Debug

Nếu mail không hiển thị:

1. **Kiểm tra console** browser (F12)
2. **Xem file path** có đúng không
3. **Validate JSON** syntax
4. **Restart** ứng dụng
5. **Kiểm tra fallback data** có được cập nhật không
