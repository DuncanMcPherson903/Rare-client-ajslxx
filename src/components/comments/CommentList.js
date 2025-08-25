import "./CommentList.css";
import { useEffect, useState } from "react";
import { getComments, deleteComment, updateComment, getPostCommentsWithDetails } from "../../managers/CommentManager";
import { CommentEdit } from "./CommentEdit";

export const CommentList = ({ postId = null, showDetails = false }) => {
  const [comments, setComments] = useState([]);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load comments - either all comments or comments for a specific post with details
  const loadComments = async () => {
    try {
      setLoading(true);
      setError(null);
      let commentsData;
      
      if (postId && showDetails) {
        // Fetch comments with author details for a specific post
        commentsData = await getPostCommentsWithDetails(postId);
      } else {
        // Fetch all comments
        commentsData = await getComments();
      }
      
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
  }, [postId, showDetails]);

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

  const renderCommentDetails = (comment) => {
    if (showDetails && comment.authorFirstName) {
      return (
        <>
          <p><strong>Content:</strong> {comment.content}</p>
          <p><strong>Author:</strong> {comment.authorFirstName} {comment.authorLastName} (@{comment.authorUsername})</p>
          <p><strong>Post ID:</strong> {comment.postId}</p>
        </>
      );
    } else {
      return (
        <>
          <p><strong>Content:</strong> {comment.content}</p>
          <p><strong>Post ID:</strong> {comment.postId}</p>
          <p><strong>Author ID:</strong> {comment.authorId}</p>
        </>
      );
    }
  };

  return (
    <div className="comment-list-container">
      <div className="comment-header">
        <h2>{postId ? `Comments for Post ${postId}` : 'All Comments'}</h2>
        <p>Total: {comments.length} comments</p>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading && (
        <div className="loading-message">
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
          <div className="no-comments">
            No comments found.
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="comment-item-simple">
              <div className="comment-content">
                {renderCommentDetails(comment)}
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

<CommentList postId={123} showDetails={true} />