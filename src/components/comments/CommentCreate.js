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

        // Get authorId from localStorage or context (assuming user is logged in)
        const authorId = parseInt(localStorage.getItem("rare_user_id") || "1");

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