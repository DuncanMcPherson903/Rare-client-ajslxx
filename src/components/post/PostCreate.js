import { useState } from "react";
import { createPost } from "../../managers/PostManager";
import "./postCreate.css";

export const PostCreate = ({ onPostCreated }) => {
    const [formData, setFormData] = useState({
        userId: 0,
        categoryId: 0,
        title: "",
        publicationDate: "",
        imageUrl: "",
        content: "",
        approved: false
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

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

        // Validate file size (10MB limit)
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

    const convertFileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setUploading(true);
        setError(null);
        setSuccess(null);

        try {
            let imageUrl = formData.imageUrl.trim();

            // If a file is selected, upload it first
            if (selectedFile) {
                const base64Data = await convertFileToBase64(selectedFile);
                // For now, we'll use the base64 data directly as the image URL
                // In a real application, you'd upload to a server and get back a URL
                imageUrl = base64Data;
            }

            const postData = {
                userId: parseInt(formData.userId),
                categoryId: parseInt(formData.categoryId),
                title: formData.title.trim(),
                content: formData.content.trim(),
                publicationDate: formData.publicationDate
                    ? formData.publicationDate
                    : new Date().toISOString().split('T')[0],
                imageUrl: imageUrl || "",
                approved: formData.approved
            };

            await createPost(postData);

            // Reset form
            setFormData({
                userId: 0,
                categoryId: 0,
                title: "",
                publicationDate: "",
                imageUrl: "",
                content: "",
                approved: false
            });

            setSelectedFile(null);
            setPreview(null);

            if (onPostCreated) {
                onPostCreated();
            }

            setSuccess("Post created successfully!");
        } catch (error) {
            console.error("Error creating post:", error);
            setError("Error creating post. Please try again.");
        } finally {
            setUploading(false);
        }
    };

    const clearMessages = () => {
        setError(null);
        setSuccess(null);
    };

    return (
        <div className="post-form-container">
            <h2>Create New Post</h2>
            
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

            <form onSubmit={handleSubmit} className="post-form">
                <div className="form-group">
                    <label htmlFor="title">Title:</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="user_id">User ID:</label>
                    <input
                        type="number"
                        id="userId"
                        name="userId"
                        value={formData.userId}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="category_id">Category ID:</label>
                    <input
                        type="number"
                        id="categoryId"
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        required
                        className="form-input"
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="content">Content:</label>
                    <textarea
                        id="content"
                        name="content"
                        value={formData.content}
                        onChange={handleInputChange}
                        required
                        rows="5"
                        className="form-textarea"
                    />
                </div>

                {/* Header Image Upload Section */}
                <div className="form-group">
                    <label>Post Header Image:</label>
                    <div className="image-upload-section">
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

                <div className="form-group">
                    <label htmlFor="image_url">Or enter Image URL:</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
                        disabled={selectedFile !== null}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="publication_date">Publication Date:</label>
                    <input
                        type="date"
                        id="publicationDate"
                        name="publicationDate"
                        value={formData.publicationDate}
                        onChange={handleInputChange}
                        className="form-input"
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label htmlFor="approved">
                        <input
                            type="checkbox"
                            id="approved"
                            name="approved"
                            checked={formData.approved}
                            onChange={handleInputChange}
                            className="form-checkbox"
                        />
                        Approved
                    </label>
                </div>

                <button type="submit" className="submit-button" disabled={uploading}>
                    {uploading ? "Creating Post..." : "Create Post"}
                </button>
            </form>
        </div>
    );
};