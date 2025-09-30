const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');

// Create test data in ReviewMail
const classifyMailPath = 'C:/classifyMail';
const testFileName = 'test-api-move-back.json';

const testMail = {
    id: 'test-api-001',
    originalCategory: 'DungHan',
    subject: 'Test API Move Back',
    content: 'Testing move back API',
    isReplied: false,
    timestamp: Date.now(),
    status: 'processed'
};

// Create test file in ReviewMail/processed
const reviewMailProcessedPath = path.join(classifyMailPath, 'ReviewMail', 'processed');
const testFilePath = path.join(reviewMailProcessedPath, testFileName);

// Ensure directory exists
if (!fs.existsSync(reviewMailProcessedPath)) {
    fs.mkdirSync(reviewMailProcessedPath, { recursive: true });
}

// Write test file
fs.writeFileSync(testFilePath, JSON.stringify(testMail, null, 2));
console.log(`✅ Test file created: ${testFilePath}`);

// Function to test API
async function testMoveBackAPI() {
    try {
        const data = JSON.stringify({
            mailId: testMail.id,
            mailData: {
                ...testMail,
                filePath: testFilePath,
                Subject: testMail.subject
            }
        });

        const options = {
            hostname: '127.0.0.1',
            port: 3002,
            path: '/api/move-back-from-review',
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

                // Check if file was moved correctly
                setTimeout(() => {
                    const sourceExists = fs.existsSync(testFilePath);
                    const targetPath = path.join(classifyMailPath, 'DungHan', 'rep', testFileName);
                    const targetExists = fs.existsSync(targetPath);

                    console.log('\n🔍 Verification:');
                    console.log(`Source file (${testFilePath}) exists: ${sourceExists}`);
                    console.log(`Target file (${targetPath}) exists: ${targetExists}`);

                    if (targetExists) {
                        const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
                        console.log('Target file content:');
                        console.log(`  category: ${targetContent.originalCategory}`);
                        console.log(`  status: ${targetContent.status}`);
                        console.log(`  isReplied: ${targetContent.isReplied}`);
                        
                        // Cleanup
                        fs.unlinkSync(targetPath);
                        console.log('✅ Cleaned up target file');
                    }
                }, 1000);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ API Test Error: ${error.message}`);
        });

        req.write(data);
        req.end();

    } catch (error) {
        console.error(`❌ API Test Error: ${error.message}`);
    }
}

// Wait a moment then test
setTimeout(() => {
    console.log('\n📡 Testing move-back API...');
    testMoveBackAPI();
}, 2000);