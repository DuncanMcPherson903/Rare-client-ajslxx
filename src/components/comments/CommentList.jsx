import "./CommentList.css";
import { useEffect, useState } from "react";
import { getComments, deleteComment, updateComment } from "../../managers/CommentManager";
import { CommentEdit } from "./CommentEdit";

export const CommentList = () => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all comments
  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      const commentsData = await getComments();
      setComments(commentsData);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleEdit = (comment) => {
    setEditingComment(comment);
  };

  const handleSaveEdit = async (content) => {
    try {
      await updateComment(editingComment.id, content);
      setEditingComment(null);
      await loadComments();
    } catch (err) {
      setError("Failed to update comment");
      console.error("Error updating comment:", err);
    }
  };

  const handleCancelEdit = () => {
    setEditingComment(null);
  };

  const handleDelete = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await deleteComment(commentId);
        await loadComments();
      } catch (err) {
        setError("Failed to delete comment");
        console.error("Error deleting comment:", err);
      }
    }
  };

  return (
    <div className="comment-list-container">
      <div className="comment-header">
        <h2>All Comments</h2>
        <p>Total: {comments.length} comments</p>
      </div>

      {error && (
        <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-message" style={{ padding: '10px', marginBottom: '10px' }}>
          Loading comments...
        </div>
      )}

      {editingComment && (
        <CommentEdit
          comment={editingComment}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}

      <div className="comment-list-simple">
        {comments.length === 0 && !loading ? (
          <div className="no-comments" style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
            No comments found.
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="comment-item-simple">
              <div className="comment-content">
                <p><strong>Content:</strong> {comment.content}</p>
                <p><strong>Post ID:</strong> {comment.postId}</p>
                <p><strong>Author ID:</strong> {comment.authorId}</p>
              </div>
              <div className="comment-actions">
                <button
                  className="edit-button"
                  onClick={() => handleEdit(comment)}
                  disabled={editingComment !== null}
                >
                  Edit
                </button>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(comment.id)}
                  disabled={editingComment !== null}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};