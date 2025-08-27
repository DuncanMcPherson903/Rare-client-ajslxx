import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCommentById, updateComment } from "../../managers/CommentManager";
import { CommentEdit } from "./CommentEdit";
import "./CommentList.css";

export const CommentEditPage = () => {
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

    const handleSave = async (commentData) => {
        try {
            await updateComment(commentId, commentData);
            // Return true to indicate success
            return true;
        } catch (err) {
            setError("Failed to update comment");
            console.error("Error updating comment:", err);
            return false;
        }
    };

    const handleCancel = () => {
        navigate("/comments");
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
                <h2>Edit Comment</h2>
            </div>
            <CommentEdit 
                comment={comment} 
                onSave={handleSave} 
                onCancel={handleCancel}
                redirectAfterSave={true}
            />
        </div>
    );
};
