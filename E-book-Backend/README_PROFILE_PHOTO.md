# Profile Photo Upload Feature

This feature allows users to upload, preview, and manage their profile photos in the E-book application.

## Features

- **File Upload**: Users can upload JPG, PNG, or GIF images up to 5MB
- **Image Processing**: Automatic resizing to 300x300 pixels with center crop
- **Preview**: Real-time preview of selected image before upload
- **Validation**: Client-side and server-side file type and size validation
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Delete Functionality**: Users can delete their current profile photo

## Backend Implementation

### New Endpoints

1. **POST /api/user/upload-profile-photo**
   - Uploads a new profile photo
   - Requires authentication
   - Accepts multipart/form-data with 'profilePhoto' field

2. **POST /api/user/delete-profile-photo**
   - Deletes the current profile photo
   - Requires authentication

### Database Changes

- The `profilePhotoUrl` field already exists in the User model
- Stores the path to the uploaded image file

### File Storage

- Images are stored in the `uploads/` directory
- Files are named with pattern: `profile_{userId}_{timestamp}.jpg`
- Images are processed with Sharp for optimization
- Static file serving configured for `/uploads/` path

## Frontend Implementation

### New Components

1. **ProfilePhotoUpload.jsx**
   - Handles file selection and preview
   - Client-side validation
   - Upload progress indication
   - Error and success messaging

### Integration

- Added to EditProfile component
- Profile photos displayed in Account header
- Responsive design for all screen sizes

## Setup Instructions

1. **Run Migration** (if needed):
   ```bash
   cd E-book-Backend
   npm run migrate
   ```

2. **Start the Backend**:
   ```bash
   npm start
   ```

3. **Start the Frontend**:
   ```bash
   cd ../E-book-Frontend-
   npm run dev
   ```

## Usage

1. Navigate to Account → Edit Profile
2. Click "Choose Photo" to select an image
3. Preview the image and click "Upload Photo"
4. The profile photo will be updated and displayed throughout the app

## File Structure

```
E-book-Backend/
├── uploads/           # Profile photos storage
├── Controllers/User/UserController.js  # Upload/delete logic
├── Routes/userRouter.js                # API endpoints
├── Utils/migration.js                  # Database migration
└── index.js                           # Static file serving

E-book-Frontend-/
├── src/Components/layout/User/Account/
│   ├── EditProfile.jsx                # Updated with photo upload
│   └── ProfilePhotoUpload.jsx         # New component
└── src/Services/Apis/UserApi.js       # API mutations
```

## Security Features

- File type validation (JPG, PNG, GIF only)
- File size limit (5MB)
- Authentication required for upload/delete
- Image processing to prevent malicious files
- Unique filenames to prevent conflicts

## Error Handling

- Invalid file type/size messages
- Upload failure notifications
- Network error handling
- Graceful fallbacks for missing images 