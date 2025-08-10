const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");
const cors = require("cors");
const {
  decryptText,
  decryptMailFrom,
  decryptMailArray,
  testDecryption,
} = require("./decryptUtils");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: "*", // Allow all origins
  })
);
app.use(express.json());

// Import crypto for password hashing
const crypto = require("crypto");

// Đường dẫn đến thư mục mail data
const MAIL_DATA_PATH = "C:\\classifyMail";
const ASSIGNMENT_DATA_PATH = "C:\\classifyMail\\AssignmentData";
const USER_DATA_PATH = "C:\\classifyMail\\UserData";
const RELOAD_STATUS_FILE = path.join(MAIL_DATA_PATH, "DungHan/new.json");

// Ensure necessary directories exist on startup
const ensureDirectoriesExist = () => {
  try {
    if (!fs.existsSync(MAIL_DATA_PATH)) {
      fs.mkdirSync(MAIL_DATA_PATH, { recursive: true });
      console.log(`📁 Created mail data directory: ${MAIL_DATA_PATH}`);
    }
    if (!fs.existsSync(ASSIGNMENT_DATA_PATH)) {
      fs.mkdirSync(ASSIGNMENT_DATA_PATH, { recursive: true });
      console.log(
        `📁 Created assignment data directory: ${ASSIGNMENT_DATA_PATH}`
      );
    }
    if (!fs.existsSync(USER_DATA_PATH)) {
      fs.mkdirSync(USER_DATA_PATH, { recursive: true });
      console.log(`📁 Created user data directory: ${USER_DATA_PATH}`);
    }
  } catch (error) {
    console.error("❌ Error creating necessary directories:", error);
    process.exit(1); // Exit if we can't create essential directories
  }
};

// Run directory check on startup
ensureDirectoriesExist();

// State management
let connectedClients = new Set();
let mailStats = {
  totalMails: 0,
  newMails: 0,
  dungHanCount: 0,
  quaHanCount: 0,
  lastUpdate: new Date(),
};

// Utility functions
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error.message);
    return null;
  }
};

// Password hashing utilities
const hashPassword = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 64, "sha512")
    .toString("hex");
  return { salt, hash };
};

const verifyPassword = (password, salt, hash) => {
  try {
    console.log(
      `[Verify] Input type - password: ${typeof password}, salt: ${typeof salt}, hash: ${typeof hash}`
    );
    if (
      typeof password !== "string" ||
      typeof salt !== "string" ||
      typeof hash !== "string"
    ) {
      console.error(
        "[Verify] Error: Invalid input types for password verification."
      );
      return false;
    }

    const hashVerify = crypto
      .pbkdf2Sync(password, salt, 1000, 64, "sha512")
      .toString("hex");

    const result = hash === hashVerify;
    console.log(`[Verify] Verification successful. Match: ${result}`);
    return result;
  } catch (e) {
    console.error("!!! CRITICAL: Error inside verifyPassword function:", e);
    throw e; // Re-throw the error to be caught by the main login handler
  }
};

// User management utilities
const createUserDirectory = () => {
  if (!fs.existsSync(USER_DATA_PATH)) {
    fs.mkdirSync(USER_DATA_PATH, { recursive: true });
    console.log(`📁 Created user data directory: ${USER_DATA_PATH}`);
  }
};

const getUserFilePath = (username) => {
  return path.join(USER_DATA_PATH, `${username}.json`);
};

const userExists = (username) => {
  const userFilePath = getUserFilePath(username);
  return fs.existsSync(userFilePath);
};

const saveUser = (userData) => {
  createUserDirectory();
  const userFilePath = getUserFilePath(userData.username);

  const userRecord = {
    id: Date.now().toString(),
    username: userData.username,
    email: userData.email,
    fullName: userData.fullName,
    role: userData.role,
    passwordHash: userData.passwordHash,
    passwordSalt: userData.passwordSalt,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isActive: true,
  };

  try {
    fs.writeFileSync(userFilePath, JSON.stringify(userRecord, null, 2));
    console.log(`✅ User saved: ${userData.username}`);
    return userRecord;
  } catch (error) {
    console.error(`❌ Error saving user ${userData.username}:`, error.message);
    throw error;
  }
};

const getUser = (username) => {
  const userFilePath = getUserFilePath(username);
  return readJsonFile(userFilePath);
};

const writeJsonFile = (filePath, data) => {
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`❌ Error writing file ${filePath}:`, error.message);
    return false;
  }
};

// Scan mail directories and count mails
const scanMailDirectory = () => {
  const stats = {
    totalMails: 0,
    newMails: 0,
    dungHanCount: 0,
    quaHanCount: 0,
    dungHanUnreplied: 0,
    quaHanUnreplied: 0,
    lastUpdate: new Date(),
  };

  try {
    // Scan DungHan (Valid mails)
    const dungHanPath = path.join(MAIL_DATA_PATH, "DungHan");
    if (fs.existsSync(dungHanPath)) {
      // DungHan - mustRep (chưa trả lời)
      const dungHanMustRepPath = path.join(dungHanPath, "mustRep");
      if (fs.existsSync(dungHanMustRepPath)) {
        const files = fs
          .readdirSync(dungHanMustRepPath)
          .filter((f) => f.endsWith(".json"));
        stats.dungHanCount += files.length;
        stats.dungHanUnreplied += files.length;

        // Count new mails (only unread files in mustRep are considered new)
        const unreadCount = files.filter((file) => {
          const filePath = path.join(dungHanMustRepPath, file);
          const mailData = readJsonFile(filePath);
          return mailData && !mailData.isRead;
        }).length;
        stats.newMails += unreadCount;
      }

      // Logic mới: NEW badge dựa vào việc có mail trong folder hay không
      // Không cần new.json file nữa
    }

    // Scan QuaHan (Expired mails)
    const quaHanPath = path.join(MAIL_DATA_PATH, "QuaHan");
    if (fs.existsSync(quaHanPath)) {
      // QuaHan - chuaRep (chưa trả lời)
      const quaHanChuaRepPath = path.join(quaHanPath, "chuaRep");
      if (fs.existsSync(quaHanChuaRepPath)) {
        const files = fs
          .readdirSync(quaHanChuaRepPath)
          .filter((f) => f.endsWith(".json"));
        stats.quaHanCount += files.length;
        stats.quaHanUnreplied += files.length;

        // QuaHan/chuaRep không được tính là "new" nữa
        // Chỉ DungHan/mustRep mới được tính là NEW
      }

      // QuaHan - daRep (đã trả lời)
      const quaHanDaRepPath = path.join(quaHanPath, "daRep");
      if (fs.existsSync(quaHanDaRepPath)) {
        const files = fs
          .readdirSync(quaHanDaRepPath)
          .filter((f) => f.endsWith(".json"));
        stats.quaHanCount += files.length;
      }
    }

    // Scan ReviewMail (Review mails)
    const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
    if (fs.existsSync(reviewMailPath)) {
      const files = fs
        .readdirSync(reviewMailPath)
        .filter((f) => f.endsWith(".json"));
      stats.reviewMailCount = files.length;
    } else {
      stats.reviewMailCount = 0;
    }

    stats.totalMails =
      stats.dungHanCount + stats.quaHanCount + stats.reviewMailCount;

    console.log(`📊 Mail Stats Updated:`, {
      total: stats.totalMails,
      new: stats.newMails,
      dungHan: stats.dungHanCount,
      quaHan: stats.quaHanCount,
      unreplied: stats.dungHanUnreplied + stats.quaHanUnreplied,
    });

    return stats;
  } catch (error) {
    console.error("❌ Error scanning mail directory:", error);
    return stats;
  }
};

// Broadcast to all connected clients
const broadcastToClients = (event, data) => {
  io.emit(event, data);
  console.log(`📡 Broadcasted ${event} to ${connectedClients.size} clients`);
};

// Check for new mails and notify clients
const checkForNewMails = () => {
  const newStats = scanMailDirectory();
  const hasNewMails = newStats.newMails > mailStats.newMails;
  const hasChanges = JSON.stringify(newStats) !== JSON.stringify(mailStats);

  if (hasChanges) {
    mailStats = newStats;

    // Broadcast updated stats
    broadcastToClients("mailStatsUpdate", mailStats);

    if (hasNewMails) {
      console.log(`🆕 New mails detected! Count: ${newStats.newMails}`);

      // DON'T automatically set reload status - let user control manually
      // const reloadStatus = { "Reload status": true };
      // writeJsonFile(RELOAD_STATUS_FILE, reloadStatus);

      // Notify clients about new mails but don't trigger auto-reload
      broadcastToClients("newMailsDetected", {
        count: newStats.newMails,
        timestamp: new Date(),
        shouldReload: false, // Changed to false to prevent auto-reload
      });
    }
  }
};

