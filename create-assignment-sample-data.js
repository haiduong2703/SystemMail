const fs = require('fs');
const path = require('path');

// Create assignment data directory
const assignmentDataPath = path.join('C:', 'classifyMail', 'AssignmentData', 'Assignments');

// Ensure directory exists
if (!fs.existsSync(assignmentDataPath)) {
  fs.mkdirSync(assignmentDataPath, { recursive: true });
}

// Sample assignment data
const assignments = [
  {
    id: "1",
    title: "Xử lý khiếu nại khách hàng",
    description: "Xử lý các khiếu nại từ khách hàng về dịch vụ",
    assignedTo: {
      type: "group", // "group" or "pic"
      id: "2", // QA Team
      name: "QA Team"
    },
    priority: "high",
    status: "active",
    dueDate: "2024-02-15T23:59:59.000Z",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-01-15T10:00:00.000Z",
    mailCategories: ["QuaHan/chuaRep", "QuaHan/daRep"],
    rules: {
      keywords: ["khiếu nại", "complaint", "phản ánh"],
      senderDomains: ["@customer.com"],
      subjectContains: ["khiếu nại", "complaint"]
    }
  },
  {
    id: "2", 
    title: "Phản hồi yêu cầu kỹ thuật",
    description: "Xử lý các yêu cầu hỗ trợ kỹ thuật từ khách hàng",
    assignedTo: {
      type: "group",
      id: "1", // Development Team
      name: "Development Team"
    },
    priority: "medium",
    status: "active",
    dueDate: "2024-02-20T23:59:59.000Z",
    createdAt: "2024-01-15T11:00:00.000Z",
    updatedAt: "2024-01-15T11:00:00.000Z",
    mailCategories: ["DungHan/mustRep"],
    rules: {
      keywords: ["technical", "kỹ thuật", "support", "hỗ trợ"],
      senderDomains: ["@tech.com"],
      subjectContains: ["technical", "kỹ thuật"]
    }
  },
  {
    id: "3",
    title: "Xử lý đơn hàng khẩn cấp",
    description: "Xử lý các đơn hàng có tính chất khẩn cấp",
    assignedTo: {
      type: "pic",
      id: "5", // Michael Brown
      name: "Michael Brown"
    },
    priority: "urgent",
    status: "active", 
    dueDate: "2024-02-10T23:59:59.000Z",
    createdAt: "2024-01-15T12:00:00.000Z",
    updatedAt: "2024-01-15T12:00:00.000Z",
    mailCategories: ["DungHan/mustRep", "DungHan"],
    rules: {
      keywords: ["urgent", "khẩn cấp", "emergency", "asap"],
      senderDomains: ["@vip.com"],
      subjectContains: ["urgent", "khẩn cấp"]
    }
  },
  {
    id: "4",
    title: "Quản lý mail marketing",
    description: "Xử lý và phản hồi các mail liên quan đến marketing",
    assignedTo: {
      type: "group",
      id: "3", // Marketing Team
      name: "Marketing Team"
    },
    priority: "low",
    status: "active",
    dueDate: "2024-03-01T23:59:59.000Z",
    createdAt: "2024-01-15T13:00:00.000Z",
    updatedAt: "2024-01-15T13:00:00.000Z",
    mailCategories: ["ReviewMail"],
    rules: {
      keywords: ["marketing", "promotion", "campaign", "quảng cáo"],
      senderDomains: ["@marketing.com"],
      subjectContains: ["marketing", "promotion"]
    }
  },
  {
    id: "5",
    title: "Xử lý mail nhân sự",
    description: "Xử lý các mail liên quan đến tuyển dụng và nhân sự",
    assignedTo: {
      type: "group",
      id: "5", // HR Team
      name: "HR Team"
    },
    priority: "medium",
    status: "paused",
    dueDate: "2024-02-25T23:59:59.000Z",
    createdAt: "2024-01-15T14:00:00.000Z",
    updatedAt: "2024-01-20T10:00:00.000Z",
    mailCategories: ["DungHan"],
    rules: {
      keywords: ["recruitment", "tuyển dụng", "hr", "nhân sự"],
      senderDomains: ["@hr.com"],
      subjectContains: ["recruitment", "tuyển dụng"]
    }
  }
];

// Write assignment files
assignments.forEach(assignment => {
  const filePath = path.join(assignmentDataPath, `${assignment.id}.json`);
  fs.writeFileSync(filePath, JSON.stringify(assignment, null, 2), 'utf8');
  console.log(`✅ Created assignment file: ${assignment.id}.json`);
});

console.log(`🎉 Successfully created ${assignments.length} assignment files in ${assignmentDataPath}`);
