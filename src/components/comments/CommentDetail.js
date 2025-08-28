import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentById, deleteComment } from "../../managers/CommentManager";
import "./CommentList.css";

export const CommentDetail = () => {
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { commentId } = useParams();

    useEffect(() => {
        const loadComment = async () => {
            try {
                setLoading(true);
                setError(null);
                const commentData = await getCommentById(commentId);
                setComment(commentData);
            } catch (err) {
                setError("Failed to load comment");
                console.error("Error loading comment:", err);
            } finally {
                setLoading(false);
            }
        };

        if (commentId) {
            loadComment();
        }
    }, [commentId]);

    const handleEdit = () => {
        navigate(`/comments/${commentId}/edit`);
    };

    const handleDelete = async () => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            try {
                await deleteComment(commentId);
                navigate("/comments");
            } catch (err) {
                setError("Failed to delete comment");
                console.error("Error deleting comment:", err);
            }
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Date not available";
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    if (loading) {
        return (
            <div className="comment-list-container">
                <div className="loading-message">Loading comment...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="comment-list-container">
                <div className="error-message">{error}</div>
                <button 
                    className="edit-button"
                    onClick={() => navigate("/comments")}
                    style={{ marginTop: "20px" }}
                >
                    ← Back to Comments
                </button>
            </div>
        );
    }

    if (!comment) {
        return (
            <div className="comment-list-container">
                <div className="error-message">Comment not found</div>
                <button 
                    className="edit-button"
                    onClick={() => navigate("/comments")}
                    style={{ marginTop: "20px" }}
                >
                    ← Back to Comments
                </button>
            </div>
        );
    }

    return (
        <div className="comment-list-container">
            <div className="comment-header">
                <button 
                    className="back-to-post-btn"
                    onClick={() => navigate("/comments")}
                    style={{ marginBottom: "15px" }}
                >
                    ← Back to Comments
                </button>
                <h2>Comment Details</h2>
            </div>

            <div className="comment-item-simple">
                <div className="comment-content">
                    <div className="comment-details">
                        {comment.subject && (
                            <h4 className="comment-subject">{comment.subject}</h4>
                        )}
                        <div className="comment-content-text">{comment.content}</div>
                        <div className="comment-meta">
                            <span className="comment-author">
                                Author ID: {comment.authorId}
                            </span>
                            <span className="comment-date">
                                {formatDate(comment.createdAt || comment.created_at || comment.dateCreated)}
                            </span>
                        </div>
                        <div className="comment-meta" style={{ borderTop: "none", paddingTop: "5px" }}>
                            <span>Post ID: {comment.postId}</span>
                        </div>
                    </div>
                </div>
                
                <div className="comment-actions">
                    <button
                        className="edit-button"
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                    <button
                        className="delete-button"
                        onClick={handleDelete}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};
