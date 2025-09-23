const fs = require('fs');
const path = require('path');

const ASSIGNMENT_DATA_PATH = "C:\\classifyMail\\AssignmentData";
const GROUPS_PATH = path.join(ASSIGNMENT_DATA_PATH, "Groups");

// Ensure directory exists
if (!fs.existsSync(GROUPS_PATH)) {
  fs.mkdirSync(GROUPS_PATH, { recursive: true });
  console.log(`📁 Created groups directory: ${GROUPS_PATH}`);
}

// Create sample group
const sampleGroup = {
  id: "1724494800000", // timestamp
  name: "Marketing Team",
  description: "Marketing and Communications Department",
  members: [
    "marketing@company.com",
    "a@gmail.com", 
    "b@gmail.com",
    "huan.tran@samsung.com" // Test email from your example mail
  ],
  pic: "Marketing Leader",
  picEmail: "leader.marketing@company.com",
  color: "primary",
  createdAt: "2024-08-24"
};

const fileName = `${sampleGroup.id}.json`;
const filePath = path.join(GROUPS_PATH, fileName);

fs.writeFileSync(filePath, JSON.stringify(sampleGroup, null, 2));
console.log(`✅ Created sample group: ${filePath}`);
console.log(`📧 Group members: ${sampleGroup.members.join(', ')}`);
console.log(`👤 Group leader: ${sampleGroup.pic} (${sampleGroup.picEmail})`);
console.log(`🎯 Now any mail from these members will be auto-assigned to the leader!`);