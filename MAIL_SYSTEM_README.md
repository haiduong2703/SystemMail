# 📧 Hệ thống Quản trị Mail - Argon Dashboard React

## 🎯 Tổng quan

Hệ thống quản trị mail được xây dựng trên nền tảng Argon Dashboard React, cho phép quản lý và theo dõi mail đúng hạn/hết hạn với giao diện hiện đại và thân thiện.

## 🚀 Tính năng chính

### 📊 Dashboard

- **Thống kê tổng quan**: Hiển thị số lượng mail tổng, đúng hạn, hết hạn
- **Biểu đồ tương tác**: Chuyển đổi giữa view mail đúng hạn và hết hạn
- **Thống kê theo loại**: Phân tích mail TO, CC, BCC
- **Top người gửi**: Hiển thị người gửi mail nhiều nhất
- **Mail gần đây**: Danh sách mail đúng hạn mới nhất

### 📋 Quản lý Mail

1. **Mail đúng hạn** (`/admin/valid-mails`)

   - Danh sách mail còn hiệu lực
   - Tìm kiếm theo tiêu đề/người gửi
   - Phân trang
   - Actions: Xem chi tiết, Đánh dấu hết hạn, Xóa

2. **Mail hết hạn** (`/admin/expired-mails`)

   - Danh sách mail đã hết hạn
   - Hiển thị số ngày hết hạn
   - Actions: Xem chi tiết, Khôi phục, Xóa vĩnh viễn

3. **Tất cả mail** (`/admin/all-mails`)
   - Danh sách toàn bộ mail
   - Filter theo trạng thái (Tất cả/Đúng hạn/Hết hạn)
   - Tìm kiếm và phân trang nâng cao

### 📄 **Tính năng Pagination nâng cao:**

- **Chọn số items/trang**: 5, 10, 25, 50, 100
- **Hiển thị thông tin**: "Hiển thị 1-10 của 25 mục"
- **Navigation**: Previous/Next + số trang
- **Auto-reset**: Về trang 1 khi thay đổi items/trang

## 📁 Cấu trúc dữ liệu

### Cấu trúc thư mục

```
C:\classifyMail\
├── DungHan/                    # Mail đúng hạn
│   ├── mustRep/               # Chưa trả lời
│   │   ├── [Subject].json
│   │   └── ...
│   └── new.json               # File trạng thái reload
└── QuaHan/                    # Mail quá hạn
    ├── chuaRep/               # Chưa trả lời
    │   ├── [Subject].json
    │   └── ...
    └── daRep/                 # Đã trả lời
        ├── [Subject].json
        └── ...
```

### Format file JSON

```
Tên file: [Subject].json
Đường dẫn: C:\classifyMail\[DungHan|QuaHan]\[mustRep|chuaRep|daRep]\[Subject].json
```

### Nội dung file JSON

```json
{
  "Subject": "Tiêu đề email",
  "From": "Người gửi",
  "Type": "To|CC|BCC",
  "Date": ["YYYY-MM-DD", "HH:MM"]
}
```

### Ví dụ

```json
{
  "Subject": "Jitender Girdhar and others share their thoughts on LinkedIn",
  "From": "LinkedIn",
  "Type": "To",
  "Date": ["2025-01-14", "19:31"]
}
```

### Phân loại tự động

- **DungHan**: Mail chưa quá 30 ngày
  - **mustRep**: Mail chưa được phản hồi
- **QuaHan**: Mail đã quá 30 ngày
  - **chuaRep**: Mail chưa được phản hồi
  - **daRep**: Mail đã được phản hồi

## 🗂️ Cấu trúc thư mục mới

