const path = require('path');
const fs = require('fs');
const http = require('http');

// Test với một file thật từ DungHan
console.log('🔍 Creating a real test scenario...');

// Create a real mail file in DungHan/mustRep
const testMail = {
    id: '1758251999999',
    fileName: '1758251999999.json',
    Subject: 'Real Test Move To Review',
    category: 'DungHan',
    status: 'mustRep',
    isExpired: false,
    isReplied: false,
    filePath: 'C:\\classifyMail\\DungHan\\mustRep\\1758251999999.json',
    From: 'realtest@example.com',
    Type: 'To',
    Date: ['2025-09-26', '17:30'],
    SummaryContent: 'Real test mail content',
    EncryptedFrom: 'realtest@example.com'
};

// Create source file
const sourcePath = 'C:/classifyMail/DungHan/mustRep';
const sourceFilePath = path.join(sourcePath, '1758251999999.json');

if (!fs.existsSync(sourcePath)) {
    fs.mkdirSync(sourcePath, { recursive: true });
}

fs.writeFileSync(sourceFilePath, JSON.stringify(testMail, null, 2));
console.log(`✅ Created source file: ${sourceFilePath}`);

// Test move-to-review API
function testRealMove() {
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

        console.log('\n📡 Sending move-to-review request...');
        console.log(`📋 Request data: ${data.substring(0, 100)}...`);

        const req = http.request(options, (res) => {
            console.log(`📡 Response Status: ${res.statusCode}`);
            
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                console.log(`📋 Response Body: ${responseBody}`);

                // Parse response 
                if (res.statusCode === 200) {
                    try {
                        const response = JSON.parse(responseBody);
                        console.log('\n🔍 API Response Analysis:');
                        console.log(`   Success: ${response.success}`);
                        console.log(`   Message: ${response.message}`);
                        console.log(`   FilePath returned: ${response.reviewMailData?.filePath}`);
                    } catch (e) {
                        console.log('❌ Could not parse response JSON');
                    }
                }

                // Check what actually happened
                setTimeout(() => {
                    console.log('\n📂 File System Check:');
                    
                    const processedPath = 'C:/classifyMail/ReviewMail/processed/1758251999999.json';
                    const pendingPath = 'C:/classifyMail/ReviewMail/pending/1758251999999.json';
                    
                    const sourceStillExists = fs.existsSync(sourceFilePath);
                    const inProcessed = fs.existsSync(processedPath);
                    const inPending = fs.existsSync(pendingPath);
                    
                    console.log(`   Source file still exists: ${sourceStillExists}`);
                    console.log(`   File in processed/: ${inProcessed}`);
                    console.log(`   File in pending/: ${inPending}`);

                    if (inProcessed) {
                        const content = JSON.parse(fs.readFileSync(processedPath, 'utf8'));
                        console.log('\n📄 File Content in processed/:');
                        console.log(`   filePath: "${content.filePath}"`);
                        console.log(`   category: ${content.category}`);
                        console.log(`   originalCategory: ${content.originalCategory}`);
                        console.log(`   isReplied: ${content.isReplied}`);
                        
                        // Check if path is correct
                        const expectedPath = 'C:\\classifyMail\\ReviewMail\\processed\\1758251999999.json';
                        const isCorrect = content.filePath === expectedPath;
                        console.log(`   Path correct: ${isCorrect ? '✅' : '❌'}`);
                        if (!isCorrect) {
                            console.log(`   Expected: "${expectedPath}"`);
                            console.log(`   Got: "${content.filePath}"`);
                        }

                        // Cleanup 
                        fs.unlinkSync(processedPath);
                        console.log('🗑️ Cleaned up test file');
                    }

                    if (inPending) {
                        const content = JSON.parse(fs.readFileSync(pendingPath, 'utf8'));
                        console.log('\n📄 File Content in pending/:');
                        console.log(`   filePath: "${content.filePath}"`);
                        fs.unlinkSync(pendingPath);
                        console.log('🗑️ Cleaned up test file');
                    }

                    // Also cleanup source if it still exists
                    if (sourceStillExists) {
                        fs.unlinkSync(sourceFilePath);
                        console.log('🗑️ Cleaned up source file');
                    }

                    resolve();
                }, 2000);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ Request Error: ${error.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

// Run the test
setTimeout(() => {
    testRealMove();
}, 3000);