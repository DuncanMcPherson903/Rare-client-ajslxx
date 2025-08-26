import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CommentEdit = ({ comment, onSave, onCancel, redirectAfterSave = false }) => {
    const navigate = useNavigate();
    const [editedComment, setEditedComment] = useState({ 
        subject: comment?.subject || "",
        content: comment?.content || "" 
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Call the onSave function with the complete comment data
        const success = await onSave(editedComment);
        
        // If redirectAfterSave is true and save was successful, redirect to comment details
        if (redirectAfterSave && success) {
            navigate(`/comments/${comment.id}`);
        }
    };

    const handleCancel = () => {
        if (redirectAfterSave) {
            // If we're in standalone edit mode, redirect to comments list
            navigate("/comments");
        } else {
            // If we're in inline edit mode, call the cancel function
            onCancel();
        }
    };

    return (
        <div className="comment-edit-container">
            <div className="comment-edit-header">
                <h2>Edit Comment</h2>
            </div>

            <form onSubmit={handleSubmit} className="comment-edit-form">
                <div className="form-group">
                    <label htmlFor="commentSubject">Subject:</label>
                    <input
                        type="text"
                        id="commentSubject"
                        value={editedComment.subject}
                        onChange={(e) => setEditedComment({ ...editedComment, subject: e.target.value })}
                        placeholder="Enter comment subject..."
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="commentContent">Comment:</label>
                    <textarea
                        id="commentContent"
                        value={editedComment.content}
                        onChange={(e) => setEditedComment({ ...editedComment, content: e.target.value })}
                        placeholder="Enter comment content..."
                        rows="6"
                        required
                    />
                </div>

                <div className="form-buttons">
                    <button type="submit" className="save-button">
                        Save Changes
                    </button>
                    <button type="button" onClick={handleCancel} className="cancel-button">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};