import "./post.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById } from "../../managers/CommentManager";
import { PostReactions } from "./PostReactions";
import { PostHeaderImageUpload } from "./PostHeaderImageUpload";
import { CommentCreate } from "../comments/CommentCreate";

export const PostDetail = () => {
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

    const handleCommentCreated = () => {
        // You could refresh the page or show a success message
        // For now, we'll just log it. You might want to add a comments count or recent comments display
        console.log("Comment created successfully!");
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
                    onClick={() => navigate("/posts")}
                    style={{ marginBottom: "20px" }}
                >
                    ← Back to Posts
                </button>
            </div>

            <div className="post-header-text">{post.title}</div>
            
            <div className="post-item-simple">
                <div className="post-details">
                    <h3>{post.title}</h3>
                    {post.imageUrl && (
                        <div>
                            <img 
                                src={post.imageUrl || post.image_url} 
                                alt="Post" 
                                style={{maxWidth: '300px', height: 'auto'}} 
                            />
                        </div>
                    )}
                    <div style={{ marginTop: "15px", lineHeight: "1.6" }}>
                        {post.content || 'No content'}
                    </div>
                    <div className="post-details-fine">
                        <p><strong>Author:</strong> {post.userId || post.user_id}</p>
                        <p><strong>Category:</strong> {post.categoryId || post.category_id}</p>
                        <div><strong>Date Created:</strong> {post.publicationDate || post.publication_date}</div>
                    </div> 
                </div>
                
                {/* Post Reactions Section */}
                <PostReactions postId={post.id} />
                
                {/* Add Comment Section */}
                <div className="post-detail-add-comment-section">
                    <h3>Add a Comment</h3>
                    <CommentCreate 
                        postId={parseInt(post.id)} 
                        onCommentCreated={handleCommentCreated}
                    />
                </div>
                
                {/* Post Header Image Upload Section */}
                <PostHeaderImageUpload 
                    postId={post.id} 
                    onImageUpdate={handleImageUpdate}
                />
                
                <div className="post-actions">
                    <button
                        className="edit-button"
                        onClick={() => navigate(`/posts/${post.id}/comments`)}
                    >
                        View Comments
                    </button>
                    <button
                        className="edit-button"
                        onClick={() => navigate(`/posts/${post.id}/edit`)}
                        style={{ marginLeft: "10px" }}
                    >
                        Edit Post
                    </button>
                </div>
            </div>
        </div>
    );
};
