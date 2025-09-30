const http = require('http');

const testUserUpdate = {
    username: "duong123updated",
    email: "duongggg@gmail.com"
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

console.log('🧪 Testing PUT /api/users/1759162316916 with minimal body');
console.log('📋 Request data:', testUserUpdate);

const req = http.request(options, (res) => {
    console.log(`📡 Response Status: ${res.statusCode}`);
    console.log(`📋 Response Headers:`, res.headers);
    
    let responseBody = '';
    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log(`📋 Response Body: ${responseBody}`);
        
        if (res.statusCode === 200) {
            console.log('✅ Update successful!');
        } else if (res.statusCode === 404) {
            console.log('❌ 404 - User not found in server logic');
        } else {
            console.log(`❌ Update failed with status: ${res.statusCode}`);
        }
    });
});

req.on('error', (error) => {
    console.error(`❌ Connection Error: ${error.message}`);
    console.log('💡 Check if server is running on port 3002');
});

// Add timeout
req.setTimeout(5000, () => {
    console.log('⏰ Request timeout');
    req.destroy();
});

req.write(data);
req.end();