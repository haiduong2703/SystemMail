# User File Naming System Update

## Changes Made

### File Naming Convention Changed
- **Before**: Files named by username (e.g., `admin.json`, `duong.json`)
- **After**: Files named by user ID (e.g., `1753684959632.json`, `1755945950357.json`)

### Functions Updated

1. **User Registration (POST /api/users)**
   - Changed file path from `getUserFilePath(username)` to `path.join(USER_DATA_PATH, ${uniqueId}.json)`

2. **userExists(username)**
   - Changed from checking file existence to scanning all files and checking username field

3. **saveUser(userData)**
   - Changed file path from `getUserFilePath(userData.username)` to `path.join(USER_DATA_PATH, ${userRecord.id}.json)`

4. **getUser(username)**
   - Changed from direct file read to scanning all files and checking username field

5. **User Update (PUT /api/users/:id)**
   - Removed file rename logic since files are now named by ID (ID doesn't change)

6. **Profile Update (PUT /api/users/:username)**
   - Changed to find file by user ID instead of username

7. **Password Update (PUT /api/users/:username/password)**
   - Changed to scan files and find by username instead of direct file path

### Benefits
- ✅ User ID never changes, so file names are stable
- ✅ Username can be changed without file system operations
- ✅ Consistent with API calls that use user ID
- ✅ Eliminates "User not found" errors when frontend sends user ID

### Next Steps
1. Restart backend server to apply changes
2. Test user creation, update, and password change functionality
3. Verify that existing user files still work (may need to rename existing files to use ID format)

## File Structure Example
```
C:\classifyMail\userData\
├── 1753684959632.json  (admin user)
├── 1755945950357.json  (duong user)
└── 1756031031234yyb2gtdh2.json  (duongg user)
```

## API Endpoints Affected
- POST /api/users (create user)
- PUT /api/users/:id (update user by ID)
- PUT /api/users/:username (update user profile by username)
- PUT /api/users/:username/password (change password)
- All functions that look up users by username