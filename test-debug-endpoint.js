// Test debug endpoint để kiểm tra user có tồn tại không
async function testDebugEndpoint() {
  const userId = "1759162316916";
  
  console.log(`🧪 Testing debug endpoint for user: ${userId}`);
  
  try {
    const response = await fetch(`http://127.0.0.1:3002/api/debug/users/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    console.log(`📊 Response status: ${response.status}`);
    const result = await response.json();
    console.log('📋 Response body:', JSON.stringify(result, null, 2));

  } catch (error) {
    console.error('💥 Error during test:', error);
  }
}

testDebugEndpoint();