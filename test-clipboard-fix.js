/**
 * Test script to verify clipboard functionality fix
 * This script can be run in browser console to test clipboard operations
 */

// Test clipboard functionality
const testClipboard = () => {
  console.log('🧪 Testing Clipboard Functionality');
  console.log('=====================================');
  
  // Check environment
  const isSecure = window.isSecureContext;
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const hasClipboardAPI = !!(navigator.clipboard && navigator.clipboard.writeText);
  const hasExecCommand = !!document.execCommand;
  
  console.log('📊 Environment Info:');
  console.log(`   - Protocol: ${protocol}`);
  console.log(`   - Hostname: ${hostname}`);
  console.log(`   - Secure Context: ${isSecure}`);
  console.log(`   - Clipboard API Available: ${hasClipboardAPI}`);
  console.log(`   - execCommand Available: ${hasExecCommand}`);
  console.log('');
  
  // Test text to copy
  const testText = 'Test email subject - clipboard functionality test';
  
  // Test modern clipboard API
  if (hasClipboardAPI) {
    console.log('✅ Testing Clipboard API...');
    navigator.clipboard.writeText(testText)
      .then(() => {
        console.log('✅ Clipboard API: SUCCESS');
        return navigator.clipboard.readText();
      })
      .then(text => {
        console.log(`✅ Read back: "${text}"`);
      })
      .catch(err => {
        console.log('❌ Clipboard API: FAILED', err);
        testFallbackMethod();
      });
  } else {
    console.log('⚠️ Clipboard API not available, testing fallback...');
    testFallbackMethod();
  }
  
  function testFallbackMethod() {
    console.log('🔄 Testing Fallback Method (execCommand)...');
    
    const textArea = document.createElement("textarea");
    textArea.value = testText;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    textArea.style.top = "0";
    textArea.style.left = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (successful) {
        console.log('✅ Fallback Method: SUCCESS');
        console.log('📋 Text should be copied to clipboard');
      } else {
        console.log('❌ Fallback Method: FAILED');
      }
    } catch (err) {
      console.log('❌ Fallback Method: ERROR', err);
      document.body.removeChild(textArea);
    }
  }
};

// Test the utility function if available
const testUtilityFunction = async () => {
  console.log('');
  console.log('🔧 Testing Utility Function');
  console.log('============================');
  
  // Check if utility is available (this would work if imported)
  if (typeof copyWithFeedback !== 'undefined') {
    console.log('✅ Utility function available');
    
    try {
      const success = await copyWithFeedback('Utility test text', {
        onSuccess: () => console.log('✅ Utility: Copy successful'),
        onError: (error) => console.log('❌ Utility: Copy failed', error),
        showAlert: false
      });
      
      console.log(`📊 Utility result: ${success}`);
    } catch (err) {
      console.log('❌ Utility function error:', err);
    }
  } else {
    console.log('⚠️ Utility function not available in this context');
    console.log('   (This is normal when testing in browser console)');
  }
};

// Instructions for manual testing
const showInstructions = () => {
  console.log('');
  console.log('📝 Manual Testing Instructions');
  console.log('===============================');
  console.log('1. Run testClipboard() to test basic functionality');
  console.log('2. Try copying text and paste it somewhere to verify');
  console.log('3. Test on different environments:');
  console.log('   - localhost (should use Clipboard API)');
  console.log('   - HTTPS (should use Clipboard API)');
  console.log('   - HTTP/IP address (should use fallback)');
  console.log('');
  console.log('🚀 To test: Run testClipboard() in console');
};

// Auto-run basic test
console.log('🔧 Clipboard Fix Test Script Loaded');
console.log('====================================');
showInstructions();

// Export functions for manual testing
window.testClipboard = testClipboard;
window.testUtilityFunction = testUtilityFunction;
window.showClipboardInstructions = showInstructions;

console.log('');
console.log('💡 Available functions:');
console.log('   - testClipboard()');
console.log('   - testUtilityFunction()');
console.log('   - showClipboardInstructions()');
