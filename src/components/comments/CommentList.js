import "./CommentList.css";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getComments, deleteComment, updateComment, getPostCommentsWithDetails, getPostById, getPostWithCommentsDetails } from "../../managers/CommentManager";
import { CommentEdit } from "./CommentEdit";
import { CommentCreate } from "./CommentCreate";

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
        const response = await getPostWithCommentsDetails(currentPostId);
        commentsData = response.comments || [];
        // Also set the post data if we have it
        if (response.post) {
          setPost(response.post);
        }
      } else if (currentPostId) {
        // Fetch comments for a specific post without details
        commentsData = await getPostCommentsWithDetails(currentPostId);
      } else {
        // Fetch all comments
        commentsData = await getComments();
      }
      
      // Ensure commentsData is always an array
      if (!Array.isArray(commentsData)) {
        commentsData = [];
      }
      
      // Sort comments by creation date, most recent first
      if (commentsData && Array.isArray(commentsData)) {
        commentsData.sort((a, b) => new Date(b.createdAt || b.created_at || b.dateCreated || b.createdOn) - new Date(a.createdAt || a.created_at || a.dateCreated || a.createdOn));
      }
      
      setComments(commentsData || []);
    } catch (err) {
      setError("Failed to load comments");
      console.error("Error loading comments:", err);
      setComments([]); // Ensure comments is always an array
    } finally {
      setLoading(false);
    }
  }, [currentPostId, showDetails]);

  useEffect(() => {
    const loadData = async () => {
      // If we're not showing details and have a postId, we need to load the post separately
      if (currentPostId && !showDetails) {
        await loadPost(currentPostId);
      }
      await loadComments();
    };
    loadData();
  }, [currentPostId, showDetails, loadComments]);

  const handleEdit = (comment) => {
    setEditingComment(comment);
  };

  const handleSaveEdit = async (commentData) => {
    try {
      await updateComment(editingComment.id, commentData);
      setEditingComment(null);
      await loadComments();
      return true; // Return success
    } catch (err) {
      setError("Failed to update comment");
      console.error("Error updating comment:", err);
      return false; // Return failure
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
              {formatDate(comment.createdAt || comment.created_at || comment.dateCreated || comment.createdOn)}
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

      {/* Add Comment Section - only show for post-specific views */}
      {currentPostId && (
        <div className="add-comment-section">
          <h3>Add a Comment</h3>
          <CommentCreate 
            postId={parseInt(currentPostId)} 
            onCommentCreated={loadComments}
          />
        </div>
      )}

      <div className="comment-list-simple">
        {(!Array.isArray(comments) || comments.length === 0) && !loading ? (
          <div className="no-comments">
            {currentPostId ? "No comments on this post yet." : "No comments found."}
          </div>
        ) : (
          Array.isArray(comments) && comments.map((comment, index) => (
            <div key={comment.id || index} className="comment-item-simple">
              <div className="comment-content">
                {renderCommentDetails(comment)}
              </div>
              {/* Only show edit/delete for admin view */}
              {!currentPostId && (
                <div className="comment-actions">
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/comments/${comment.id}`)}
                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                  >
                    View
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => navigate(`/comments/${comment.id}/edit`)}
                    disabled={editingComment !== null}
                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
                  >
                    Edit
                  </button>
                  <button
                    className="edit-button"
                    onClick={() => handleEdit(comment)}
                    disabled={editingComment !== null}
                    style={{ fontSize: "0.8rem", padding: "6px 12px", background: "#28a745" }}
                  >
                    Inline Edit
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(comment.id)}
                    disabled={editingComment !== null}
                    style={{ fontSize: "0.8rem", padding: "6px 12px" }}
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