// Socket.IO connection handling
io.on("connection", (socket) => {
  connectedClients.add(socket.id);
  console.log(
    `🔌 Client connected: ${socket.id} (Total: ${connectedClients.size})`
  );

  // Send current stats to new client
  socket.emit("mailStatsUpdate", mailStats);

  // Handle client requests
  socket.on("requestMailStats", () => {
    const currentStats = scanMailDirectory();
    socket.emit("mailStatsUpdate", currentStats);
  });

  socket.on("markMailsAsRead", () => {
    // Reset reload status
    const reloadStatus = { "Reload status": false };
    writeJsonFile(RELOAD_STATUS_FILE, reloadStatus);

    broadcastToClients("reloadStatusChanged", { shouldReload: false });
    console.log("✅ Mails marked as read, reload status reset");
  });

  socket.on("disconnect", () => {
    connectedClients.delete(socket.id);
    console.log(
      `🔌 Client disconnected: ${socket.id} (Total: ${connectedClients.size})`
    );
  });
});

// Function to enrich mail data with assignment information
const enrichMailWithAssignmentInfo = (mailData) => {
  if (!mailData.assignedTo) {
    return mailData;
  }

  const enrichedMail = { ...mailData };

  try {
    // If assigned to PIC, get PIC name
    if (mailData.assignedTo.type === "pic" && mailData.assignedTo.picId) {
      const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
      const picFileName = `${mailData.assignedTo.picId}.json`;
      const picFilePath = path.join(picsPath, picFileName);

      if (fs.existsSync(picFilePath)) {
        const picData = readJsonFile(picFilePath);
        if (picData) {
          enrichedMail.assignedTo.picName = picData.name;
          enrichedMail.assignedTo.picEmail = picData.email;
        }
      }
    }

    // If assigned to Group, get Group name
    if (mailData.assignedTo.type === "group" && mailData.assignedTo.groupId) {
      const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");
      const groupFileName = `${mailData.assignedTo.groupId}.json`;
      const groupFilePath = path.join(groupsPath, groupFileName);

      if (fs.existsSync(groupFilePath)) {
        const groupData = readJsonFile(groupFilePath);
        if (groupData) {
          enrichedMail.assignedTo.groupName = groupData.name;
        }
      }
    }
  } catch (error) {
    console.error("Error enriching mail with assignment info:", error);
  }

  return enrichedMail;
};

// Function to load all mails from file system
const loadAllMails = () => {
  const allMails = [];
  let fileId = 1;

  try {
    // Load DungHan - mustRep
    const dungHanMustRepPath = path.join(MAIL_DATA_PATH, "DungHan/mustRep");
    if (fs.existsSync(dungHanMustRepPath)) {
      const files = fs
        .readdirSync(dungHanMustRepPath)
        .filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const mailData = readJsonFile(path.join(dungHanMustRepPath, file));
        if (mailData) {
          const decryptedMail = decryptMailFrom(mailData); // Decrypt here
          const enrichedMail = enrichMailWithAssignmentInfo(decryptedMail);
          allMails.push({
            id: fileId++,
            fileName: file,
            filePath: path.join(dungHanMustRepPath, file),
            category: "DungHan",
            status: "mustRep",
            isExpired: false,
            isReplied: false,
            ...enrichedMail,
          });
        }
      });
    }

    // Load QuaHan - chuaRep
    const quaHanChuaRepPath = path.join(MAIL_DATA_PATH, "QuaHan/chuaRep");
    if (fs.existsSync(quaHanChuaRepPath)) {
      const files = fs
        .readdirSync(quaHanChuaRepPath)
        .filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const mailData = readJsonFile(path.join(quaHanChuaRepPath, file));
        if (mailData) {
          const decryptedMail = decryptMailFrom(mailData); // Decrypt here
          const enrichedMail = enrichMailWithAssignmentInfo(decryptedMail);
          allMails.push({
            id: fileId++,
            fileName: file,
            filePath: path.join(quaHanChuaRepPath, file),
            category: "QuaHan",
            status: "chuaRep",
            isExpired: true,
            isReplied: false,
            ...enrichedMail,
          });
        }
      });
    }

    // Load QuaHan - daRep
    const quaHanDaRepPath = path.join(MAIL_DATA_PATH, "QuaHan/daRep");
    if (fs.existsSync(quaHanDaRepPath)) {
      const files = fs
        .readdirSync(quaHanDaRepPath)
        .filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const mailData = readJsonFile(path.join(quaHanDaRepPath, file));
        if (mailData) {
          const decryptedMail = decryptMailFrom(mailData); // Decrypt here
          const enrichedMail = enrichMailWithAssignmentInfo(decryptedMail);
          allMails.push({
            id: fileId++,
            fileName: file,
            filePath: path.join(quaHanDaRepPath, file),
            category: "QuaHan",
            status: "daRep",
            isExpired: true,
            isReplied: true,
            ...enrichedMail,
          });
        }
      });
    }

    // Load ReviewMail
    const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
    if (fs.existsSync(reviewMailPath)) {
      const files = fs
        .readdirSync(reviewMailPath)
        .filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const mailData = readJsonFile(path.join(reviewMailPath, file));
        if (mailData) {
          const decryptedMail = decryptMailFrom(mailData); // Decrypt here
          const enrichedMail = enrichMailWithAssignmentInfo(decryptedMail);
          allMails.push({
            id: fileId++,
            fileName: file,
            filePath: path.join(reviewMailPath, file),
            category: "ReviewMail",
            status: "review",
            isExpired: false,
            isReplied: false,
            ...enrichedMail,
          });
        }
      });
    }

    // Load DungHan/new.json file (skip it as it's not a mail)
    // const newJsonPath = path.join(MAIL_DATA_PATH, 'DungHan/new.json');
    // Skip new.json as it's not a mail file

    console.log(`📧 Loaded ${allMails.length} mails from file system`);
    return allMails;
  } catch (error) {
    console.error("❌ Error loading mails:", error);
    return [];
  }
};

// REST API endpoints
app.get("/api/mail-stats", (req, res) => {
  const currentStats = scanMailDirectory();
  res.json(currentStats);
});

app.get("/api/mails", (req, res) => {
  const mails = loadAllMails();
  res.json(mails);
});

