import { createComment } from "../../managers/CommentManager";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CommentCreate = ({ postId, onCommentCreated }) => {
    const navigate = useNavigate();
    const [comment, setComment] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!comment.trim()) {
            return;
        }

        // Get authorId from localStorage - try multiple possible keys
        let authorId = parseInt(localStorage.getItem("rare_user_id"));
        if (!authorId || isNaN(authorId)) {
            // Fallback to using auth_token as user ID (if it's numeric)
            const token = localStorage.getItem("auth_token");
            authorId = parseInt(token) || 1; // Default to 1 if no valid ID found
        }

        const commentData = {
            postId: postId,
            authorId: authorId,
            content: comment
        };

        createComment(commentData).then(() => {
            setComment(""); // Clear the form
            if (onCommentCreated) {
                onCommentCreated(); // Callback to refresh comments
            } else {
                navigate("/comments");
            }
        }).catch(err => {
            console.error("Error creating comment:", err);
            alert("Failed to create comment. Please try again.");
        });
    };

    return (
        <div className="comment-create-form">
            <h1>Comment</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="comment">Comment</label>
                    <textarea 
                        id="comment" 
                        value={comment} 
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Enter your comment..."
                        rows="4"
                        required
                    />
                </div>
                <button type="submit">Leave Comment</button>
            </form>
        </div>
    )
}