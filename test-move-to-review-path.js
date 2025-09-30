const path = require('path');
const fs = require('fs');
const http = require('http');

// Test move-to-review API
const testMail = {
    id: 'test-move-path-fix',
    fileName: 'test-move-path-fix.json',
    subject: 'Test Move Path Fix',
    category: 'DungHan',
    status: 'mustRep',
    filePath: 'C:\\classifyMail\\DungHan\\mustRep\\test-move-path-fix.json'
};

// Create test file in DungHan/mustRep first
const sourcePath = path.join('C:/classifyMail', 'DungHan', 'mustRep');
const sourceFilePath = path.join(sourcePath, 'test-move-path-fix.json');

// Ensure source directory exists
if (!fs.existsSync(sourcePath)) {
    fs.mkdirSync(sourcePath, { recursive: true });
}

// Create source file
fs.writeFileSync(sourceFilePath, JSON.stringify(testMail, null, 2));
console.log(`✅ Created source file: ${sourceFilePath}`);

function testMoveToReviewAPI() {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            mailId: testMail.id,
            mailData: testMail
        });

        const options = {
            hostname: '127.0.0.1',
            port: 3002,
            path: '/api/move-to-review',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const req = http.request(options, (res) => {
            console.log(`📡 API Response Status: ${res.statusCode}`);
            
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                console.log(`📋 API Response Body: ${responseBody}`);

                if (res.statusCode === 200) {
                    const response = JSON.parse(responseBody);
                    console.log('\n📊 Review Mail Data from API:');
                    console.log(`   filePath: ${response.reviewMailData.filePath}`);
                    console.log(`   category: ${response.reviewMailData.category}`);
                    console.log(`   originalCategory: ${response.reviewMailData.originalCategory}`);
                }

                // Check actual file on disk
                setTimeout(() => {
                    const processedPath = path.join('C:/classifyMail', 'ReviewMail', 'processed', 'test-move-path-fix.json');
                    const pendingPath = path.join('C:/classifyMail', 'ReviewMail', 'pending', 'test-move-path-fix.json');
                    
                    console.log('\n🔍 File System Check:');
                    console.log(`   Source exists: ${fs.existsSync(sourceFilePath)}`);
                    console.log(`   In processed: ${fs.existsSync(processedPath)}`);
                    console.log(`   In pending: ${fs.existsSync(pendingPath)}`);

                    if (fs.existsSync(processedPath)) {
                        const fileContent = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
                        console.log('\n📄 Actual File Content:');
                        console.log(`   filePath in file: ${fileContent.filePath}`);
                        console.log(`   category: ${fileContent.category}`);
                        console.log(`   originalCategory: ${fileContent.originalCategory}`);
                        
                        // Cleanup
                        fs.unlinkSync(processedPath);
                        console.log('✅ Cleaned up test file');
                    }
                    
                    if (fs.existsSync(pendingPath)) {
                        const fileContent = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
                        console.log('\n📄 Actual File Content (pending):');
                        console.log(`   filePath in file: ${fileContent.filePath}`);
                        
                        // Cleanup
                        fs.unlinkSync(pendingPath);
                        console.log('✅ Cleaned up test file');
                    }

                    resolve();
                }, 1000);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ API Test Error: ${error.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

// Wait a moment then test
setTimeout(() => {
    console.log('\n📡 Testing move-to-review API...');
    testMoveToReviewAPI();
}, 2000);