// Update mail status (isReplied)
app.put("/api/mails/:id/status", (req, res) => {
  const { id } = req.params;
  const { isReplied } = req.body;

  try {
    console.log(`[Update Mail Status] ID: ${id}, isReplied: ${isReplied}`);

    // Find the mail file
    const allMails = loadAllMails();
    const mail = allMails.find((m) => m.id === id || m.id === parseInt(id));

    if (!mail) {
      return res.status(404).json({
        success: false,
        error: "Mail not found",
      });
    }

    // Read the current mail file
    const mailData = readJsonFile(mail.filePath);
    if (!mailData) {
      return res.status(500).json({
        success: false,
        error: "Failed to read mail file",
      });
    }

    // Update isReplied status
    mailData.isReplied = Boolean(isReplied);

    // Write back to file
    if (writeJsonFile(mail.filePath, mailData)) {
      console.log(
        `✅ Updated mail status: ${mail.Subject} -> isReplied: ${isReplied}`
      );

      // Broadcast update to clients
      broadcastToClients("mailStatusUpdated", {
        mailId: id,
        isReplied: Boolean(isReplied),
        subject: mail.Subject,
      });

      res.json({
        success: true,
        message: "Mail status updated successfully",
        isReplied: Boolean(isReplied),
      });
    } else {
      res.status(500).json({
        success: false,
        error: "Failed to update mail file",
      });
    }
  } catch (error) {
    console.error("❌ Error updating mail status:", error);
    res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
});

app.get("/api/reload-status", (req, res) => {
  const reloadData = readJsonFile(RELOAD_STATUS_FILE);
  res.json({
    shouldReload: reloadData ? reloadData["Reload status"] : false,
    timestamp: new Date(),
  });
});

app.post("/api/set-reload-status", (req, res) => {
  const { shouldReload } = req.body;
  const reloadStatus = { "Reload status": Boolean(shouldReload) };

  if (writeJsonFile(RELOAD_STATUS_FILE, reloadStatus)) {
    broadcastToClients("reloadStatusChanged", {
      shouldReload: Boolean(shouldReload),
    });
    res.json({ success: true, shouldReload: Boolean(shouldReload) });
  } else {
    res
      .status(500)
      .json({ success: false, error: "Failed to update reload status" });
  }
});

app.post("/api/simulate-new-mail", (req, res) => {
  const { subject, from, type = "To" } = req.body;

  if (!subject || !from) {
    return res.status(400).json({ error: "Subject and From are required" });
  }

  // Create new mail file with ID-based filename
  const mailId = Date.now().toString(); // Use timestamp as ID
  const fileName = `${mailId}.json`;
  const filePath = path.join(MAIL_DATA_PATH, "DungHan/mustRep", fileName);

  const mailData = {
    Subject: subject,
    From: from,
    Type: type,
    Date: [
      new Date().toISOString().split("T")[0],
      new Date().toTimeString().slice(0, 5),
    ],
    SummaryContent: "Sample content for testing purposes",
    id: mailId,
    isRead: false, // Thêm trạng thái đã đọc
  };

  if (writeJsonFile(filePath, mailData)) {
    console.log(`📧 Simulated new mail created: ${fileName}`);

    // Trigger check for new mails
    setTimeout(checkForNewMails, 1000);

    res.json({ success: true, fileName, mailData });
  } else {
    res
      .status(500)
      .json({ success: false, error: "Failed to create mail file" });
  }
});

// API to mark mail as read
app.post("/api/mark-mail-read", (req, res) => {
  const { mailId, fileName, category, status } = req.body;

  if (!mailId || !fileName || !category || !status) {
    return res
      .status(400)
      .json({ error: "mailId, fileName, category, and status are required" });
  }

  // Construct file path
  const filePath = path.join(MAIL_DATA_PATH, category, status, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Mail file not found" });
  }

  try {
    // Read current mail data
    const mailData = readJsonFile(filePath);
    if (!mailData) {
      return res.status(500).json({ error: "Failed to read mail file" });
    }

    // Update isRead status
    mailData.isRead = true;
    mailData.readAt = new Date().toISOString();

    // Write back to file
    if (writeJsonFile(filePath, mailData)) {
      console.log(`📖 Mail marked as read: ${fileName}`);

      // Trigger check for new mails to update stats
      setTimeout(checkForNewMails, 500);

      res.json({ success: true, mailId, isRead: true });
    } else {
      res
        .status(500)
        .json({ success: false, error: "Failed to update mail file" });
    }
  } catch (error) {
    console.error("Error marking mail as read:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// File system watcher
const watcher = chokidar.watch(MAIL_DATA_PATH, {
  ignored: /(^|[\/\\])\../, // ignore dotfiles
  persistent: true,
  ignoreInitial: true,
});

// Helper function to find group leader
const findGroupLeader = (groupId) => {
  const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
  if (!fs.existsSync(picsPath)) return null;

  const files = fs.readdirSync(picsPath).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const picData = readJsonFile(path.join(picsPath, file));
    if (
      picData &&
      picData.isLeader &&
      picData.groups &&
      picData.groups.includes(groupId)
    ) {
      return picData;
    }
  }
  return null;
};

watcher
  .on("add", (filePath) => {
    if (filePath.endsWith(".json") && filePath.includes("DungHan\\mustRep")) {
      console.log(`📁 New mail file detected: ${path.basename(filePath)}`);

      setTimeout(() => {
        try {
          const mailData = readJsonFile(filePath);
          if (mailData && !mailData.assignedTo) {
            // Assuming the group can be determined from the mail's "To" address or other logic
            // This is a placeholder for the actual logic to determine the group
            const groupId = "GROUP_ID_TO_BE_DETERMINED"; // Replace with actual logic

            const leader = findGroupLeader(groupId);
            if (leader) {
              mailData.assignedTo = {
                type: "pic",
                picId: leader.id,
                picName: leader.name,
                assignedAt: new Date().toISOString(),
              };
              writeJsonFile(filePath, mailData);
              console.log(
                `📧 Automatically assigned new mail ${path.basename(
                  filePath
                )} to leader ${leader.name}`
              );
            }
          }
        } catch (error) {
          console.error(
            `Error auto-assigning mail ${path.basename(filePath)}:`,
            error
          );
        }
        checkForNewMails();
      }, 1000);
    } else if (filePath.endsWith(".json")) {
      console.log(`📁 New file detected: ${path.basename(filePath)}`);
      setTimeout(checkForNewMails, 500);
    }
  })
  .on("change", (filePath) => {
    if (filePath.endsWith(".json")) {
      console.log(`📁 File changed: ${path.basename(filePath)}`);
      setTimeout(checkForNewMails, 500);
    }
  })
  .on("unlink", (filePath) => {
    if (filePath.endsWith(".json")) {
      console.log(`📁 File deleted: ${path.basename(filePath)}`);
      setTimeout(checkForNewMails, 500);
    }
  });

// Periodic check (backup mechanism) - DISABLED for performance
// setInterval(checkForNewMails, 30000); // Check every 30 seconds

// Periodic check for expired mails and auto-move them - DISABLED for performance
// setInterval(() => {
//   console.log('⏰ Auto-checking for expired mails...');
//   moveExpiredMails();
// }, 60000); // Check every 1 minute

// Assignment API endpoints
app.get("/api/groups", (req, res) => {
  const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");
  const groups = [];

  if (fs.existsSync(groupsPath)) {
    const files = fs.readdirSync(groupsPath).filter((f) => f.endsWith(".json"));
    files.forEach((file) => {
      const groupData = readJsonFile(path.join(groupsPath, file));
      if (groupData) {
        groups.push({
          id: path.parse(file).name,
          fileName: file,
          ...groupData,
        });
      }
    });
  }

  res.json(groups);
});

app.get("/api/pics", (req, res) => {
  const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
  const pics = [];

  if (fs.existsSync(picsPath)) {
    const files = fs.readdirSync(picsPath).filter((f) => f.endsWith(".json"));
    files.forEach((file) => {
      const picData = readJsonFile(path.join(picsPath, file));
      if (picData) {
        pics.push({
          id: path.parse(file).name,
          fileName: file,
          ...picData,
        });
      }
    });
  }

  res.json(pics);
});

app.get("/api/assignments", (req, res) => {
  const assignmentsPath = path.join(ASSIGNMENT_DATA_PATH, "Assignments");
  const assignments = [];

  if (fs.existsSync(assignmentsPath)) {
    const files = fs
      .readdirSync(assignmentsPath)
      .filter((f) => f.endsWith(".json"));
    files.forEach((file) => {
      const assignmentData = readJsonFile(path.join(assignmentsPath, file));
      if (assignmentData) {
        assignments.push({
          id: path.parse(file).name,
          fileName: file,
          ...assignmentData,
        });
      }
    });
  }

  res.json(assignments);
});

app.post("/api/groups", (req, res) => {
  const { name, members, description } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Group name is required" });
  }

  const groupId = Date.now().toString();
  const fileName = `${groupId}.json`;
  const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");

  // Create directory if not exists
  if (!fs.existsSync(groupsPath)) {
    fs.mkdirSync(groupsPath, { recursive: true });
  }

  const groupData = {
    id: groupId,
    name,
    members: members || [],
    description: description || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(groupsPath, fileName);
  if (writeJsonFile(filePath, groupData)) {
    res.json({ success: true, group: groupData });
  } else {
    res.status(500).json({ success: false, error: "Failed to create group" });
  }
});

app.post("/api/refresh-pics", (req, res) => {
  try {
    // This endpoint could re-scan the PICs and Groups directories
    // and broadcast an update to clients if needed.
    // For now, just a success message.
    broadcastToClients("picsUpdated", { timestamp: new Date() });
    res.json({ success: true, message: "PICs refreshed" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to refresh PICs" });
  }
});

app.post("/api/pics", (req, res) => {
  const { name, email, groups, isLeader } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required" });
  }

  const picId = Date.now().toString();
  const fileName = `${picId}.json`;
  const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");

  // Create directory if not exists
  if (!fs.existsSync(picsPath)) {
    fs.mkdirSync(picsPath, { recursive: true });
  }

  const picData = {
    id: picId,
    name,
    email,
    groups: groups || [],
    isLeader: isLeader || false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const filePath = path.join(picsPath, fileName);
  if (writeJsonFile(filePath, picData)) {
    res.json({ success: true, pic: picData });
  } else {
    res.status(500).json({ success: false, error: "Failed to create PIC" });
  }
});

// Update group
app.put("/api/groups/:id", (req, res) => {
  const { id } = req.params;
  const { name, members, description } = req.body;

  const fileName = `${id}.json`;
  const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");
  const filePath = path.join(groupsPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Group not found" });
  }

  const existingGroup = readJsonFile(filePath);
  if (!existingGroup) {
    return res.status(500).json({ error: "Failed to read group data" });
  }

  const updatedGroup = {
    ...existingGroup,
    name: name || existingGroup.name,
    members: members !== undefined ? members : existingGroup.members,
    description:
      description !== undefined ? description : existingGroup.description,
    updatedAt: new Date().toISOString(),
  };

  if (writeJsonFile(filePath, updatedGroup)) {
    res.json({ success: true, group: updatedGroup });
  } else {
    res.status(500).json({ success: false, error: "Failed to update group" });
  }
});

// Update PIC
app.put("/api/pics/:id", (req, res) => {
  const { id } = req.params;
  const { name, email, groups, isLeader } = req.body;

  const fileName = `${id}.json`;
  const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
  const filePath = path.join(picsPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PIC not found" });
  }

  const existingPic = readJsonFile(filePath);
  if (!existingPic) {
    return res.status(500).json({ error: "Failed to read PIC data" });
  }

  const updatedPic = {
    ...existingPic,
    name: name || existingPic.name,
    email: email || existingPic.email,
    groups: groups !== undefined ? groups : existingPic.groups,
    isLeader: isLeader !== undefined ? isLeader : existingPic.isLeader,
    updatedAt: new Date().toISOString(),
  };

  if (writeJsonFile(filePath, updatedPic)) {
    res.json({ success: true, pic: updatedPic });
  } else {
    res.status(500).json({ success: false, error: "Failed to update PIC" });
  }
});

// Delete group
app.delete("/api/groups/:id", (req, res) => {
  const { id } = req.params;
  const fileName = `${id}.json`;
  const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");
  const filePath = path.join(groupsPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Group not found" });
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete group" });
  }
});

// Delete PIC
app.delete("/api/pics/:id", (req, res) => {
  const { id } = req.params;
  const fileName = `${id}.json`;
  const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
  const filePath = path.join(picsPath, fileName);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "PIC not found" });
  }

  try {
    fs.unlinkSync(filePath);
    res.json({ success: true, message: "PIC deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to delete PIC" });
  }
});

// Assign mail to group/PIC
app.post("/api/assign-mail", (req, res) => {
  const { mailId, groupId, picId, assignmentType } = req.body;

  if (!mailId || (!groupId && !picId)) {
    return res
      .status(400)
      .json({ error: "Mail ID and either Group ID or PIC ID are required" });
  }

  // Find the mail file
  let mailData = null;
  let mailFilePath = null;

  const folders = [
    "DungHan/mustRep",
    "DungHan",
    "QuaHan/chuaRep",
    "QuaHan/daRep",
    "ReviewMail",
  ];

  for (const folder of folders) {
    const folderPath = path.join(MAIL_DATA_PATH, folder);
    const fileName = `${mailId}.json`;
    const filePath = path.join(folderPath, fileName);

    if (fs.existsSync(filePath)) {
      mailData = readJsonFile(filePath);
      mailFilePath = filePath;
      break;
    }
  }

  if (!mailData) {
    return res.status(404).json({ error: "Mail not found" });
  }

  // Create assignment object
  const assignmentData = {
    type: assignmentType || (groupId ? "group" : "pic"),
    groupId: groupId || null,
    picId: picId || null,
    assignedAt: new Date().toISOString(),
  };

  // Populate names based on assignment type
  if (assignmentData.type === "pic" && picId) {
    const picsPath = path.join(ASSIGNMENT_DATA_PATH, "PIC");
    const picFileName = `${picId}.json`;
    const picFilePath = path.join(picsPath, picFileName);

    if (fs.existsSync(picFilePath)) {
      const picData = readJsonFile(picFilePath);
      if (picData) {
        assignmentData.picName = picData.name;
        assignmentData.picEmail = picData.email;
      }
    }
  }

  if (assignmentData.type === "group" && groupId) {
    const groupsPath = path.join(ASSIGNMENT_DATA_PATH, "Groups");
    const groupFileName = `${groupId}.json`;
    const groupFilePath = path.join(groupsPath, groupFileName);

    if (fs.existsSync(groupFilePath)) {
      const groupData = readJsonFile(groupFilePath);
      if (groupData) {
        assignmentData.groupName = groupData.name;
      }
    }
  }

  // Update mail with assignment
  const updatedMail = {
    ...mailData,
    assignedTo: assignmentData,
    updatedAt: new Date().toISOString(),
  };

  if (writeJsonFile(mailFilePath, updatedMail)) {
    res.json({ success: true, mail: updatedMail });
  } else {
    res.status(500).json({ success: false, error: "Failed to assign mail" });
  }
});

// Get assigned mails for a group or PIC
app.get("/api/assigned-mails", (req, res) => {
  const { groupId, picId } = req.query;

  const assignedMails = [];
  const folders = [
    "DungHan/mustRep",
    "DungHan",
    "QuaHan/chuaRep",
    "QuaHan/daRep",
    "ReviewMail",
  ];

  folders.forEach((folder) => {
    const folderPath = path.join(MAIL_DATA_PATH, folder);
    if (fs.existsSync(folderPath)) {
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.endsWith(".json"));
      files.forEach((file) => {
        const mailData = readJsonFile(path.join(folderPath, file));
        if (mailData && mailData.assignedTo) {
          // If no specific groupId or picId is provided, return all assigned mails
          // If groupId or picId is provided, filter by that
          let shouldInclude = false;

          if (!groupId && !picId) {
            shouldInclude = true; // Return all assigned mails
          } else if (groupId && groupId !== "all") {
            shouldInclude = mailData.assignedTo.groupId === groupId;
          } else if (picId && picId !== "all") {
            shouldInclude = mailData.assignedTo.picId === picId;
          } else if (groupId === "all" || picId === "all") {
            shouldInclude = true; // Return all assigned mails
          }

          if (shouldInclude) {
            const enrichedMail = enrichMailWithAssignmentInfo(mailData);
            assignedMails.push({
              id: path.parse(file).name,
              fileName: file,
              folder: folder,
              ...enrichedMail,
            });
          }
        }
      });
    }
  });

  res.json(assignedMails);
});

// Unassign mail
app.post("/api/unassign-mail", (req, res) => {
  const { mailId } = req.body;

  if (!mailId) {
    return res.status(400).json({ error: "Mail ID is required" });
  }

  // Find the mail file
  let mailData = null;
  let mailFilePath = null;

  const folders = [
    "DungHan/mustRep",
    "DungHan",
    "QuaHan/chuaRep",
    "QuaHan/daRep",
    "ReviewMail",
  ];

  for (const folder of folders) {
    const folderPath = path.join(MAIL_DATA_PATH, folder);
    const fileName = `${mailId}.json`;
    const filePath = path.join(folderPath, fileName);

    if (fs.existsSync(filePath)) {
      mailData = readJsonFile(filePath);
      mailFilePath = filePath;
      break;
    }
  }

  if (!mailData) {
    return res.status(404).json({ error: "Mail not found" });
  }

  // Remove assignment
  const updatedMail = {
    ...mailData,
    updatedAt: new Date().toISOString(),
  };

  // Remove assignedTo field
  delete updatedMail.assignedTo;

  if (writeJsonFile(mailFilePath, updatedMail)) {
    res.json({ success: true, mail: updatedMail });
  } else {
    res.status(500).json({ success: false, error: "Failed to unassign mail" });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    uptime: process.uptime(),
    connectedClients: connectedClients.size,
    mailStats,
    timestamp: new Date(),
  });
});

// API endpoint để lấy thống kê server
app.get("/api/server-stats", (req, res) => {
  try {
    const stats = {
      status: "online",
      uptime: process.uptime(),
      connectedClients: connectedClients.size,
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage(),
      version: process.version,
      platform: process.platform,
      timestamp: new Date().toISOString(),
    };
    res.json(stats);
  } catch (error) {
    console.error("Error getting server stats:", error);
    res.status(500).json({ error: "Failed to get server stats" });
  }
});

// API endpoint để restart server
app.post("/api/server-restart", (req, res) => {
  try {
    res.json({ success: true, message: "Server restart initiated" });

    // Restart server sau 1 giây
    setTimeout(() => {
      console.log("🔄 Server restart requested via API");
      process.exit(0);
    }, 1000);
  } catch (error) {
    console.error("Error restarting server:", error);
    res.status(500).json({ error: "Failed to restart server" });
  }
});

// Function to check if mail is expired (over 24 hours)
const isMailExpired = (dateArray) => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length === 0) {
    return false;
  }

  try {
    const [date, time] = dateArray;
    let mailDate;

    if (time) {
      mailDate = new Date(`${date}T${time}`);
    } else {
      mailDate = new Date(date);
    }

    if (isNaN(mailDate.getTime())) {
      return false;
    }

    const currentDate = new Date();
    const hoursDiff = (currentDate - mailDate) / (1000 * 60 * 60);

    return hoursDiff > 24;
  } catch (error) {
    console.error("Error checking mail expiry:", error);
    return false;
  }
};

