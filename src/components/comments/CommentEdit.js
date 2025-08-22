import { useState } from "react";

export const CommentEdit = ({ comment, onSave, onCancel }) => {
    const [editedComment, setEditedComment] = useState({ content: comment?.content || "" });

    const handleSubmit = async (e) => {
        e.preventDefault();
        onSave(editedComment.content);
    };

    const handleCancel = () => {
        onCancel();
    };

    return (
        <div className="comment-edit-container">
            <div className="comment-edit-header">
                <h2>Edit Comment</h2>
            </div>

            <form onSubmit={handleSubmit} className="comment-edit-form">
                <div className="form-group">
                    <label htmlFor="commentContent">Comment:</label>
                    <textarea
                        id="commentContent"
                        value={editedComment.content}
                        onChange={(e) => setEditedComment({ ...editedComment, content: e.target.value })}
                        placeholder="Enter comment content..."
                        rows="4"
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