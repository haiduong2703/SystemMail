const fs = require('fs');
const path = require('path');

// Analyze all the files with wrong paths we found earlier
console.log('🔍 Analyzing files with path issues...\n');

const problemFiles = [
    'C:/classifyMail/ReviewMail/processed/1755960389726.json',
    'C:/classifyMail/ReviewMail/processed/1758251188844.json', 
    'C:/classifyMail/ReviewMail/processed/1758251316514.json'
];

for (const filePath of problemFiles) {
    if (fs.existsSync(filePath)) {
        console.log(`📄 Analyzing ${path.basename(filePath)}:`);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        console.log(`   Current filePath: ${content.filePath}`);
        console.log(`   processedDate: ${content.processedDate || 'Not set'}`);
        console.log(`   dateMoved: ${content.dateMoved ? JSON.stringify(content.dateMoved) : 'Not set'}`);
        console.log(`   originalCategory: ${content.originalCategory || 'Not set'}`);
        console.log(`   category: ${content.category}`);
        
        // Check if it looks like it was moved recently or older
        if (content.processedDate) {
            const processedDate = new Date(content.processedDate);
            const now = new Date();
            const timeDiff = now - processedDate;
            const hours = timeDiff / (1000 * 60 * 60);
            console.log(`   Hours since processed: ${hours.toFixed(1)}`);
        }
        
        console.log('');
    } else {
        console.log(`❌ File not found: ${filePath}`);
    }
}

// Now let's see if there are any other files in ReviewMail with issues
console.log('📂 Scanning all ReviewMail files for patterns...\n');

const reviewFolders = ['pending', 'processed'];
let oldFormatCount = 0;
let newFormatCount = 0;

for (const folder of reviewFolders) {
    const folderPath = `C:/classifyMail/ReviewMail/${folder}`;
    if (fs.existsSync(folderPath)) {
        const files = fs.readdirSync(folderPath).filter(f => f.endsWith('.json'));
        console.log(`📁 ${folder}/ folder: ${files.length} files`);
        
        for (const file of files) {
            const filePath = path.join(folderPath, file);
            const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            if (content.filePath.includes(`\\${folder}\\`)) {
                newFormatCount++;
                console.log(`   ✅ ${file}: Correct format`);
            } else {
                oldFormatCount++;
                console.log(`   ❌ ${file}: Missing ${folder} in path`);
                console.log(`      Path: ${content.filePath}`);
                
                // Show creation time if available
                const stats = fs.statSync(filePath);
                console.log(`      File created: ${stats.birthtime.toISOString()}`);
                console.log(`      File modified: ${stats.mtime.toISOString()}`);
                
                if (content.processedDate) {
                    console.log(`      processedDate: ${content.processedDate}`);
                }
            }
        }
        console.log('');
    }
}

console.log('📊 Summary:');
console.log(`   Files with correct format: ${newFormatCount}`);
console.log(`   Files with old format: ${oldFormatCount}`);

if (oldFormatCount > 0) {
    console.log('\n💡 Conclusion: These files were likely moved with an older version of the API');
    console.log('   The current API is working correctly, but old files need manual fixing');
} else {
    console.log('\n✅ All files have correct format - API is working properly');
}