// Function to move expired mails from DungHan to QuaHan
const moveExpiredMails = () => {
  console.log("🔄 Checking for expired mails to move...");

  const dungHanMustRepPath = path.join(MAIL_DATA_PATH, "DungHan", "mustRep");
  const quaHanChuaRepPath = path.join(MAIL_DATA_PATH, "QuaHan", "chuaRep");

  // Ensure QuaHan/chuaRep directory exists
  if (!fs.existsSync(quaHanChuaRepPath)) {
    fs.mkdirSync(quaHanChuaRepPath, { recursive: true });
  }

  if (!fs.existsSync(dungHanMustRepPath)) {
    console.log("⚠️ DungHan/mustRep directory not found");
    return { moved: 0, errors: [] };
  }

  const files = fs
    .readdirSync(dungHanMustRepPath)
    .filter((f) => f.endsWith(".json"));
  let movedCount = 0;
  const errors = [];

  files.forEach((fileName) => {
    try {
      const sourceFilePath = path.join(dungHanMustRepPath, fileName);
      const mailData = readJsonFile(sourceFilePath);

      if (mailData && mailData.Date && isMailExpired(mailData.Date)) {
        const targetFilePath = path.join(quaHanChuaRepPath, fileName);

        // Copy file to QuaHan/chuaRep
        fs.copyFileSync(sourceFilePath, targetFilePath);

        // Delete original file from DungHan/mustRep
        fs.unlinkSync(sourceFilePath);

        movedCount++;
        console.log(`📦 Moved expired mail: ${fileName} -> QuaHan/chuaRep`);
      }
    } catch (error) {
      console.error(`❌ Error moving file ${fileName}:`, error.message);
      errors.push({ fileName, error: error.message });
    }
  });

  if (movedCount > 0) {
    console.log(`✅ Moved ${movedCount} expired mails to QuaHan`);
    // Broadcast update to clients
    setTimeout(() => {
      const updatedStats = scanMailDirectory();
      broadcastToClients("mailStatsUpdate", updatedStats);
      broadcastToClients("mailsUpdated", {
        type: "expired_moved",
        count: movedCount,
      });
    }, 1000);
  }

  return { moved: movedCount, errors };
};

