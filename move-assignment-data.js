const fs = require('fs');
const path = require('path');

const oldPath = 'C:\\classifyMail\\Assignment';
const newPath = 'C:\\classifyMail\\AssignmentData';

if (fs.existsSync(oldPath)) {
  console.log('Found old Assignment directory');
  
  // Copy Groups
  const oldGroups = path.join(oldPath, 'Groups');
  const newGroups = path.join(newPath, 'Groups');
  if (fs.existsSync(oldGroups)) {
    if (!fs.existsSync(newGroups)) {
      fs.mkdirSync(newGroups, { recursive: true });
    }
    const files = fs.readdirSync(oldGroups);
    files.forEach(file => {
      fs.copyFileSync(path.join(oldGroups, file), path.join(newGroups, file));
      console.log('Copied Groups file:', file);
    });
  }
  
  // Copy PICs
  const oldPICs = path.join(oldPath, 'PIC');
  const newPICs = path.join(newPath, 'PIC');
  if (fs.existsSync(oldPICs)) {
    if (!fs.existsSync(newPICs)) {
      fs.mkdirSync(newPICs, { recursive: true });
    }
    const files = fs.readdirSync(oldPICs);
    files.forEach(file => {
      fs.copyFileSync(path.join(oldPICs, file), path.join(newPICs, file));
      console.log('Copied PICs file:', file);
    });
  }
} else {
  console.log('Old Assignment directory not found');
}
