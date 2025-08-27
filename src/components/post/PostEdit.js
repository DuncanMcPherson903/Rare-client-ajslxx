import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById } from "../../managers/CommentManager";
import { PostHeaderImageUpload } from "./PostHeaderImageUpload";
import "./post.css";

export const PostEdit = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { postId } = useParams();

    useEffect(() => {
        const loadPost = async () => {
            try {
                setLoading(true);
                setError(null);
                const postData = await getPostById(postId);
                setPost(postData);
            } catch (err) {
                setError("Failed to load post");
                console.error("Error loading post:", err);
            } finally {
                setLoading(false);
            }
        };

        if (postId) {
            loadPost();
        }
    }, [postId]);

    const handleImageUpdate = (newImageUrl) => {
        setPost(prevPost => ({
            ...prevPost,
            imageUrl: newImageUrl,
            image_url: newImageUrl
        }));
    };

    if (loading) {
        return (
            <div className="post-list-container">
                <div className="loading-message">Loading post...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="post-list-container">
                <div className="error-message">{error}</div>
                <button 
                    className="edit-button"
                    onClick={() => navigate("/posts")}
                >
                    ← Back to Posts
                </button>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="post-list-container">
                <div className="error-message">Post not found</div>
                <button 
                    className="edit-button"
                    onClick={() => navigate("/posts")}
                >
                    ← Back to Posts
                </button>
            </div>
        );
    }

    return (
        <div className="post-list-container">
            <div className="post-header">
                <button 
                    className="edit-button"
                    onClick={() => navigate(`/posts/${postId}`)}
                    style={{ marginBottom: "20px" }}
                >
                    ← Back to Post
                </button>
                <h2>Edit Post: {post.title}</h2>
            </div>

            <div className="post-item-simple">
                <div className="post-details">
                    <h3>{post.title}</h3>
                    {(post.imageUrl || post.image_url) && (
                        <div>
                            <h4>Current Header Image:</h4>
                            <img 
                                src={post.imageUrl || post.image_url} 
                                alt="Post header" 
                                style={{
                                    maxWidth: '100%', 
                                    maxHeight: '300px', 
                                    height: 'auto',
                                    borderRadius: '8px',
                                    marginBottom: '20px',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }} 
                            />
                        </div>
                    )}
                    
                    <div style={{ marginTop: "15px", lineHeight: "1.6" }}>
                        <strong>Content:</strong>
                        <p>{post.content || 'No content'}</p>
                    </div>
                    
                    <div className="post-details-fine">
                        <p><strong>Author:</strong> {post.userId || post.user_id}</p>
                        <p><strong>Category:</strong> {post.categoryId || post.category_id}</p>
                        <div><strong>Date Created:</strong> {post.publicationDate || post.publication_date}</div>
                    </div> 
                </div>
                
                {/* Post Header Image Upload Section */}
                <PostHeaderImageUpload 
                    postId={post.id} 
                    onImageUpdate={handleImageUpdate}
                />
                
                <div className="post-actions">
                    <button
                        className="edit-button"
                        onClick={() => navigate(`/posts/${post.id}`)}
                    >
                        View Post
                    </button>
                    <button
                        className="edit-button"
                        onClick={() => navigate("/posts")}
                    >
                        Back to Posts
                    </button>
                </div>
            </div>
        </div>
    );
};
