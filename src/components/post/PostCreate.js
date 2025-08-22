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

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();


        const postData = {
            userId: parseInt(formData.userId),
            categoryId: parseInt(formData.categoryId),
            title: formData.title.trim(),
            content: formData.content.trim(),
            publicationDate: formData.publicationDate
                ? formData.publicationDate
                : new Date().toISOString().split('T')[0],
            imageUrl: formData.imageUrl.trim() || "",
            approved: formData.approved
        };

        createPost(postData)
            .then(() => {

                setFormData({
                    userId: 0,
                    categoryId: 0,
                    title: "",
                    publicationDate: "",
                    imageUrl: "",
                    content: "",
                    approved: false
                });


                if (onPostCreated) {
                    onPostCreated();
                }

                alert("Post created successfully!");
            })
            .catch(error => {
                console.error("Error creating post:", error);
                alert("Error creating post. Please try again.");
            });
    };

    return (
        <div className="post-form-container">
            <h2>Create New Post</h2>
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

                <div className="form-group">
                    <label htmlFor="image_url">Image URL:</label>
                    <input
                        type="url"
                        id="imageUrl"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="form-input"
                        placeholder="https://example.com/image.jpg"
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

                <button type="submit" className="submit-button">
                    Create Post
                </button>
            </form>
        </div>
    );
};