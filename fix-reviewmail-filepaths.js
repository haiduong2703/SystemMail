const fs = require('fs');
const path = require('path');

const classifyMailPath = 'C:/classifyMail';
const reviewMailPath = path.join(classifyMailPath, 'ReviewMail');

function checkAndFixFilePaths() {
    const subfolders = ['pending', 'processed'];
    let totalChecked = 0;
    let totalFixed = 0;

    for (const subfolder of subfolders) {
        const folderPath = path.join(reviewMailPath, subfolder);
        
        if (!fs.existsSync(folderPath)) {
            console.log(`📁 Folder doesn't exist: ${folderPath}`);
            continue;
        }

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
        console.log(`\n📂 Checking ${subfolder}/ folder: ${files.length} files`);

        for (const file of files) {
            totalChecked++;
            const filePath = path.join(folderPath, file);
            
            try {
                const mailData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                
                // Check if filePath is correct
                const expectedFilePath = filePath.replace(/\//g, '\\');
                const currentFilePath = mailData.filePath;
                
                if (currentFilePath !== expectedFilePath) {
                    console.log(`❌ ${file}: Wrong filePath`);
                    console.log(`   Current: ${currentFilePath}`);
                    console.log(`   Expected: ${expectedFilePath}`);
                    
                    // Fix the filePath
                    mailData.filePath = expectedFilePath;
                    
                    fs.writeFileSync(filePath, JSON.stringify(mailData, null, 2));
                    console.log(`✅ Fixed ${file}`);
                    totalFixed++;
                } else {
                    console.log(`✅ ${file}: Correct filePath`);
                }
            } catch (error) {
                console.log(`❌ ${file}: Error reading file - ${error.message}`);
            }
        }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total files checked: ${totalChecked}`);
    console.log(`   Files fixed: ${totalFixed}`);
    console.log(`   Files already correct: ${totalChecked - totalFixed}`);
}

console.log('🔍 Checking ReviewMail file paths...');
checkAndFixFilePaths();