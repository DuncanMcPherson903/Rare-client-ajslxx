import { useLocation } from "react-router-dom";
import "./postsDetails.css";
import { CommentList } from "../comments/CommentList";
import { PostReactions } from "./PostReactions";

export const PostsDetails = () => {
    const location = useLocation();
    const post = location.state?.post;
    const { title, imageUrl, content, userId, categoryId, publicationDate, approved, id: postId } = post || {};

    if (!location.state || !post) {
        return <div>No post data found. Please go back and select a post.</div>;
    }

    return (
        <div className="post-details-container">
            {/* Title first */}
            <div className="post-details-title">{title || "Untitled Post"}</div>
            
            {/* Image second */}
           
                <div className="post-image-container">
                    <img src={imageUrl} alt="Post" className="post-details-image" />
                </div>
            
            
            {/* Rest in order */}
            <div className="post-details-content">
               
                
                <div className="detail-item">
                    <strong>Content:</strong> 
                    <p className="content-text">{content || "No content available."}</p>
                </div>
                
                <div className="detail-item">
                    <strong>Author ID:</strong> {userId}
                </div>
                
                <div className="detail-item">
                    <strong>Category ID:</strong> {categoryId}
                </div>
                
                <div className="detail-item">
                    <strong>Publication Date:</strong> {publicationDate}
                </div>
                
                <div className="detail-item">
                    <strong>Approved:</strong> {approved ? "Yes" : "No"}
                </div>
            </div>

            {/* Add Comment Section */}
            {postId && (
                <div className="comments-section">
                    {/* Post Reactions Section */}
                    <PostReactions postId={parseInt(postId)} />
                    
                    <h3>Comments</h3>
                    <CommentList postId={postId} showDetails={true} />
                </div>
            )}
        </div>
    );
};