// API endpoint to manually trigger expired mail movement
app.post("/api/move-expired-mails", (req, res) => {
  try {
    const result = moveExpiredMails();
    res.json({
      success: true,
      message: `Moved ${result.moved} expired mails`,
      moved: result.moved,
      errors: result.errors,
    });
  } catch (error) {
    console.error("Error moving expired mails:", error);
    res.status(500).json({ error: "Failed to move expired mails" });
  }
});

// API endpoint to move mail to review
app.post("/api/move-to-review", (req, res) => {
  try {
    const { mailId, mailData } = req.body;

    if (!mailId || !mailData) {
      return res
        .status(400)
        .json({ error: "Mail ID and mail data are required" });
    }

    console.log(`📤 Moving mail to review: ${mailData.Subject}`);
    console.log(`📂 Original category: ${mailData.category}`);
    console.log(`📊 Original status: ${mailData.status}`);
    console.log(
      `⏰ Existing dateMoved: ${
        mailData.dateMoved ? JSON.stringify(mailData.dateMoved) : "None"
      }`
    );

    // Create ReviewMail directory if it doesn't exist
    const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
    if (!fs.existsSync(reviewMailPath)) {
      fs.mkdirSync(reviewMailPath, { recursive: true });
    }

    // Create new mail data with review category and date moved
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0]; // YYYY-MM-DD
    const timeStr = now.toTimeString().slice(0, 5); // HH:MM

    console.log(`🕒 New dateMoved will be: [${dateStr}, ${timeStr}]`);

    // Create review mail data with fresh dateMoved (always update to current time)
    const reviewMailData = {
      ...mailData,
      category: "ReviewMail",
      dateMoved: [dateStr, timeStr], // Always use current date/time when moving to review
      originalCategory:
        mailData.originalCategory || mailData.category || "Unknown",
      originalStatus: mailData.originalStatus || mailData.status || "Unknown",
    };

    // Remove any existing dateMoved from original mail data to ensure fresh timestamp
    delete reviewMailData.dateMoved;
    reviewMailData.dateMoved = [dateStr, timeStr];

    // Generate filename for review mail - preserve original filename/ID
    let fileName = mailData.fileName;

    // If no fileName, extract from filePath
    if (!fileName && mailData.filePath) {
      fileName = path.basename(mailData.filePath);
    }

    // If still no fileName, use ID if available, otherwise fallback to Subject
    if (!fileName) {
      if (mailData.id) {
        fileName = `${mailData.id}.json`;
      } else {
        fileName = `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
      }
    }

    console.log(`📝 Using filename for review: ${fileName}`);
    const reviewFilePath = path.join(reviewMailPath, fileName);

    // Write the mail to ReviewMail folder
    if (writeJsonFile(reviewFilePath, reviewMailData)) {
      // Find and remove original mail file
      const originalFilePath = findMailFile(mailData);
      if (originalFilePath && fs.existsSync(originalFilePath)) {
        try {
          fs.unlinkSync(originalFilePath);
          console.log(`📧 Moved mail to review: ${mailData.Subject}`);
        } catch (error) {
          console.error("Error removing original mail file:", error);
        }
      }

      // Broadcast update to all clients
      broadcastToClients("mailMoved", {
        type: "moved_to_review",
        mailId,
        subject: mailData.Subject,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: `Mail "${mailData.Subject}" moved to review section`,
        reviewMailData,
      });
    } else {
      res.status(500).json({ error: "Failed to move mail to review section" });
    }
  } catch (error) {
    console.error("Error moving mail to review:", error);
    res.status(500).json({ error: "Failed to move mail to review section" });
  }
});

// API endpoint to move mail back from review to original location
app.post("/api/move-back-from-review", (req, res) => {
  try {
    const { mailId, mailData } = req.body;

    if (!mailId || !mailData) {
      return res
        .status(400)
        .json({ error: "Mail ID and mail data are required" });
    }

    console.log(`📤 Moving mail back from review: ${mailData.Subject}`);
    console.log(`📂 Original category: ${mailData.originalCategory}`);
    console.log(`📊 Original status: ${mailData.originalStatus}`);

    // Determine original folder path based on originalCategory and originalStatus
    let originalFolderPath;
    if (mailData.originalCategory === "DungHan") {
      originalFolderPath = path.join(
        MAIL_DATA_PATH,
        "DungHan",
        mailData.originalStatus || "mustRep"
      );
    } else if (mailData.originalCategory === "QuaHan") {
      originalFolderPath = path.join(
        MAIL_DATA_PATH,
        "QuaHan",
        mailData.originalStatus || "chuaRep"
      );
    } else {
      // Fallback: determine by isExpired
      if (mailData.isExpired) {
        originalFolderPath = path.join(
          MAIL_DATA_PATH,
          "QuaHan",
          mailData.originalStatus || "chuaRep"
        );
      } else {
        originalFolderPath = path.join(
          MAIL_DATA_PATH,
          "DungHan",
          mailData.originalStatus || "mustRep"
        );
      }
    }

    console.log(`📁 Target folder: ${originalFolderPath}`);

    // Ensure target directory exists
    if (!fs.existsSync(originalFolderPath)) {
      fs.mkdirSync(originalFolderPath, { recursive: true });
    }

    // Restore original mail data (remove review-specific fields)
    const restoredMailData = {
      ...mailData,
      category:
        mailData.originalCategory ||
        (mailData.isExpired ? "QuaHan" : "DungHan"),
      status:
        mailData.originalStatus || (mailData.isExpired ? "chuaRep" : "mustRep"),
    };

    // Remove review-specific fields
    delete restoredMailData.dateMoved;
    delete restoredMailData.originalCategory;
    delete restoredMailData.originalStatus;

    // Generate filename for restored mail - preserve original filename/ID
    let fileName = mailData.fileName;

    // If no fileName, extract from filePath
    if (!fileName && mailData.filePath) {
      fileName = path.basename(mailData.filePath);
    }

    // If still no fileName, use ID if available, otherwise fallback to Subject
    if (!fileName) {
      if (mailData.id) {
        fileName = `${mailData.id}.json`;
      } else {
        fileName = `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
      }
    }

    console.log(`📝 Using filename for restore: ${fileName}`);
    const restoredFilePath = path.join(originalFolderPath, fileName);

    // Write restored mail to original location
    const writeSuccess = writeJsonFile(restoredFilePath, restoredMailData);

    if (writeSuccess) {
      console.log(`✅ Mail restored to: ${restoredFilePath}`);

      // Remove mail from ReviewMail folder
      const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
      const reviewFileName =
        mailData.fileName ||
        `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
      const reviewFilePath = path.join(reviewMailPath, reviewFileName);

      if (fs.existsSync(reviewFilePath)) {
        fs.unlinkSync(reviewFilePath);
        console.log(`🗑️ Removed from review folder: ${reviewFilePath}`);
      }

      res.json({
        success: true,
        message: `Mail "${mailData.Subject}" moved back to original location`,
        restoredMailData,
        originalPath: restoredFilePath,
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to move mail back to original location" });
    }
  } catch (error) {
    console.error("Error moving mail back from review:", error);
    res.status(500).json({ error: "Failed to move mail back from review" });
  }
});

// Helper function to find mail file path
const findMailFile = (mailData) => {
  // First try to use the actual fileName if available
  let fileName = mailData.fileName;

  // If no fileName, try to use filePath
  if (!fileName && mailData.filePath) {
    fileName = path.basename(mailData.filePath);
  }

  // If still no fileName, use ID if available, otherwise fallback to Subject
  if (!fileName) {
    if (mailData.id) {
      fileName = `${mailData.id}.json`;
    } else {
      fileName = `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
    }
  }

  console.log(`🔍 Looking for mail file: ${fileName}`);

  // Search in all possible mail folders
  const searchFolders = [
    "DungHan/mustRep",
    "DungHan",
    "QuaHan/chuaRep",
    "QuaHan/daRep",
    "QuaHan",
    "ReviewMail",
  ];

  for (const folder of searchFolders) {
    const folderPath = path.join(MAIL_DATA_PATH, folder);
    if (fs.existsSync(folderPath)) {
      const filePath = path.join(folderPath, fileName);
      if (fs.existsSync(filePath)) {
        console.log(`📁 Found mail file: ${filePath}`);
        return filePath;
      }
    }
  }

  console.log(`❌ Mail file not found: ${fileName}`);
  return null;
};

