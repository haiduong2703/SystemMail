const http = require('http');

const testUserUpdate = {
    username: "duong123updated",
    email: "duongggg@gmail.com", 
    fullName: "Nguyễn Hải Dương Test Updated"
};

const data = JSON.stringify(testUserUpdate);

const options = {
    hostname: '127.0.0.1',
    port: 3002,
    path: '/api/users/1759162316916',
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
    }
};

console.log('🧪 Testing PUT /api/users/1759162316916');
console.log('📋 Request data:', testUserUpdate);

const req = http.request(options, (res) => {
    console.log(`📡 Response Status: ${res.statusCode}`);
    
    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`📋 Response Body: ${responseBody}`);
        
        if (res.statusCode === 200) {
            console.log('✅ Update successful!');
        } else {
            console.log('❌ Update failed!');
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Request Error: ${error.message}`);
});

req.write(data);
req.end();