```
src/
├── data/
│   ├── mockMails.js              # Mock data và utility functions
│   ├── DungHan/                  # Mail đúng hạn
│   │   ├── ChuaTraLoi/          # Chưa trả lời
│   │   │   ├── Jitender Girdhar and others share their thoughts on LinkedIn.json
│   │   │   ├── Your weekly digest from Medium.json
│   │   │   └── New comment on your post.json
│   │   └── DaTraLoi/            # Đã trả lời
│   │       ├── Security alert - New sign-in from Chrome.json
│   │       ├── Meeting reminder - Team standup tomorrow.json
│   │       └── Your order has been shipped.json
│   └── QuaHan/                   # Mail quá hạn
│       ├── ChuaTraLoi/          # Chưa trả lời
│       │   ├── Welcome to GitHub - Verify your email.json
│       │   ├── Your invoice from Spotify Premium.json
│       │   └── Monthly newsletter - Tech updates.json
│       └── DaTraLoi/            # Đã trả lời
│           ├── Password reset request for your account.json
│           └── System maintenance scheduled for tonight.json
├── views/
│   └── mail/                     # Các trang quản lý mail
│       ├── ValidMails.js         # Trang mail đúng hạn
│       ├── ExpiredMails.js       # Trang mail hết hạn
│       └── AllMails.js           # Trang tất cả mail
└── components/
    └── Headers/
        └── MailHeader.js         # Header tùy chỉnh cho mail system
```

## 🎨 Giao diện

### Dashboard

- **Header**: 4 card thống kê (Tổng mail, Đúng hạn, Hết hạn, Tỷ lệ hiệu quả)
- **Biểu đồ chính**: Hiển thị thống kê mail với khả năng chuyển đổi view
- **Thống kê phụ**: Phân tích theo loại mail (TO/CC/BCC)
- **Bảng mail đúng hạn**: 5 mail đúng hạn gần đây
- **Top người gửi**: Thống kê người gửi mail nhiều nhất

### Các trang quản lý

- **Tìm kiếm**: Input search theo tiêu đề và người gửi
- **Filter**: Button group để lọc theo trạng thái (chỉ có ở trang All Mails)
- **Bảng dữ liệu**: Hiển thị thông tin chi tiết với badge màu sắc
- **Phân trang**: Navigation phân trang ở cuối bảng
- **Actions**: Dropdown menu với các hành động

## 🎯 Logic nghiệp vụ

### Xác định mail hết hạn

- Mail được coi là hết hạn nếu quá 30 ngày từ ngày gửi
- Tính toán dựa trên field `Date` trong JSON

### Màu sắc Badge

- **TO**: Xanh lá (success)
- **CC**: Vàng (warning)
- **BCC**: Xanh dương (info)
- **Đúng hạn**: Xanh lá (success)
- **Hết hạn**: Đỏ (danger)

## 🚀 Chạy dự án

```bash
# Cài đặt dependencies
npm install

# Chạy development server
npm start

# Build production
npm run build
```

## 🔧 Tùy chỉnh

### Thêm mail mới

Chỉnh sửa file `src/data/mockMails.js` và thêm object mới vào array `mockMails`.

### Thay đổi logic hết hạn

Sửa function `checkIfExpired` trong `src/data/mockMails.js`.

### Tùy chỉnh giao diện

Các file SCSS trong `src/assets/scss/` để thay đổi theme và màu sắc.

## 📱 Responsive

- Hoàn toàn responsive trên mobile, tablet, desktop
- Sidebar collapse trên mobile
- Bảng scroll ngang trên màn hình nhỏ

## 📊 **Thống kê hiện tại:**

- **Tổng mail**: 11
- **Mail đúng hạn**: 6 (55%)
- **Mail hết hạn**: 5 (45%)
- **Loại mail**: TO: 8, CC: 2, BCC: 1

### 📂 **Phân loại chi tiết:**

- **Đúng hạn - Chưa trả lời**: 3 mail
- **Đúng hạn - Đã trả lời**: 3 mail
- **Quá hạn - Chưa trả lời**: 3 mail
- **Quá hạn - Đã trả lời**: 2 mail

## 🎉 Demo

Truy cập `http://localhost:3000` sau khi chạy `npm start` để xem demo.

# Hướng dẫn Hệ thống Mail: Kiểm thử và Luồng hoạt động

Tài liệu này cung cấp hướng dẫn về cách kiểm thử hệ thống mail real-time và giải thích luồng hoạt động của nó.

## 🚀 Cách Kiểm thử Hệ thống

