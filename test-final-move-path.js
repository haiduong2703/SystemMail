const path = require('path');
const fs = require('fs');
const http = require('http');

// Test move-to-review với file thật từ DungHan
const testMail = {
    id: 'test-final-move-check',
    fileName: 'test-final-move-check.json',
    Subject: 'Test Final Move Check', // Note: Subject not subject
    category: 'DungHan', 
    status: 'rep',
    isExpired: false,
    isReplied: false,
    filePath: 'C:\\classifyMail\\DungHan\\rep\\test-final-move-check.json',
    From: 'test@example.com',
    Type: 'To',
    Date: ['2025-09-26', '17:20'],
    SummaryContent: 'Testing final move check'
};

// Create test file in DungHan/rep first
const sourcePath = path.join('C:/classifyMail', 'DungHan', 'rep');
const sourceFilePath = path.join(sourcePath, 'test-final-move-check.json');

// Ensure source directory exists
if (!fs.existsSync(sourcePath)) {
    fs.mkdirSync(sourcePath, { recursive: true });
}

// Create source file
fs.writeFileSync(sourceFilePath, JSON.stringify(testMail, null, 2));
console.log(`✅ Created source file: ${sourceFilePath}`);

function testMoveAPI() {
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
            console.log(`\n📡 API Response Status: ${res.statusCode}`);
            
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(responseBody);
                    console.log('✅ API Success!');
                    console.log(`📂 API returned filePath: ${response.reviewMailData.filePath}`);
                    console.log(`📁 Category: ${response.reviewMailData.category}`);
                    console.log(`📋 Original Category: ${response.reviewMailData.originalCategory}`);
                } else {
                    console.log(`❌ API Error: ${responseBody}`);
                }

                // Check actual file
                setTimeout(() => {
                    const processedPath = 'C:/classifyMail/ReviewMail/processed/test-final-move-check.json';
                    
                    console.log('\n🔍 File System Verification:');
                    console.log(`📄 Source file removed: ${!fs.existsSync(sourceFilePath)}`);
                    console.log(`📄 Target file created: ${fs.existsSync(processedPath)}`);

                    if (fs.existsSync(processedPath)) {
                        const fileContent = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
                        console.log('\n📊 File Content Check:');
                        console.log(`   filePath: ${fileContent.filePath}`);
                        console.log(`   category: ${fileContent.category}`);
                        console.log(`   originalCategory: ${fileContent.originalCategory}`);
                        console.log(`   originalStatus: ${fileContent.originalStatus}`);
                        console.log(`   isReplied: ${fileContent.isReplied}`);
                        console.log(`   processedDate: ${fileContent.processedDate}`);
                        
                        // Verify path format
                        const expectedPath = 'C:\\classifyMail\\ReviewMail\\processed\\test-final-move-check.json';
                        const pathIsCorrect = fileContent.filePath === expectedPath;
                        console.log(`   Path format correct: ${pathIsCorrect ? '✅' : '❌'}`);
                        
                        if (!pathIsCorrect) {
                            console.log(`   Expected: ${expectedPath}`);
                            console.log(`   Got: ${fileContent.filePath}`);
                        }
                        
                        // Cleanup
                        fs.unlinkSync(processedPath);
                        console.log('✅ Test completed - file cleaned up');
                    } else {
                        console.log('❌ Target file not found!');
                    }

                    resolve();
                }, 1000);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ API Request Error: ${error.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

// Run test
setTimeout(() => {
    console.log('\n🧪 Testing move-to-review API with debug...');
    testMoveAPI();
}, 2000);