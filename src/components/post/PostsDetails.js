import { useLocation } from "react-router-dom";
import "./postsDetails.css";

export const PostsDetails = () => {
    const location = useLocation();
    const { title, imageUrl, content, userId, categoryId, publicationDate, approved } = location.state || {};

    if (!location.state) {
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
        </div>
    );
};