Thực hiện theo các bước sau để xác minh tất cả các tính năng real-time đang hoạt động chính xác.

### Yêu cầu Chuẩn bị

1.  **Khởi động Server Backend:**
    Di chuyển đến thư mục `mail-server` và chạy server.

    ```bash
    cd mail-server
    npm start
    ```

    Server sẽ khởi động, thường ở cổng `3001`, và giao diện điều khiển (console) sẽ hiển thị:
    `✅ Chokidar watcher is ready and scanning.`

2.  **Khởi động Ứng dụng Frontend:**
    Trong một cửa sổ dòng lệnh (terminal) khác, di chuyển đến thư mục gốc của dự án và khởi động ứng dụng React.

    ```bash
    npm start
    ```

    Ứng dụng sẽ mở trong trình duyệt của bạn, thường tại địa chỉ `http://localhost:3000`.

3.  **Mở Giao diện Điều khiển cho Lập trình viên:**
    - **Console của Trình duyệt:** Nhấn `F12` trong trình duyệt của bạn và chuyển đến tab "Console". Điều này sẽ giúp bạn xem các log từ frontend.
    - **Console của Server:** Giữ cửa sổ dòng lệnh cho `mail-server` hiển thị. Điều này sẽ hiển thị các log từ backend.

### Các Kịch bản Kiểm thử

#### Kịch bản 1: Nhận một Mail Mới

1.  **Hành động:** Trên trang dashboard, tìm đến phần "Simulate New Mail". Nhập một tiêu đề (ví dụ: "Thư Test 1") và một người gửi, sau đó nhấp vào **"Send Test Mail"**.

2.  **Kết quả Mong đợi:**
    - **Backend:** Một tệp `.json` mới được tạo trong thư mục `data/DungHan/ChuaTraLoi/`. Console của server ghi lại:
      - `[+] File added: Thư Test 1.json`
      - `✅ New mail count increased. Emitting 'newMailsDetected'.`
    - **Frontend (Trình duyệt):**
      - **Tiêu đề Tab:** Tiêu đề của tab trình duyệt sẽ bắt đầu nhấp nháy, xen kẽ giữa tiêu đề trang và "📧 New Mail!".
      - **Sidebar:** Một huy hiệu "New" sẽ xuất hiện bên cạnh mục menu "Mail đúng hạn".
      - **Dữ liệu Dashboard:** Danh sách các mail gần đây và các thống kê khác sẽ tự động cập nhật mà không cần tải lại trang.
      - **Console Trình duyệt:** Bạn sẽ thấy log debug: `📢 [DEBUG] Received newMailsDetected event. Setting reloadStatus to: true`.

#### Kịch bản 2: Đánh dấu Mail đã đọc bằng cách Nhấp vào Menu

1.  **Hành động:** Sau khi nhận được một mail mới (tiêu đề đang nhấp nháy và huy hiệu "New" đang hiển thị), hãy nhấp vào mục menu **"Mail đúng hạn"** trong sidebar.

2.  **Kết quả Mong đợi:**
    - **Backend:** Console của server ghi lại rằng nó đang cập nhật trạng thái của các tệp mail từ "New" sang "Read".
      - `🔄 Marking all "New" mails as "Read"...`
      - `✅ Finished marking mails. 1 file(s) updated.` (hoặc nhiều hơn)
      - `[*] File changed: Thư Test 1.json` (Hành động này kích hoạt watcher)
    - **Frontend (Trình duyệt):**
      - **Tiêu đề Tab:** Tiêu đề tab ngay lập tức ngừng nhấp nháy và trở về tiêu đề trang bình thường.
      - **Sidebar:** Huy hiệu "New" bên cạnh "Mail đúng hạn" biến mất.

#### Kịch bản 3: Tập trung vào Tab để Dừng Nhấp nháy

1.  **Hành động:** Nhận một mail mới (Kịch bản 1), sau đó chuyển sang một tab trình duyệt khác và quay lại tab của ứng dụng.

2.  **Kết quả Mong đợi:**
    - Tiêu đề tab sẽ ngay lập tức ngừng nhấp nháy ngay khi bạn tập trung vào tab của ứng dụng. Huy hiệu "New" trên sidebar sẽ vẫn còn cho đến khi bạn đánh dấu các mail đã đọc.

