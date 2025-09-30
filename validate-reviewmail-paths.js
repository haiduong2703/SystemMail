const fs = require('fs');
const path = require('path');

const classifyMailPath = 'C:/classifyMail';
const reviewMailPath = path.join(classifyMailPath, 'ReviewMail');

function validateAndFixAllReviewMailPaths() {
    const subfolders = ['pending', 'processed'];
    let totalChecked = 0;
    let totalFixed = 0;
    let issues = [];

    console.log('🔍 Comprehensive ReviewMail path validation...\n');

    for (const subfolder of subfolders) {
        const folderPath = path.join(reviewMailPath, subfolder);
        
        if (!fs.existsSync(folderPath)) {
            console.log(`📁 Folder doesn't exist: ${folderPath}`);
            continue;
        }

        const files = fs.readdirSync(folderPath).filter(file => file.endsWith('.json'));
        console.log(`📂 Checking ${subfolder}/ folder: ${files.length} files`);

        for (const file of files) {
            totalChecked++;
            const actualFilePath = path.join(folderPath, file);
            
            try {
                const mailData = JSON.parse(fs.readFileSync(actualFilePath, 'utf8'));
                
                // Expected filePath should match actual location
                const expectedFilePath = actualFilePath.replace(/\//g, '\\');
                const currentFilePath = mailData.filePath;
                
                // Check for various issues
                let hasIssues = false;
                let issueTypes = [];

                // Issue 1: filePath doesn't match actual location
                if (currentFilePath !== expectedFilePath) {
                    hasIssues = true;
                    issueTypes.push('wrong_path');
                }

                // Issue 2: missing subfolder in path
                if (!currentFilePath.includes(`\\${subfolder}\\`)) {
                    hasIssues = true;
                    issueTypes.push('missing_subfolder');
                }

                // Issue 3: category should be ReviewMail
                if (mailData.category !== 'ReviewMail') {
                    hasIssues = true;
                    issueTypes.push('wrong_category');
                }

                if (hasIssues) {
                    console.log(`❌ ${file}: Issues found`);
                    console.log(`   Current filePath: ${currentFilePath}`);
                    console.log(`   Expected filePath: ${expectedFilePath}`);
                    console.log(`   Category: ${mailData.category}`);
                    console.log(`   Issues: ${issueTypes.join(', ')}`);
                    
                    // Fix all issues
                    const fixedData = {
                        ...mailData,
                        filePath: expectedFilePath,
                        category: 'ReviewMail'
                    };
                    
                    fs.writeFileSync(actualFilePath, JSON.stringify(fixedData, null, 2));
                    console.log(`✅ Fixed all issues for ${file}`);
                    totalFixed++;
                    
                    issues.push({
                        file: file,
                        folder: subfolder,
                        issues: issueTypes,
                        oldPath: currentFilePath,
                        newPath: expectedFilePath
                    });
                } else {
                    console.log(`✅ ${file}: All correct`);
                }
            } catch (error) {
                console.log(`❌ ${file}: Error reading file - ${error.message}`);
                issues.push({
                    file: file,
                    folder: subfolder,
                    issues: ['read_error'],
                    error: error.message
                });
            }
        }
        console.log('');
    }

    // Summary
    console.log(`📊 Validation Summary:`);
    console.log(`   Total files checked: ${totalChecked}`);
    console.log(`   Files with issues: ${issues.length}`);
    console.log(`   Files fixed: ${totalFixed}`);
    console.log(`   Files already correct: ${totalChecked - issues.length}`);

    if (issues.length > 0) {
        console.log('\n🚨 Issues found and fixed:');
        issues.forEach((issue, index) => {
            console.log(`   ${index + 1}. ${issue.file} (${issue.folder}/)`);
            console.log(`      Issues: ${issue.issues.join(', ')}`);
            if (issue.oldPath) {
                console.log(`      Old path: ${issue.oldPath}`);
                console.log(`      New path: ${issue.newPath}`);
            }
            if (issue.error) {
                console.log(`      Error: ${issue.error}`);
            }
        });
    }

    console.log('\n✅ All ReviewMail files now have correct paths!');
}

validateAndFixAllReviewMailPaths();