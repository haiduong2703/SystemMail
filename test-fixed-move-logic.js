const path = require('path');
const fs = require('fs');
const http = require('http');

// Test với file mustRep (should go to pending)
const testMustRep = {
    id: 'test-mustrep-pending',
    fileName: 'test-mustrep-pending.json',
    Subject: 'Test MustRep to Pending',
    category: 'DungHan',
    status: 'mustRep',
    isExpired: false,
    isReplied: false,
    filePath: 'C:\\classifyMail\\DungHan\\mustRep\\test-mustrep-pending.json'
};

// Test với file rep (should go to processed) 
const testRep = {
    id: 'test-rep-processed',
    fileName: 'test-rep-processed.json',
    Subject: 'Test Rep to Processed',
    category: 'DungHan',
    status: 'rep',
    isExpired: false,
    isReplied: true,
    filePath: 'C:\\classifyMail\\DungHan\\rep\\test-rep-processed.json'
};

// Create source files
function createTestFiles() {
    const mustRepPath = 'C:/classifyMail/DungHan/mustRep';
    const repPath = 'C:/classifyMail/DungHan/rep';

    [mustRepPath, repPath].forEach(dirPath => {
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }
    });

    fs.writeFileSync(path.join(mustRepPath, 'test-mustrep-pending.json'), JSON.stringify(testMustRep, null, 2));
    fs.writeFileSync(path.join(repPath, 'test-rep-processed.json'), JSON.stringify(testRep, null, 2));
    
    console.log('✅ Created test files');
}

function testMoveAPI(testData, expectedFolder) {
    return new Promise((resolve) => {
        const data = JSON.stringify({
            mailId: testData.id,
            mailData: testData
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
            console.log(`\n📡 Testing ${testData.status} → ${expectedFolder}`);
            console.log(`📡 Response Status: ${res.statusCode}`);
            
            let responseBody = '';
            res.on('data', (chunk) => {
                responseBody += chunk;
            });

            res.on('end', () => {
                if (res.statusCode === 200) {
                    const response = JSON.parse(responseBody);
                    console.log(`✅ API Success`);
                    console.log(`📂 FilePath returned: ${response.reviewMailData.filePath}`);
                    console.log(`📊 isReplied: ${response.reviewMailData.isReplied}`);
                    console.log(`📅 processedDate: ${response.reviewMailData.processedDate || 'Not set'}`);
                }

                setTimeout(() => {
                    const targetPath = `C:/classifyMail/ReviewMail/${expectedFolder}/${testData.fileName}`;
                    const wrongPath = `C:/classifyMail/ReviewMail/${expectedFolder === 'pending' ? 'processed' : 'pending'}/${testData.fileName}`;
                    
                    const inCorrectFolder = fs.existsSync(targetPath);
                    const inWrongFolder = fs.existsSync(wrongPath);
                    
                    console.log(`🔍 Verification:`);
                    console.log(`   In correct folder (${expectedFolder}): ${inCorrectFolder ? '✅' : '❌'}`);
                    console.log(`   In wrong folder: ${inWrongFolder ? '❌' : '✅'}`);

                    if (inCorrectFolder) {
                        const content = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
                        console.log(`   FilePath in file: ${content.filePath}`);
                        console.log(`   isReplied: ${content.isReplied}`);
                        console.log(`   processedDate: ${content.processedDate || 'Not set'}`);
                        
                        // Cleanup
                        fs.unlinkSync(targetPath);
                        console.log('✅ Cleaned up test file');
                    }

                    if (inWrongFolder) {
                        fs.unlinkSync(wrongPath);
                        console.log('🗑️ Cleaned up file from wrong folder');
                    }

                    resolve();
                }, 1000);
            });
        });

        req.on('error', (error) => {
            console.error(`❌ API Error: ${error.message}`);
            resolve();
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing fixed move-to-review logic...');
    
    createTestFiles();
    
    // Test mustRep → pending
    await testMoveAPI(testMustRep, 'pending');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test rep → processed  
    await testMoveAPI(testRep, 'processed');
    
    console.log('\n🎯 Testing completed!');
}

setTimeout(() => {
    runTests();
}, 3000);