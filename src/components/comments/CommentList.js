import "./CommentList.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComments, deleteComment, updateComment, getPostCommentsWithDetails, getPostById } from "../../managers/CommentManager";
import { CommentEdit } from "./CommentEdit";

export const CommentList = ({ postId = null, showDetails = false }) => {
  const [comments, setComments] = useState([]);
  const [post, setPost] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  
  // Use postId from props or URL params
  const currentPostId = postId || params.postId;

  // Load post details if we have a postId
  const loadPost = async (id) => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
    } catch (err) {
      console.error("Error loading post:", err);
    }
  };

  // Load comments - either all comments or comments for a specific post with details
  const loadComments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let commentsData;
      
      if (currentPostId && showDetails) {
        // Fetch comments with author details for a specific post
        commentsData = await getPostCommentsWithDetails(currentPostId);
      } else if (currentPostId) {
        // Fetch comments for a specific post without details
        commentsData = await getPostCommentsWithDetails(currentPostId);
      } else {
        // Fetch all comments
        commentsData = await getComments();
      }
      
      // Sort comments by creation date, most recent first
      if (commentsData && Array.isArray(commentsData)) {
        commentsData.sort((a, b) => new Date(b.createdAt || b.created_at || b.dateCreated) - new Date(a.createdAt || a.created_at || a.dateCreated));
      }
      
      setComments(commentsData || []);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error loading comments:", err);
    } finally {
      setLoading(false);
    }
  }, [currentPostId, showDetails]);

  useEffect(() => {
    const loadData = async () => {
      if (currentPostId) {
        await loadPost(currentPostId);
      }
      await loadComments();
    };
    loadData();
  }, [currentPostId, showDetails, loadComments]);

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

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit", 
      year: "numeric"
    });
  };

  const renderCommentDetails = (comment) => {
    if (currentPostId && (comment.authorFirstName || comment.authorDisplayName)) {
      // Post-specific view with author details
      return (
        <div className="comment-details">
          {comment.subject && (
            <h4 className="comment-subject">{comment.subject}</h4>
          )}
          <div className="comment-content-text">{comment.content}</div>
          <div className="comment-meta">
            <span className="comment-author">
              By: {comment.authorDisplayName || `${comment.authorFirstName} ${comment.authorLastName}`}
            </span>
            <span className="comment-date">
              {formatDate(comment.createdAt || comment.created_at || comment.dateCreated)}
            </span>
          </div>
        </div>
      );
    } else {
      // General admin view
      return (
        <div className="comment-details">
          <div className="comment-content-text">{comment.content}</div>
          <div className="comment-meta">
            <span>Post ID: {comment.postId}</span>
            <span>Author ID: {comment.authorId}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="comment-list-container">
      {/* Post Header with title and back link */}
      {currentPostId && post ? (
        <div className="post-header">
          <button 
            className="back-to-post-btn"
            onClick={() => navigate(`/posts/${currentPostId}`)}
          >
            ← Back to Post
          </button>
          <h2>Comments on: {post.title}</h2>
        </div>
      ) : (
        <div className="comment-header">
          <h2>All Comments</h2>
        </div>
      )}

      <div className="comments-count">
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
            {currentPostId ? "No comments on this post yet." : "No comments found."}
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id || index} className="comment-item-simple">
              <div className="comment-content">
                {renderCommentDetails(comment)}
              </div>
              {/* Only show edit/delete for admin view */}
              {!currentPostId && (
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
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};