import { useState, useEffect } from "react";
import { updatePostHeaderImage, getPostHeaderImage, deletePostHeaderImage } from "../../managers/PostManager";
import "./PostHeaderImageUpload.css";

export const PostHeaderImageUpload = ({ postId, onImageUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load current header image on mount
  useEffect(() => {
    const loadCurrentImage = async () => {
      try {
        const imageUrl = await getPostHeaderImage(postId);
        if (imageUrl && imageUrl.trim()) {
          setCurrentImage(imageUrl);
        }
      } catch (err) {
        console.error("Error loading current header image:", err);
      }
    };

    if (postId) {
      loadCurrentImage();
    }
  }, [postId]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setError(null);
    setSuccess(null);

    if (!file) {
      setSelectedFile(null);
      setPreview(null);
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB limit for header images)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('File size must be less than 10MB');
      return;
    }

    setSelectedFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!selectedFile) {
      setError('Please select an image file');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target.result;
          
          const response = await updatePostHeaderImage(
            postId,
            base64Data,
            selectedFile.name,
            selectedFile.type
          );

          if (response.success) {
            setCurrentImage(response.imageUrl);
            setSelectedFile(null);
            setPreview(null);
            setSuccess('Header image uploaded successfully!');
            
            // Clear file input
            const fileInput = document.getElementById('header-image-upload');
            if (fileInput) fileInput.value = '';

            // Notify parent component
            if (onImageUpdate) {
              onImageUpdate(response.imageUrl);
            }
          } else {
            setError(response.message || 'Failed to upload header image');
          }
        } catch (err) {
          setError('Error uploading header image: ' + (err.message || 'Unknown error'));
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Error reading file');
        setUploading(false);
      };

      reader.readAsDataURL(selectedFile);
    } catch (err) {
      setError('Error uploading header image: ' + (err.message || 'Unknown error'));
      setUploading(false);
    }
  };

  const removeImage = async () => {
    setRemoving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await deletePostHeaderImage(postId);
      
      if (result) {
        setCurrentImage(null);
        setSelectedFile(null);
        setPreview(null);
        setSuccess('Header image removed successfully!');
        
        // Clear file input
        const fileInput = document.getElementById('header-image-upload');
        if (fileInput) fileInput.value = '';

        // Notify parent component
        if (onImageUpdate) {
          onImageUpdate(null);
        }
      } else {
        setError('Failed to remove header image');
      }
    } catch (err) {
      setError('Error removing header image: ' + (err.message || 'Unknown error'));
    } finally {
      setRemoving(false);
    }
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="post-header-image-upload">
      <div className="upload-section">
        <h4>Post Header Image</h4>
        
        {/* Current Image Display */}
        {currentImage && (
          <div className="current-image-container">
            <div className="current-image-wrapper">
              <img 
                src={currentImage} 
                alt="Current header" 
                className="current-header-image"
              />
              <div className="image-overlay">
                <button
                  type="button"
                  onClick={removeImage}
                  disabled={removing}
                  className="remove-image-btn"
                  title="Remove header image"
                >
                  {removing ? "Removing..." : "Remove"}
                </button>
              </div>
            </div>
            <p className="image-info">Current header image</p>
          </div>
        )}

        {/* File Upload Section */}
        <div className="upload-controls">
          <label htmlFor="header-image-upload" className="file-label">
            Choose Header Image
          </label>
          <input
            id="header-image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileSelect}
            className="file-input"
          />
          
          {selectedFile && (
            <div className="file-info">
              <p>Selected: {selectedFile.name}</p>
              <p>Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          )}
        </div>

        {/* Preview Section */}
        {preview && (
          <div className="preview-container">
            <h5>Preview:</h5>
            <div className="preview-wrapper">
              <img 
                src={preview} 
                alt="Preview" 
                className="preview-image"
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedFile && (
          <div className="upload-actions">
            <button
              type="button"
              onClick={uploadImage}
              disabled={uploading}
              className="upload-btn"
            >
              {uploading ? "Uploading..." : "Upload Header Image"}
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setPreview(null);
                clearMessages();
                const fileInput = document.getElementById('header-image-upload');
                if (fileInput) fileInput.value = '';
              }}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="message error-message">
            <span>{error}</span>
            <button onClick={clearMessages} className="close-message">×</button>
          </div>
        )}

        {success && (
          <div className="message success-message">
            <span>{success}</span>
            <button onClick={clearMessages} className="close-message">×</button>
          </div>
        )}

        {/* Upload Guidelines */}
        <div className="upload-guidelines">
          <h5>Guidelines:</h5>
          <ul>
            <li>Supported formats: JPEG, PNG, GIF, WebP</li>
            <li>Maximum file size: 10MB</li>
            <li>Recommended dimensions: 1200×630px (landscape)</li>
            <li>Images will be displayed as header banners</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