---

## ⚙️ Giải thích Luồng hoạt động của Hệ thống

Chức năng real-time dựa trên kết nối WebSocket giữa frontend và backend, tạo ra một hệ thống mạnh mẽ và tách biệt.

### Các Thành phần Cốt lõi

- **Backend (`mail-server/server.js`):**
  - **`Express` & `Socket.IO`:** Quản lý máy chủ web và kênh giao tiếp WebSocket.
  - **`Chokidar`:** Một trình theo dõi hệ thống tệp tin, giám sát một cách đáng tin cậy thư mục `data/` cho bất kỳ thay đổi nào (thêm, sửa, xóa).
- **Frontend (`src/`):**
  - **`MailProvider` (`src/contexts/MailContext.js`):** Trung tâm cho tất cả trạng thái liên quan đến mail. Nó thiết lập **một kết nối WebSocket duy nhất** và cung cấp dữ liệu cũng như trạng thái real-time cho toàn bộ ứng dụng.
  - **`useRealtimeMailServer` (`src/hooks/useRealtimeMailServer.js`):** Hook chịu trách nhiệm quản lý logic kết nối WebSocket, gửi và nhận các sự kiện.
  - **`BlinkingTitleController` (`src/components/BlinkingTitleController/BlinkingTitleController.js`):** Một component không render gì, nhưng kiểm soát việc nhấp nháy tiêu đề dựa trên trạng thái toàn cục từ `MailProvider`.
  - **`Sidebar` (`src/components/Sidebar/Sidebar.js`):** Hiển thị huy hiệu "New" dựa trên trạng thái toàn cục từ `MailProvider`.

### Luồng Dữ liệu từng bước

1.  **Tạo Tệp:** Một tệp mail mới được tạo trong thư mục `data/`.
2.  **Theo dõi Hệ thống Tệp:** `Chokidar` ở backend phát hiện sự thay đổi này.
3.  **Logic Backend (`handleDataChange`):** Hàm này được kích hoạt. Nó quét lại thư mục mail, phát hiện sự gia tăng số lượng mail "New", và phát một sự kiện **`newMailsDetected`** qua Socket.IO tới tất cả các client đang kết nối.
4.  **Frontend Nhận tín hiệu:** Hook `useRealtimeMailServer` (đang chạy bên trong `MailProvider`) nhận được sự kiện `newMailsDetected`. Nó đặt trạng thái nội bộ `reloadStatus` của mình thành `true`.
5.  **Cập nhật Context:** Vì `reloadStatus` đã thay đổi, `MailProvider` render lại và cung cấp giá trị mới (`true`) cho tất cả các component con của nó thông qua React Context.
6.  **Giao diện Phản ứng:**
    - Component `BlinkingTitleController` thấy rằng `reloadStatus` bây giờ là `true` và gọi hàm `startBlinking()`.
    - Component `Sidebar` thấy rằng `reloadStatus` bây giờ là `true` và render `<Badge>New</Badge>`.
7.  **Đánh dấu đã đọc:** Người dùng nhấp vào mục menu "Mail đúng hạn". Trình xử lý `onClick` gọi hàm `markMailsAsRead()` từ context.
8.  **Hành động từ Client đến Server:** `markMailsAsRead` gửi một sự kiện cùng tên đến server.
9.  **Hành động của Backend:** Server nhận sự kiện, tìm tất cả các tệp có `Status: "New"`, và thay đổi trạng thái của chúng thành `Status: "Read"`.
10. **Vòng lặp Hoàn chỉnh:** Sự thay đổi tệp này được `Chokidar` phát hiện, kích hoạt lại `handleDataChange` (Bước 2). Lần này, số lượng mail "New" đã giảm, vì vậy `reloadStatus` được đặt thành `false`, và giao diện người dùng cập nhật tương ứng (ngừng nhấp nháy, huy hiệu biến mất).

Kiến trúc này đảm bảo một hệ thống real-time mạnh mẽ, tập trung và tách biệt.
