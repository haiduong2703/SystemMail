# 🔓 Mail Decryption System Guide

## 📋 Overview

This guide explains how to use the mail decryption system that has been integrated into your Argon Dashboard React mail management application. The system can decrypt AES-256-CBC encrypted "From" fields in mail data.

## 🔑 Encryption Details

- **Algorithm**: AES-256-CBC
- **Key**: `0123456789abcdef0123456789abcdef` (UTF-8 encoded)
- **IV**: `abcdef9876543210` (UTF-8 encoded)
- **Output Format**: Base64 encoded

## 🚀 Quick Start

### 1. Test Decryption (Command Line)

```bash
# Run the decryption test script
npm run test:decrypt
```

This will test decryption with your sample encrypted text: `jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=`

### 2. Start the System

```bash
# Start both backend and frontend
npm run dev

# Or start them separately:
# Terminal 1: Start backend server
cd mail-server && npm start

# Terminal 2: Start React app
npm start
```

### 3. Test in Browser

1. Navigate to `http://localhost:3000/admin/decryption-test`
2. Use the decryption demo interface to test various scenarios

## 🛠️ Implementation Details

### Backend Components

#### `mail-server/decryptUtils.js`
- Core decryption utilities
- Functions: `decryptText()`, `decryptMailFrom()`, `decryptMailArray()`

#### `mail-server/server.js` (Updated)
- Added decryption API endpoints:
  - `GET /api/decrypt/test` - Test decryption service
  - `POST /api/decrypt/text` - Decrypt single text
  - `POST /api/decrypt/mail` - Decrypt mail object
  - `POST /api/decrypt/mails` - Decrypt mail array

### Frontend Components

#### `src/hooks/useDecryption.js`
- React hook for decryption API calls
- Handles loading states and error management

#### `src/utils/mailUtils.js` (Updated)
- Added browser-compatible decryption utilities
- Functions for processing mail data

#### `src/components/DecryptionDemo.js`
- Demo component for testing decryption
- Interactive UI for various decryption scenarios

#### `src/views/DecryptionTest.js`
- Full page for decryption testing
- Accessible via `/admin/decryption-test` route

## 📡 API Endpoints

### Test Decryption
```http
GET /api/decrypt/test
```

### Decrypt Text
```http
POST /api/decrypt/text
Content-Type: application/json

{
  "encryptedText": "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4="
}
```

### Decrypt Mail Object
```http
POST /api/decrypt/mail
Content-Type: application/json

{
  "mailData": {
    "Subject": "Equipment request fulfilled",
    "From": "jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=",
    "Type": "To",
    "Date": ["2024-09-15", "15:30"],
    "SummaryContent": "Your new laptop has been delivered to your desk.",
    "id": "24680"
  }
}
```

### Decrypt Mail Array
```http
POST /api/decrypt/mails
Content-Type: application/json

{
  "mailArray": [
    {
      "Subject": "Mail 1",
      "From": "encrypted_text_1",
      ...
    },
    {
      "Subject": "Mail 2", 
      "From": "encrypted_text_2",
      ...
    }
  ]
}
```

## 💻 Usage Examples

### Using the Hook in React Components

```javascript
import useDecryption from '../hooks/useDecryption';

const MailComponent = () => {
  const { decryptMail, isDecrypting, decryptionError } = useDecryption();
  
  const handleDecryptMail = async (mailData) => {
    const decryptedMail = await decryptMail(mailData);
    console.log('Decrypted:', decryptedMail);
  };
  
  return (
    <div>
      {isDecrypting && <p>Decrypting...</p>}
      {decryptionError && <p>Error: {decryptionError}</p>}
      {/* Your mail display logic */}
    </div>
  );
};
```

### Direct API Call

```javascript
const decryptMailData = async (mailData) => {
  try {
    const response = await fetch('http://localhost:3001/api/decrypt/mail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mailData }),
    });
    
    const result = await response.json();
    return result.decrypted;
  } catch (error) {
    console.error('Decryption failed:', error);
    return mailData; // Return original on failure
  }
};
```

## 🔧 Integration with Existing Mail System

### Option 1: Decrypt on Display
Decrypt mail data when displaying it to users:

```javascript
// In your mail table component
const displayMails = mails.map(async (mail) => {
  const decryptedMail = await decryptMail(mail);
  return decryptedMail;
});
```

### Option 2: Decrypt on Load
Decrypt all mail data when loading from the server:

```javascript
// In your data loading logic
const loadMails = async () => {
  const mails = await fetchMailsFromServer();
  const decryptedMails = await decryptMails(mails);
  setMails(decryptedMails);
};
```

## 🛡️ Security Considerations

1. **Key Management**: In production, store encryption keys securely (environment variables, key management services)
2. **HTTPS**: Always use HTTPS in production to protect data in transit
3. **Access Control**: Implement proper authentication and authorization
4. **Audit Logging**: Log decryption operations for security auditing

## 🐛 Troubleshooting

### Common Issues

1. **"Crypto API not available"**
   - This occurs in browser environments
   - Use the backend API endpoints instead of client-side decryption

2. **"Decryption failed"**
   - Check that the encrypted text is valid Base64
   - Verify the key and IV match the encryption settings

3. **Server connection errors**
   - Ensure the mail server is running on port 3001
   - Check CORS settings if making requests from different origins

### Debug Steps

1. Test with the command line script: `npm run test:decrypt`
2. Check server logs for error messages
3. Use the browser decryption test page: `/admin/decryption-test`
4. Verify API endpoints with tools like Postman

## 📝 Next Steps

1. **Integration**: Integrate decryption into your existing mail display components
2. **Performance**: Consider caching decrypted values to avoid repeated API calls
3. **Error Handling**: Implement robust error handling for production use
4. **Security**: Review and enhance security measures for production deployment

## 🎯 Test Results

Your sample encrypted text `jDzr25GOLBrArcJFx83l7UwvqjtruTzEj8h3xdStme4=` should decrypt to reveal the original sender information.

Run `npm run test:decrypt` to see the actual decrypted value!