// API endpoint to move mail back from review to original location
app.post("/api/move-back-from-review", (req, res) => {
  try {
    const { mailId, mailData } = req.body;

    if (!mailId || !mailData) {
      return res
        .status(400)
        .json({ error: "Mail ID and mail data are required" });
    }

    // Determine original location based on stored metadata
    const originalCategory = mailData.originalCategory || "DungHan";
    const originalStatus = mailData.originalStatus || "mustRep";

    // Create target directory path
    let targetFolder;
    if (originalCategory === "DungHan") {
      targetFolder =
        originalStatus === "mustRep" ? "DungHan/mustRep" : "DungHan";
    } else if (originalCategory === "QuaHan") {
      targetFolder =
        originalStatus === "chuaRep" ? "QuaHan/chuaRep" : "QuaHan/daRep";
    } else {
      targetFolder = "DungHan/mustRep"; // Default fallback
    }

    const targetPath = path.join(MAIL_DATA_PATH, targetFolder);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true });
    }

    // Create restored mail data (remove review-specific fields)
    const restoredMailData = {
      ...mailData,
      category: originalCategory,
      status: originalStatus,
    };

    // Remove review-specific fields
    delete restoredMailData.dateMoved;
    delete restoredMailData.originalCategory;
    delete restoredMailData.originalStatus;

    // Generate filename for restored mail - preserve original filename/ID
    let fileName = mailData.fileName;

    // If no fileName, extract from filePath
    if (!fileName && mailData.filePath) {
      fileName = path.basename(mailData.filePath);
    }

    // If still no fileName, use ID if available, otherwise fallback to Subject
    if (!fileName) {
      if (mailData.id) {
        fileName = `${mailData.id}.json`;
      } else {
        fileName = `${mailData.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
      }
    }

    console.log(`📝 Using filename for restore: ${fileName}`);
    const restoredFilePath = path.join(targetPath, fileName);

    // Write the mail to original location
    if (writeJsonFile(restoredFilePath, restoredMailData)) {
      // Remove from ReviewMail folder
      const reviewFilePath = path.join(MAIL_DATA_PATH, "ReviewMail", fileName);
      if (fs.existsSync(reviewFilePath)) {
        try {
          fs.unlinkSync(reviewFilePath);
          console.log(`📧 Moved mail back from review: ${mailData.Subject}`);
        } catch (error) {
          console.error("Error removing review mail file:", error);
        }
      }

      // Broadcast update to all clients
      broadcastToClients("mailMoved", {
        type: "moved_back_from_review",
        mailId,
        subject: mailData.Subject,
        targetLocation: `${originalCategory}/${originalStatus}`,
        timestamp: new Date(),
      });

      res.json({
        success: true,
        message: `Mail "${mailData.Subject}" moved back to ${originalCategory}/${originalStatus}`,
        restoredMailData,
      });
    } else {
      res
        .status(500)
        .json({ error: "Failed to move mail back from review section" });
    }
  } catch (error) {
    console.error("Error moving mail back from review:", error);
    res
      .status(500)
      .json({ error: "Failed to move mail back from review section" });
  }
});

// API endpoint to move selected mails to expired
app.post("/api/move-selected-to-expired", (req, res) => {
  try {
    const { selectedMailIds } = req.body;

    if (
      !selectedMailIds ||
      !Array.isArray(selectedMailIds) ||
      selectedMailIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Selected mail IDs array is required" });
    }

    let movedCount = 0;
    const errors = [];

    // Load all mails to find the selected ones
    const allMails = loadAllMails();

    selectedMailIds.forEach((mailId) => {
      try {
        // Find the mail by ID
        const mail = allMails.find(
          (m) => (m.id || `${m.Subject}-${m.From}`) === mailId
        );

        if (!mail) {
          errors.push(`Mail with ID ${mailId} not found`);
          return;
        }

        // Only move if mail is not already expired
        if (!mail.isExpired) {
          // Create expired mail directories if they don't exist
          const expiredUnrepliedPath = path.join(
            MAIL_DATA_PATH,
            "QuaHan",
            "chuaRep"
          );
          if (!fs.existsSync(expiredUnrepliedPath)) {
            fs.mkdirSync(expiredUnrepliedPath, { recursive: true });
          }

          // Update mail data for expired status
          const expiredMailData = {
            ...mail,
            category: "QuaHan",
            status: "chuaRep",
            isExpired: true,
            expiredDate: new Date().toISOString().split("T"), // [date, time] format
          };

          // Generate filename - preserve original filename/ID
          let fileName = mail.fileName;

          // If no fileName, extract from filePath
          if (!fileName && mail.filePath) {
            fileName = path.basename(mail.filePath);
          }

          // If still no fileName, use ID if available, otherwise fallback to Subject
          if (!fileName) {
            if (mail.id) {
              fileName = `${mail.id}.json`;
            } else {
              fileName = `${mail.Subject.replace(/[<>:"/\\|?*]/g, "_")}.json`;
            }
          }

          console.log(`📝 Using filename for expired: ${fileName}`);
          const expiredFilePath = path.join(expiredUnrepliedPath, fileName);

          // Write to expired folder
          if (writeJsonFile(expiredFilePath, expiredMailData)) {
            // Remove from original location
            const originalFilePath = findMailFile(mail);
            if (originalFilePath && fs.existsSync(originalFilePath)) {
              try {
                fs.unlinkSync(originalFilePath);
                movedCount++;
                console.log(`📧 Moved mail to expired: ${mail.Subject}`);
              } catch (error) {
                errors.push(
                  `Failed to remove original file for: ${mail.Subject}`
                );
              }
            }
          } else {
            errors.push(
              `Failed to write expired mail file for: ${mail.Subject}`
            );
          }
        }
      } catch (error) {
        errors.push(`Error processing mail ${mailId}: ${error.message}`);
      }
    });

    // Broadcast update to all clients
    if (movedCount > 0) {
      broadcastToClients("mailsUpdated", {
        type: "expired_moved",
        count: movedCount,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      message: `Moved ${movedCount} mail(s) to expired section`,
      movedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error moving selected mails to expired:", error);
    res
      .status(500)
      .json({ error: "Failed to move selected mails to expired section" });
  }
});

