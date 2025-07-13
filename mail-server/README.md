# 📧 Real-time Mail Server

Server Node.js real-time để monitor mail mới với WebSocket và file system watching.

## 🚀 Features

- **Real-time monitoring**: WebSocket connection để nhận updates ngay lập tức
- **File system watching**: Tự động detect khi có file mail mới được thêm
- **REST API**: Endpoints để interact với server
- **Mail simulation**: Tạo mail mới để test
- **Health monitoring**: Check server status và performance
- **Notification support**: Browser notifications cho mail mới

## 📦 Installation

### 1. Cài đặt dependencies

```bash
cd mail-server
npm install
```

### 2. Cài đặt socket.io-client cho React app

```bash
cd ..
npm install socket.io-client
```

## 🏃‍♂️ Running the Server

### Development mode (với auto-restart)
```bash
cd mail-server
npm run dev
```

### Production mode
```bash
cd mail-server
npm start
```

Server sẽ chạy trên port **3001** (http://localhost:3001)

## 🔌 WebSocket Events

### Client → Server
- `requestMailStats`: Yêu cầu mail statistics hiện tại
- `markMailsAsRead`: Đánh dấu mail đã đọc (reset reload status)

### Server → Client
- `mailStatsUpdate`: Cập nhật mail statistics
- `newMailsDetected`: Thông báo có mail mới
- `reloadStatusChanged`: Thay đổi reload status

## 🌐 REST API Endpoints

### GET `/health`
Kiểm tra server health
```json
{
  "status": "OK",
  "uptime": 3600,
  "connectedClients": 2,
  "mailStats": {...},
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### GET `/api/mail-stats`
Lấy mail statistics hiện tại
```json
{
  "totalMails": 25,
  "newMails": 3,
  "dungHanCount": 15,
  "quaHanCount": 10,
  "dungHanUnreplied": 8,
  "quaHanUnreplied": 5,
  "lastUpdate": "2025-01-15T10:30:00.000Z"
}
```

### GET `/api/reload-status`
Kiểm tra reload status
```json
{
  "shouldReload": true,
  "timestamp": "2025-01-15T10:30:00.000Z"
}
```

### POST `/api/set-reload-status`
Set reload status
```json
// Request
{
  "shouldReload": true
}

// Response
{
  "success": true,
  "shouldReload": true
}
```

### POST `/api/simulate-new-mail`
Tạo mail mới để test
```json
// Request
{
  "subject": "Test Mail",
  "from": "test@example.com",
  "type": "To"
}

// Response
{
  "success": true,
  "fileName": "Test Mail.json",
  "mailData": {...}
}
```

## 📁 File Structure

Server monitor các thư mục sau:
```
C:\classifyMail\
├── DungHan/
│   ├── mustRep/             # Mail đúng hạn chưa trả lời
│   └── new.json             # File trạng thái reload
└── QuaHan/
    ├── chuaRep/             # Mail quá hạn chưa trả lời
    └── daRep/               # Mail quá hạn đã trả lời
```

## 🔧 Configuration

### Environment Variables
```bash
PORT=3001                    # Server port (default: 3001)
MAIL_DATA_PATH=../src/data   # Path to mail data directory
```

### CORS Settings
Server được config để accept connections từ:
- `http://localhost:3000` (React development server)

## 📊 Monitoring

### File System Watching
- Tự động detect khi có file `.json` mới được thêm
- Monitor changes và deletions
- Delay 500ms để đảm bảo file được ghi hoàn toàn

### Periodic Checks
- Backup check mỗi 30 giây
- Health check endpoint
- Connection monitoring

## 🔔 Notifications

### Browser Notifications
- Tự động request permission khi connect
- Show notification khi có mail mới
- Custom icon và message

### Console Logging
- Detailed logs cho tất cả events
- Color-coded messages với emojis
- Error tracking và debugging info

## 🧪 Testing

### 1. Test Connection
```bash
curl http://localhost:3001/health
```

### 2. Test Mail Stats
```bash
curl http://localhost:3001/api/mail-stats
```

### 3. Test New Mail Simulation
```bash
curl -X POST http://localhost:3001/api/simulate-new-mail \
  -H "Content-Type: application/json" \
  -d '{"subject":"Test Mail","from":"test@example.com"}'
```

### 4. Test WebSocket (trong browser console)
```javascript
const socket = io('http://localhost:3001');
socket.on('connect', () => console.log('Connected!'));
socket.on('mailStatsUpdate', (data) => console.log('Stats:', data));
socket.emit('requestMailStats');
```

## 🚨 Troubleshooting

### Server không start
- Kiểm tra port 3001 có bị occupied không
- Verify Node.js version >= 14.0.0
- Check dependencies đã install chưa

### WebSocket connection failed
- Kiểm tra CORS settings
- Verify React app đang chạy trên port 3000
- Check firewall settings

### File watching không hoạt động
- Verify đường dẫn `../src/data` tồn tại
- Check file permissions
- Ensure thư mục structure đúng

## 📝 Logs

Server logs sẽ hiển thị:
- 🚀 Server startup
- 🔌 Client connections/disconnections
- 📁 File system events
- 📊 Mail statistics updates
- 🆕 New mail detections
- ❌ Errors và warnings

## 🔄 Integration với React App

Sử dụng hook `useRealtimeMailServer` trong React components:

```javascript
import { useRealtimeMailServer } from 'hooks/useRealtimeMailServer.js';

function MyComponent() {
  const {
    isConnected,
    mailStats,
    reloadStatus,
    markMailsAsRead,
    simulateNewMail
  } = useRealtimeMailServer();
  
  // Component logic...
}
```

## 📈 Performance

- WebSocket connections: Unlimited (limited by system resources)
- File watching: Real-time với minimal CPU usage
- Memory usage: ~50MB base + ~1MB per 1000 mail files
- Response time: <10ms cho API calls

## 🔐 Security

- CORS protection
- Input validation cho API endpoints
- File path sanitization
- No authentication (development only)

**Note**: Đây là development server, không nên dùng trong production environment mà không có proper security measures.