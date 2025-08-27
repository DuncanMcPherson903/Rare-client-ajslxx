import React, { useState, useRef } from 'react';
import { updateProfilePicture, deleteProfilePicture } from '../../managers/UserManager';
import './ProfilePictureUpload.css';

export const ProfilePictureUpload = ({ userId, currentImageUrl, onUpdate }) => {
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(currentImageUrl || null);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const fileInputRef = useRef(null);

    // Supported file types
    const supportedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    const maxFileSize = 5 * 1024 * 1024; // 5MB

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setError(null);
        setSuccess(null);

        // Validate file type
        if (!supportedTypes.includes(file.type)) {
            setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size
        if (file.size > maxFileSize) {
            setError('Image size cannot exceed 5MB');
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target.result);
        };
        reader.readAsDataURL(file);

        // Upload the file
        uploadImage(file);
    };

    const uploadImage = async (file) => {
        setUploading(true);
        setError(null);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result; // This includes the data URL prefix
                    
                    const response = await updateProfilePicture(
                        userId,
                        base64Data,
                        file.name,
                        file.type
                    );

                    if (response.success) {
                        setSuccess('Profile picture updated successfully!');
                        setPreviewUrl(response.profileImageUrl);
                        if (onUpdate) {
                            onUpdate(response.profileImageUrl);
                        }
                    } else {
                        setError(response.message || 'Failed to update profile picture');
                        setPreviewUrl(currentImageUrl); // Reset to original
                    }
                } catch (err) {
                    setError('Error uploading image. Please try again.');
                    setPreviewUrl(currentImageUrl); // Reset to original
                    console.error('Upload error:', err);
                } finally {
                    setUploading(false);
                }
            };
            reader.readAsDataURL(file);
        } catch (err) {
            setError('Error reading file. Please try again.');
            setUploading(false);
            console.error('File read error:', err);
        }
    };

    const handleRemoveImage = async () => {
        if (!window.confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const success = await deleteProfilePicture(userId);
            if (success) {
                setSuccess('Profile picture removed successfully!');
                setPreviewUrl(null);
                if (onUpdate) {
                    onUpdate(null);
                }
            } else {
                setError('Failed to remove profile picture');
            }
        } catch (err) {
            setError('Error removing image. Please try again.');
            console.error('Remove error:', err);
        } finally {
            setUploading(false);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="profile-picture-upload">
            <div className="upload-section">
                <h3>Profile Picture</h3>
                
                <div className="image-preview-container">
                    {previewUrl ? (
                        <div className="image-preview">
                            <img 
                                src={previewUrl} 
                                alt="Profile preview" 
                                className="preview-image"
                            />
                            <div className="image-overlay">
                                <button
                                    onClick={triggerFileInput}
                                    disabled={uploading}
                                    className="btn-change"
                                >
                                    Change
                                </button>
                                <button
                                    onClick={handleRemoveImage}
                                    disabled={uploading}
                                    className="btn-remove"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="no-image-preview">
                            <div className="placeholder-avatar">
                                <span className="placeholder-icon">👤</span>
                            </div>
                            <button
                                onClick={triggerFileInput}
                                disabled={uploading}
                                className="btn-upload"
                            >
                                {uploading ? 'Uploading...' : 'Upload Picture'}
                            </button>
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept={supportedTypes.join(',')}
                    onChange={handleFileSelect}
                    style={{ display: 'none' }}
                />

                <div className="upload-info">
                    <p className="file-requirements">
                        Supported formats: JPEG, PNG, GIF, WebP<br/>
                        Maximum size: 5MB
                    </p>
                </div>

                {error && (
                    <div className="message error-message">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="message success-message">
                        {success}
                    </div>
                )}

                {uploading && (
                    <div className="uploading-indicator">
                        <div className="loading-spinner"></div>
                        <span>Uploading...</span>
                    </div>
                )}
            </div>
        </div>
    );
};