// API endpoint to move selected mails to review
app.post("/api/move-selected-to-review", (req, res) => {
  try {
    const { selectedMailIds } = req.body;

    if (
      !selectedMailIds ||
      !Array.isArray(selectedMailIds) ||
      selectedMailIds.length === 0
    ) {
      return res
        .status(400)
        .json({ error: "Selected mail IDs array is required" });
    }

    let movedCount = 0;
    const errors = [];
    const reviewMailPath = path.join(MAIL_DATA_PATH, "ReviewMail");
    if (!fs.existsSync(reviewMailPath)) {
      fs.mkdirSync(reviewMailPath, { recursive: true });
    }

    const allMails = loadAllMails();

    selectedMailIds.forEach((mailId) => {
      const mailData = allMails.find(
        (m) => (m.id || `${m.Subject}-${m.From}`) === mailId
      );

      if (!mailData) {
        errors.push(`Mail with ID ${mailId} not found`);
        return;
      }

      try {
        const originalFilePath = findMailFile(mailData);
        if (!originalFilePath || !fs.existsSync(originalFilePath)) {
          errors.push(`Mail file not found for: ${mailData.Subject}`);
          return;
        }

        const now = new Date();
        const dateStr = now.toISOString().split("T")[0];
        const timeStr = now.toTimeString().slice(0, 5);

        const reviewMailData = {
          ...mailData,
          category: "ReviewMail",
          dateMoved: [dateStr, timeStr],
          originalCategory: mailData.category || "Unknown",
          originalStatus: mailData.status || "Unknown",
        };
        const fileName =
          mailData.fileName || `${path.basename(mailData.filePath)}`;
        const reviewFilePath = path.join(reviewMailPath, fileName);

        if (writeJsonFile(reviewFilePath, reviewMailData)) {
          fs.unlinkSync(originalFilePath);
          movedCount++;
        } else {
          errors.push(
            `Failed to write review mail file for: ${mailData.Subject}`
          );
        }
      } catch (error) {
        errors.push(
          `Error processing mail ${mailData.Subject}: ${error.message}`
        );
      }
    });

    if (movedCount > 0) {
      broadcastToClients("mailsUpdated", {
        type: "moved_to_review",
        count: movedCount,
        timestamp: new Date(),
      });
    }

    res.json({
      success: true,
      message: `Moved ${movedCount} mail(s) to review section`,
      movedCount,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error moving selected mails to review:", error);
    res
      .status(500)
      .json({ error: "Failed to move selected mails to review section" });
  }
});

// API endpoint để clear cache
app.post("/api/clear-cache", (req, res) => {
  try {
    // Reset mail stats cache
    mailStats = scanMailDirectory();

    // Broadcast updated stats
    broadcastToClients("mailStatsUpdate", mailStats);

    res.json({ success: true, message: "Cache cleared successfully" });
    console.log("🗑️ Cache cleared via API");
  } catch (error) {
    console.error("Error clearing cache:", error);
    res.status(500).json({ error: "Failed to clear cache" });
  }
});

// Authentication APIs
app.post("/api/register", (req, res) => {
  const { username, email, password, fullName, role } = req.body;

  // Validation
  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ error: "All fields are required" });
  }

  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: "Password must be at least 6 characters long" });
  }

  // Check if user already exists
  if (userExists(username)) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Check if email already exists
  try {
    const userDataDir = USER_DATA_PATH;
    if (fs.existsSync(userDataDir)) {
      const userFiles = fs.readdirSync(userDataDir);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(userDataDir, file));
          if (userData && userData.email === email) {
            return res.status(400).json({ error: "Email already exists" });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking email existence:", error);
  }

  try {
    // Hash password
    const { salt, hash } = hashPassword(password);

    // Create user data
    const userData = {
      username,
      email,
      fullName,
      role: role || "user",
      passwordHash: hash,
      passwordSalt: salt,
    };

    // Save user
    const savedUser = saveUser(userData);

    // Return success (without sensitive data)
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: savedUser.id,
        username: savedUser.username,
        email: savedUser.email,
        fullName: savedUser.fullName,
        role: savedUser.role,
        createdAt: savedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    console.log(`[Login Attempt] Username: ${username}`);

    // Get user data
    const userData = getUser(username);
    console.log(
      "[Login Attempt] Fetched userData:",
      userData ? "Found" : "Not Found"
    );

    if (!userData) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    if (!userData.isActive) {
      return res.status(401).json({ error: "Account is deactivated" });
    }

    // Verify password
    let isValidPassword = false;
    try {
      console.log("[Login Attempt] Verifying password...");
      isValidPassword = verifyPassword(
        password,
        userData.passwordSalt,
        userData.passwordHash
      );
      console.log(
        "[Login Attempt] Password verification result:",
        isValidPassword
      );
    } catch (verifyError) {
      console.error(
        "!!! Password verification failed with an error:",
        verifyError
      );
      // This will be caught by the outer catch block
      throw verifyError;
    }

    if (!isValidPassword) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Generate simple token (in production, use JWT)
    const token = crypto.randomBytes(32).toString("hex");

    // Return success
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: userData.id,
        username: userData.username,
        email: userData.email,
        fullName: userData.fullName,
        role: userData.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get all users (admin only)
app.get("/api/users", (req, res) => {
  try {
    createUserDirectory();
    const users = [];

    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);

      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData) {
            // Remove sensitive data and map to expected format
            const { passwordHash, passwordSalt, ...safeUserData } = userData;

            // Map role to isAdmin for frontend compatibility
            const mappedUser = {
              ...safeUserData,
              isAdmin: userData.role === "admin",
              department: userData.department || "",
              phone: userData.phone || "",
              lastLogin: userData.lastLogin || null,
            };

            users.push(mappedUser);
          }
        }
      }
    }

    console.log(`✅ Loaded ${users.length} users`);
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// Update user profile
app.put("/api/users/:username", (req, res) => {
  const { username } = req.params;
  const updateData = req.body;

  try {
    // Get current user data
    const userData = getUser(username);

    if (!userData) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update user data (excluding sensitive fields)
    const updatedUser = {
      ...userData,
      ...updateData,
      // Preserve sensitive fields
      id: userData.id,
      passwordHash: userData.passwordHash,
      passwordSalt: userData.passwordSalt,
      createdAt: userData.createdAt,
      updatedAt: new Date().toISOString(),
    };

    // Save updated user
    const userFilePath = getUserFilePath(username);
    fs.writeFileSync(userFilePath, JSON.stringify(updatedUser, null, 2));

    // Return updated user (without sensitive data)
    const { passwordHash, passwordSalt, ...safeUserData } = updatedUser;

    res.json({
      success: true,
      message: "Profile updated successfully",
      user: safeUserData,
    });

    console.log(`✅ User profile updated: ${username}`);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// Create new user (admin only)
app.post("/api/users", (req, res) => {
  const { username, email, fullName, department, phone, isAdmin, isActive } =
    req.body;

  // Validation
  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: "Username and email are required",
    });
  }

  // Check if username already exists
  if (userExists(username)) {
    return res.status(400).json({
      success: false,
      error: "Username already exists",
    });
  }

  // Check if email already exists
  try {
    createUserDirectory();
    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.email === email) {
            return res.status(400).json({
              success: false,
              error: "Email already exists",
            });
          }
        }
      }
    }
  } catch (error) {
    console.error("Error checking email:", error);
  }

  try {
    // Generate unique ID (timestamp + random string)
    const uniqueId =
      Date.now().toString() + Math.random().toString(36).substr(2, 9);

    // Create user data matching existing structure
    const userData = {
      id: uniqueId,
      username,
      email,
      fullName: fullName || "",
      role: isAdmin ? "admin" : "user",
      // Note: passwordHash and passwordSalt should be set during actual registration
      // For now, we'll create users without passwords (they need to be set separately)
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: isActive !== false, // Default to true
      // Additional fields for frontend compatibility
      department: department || "",
      phone: phone || "",
      lastLogin: null,
    };

    // Save user
    createUserDirectory();
    const userFilePath = getUserFilePath(username);
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));

    console.log(`✅ User created: ${username}`);

    // Return success (without sensitive data)
    const { passwordHash, passwordSalt, ...safeUserData } = userData;
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...safeUserData,
        isAdmin: userData.role === "admin",
      },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create user",
    });
  }
});

// Delete user (admin only)
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  try {
    createUserDirectory();
    let userToDelete = null;
    let userFilePath = null;

    // Find user by ID
    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.id === id) {
            userToDelete = userData;
            userFilePath = path.join(USER_DATA_PATH, file);
            break;
          }
        }
      }
    }

    if (!userToDelete) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if this is the last admin
    if (userToDelete.role === "admin") {
      const users = [];
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData) {
            users.push(userData);
          }
        }
      }

      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete the last admin user",
        });
      }
    }

    // Delete user file
    fs.unlinkSync(userFilePath);

    console.log(`✅ User deleted: ${userToDelete.username}`);

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete user",
    });
  }
});

