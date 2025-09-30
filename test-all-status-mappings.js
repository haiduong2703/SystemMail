const path = require('path');
const fs = require('fs');
const http = require('http');

const classifyMailPath = 'C:/classifyMail';

// Test all status mapping combinations
const testCases = [
    {
        name: 'DungHan-processed',
        fileName: 'test-dunghan-processed.json',
        originalCategory: 'DungHan',
        reviewStatus: 'processed',
        expectedStatus: 'rep',
        expectedFolder: 'DungHan/rep'
    },
    {
        name: 'DungHan-pending',
        fileName: 'test-dunghan-pending.json',
        originalCategory: 'DungHan',
        reviewStatus: 'pending',
        expectedStatus: 'mustRep',
        expectedFolder: 'DungHan/mustRep'
    },
    {
        name: 'QuaHan-processed',
        fileName: 'test-quahan-processed.json',
        originalCategory: 'QuaHan',
        reviewStatus: 'processed',
        expectedStatus: 'daRep',
        expectedFolder: 'QuaHan/daRep'
    },
    {
        name: 'QuaHan-pending',
        fileName: 'test-quahan-pending.json',
        originalCategory: 'QuaHan',
        reviewStatus: 'pending',
        expectedStatus: 'chuaRep',
        expectedFolder: 'QuaHan/chuaRep'
    }
];

function createTestMail(testCase, index) {
    return {
        id: `test-${testCase.name}-${index}`,
        originalCategory: testCase.originalCategory,
        subject: `Test ${testCase.name}`,
        content: `Testing ${testCase.name} mapping`,
        isReplied: false,
        timestamp: Date.now(),
        status: testCase.reviewStatus
    };
}

function testAPI(testCase, testMail, testFilePath) {
    return new Promise((resolve) => {
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
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                const targetPath = path.join(classifyMailPath, testCase.expectedFolder, testCase.fileName);
                const sourceExists = fs.existsSync(testFilePath);
                const targetExists = fs.existsSync(targetPath);
                
                let result = {
                    name: testCase.name,
                    status: res.statusCode,
                    sourceRemoved: !sourceExists,
                    targetCreated: targetExists,
                    expectedStatus: testCase.expectedStatus,
                    actualStatus: null
                };

                if (targetExists) {
                    const targetContent = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
                    result.actualStatus = targetContent.status;
                    // Cleanup
                    fs.unlinkSync(targetPath);
                }

                resolve(result);
            });
        });

        req.on('error', (error) => {
            resolve({
                name: testCase.name,
                error: error.message
            });
        });

        req.write(data);
        req.end();
    });
}

async function runAllTests() {
    console.log('🧪 Testing all status mapping combinations...\n');

    for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i];
        const testMail = createTestMail(testCase, i);
        
        // Create test file in appropriate ReviewMail folder
        const reviewMailPath = path.join(classifyMailPath, 'ReviewMail', testCase.reviewStatus);
        const testFilePath = path.join(reviewMailPath, testCase.fileName);

        // Ensure directory exists
        if (!fs.existsSync(reviewMailPath)) {
            fs.mkdirSync(reviewMailPath, { recursive: true });
        }

        // Write test file
        fs.writeFileSync(testFilePath, JSON.stringify(testMail, null, 2));
        console.log(`📁 Created: ${testCase.fileName} in ReviewMail/${testCase.reviewStatus}`);

        // Test API
        const result = await testAPI(testCase, testMail, testFilePath);
        
        console.log(`📊 ${result.name}:`);
        console.log(`   Status: ${result.status || 'ERROR'}`);
        console.log(`   Source removed: ${result.sourceRemoved ? '✅' : '❌'}`);
        console.log(`   Target created: ${result.targetCreated ? '✅' : '❌'}`);
        console.log(`   Expected status: ${result.expectedStatus}`);
        console.log(`   Actual status: ${result.actualStatus || 'N/A'}`);
        console.log(`   Status mapping: ${result.expectedStatus === result.actualStatus ? '✅' : '❌'}`);
        
        if (result.error) {
            console.log(`   Error: ${result.error}`);
        }
        console.log('');

        // Wait a bit between tests
        await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('🎯 All tests completed!');
}

// Start tests
runAllTests().catch(console.error);