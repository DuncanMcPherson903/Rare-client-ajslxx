import "./post.css";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPostById } from "../../managers/CommentManager";
import { PostReactions } from "./PostReactions";

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
                
                <div className="post-actions">
                    <button
                        className="edit-button"
                        onClick={() => navigate(`/posts/${post.id}/comments`)}
                    >
                        View Comments
                    </button>
                </div>
            </div>
        </div>
    );
};