// Toggle user admin status
app.put("/api/users/:id/admin", (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  try {
    createUserDirectory();
    let userToUpdate = null;
    let userFilePath = null;

    // Find user by ID
    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.id === id) {
            userToUpdate = userData;
            userFilePath = path.join(USER_DATA_PATH, file);
            break;
          }
        }
      }
    }

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if removing admin from last admin
    const currentIsAdmin = userToUpdate.role === "admin";
    if (currentIsAdmin && !isAdmin) {
      const users = [];
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData) {
            users.push(userData);
          }
        }
      }

      const adminCount = users.filter((u) => u.role === "admin").length;
      if (adminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot remove admin privileges from the last admin user",
        });
      }
    }

    // Update user role
    userToUpdate.role = isAdmin ? "admin" : "user";
    userToUpdate.updatedAt = new Date().toISOString();

    // Save updated user
    fs.writeFileSync(userFilePath, JSON.stringify(userToUpdate, null, 2));

    console.log(
      `✅ User admin status updated: ${userToUpdate.username} -> ${
        isAdmin ? "admin" : "user"
      }`
    );

    // Return updated user (without sensitive data)
    const { passwordHash, passwordSalt, ...safeUserData } = userToUpdate;

    res.json({
      success: true,
      message: "User admin status updated successfully",
      user: {
        ...safeUserData,
        isAdmin: userToUpdate.role === "admin",
      },
    });
  } catch (error) {
    console.error("Error updating user admin status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user admin status",
    });
  }
});

// Update user (admin only)
app.put("/api/users/:id", (req, res) => {
  const { id } = req.params;
  const { username, email, fullName, department, phone, isAdmin, isActive } =
    req.body;

  // Validation
  if (!username || !email) {
    return res.status(400).json({
      success: false,
      error: "Username and email are required",
    });
  }

  try {
    createUserDirectory();
    let userToUpdate = null;
    let userFilePath = null;

    // Find user by ID
    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.id === id) {
            userToUpdate = userData;
            userFilePath = path.join(USER_DATA_PATH, file);
            break;
          }
        }
      }
    }

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Check if username changed and already exists
    if (username !== userToUpdate.username && userExists(username)) {
      return res.status(400).json({
        success: false,
        error: "Username already exists",
      });
    }

    // Check if email changed and already exists
    if (email !== userToUpdate.email) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.id !== id && userData.email === email) {
            return res.status(400).json({
              success: false,
              error: "Email already exists",
            });
          }
        }
      }
    }

    // Update user data (preserve existing structure)
    userToUpdate.username = username;
    userToUpdate.email = email;
    userToUpdate.fullName = fullName || "";
    userToUpdate.role = isAdmin ? "admin" : "user";
    userToUpdate.isActive = isActive !== false; // Default to true
    userToUpdate.updatedAt = new Date().toISOString();

    // Update additional fields (these may not exist in original structure)
    if (department !== undefined) userToUpdate.department = department;
    if (phone !== undefined) userToUpdate.phone = phone;

    // If username changed, rename file
    if (username !== userToUpdate.username) {
      const newFilePath = getUserFilePath(username);
      fs.writeFileSync(newFilePath, JSON.stringify(userToUpdate, null, 2));
      fs.unlinkSync(userFilePath);
    } else {
      fs.writeFileSync(userFilePath, JSON.stringify(userToUpdate, null, 2));
    }

    console.log(`✅ User updated: ${username}`);

    // Return success (without sensitive data)
    const { passwordHash, passwordSalt, ...safeUserData } = userToUpdate;

    res.json({
      success: true,
      message: "User updated successfully",
      user: safeUserData,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user",
    });
  }
});

// Toggle user active status
app.put("/api/users/:id/status", (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  try {
    createUserDirectory();
    let userToUpdate = null;
    let userFilePath = null;

    // Find user by ID
    if (fs.existsSync(USER_DATA_PATH)) {
      const userFiles = fs.readdirSync(USER_DATA_PATH);
      for (const file of userFiles) {
        if (file.endsWith(".json")) {
          const userData = readJsonFile(path.join(USER_DATA_PATH, file));
          if (userData && userData.id === id) {
            userToUpdate = userData;
            userFilePath = path.join(USER_DATA_PATH, file);
            break;
          }
        }
      }
    }

    if (!userToUpdate) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Update user
    userToUpdate.isActive = isActive;
    userToUpdate.updatedAt = new Date().toISOString();

    // Save updated user
    fs.writeFileSync(userFilePath, JSON.stringify(userToUpdate, null, 2));

    console.log(
      `✅ User status updated: ${userToUpdate.username} -> ${
        isActive ? "active" : "inactive"
      }`
    );

    // Return updated user (without sensitive data)
    const { passwordHash, passwordSalt, ...safeUserData } = userToUpdate;

    res.json({
      success: true,
      message: "User status updated successfully",
      user: {
        ...safeUserData,
        isAdmin: userToUpdate.role === "admin",
      },
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update user status",
    });
  }
});

// Change user password
app.put("/api/users/:username/password", (req, res) => {
  const { username } = req.params;
  const { currentPassword, newPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      error: "Current password and new password are required",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      error: "New password must be at least 6 characters long",
    });
  }

  try {
    createUserDirectory();
    const userFilePath = getUserFilePath(username);

    // Check if user exists
    if (!fs.existsSync(userFilePath)) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    // Read user data
    const userData = readJsonFile(userFilePath);
    if (!userData) {
      return res.status(500).json({
        success: false,
        error: "Failed to read user data",
      });
    }

    // Verify current password
    const isCurrentPasswordValid = verifyPassword(
      currentPassword,
      userData.passwordSalt,
      userData.passwordHash
    );
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        error: "Current password is incorrect",
      });
    }

    // Hash new password
    const { salt, hash } = hashPassword(newPassword);

    // Update user data
    userData.passwordHash = hash;
    userData.passwordSalt = salt;
    userData.updatedAt = new Date().toISOString();

    // Save updated user
    fs.writeFileSync(userFilePath, JSON.stringify(userData, null, 2));

    console.log(`✅ Password changed for user: ${username}`);

    res.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({
      success: false,
      error: "Failed to change password",
    });
  }
});

// ==================== DECRYPTION API ENDPOINTS ====================

// Test decryption endpoint
app.get("/api/decrypt/test", (req, res) => {
  try {
    console.log("🔍 Testing decryption endpoint...");
    const result = testDecryption();

    res.json({
      success: true,
      message: "Decryption test completed",
      result: result,
    });
  } catch (error) {
    console.error("❌ Decryption test failed:", error);
    res.status(500).json({
      success: false,
      error: "Decryption test failed",
      details: error.message,
    });
  }
});

// Decrypt single text endpoint
app.post("/api/decrypt/text", (req, res) => {
  try {
    const { encryptedText } = req.body;

    if (!encryptedText) {
      return res.status(400).json({
        success: false,
        error: "encryptedText is required",
      });
    }

    const decryptedText = decryptText(encryptedText);

    res.json({
      success: true,
      original: encryptedText,
      decrypted: decryptedText,
    });
  } catch (error) {
    console.error("❌ Text decryption failed:", error);
    res.status(500).json({
      success: false,
      error: "Text decryption failed",
      details: error.message,
    });
  }
});

// Decrypt mail object endpoint
app.post("/api/decrypt/mail", (req, res) => {
  try {
    const { mailData } = req.body;

    if (!mailData) {
      return res.status(400).json({
        success: false,
        error: "mailData is required",
      });
    }

    const decryptedMail = decryptMailFrom(mailData);

    res.json({
      success: true,
      original: mailData,
      decrypted: decryptedMail,
    });
  } catch (error) {
    console.error("❌ Mail decryption failed:", error);
    res.status(500).json({
      success: false,
      error: "Mail decryption failed",
      details: error.message,
    });
  }
});

// Decrypt mail array endpoint
app.post("/api/decrypt/mails", (req, res) => {
  try {
    const { mailArray } = req.body;

    if (!mailArray || !Array.isArray(mailArray)) {
      return res.status(400).json({
        success: false,
        error: "mailArray must be an array",
      });
    }

    const decryptedMails = decryptMailArray(mailArray);

    res.json({
      success: true,
      count: mailArray.length,
      decrypted: decryptedMails,
    });
  } catch (error) {
    console.error("❌ Mail array decryption failed:", error);
    res.status(500).json({
      success: false,
      error: "Mail array decryption failed",
      details: error.message,
    });
  }
});

// Start server
const PORT = process.env.PORT || 3002; // Changed port to 3002
server.listen(PORT, "0.0.0.0", () => {
  console.log("🚀 Mail Server Started!");
  console.log(
    `📡 Server running on 0.0.0.0:${PORT} (accessible on your network)`
  );
  console.log(`🔍 Watching mail directory: ${MAIL_DATA_PATH}`);
  console.log(`🌐 CORS enabled for: http://localhost:3000`); // Still assuming frontend is on 3000

  // Initial scan
  mailStats = scanMailDirectory();
  console.log("📊 Initial mail stats loaded");
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down mail server...");
  watcher.close();
  server.close(() => {
    console.log("✅ Mail server stopped");
    process.exit(0);
  });
});
