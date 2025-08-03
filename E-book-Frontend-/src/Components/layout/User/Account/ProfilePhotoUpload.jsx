import React, { useState, useRef } from 'react';
import { Button, Avatar, CircularProgress, Alert } from '@mui/material';
import { Camera, X, Upload, Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useUploadProfilePhotoMutation, useDeleteProfilePhotoMutation, useGetUserProfileQuery } from '../../../../Services/Apis/UserApi';

const ProfilePhotoUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  const userData = useSelector((state) => state.user.userProfile);
  const [uploadProfilePhoto] = useUploadProfilePhotoMutation();
  const [deleteProfilePhoto] = useDeleteProfilePhotoMutation();
  const { refetch: refetchUserProfile } = useGetUserProfileQuery();

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPG, PNG, or GIF)');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('File size must be less than 5MB');
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      const formData = new FormData();
      formData.append('profilePhoto', selectedFile);

      const response = await uploadProfilePhoto(formData).unwrap();
      
      setSuccess('Profile photo uploaded successfully!');
      setSelectedFile(null);
      setPreview(null);
      
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      
      // Refresh user data to get the updated profile photo URL
      await refetchUserProfile();
      
      // Debug: Log the response and user data
      console.log('Upload response:', response);
      console.log('User data after upload:', userData);
      
    } catch (error) {
      setError(error?.data?.message || 'Failed to upload profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async () => {
    setIsUploading(true);
    setError('');
    setSuccess('');

    try {
      await deleteProfilePhoto().unwrap();
      setSuccess('Profile photo deleted successfully!');
      // Refresh user data to get the updated profile photo URL
      await refetchUserProfile();
    } catch (error) {
      setError(error?.data?.message || 'Failed to delete profile photo');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
    setPreview(null);
    setError('');
    setSuccess('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Debug: Log user data
  console.log('Current user data:', userData);

  // Show loading state if user data is not available
  if (!userData) {
    return (
      <div className="space-y-6 bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-semibold text-gray-900">Profile Photo</h2>
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white rounded-xl p-6 shadow-md">
      <h2 className="text-2xl font-semibold text-gray-900">Profile Photo</h2>

      {/* Current Profile Photo */}
      <div className="flex items-center space-x-4">
        <Avatar
          src={userData?.profilePhotoUrl ? `http://localhost:4040${userData.profilePhotoUrl}` : undefined}
          alt={userData?.username || 'User'}
          sx={{ width: 80, height: 80 }}
        />
        <div>
          <p className="text-sm text-gray-600">
            {userData?.profilePhotoUrl ? 'Current profile photo' : 'No profile photo uploaded'}
          </p>
                     {userData?.profilePhotoUrl && (
             <div className="space-y-2">
               <Button
                 variant="outlined"
                 color="error"
                 size="small"
                 onClick={handleDelete}
                 disabled={isUploading}
                 startIcon={<Trash2 size={16} />}
                 className="mt-2"
               >
                 {isUploading ? 'Deleting...' : 'Delete Photo'}
               </Button>
             </div>
           )}
        </div>
      </div>

      {/* File Upload Section */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {!preview ? (
          <div className="space-y-4">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
            <Button
              variant="outlined"
              onClick={() => fileInputRef.current?.click()}
              startIcon={<Camera size={16} />}
            >
              Choose Photo
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative inline-block">
              <img
                src={preview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-full border-4 border-white shadow-lg"
              />
              <Button
                variant="outlined"
                color="error"
                size="small"
                onClick={handleCancel}
                className="absolute -top-2 -right-2"
                sx={{ minWidth: 'auto', width: 32, height: 32 }}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {selectedFile?.name}
              </p>
              <div className="flex space-x-2 justify-center">
                <Button
                  variant="contained"
                  onClick={handleUpload}
                  disabled={isUploading}
                  startIcon={isUploading ? <CircularProgress size={16} /> : <Upload size={16} />}
                >
                  {isUploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error and Success Messages */}
      {error && (
        <Alert severity="error" onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')}>
          {success}
        </Alert>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex items-center justify-center space-x-2">
          <CircularProgress size={20} />
          <span className="text-sm text-gray-600">Processing...</span>
        </div>
      )}
    </div>
  );
};

export default ProfilePhotoUpload; 